import { NextResponse } from 'next/server'
import { sanitizeAttribution } from '@/lib/attribution'
import { FormRequestError } from '@/lib/form-security'
import { recordFormSubmission } from '@/lib/form-submissions'

type ContactRequest = {
    reason?: unknown
    name?: unknown
    email?: unknown
    message?: unknown
    attribution?: unknown
    submissionId?: unknown
    turnstileToken?: unknown
}

const allowedReasons = new Set(['question', 'volunteer', 'other'])
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function stringValue(value: unknown, maxLength: number) {
    return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

export async function POST(request: Request) {
    let body: ContactRequest
    try {
        const raw = await request.text()
        if (raw.length > 16_384) return NextResponse.json({ error: 'Submission is too large.' }, { status: 413 })
        body = JSON.parse(raw) as ContactRequest
        if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('Invalid request.')
    } catch {
        return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
    }

    const reason = stringValue(body.reason, 30)
    const name = stringValue(body.name, 150)
    const email = stringValue(body.email, 254).toLowerCase()
    const message = stringValue(body.message, 5000)
    const attribution = sanitizeAttribution(body.attribution)

    if (!allowedReasons.has(reason) || !name || !emailPattern.test(email) || !message) {
        return NextResponse.json({ error: 'Please complete all required fields with valid information.' }, { status: 400 })
    }
    try {
        const stored = await recordFormSubmission(request, body.submissionId, body.turnstileToken, {
            kind: 'contact',
            data: { reason: reason as 'question' | 'volunteer' | 'other', name, email, message, attribution },
        })
        return NextResponse.json({ ok: true, duplicate: stored.duplicate })
    } catch (error) {
        if (error instanceof FormRequestError) {
            return NextResponse.json({ error: error.message }, { status: error.status })
        }
        console.error('Contact record failed', error instanceof Error ? error.name : 'unknown')
        return NextResponse.json({ error: 'We could not send your message right now. Please try again.' }, { status: 503 })
    }
}
