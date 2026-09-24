import { NextResponse } from 'next/server'
import { sanitizeAttribution } from '@/lib/attribution'
import { FormRequestError } from '@/lib/form-security'
import { recordFormSubmission } from '@/lib/form-submissions'

type PetitionRequest = {
    supporterType?: unknown
    firstName?: unknown
    lastName?: unknown
    email?: unknown
    zip?: unknown
    organization?: unknown
    authorized?: unknown
    publicSupporter?: unknown
    updates?: unknown
    attribution?: unknown
    submissionId?: unknown
    turnstileToken?: unknown
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const zipPattern = /^\d{5}(?:-\d{4})?$/

function stringValue(value: unknown, maxLength: number) {
    return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

export async function POST(request: Request) {
    let body: PetitionRequest

    try {
        const raw = await request.text()
        if (raw.length > 16_384) return NextResponse.json({ error: 'Submission is too large.' }, { status: 413 })
        body = JSON.parse(raw) as PetitionRequest
        if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('Invalid request.')
    } catch {
        return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
    }

    const supporterType = body.supporterType === 'business' ? 'business' : body.supporterType === 'individual' ? 'individual' : null
    const firstName = stringValue(body.firstName, 100)
    const lastName = stringValue(body.lastName, 100)
    const email = stringValue(body.email, 254).toLowerCase()
    const zip = stringValue(body.zip, 10)
    const organization = stringValue(body.organization, 200)
    const authorized = body.authorized === true
    const publicSupporter = body.publicSupporter === true
    const updates = body.updates === true
    const attribution = sanitizeAttribution(body.attribution)

    if (!supporterType || !firstName || !lastName || !emailPattern.test(email) || !zipPattern.test(zip)) {
        return NextResponse.json({ error: 'Please complete all required fields with valid information.' }, { status: 400 })
    }
    if (supporterType === 'business' && (!organization || !authorized)) {
        return NextResponse.json({ error: 'Business and organization supporters must provide an organization name and confirm authorization.' }, { status: 400 })
    }

    try {
        const stored = await recordFormSubmission(request, body.submissionId, body.turnstileToken, {
            kind: 'petition',
            data: {
                supporterType, firstName, lastName, email, zip, organization: supporterType === 'business' ? organization : '',
                authorized: supporterType === 'business' && authorized,
                publicSupporter: supporterType === 'business' && publicSupporter,
                updates, attribution,
            },
        })
        return NextResponse.json({ ok: true, duplicate: stored.duplicate })
    } catch (error) {
        if (error instanceof FormRequestError) {
            return NextResponse.json({ error: error.message }, { status: error.status })
        }
        console.error('Petition record failed', error instanceof Error ? error.name : 'unknown')
        return NextResponse.json({ error: 'We could not record your support right now. Please try again.' }, { status: 503 })
    }
}
