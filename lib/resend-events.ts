import { getRuntimeEnv } from '@/lib/resend'

const API = 'https://api.resend.com'

type FormEventName = 'petition.submitted' | 'contact.submitted'
type EventPayload = Record<string, string | boolean>

function authorization() {
    const key = getRuntimeEnv('RESEND_API_KEY')
    if (!key) throw new Error('Resend API key is not configured.')
    return { Authorization: `Bearer ${key}` }
}

/**
 * Resend's event API accepts a recipient email without the contact ID.
 * Use only form-safe acknowledgement data; do not include message bodies,
 * signature details, UTMs, or other personal information in the payload.
 */
export async function sendResendEvent(event: FormEventName, email: string, payload: EventPayload) {
    const response = await fetch(`${API}/events/send`, {
        method: 'POST',
        headers: { ...authorization(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, email, payload }),
    })
    if (!response.ok) {
        // Do not log the response body; it may contain the recipient address.
        throw new Error(`Resend event request failed (${response.status}).`)
    }
}

/**
 * An event sent to an unknown email can create a Resend Contact automatically.
 * Since the contact form has NO mailing-list opt-in, create it explicitly as
 * unsubscribed first. Never alter an existing contact's subscription status.
 *
 * aa_created_no_updates is already used by the petition contact handler: an
 * explicit later petition opt-in can clear our initial non-opt-in status,
 * without reversing a subsequent, genuine unsubscribe.
 */
export async function prepareContactEventRecipient(email: string) {
    const headers = authorization()
    const existing = await fetch(`${API}/contacts/${encodeURIComponent(email)}`, {
        headers,
    })
    if (existing.ok) return
    if (existing.status !== 404) {
        throw new Error(`Resend contact lookup failed (${existing.status}).`)
    }

    const created = await fetch(`${API}/contacts`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email,
            unsubscribed: true,
            properties: { aa_created_no_updates: 'yes' },
        }),
    })
    // A concurrent petition or contact request may have created this contact.
    // Its subscription status then belongs to the other request; do not change it.
    if (created.status === 409) return
    if (!created.ok) {
        throw new Error(`Resend contact creation failed (${created.status}).`)
    }
}
