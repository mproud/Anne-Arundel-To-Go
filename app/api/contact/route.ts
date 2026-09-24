import { NextResponse } from 'next/server'
import { escapeHtml, getRuntimeEnv, sendResendEmail } from '@/lib/resend'
import { attributionRows, sanitizeAttribution } from '@/lib/attribution'

type ContactRequest = {
    reason?: unknown
    name?: unknown
    email?: unknown
    message?: unknown
    updates?: unknown
    attribution?: unknown
}

const allowedReasons = new Set(['question', 'volunteer', 'other'])
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function stringValue(value: unknown, maxLength: number) {
    return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

export async function POST(request: Request) {
    let body: ContactRequest

    try {
        body = (await request.json()) as ContactRequest
    } catch {
        return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
    }

    const reason = stringValue(body.reason, 30)
    const name = stringValue(body.name, 150)
    const email = stringValue(body.email, 254).toLowerCase()
    const message = stringValue(body.message, 5000)
    const updates = body.updates === true
    const attribution = sanitizeAttribution(body.attribution)

    if (!allowedReasons.has(reason) || !name || !emailPattern.test(email) || !message) {
        return NextResponse.json({ error: 'Please complete all required fields with valid information.' }, { status: 400 })
    }

    const reasonLabels: Record<string, string> = {
        question: 'Question',
        volunteer: 'Volunteer / help',
        other: 'Other',
    }
    const reasonLabel = reasonLabels[reason]
    const recipient = getRuntimeEnv('CONTACT_RECIPIENT_EMAIL') || getRuntimeEnv('RESEND_FROM_EMAIL') || 'hello@annearundeltogo.com'

    const text = [
        `Reason: ${reasonLabel}`,
        `Name: ${name}`,
        `Email: ${email}`,
        `Opted into updates: ${updates ? 'Yes' : 'No'}`,
        '',
        'Message:',
        message,
        '',
        ...attributionRows(attribution).map(([label, value]) => `${label}: ${value}`),
    ].join('\n')

    const html = `
        <h2>New Anne Arundel To Go contact message</h2>
        <p><strong>Reason:</strong> ${escapeHtml(reasonLabel)}</p>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Opted into updates:</strong> ${updates ? 'Yes' : 'No'}</p>
        <hr />
        <p>${escapeHtml(message).replaceAll('\n', '<br />')}</p>
        <hr />
        <h3>Attribution</h3>
        <ul>${attributionRows(attribution).map(([label, value]) => `<li><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</li>`).join('')}</ul>
    `

    try {
        await sendResendEmail({
            to: recipient,
            subject: `Website contact: ${reasonLabel} from ${name}`,
            text,
            html,
            replyTo: email,
        })
        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error('Contact submission failed', error)
        return NextResponse.json({ error: 'We could not send your message right now. Please try again.' }, { status: 503 })
    }
}
