import { getRuntimeEnv } from '@/lib/resend'
import { UTM_KEYS, sanitizeAttribution } from '@/lib/attribution'
import type { Attribution } from '@/lib/attribution'

const API = 'https://api.resend.com'

type PetitionContact = {
    supporterType: 'individual' | 'business'
    firstName: string
    lastName: string
    email: string
    zip: string
    organization: string
    publicSupporter: boolean
    updates: boolean
    attribution: Attribution
}

type ContactResult = {
    id: string
    unsubscribed?: boolean
    properties?: Record<string, { value?: string; type?: string }>
}

type SegmentList = {
    data: { id: string }[]
    has_more?: boolean
}

// Send all contact-management requests from the server using a full-access
// Resend API key. Never include that key in a client component.
async function resendRequest<T>(
    path: string,
    method: 'GET' | 'POST' | 'PATCH',
    body?: Record<string, unknown>,
): Promise<{ status: number; data: T | null }> {
    const key = getRuntimeEnv('RESEND_API_KEY')
    if (!key) throw new Error('Resend is not configured.')

    const response = await fetch(`${API}${path}`, {
        method,
        headers: {
            Authorization: `Bearer ${key}`,
            ...(body ? { 'Content-Type': 'application/json' } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
    })

    if (response.status === 404 && method === 'GET') {
        return { status: 404, data: null }
    }
    if (!response.ok) {
        // Do not log the response body: Resend may include contact information.
        console.error('Resend contact request failed', method, path.split('/')[1], response.status)
        throw new Error(`Resend contact request failed (${response.status}).`)
    }
    return { status: response.status, data: (await response.json()) as T }
}

async function addMissingSegments(contactId: string, segmentIds: string[]) {
    const path = `/contacts/${encodeURIComponent(contactId)}/segments`
    const response = await resendRequest<SegmentList>(path, 'GET')
    if (!response.data || !Array.isArray(response.data.data)) {
        throw new Error('Could not verify contact segment membership.')
    }

    const existingIds = new Set(response.data.data.map((segment) => segment.id))
    for (const segmentId of segmentIds) {
        if (!existingIds.has(segmentId)) {
            await resendRequest<unknown>(`${path}/${encodeURIComponent(segmentId)}`, 'POST')
        }
    }
}

/**
 * A Resend Contact is unique per email address, not per signature. We preserve
 * the per-submission email for the full record, including repeated submissions.
 * Segment membership is additive; unchecked updates does not revoke an earlier
 * explicit opt-in. A new opt-in can reverse the initial no-opt-in status of a
 * petition-created contact, but it cannot reverse a later unsubscribe.
 */
export async function savePetitionContact(contact: PetitionContact) {
    const petitionSegment = getRuntimeEnv('RESEND_PETITION_SEGMENT_ID')
    const updatesSegment = getRuntimeEnv('RESEND_UPDATES_SEGMENT_ID')
    if (!petitionSegment || !updatesSegment || petitionSegment === updatesSegment) {
        throw new Error('Resend petition segments are not configured correctly.')
    }

    const segments = [petitionSegment, ...(contact.updates ? [updatesSegment] : [])]
    const properties: Record<string, string> = {
        aa_first_name: contact.firstName,
        aa_last_name: contact.lastName,
        aa_zip: contact.zip,
        aa_supporter_type: contact.supporterType,
        aa_last_signed_at: new Date().toISOString(),
    }
    if (contact.supporterType === 'business') {
        properties.aa_organization = contact.organization
        properties.aa_authorized = 'yes' // Business submissions require authorization.
        properties.aa_public_listing = contact.publicSupporter ? 'yes' : 'no'
    }
    if (contact.updates) {
        properties.aa_updates_opt_in_at = new Date().toISOString()
    }

    // Contact properties are a snapshot of the *latest signature*, not a
    // historical event log. Clear earlier tags on an untagged re-submission.
    const attribution = sanitizeAttribution(contact.attribution)
    for (const key of UTM_KEYS) {
        const suffix = key.slice(4)
        properties[`aa_first_utm_${suffix}`] = attribution.first?.[key] ?? ''
        properties[`aa_last_utm_${suffix}`] = attribution.latest?.[key] ?? ''
    }

    const contactPath = `/contacts/${encodeURIComponent(contact.email)}`
    const existing = await resendRequest<ContactResult>(contactPath, 'GET')
    if (existing.status === 404) {
        // Mark only NEW non-opt-in contacts, never an existing external unsubscribe.
        if (!contact.updates) properties.aa_created_no_updates = 'yes'
        // New non-opt-in signers must not be subscribed to Broadcasts globally.
        // Contacts in both segments are counted only once by Resend.
        const created = await resendRequest<ContactResult>('/contacts', 'POST', {
            email: contact.email,
            first_name: contact.firstName,
            last_name: contact.lastName,
            unsubscribed: !contact.updates,
            properties,
            segments: segments.map((id) => ({ id })),
        })
        if (!created.data?.id) throw new Error('Resend did not return a contact ID.')
        return
    }

    // The earlier patch set unsubscribed=true on a NEW petition contact whose
    // first signature did not opt in. A subsequent *explicit* opt-in should
    // enable Broadcasts for a contact we explicitly marked as no-opt-in
    // on creation. Do not clear a
    // prior unsubscribe of someone who previously opted in, or of a contact
    // created by some other source (we cannot know why it was unsubscribed).
    const previousProperties = existing.data?.properties
    const petitionCreated = previousProperties?.aa_created_no_updates?.value === 'yes'
    const previouslyOptedIn = Boolean(previousProperties?.aa_updates_opt_in_at?.value)
    const activateNewOptIn = contact.updates && existing.data?.unsubscribed === true &&
        petitionCreated && !previouslyOptedIn

    await resendRequest<ContactResult>(contactPath, 'PATCH', {
        properties,
        ...(activateNewOptIn ? { unsubscribed: false } : {}),
    })
    if (!existing.data?.id) throw new Error('Resend did not return a contact ID.')
    await addMissingSegments(existing.data.id, segments)
}
