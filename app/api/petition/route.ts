import { NextResponse } from 'next/server'
import { escapeHtml, getRuntimeEnv, sendResendEmail } from '@/lib/resend'
import { savePetitionContact } from '@/lib/resend-contacts'
import { attributionRows, sanitizeAttribution } from '@/lib/attribution'

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
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const zipPattern = /^\d{5}(?:-\d{4})?$/

function stringValue(value: unknown, maxLength: number) {
    return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

export async function POST(request: Request) {
    let body: PetitionRequest

    try {
        body = (await request.json()) as PetitionRequest
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

    const recipient = getRuntimeEnv('PETITION_RECIPIENT_EMAIL') || getRuntimeEnv('RESEND_FROM_EMAIL') || 'hello@annearundeltogo.com'
    const supporterLabel = supporterType === 'business' ? 'Business / organization' : 'Individual'
    const subject = supporterType === 'business'
        ? `New organization supporter: ${organization}`
        : `New petition signature: ${firstName} ${lastName}`

    const rows = [
        ['Supporter type', supporterLabel],
        ['Name', `${firstName} ${lastName}`],
        ['Email', email],
        ['ZIP code', zip],
        ...(supporterType === 'business' ? [
            ['Business / organization', organization],
            ['Authorized representative', authorized ? 'Yes' : 'No'],
            ['May be listed publicly', publicSupporter ? 'Yes' : 'No'],
        ] : []),
        ['Opted into updates', updates ? 'Yes' : 'No'],
        ...attributionRows(attribution),
    ]

    const text = rows.map(([label, value]) => `${label}: ${value}`).join('\n')
    const html = `
        <h2>New Anne Arundel To Go petition submission</h2>
        <table cellpadding="6" cellspacing="0" style="border-collapse:collapse">
            ${rows.map(([label, value]) => `<tr><th align="left" style="border-bottom:1px solid #ddd">${escapeHtml(label)}</th><td style="border-bottom:1px solid #ddd">${escapeHtml(value)}</td></tr>`).join('')}
        </table>
    `

    try {
        // Save the contact and its consent-based segment memberships before
        // confirming the signature. Retain the per-submission notification email.
        await savePetitionContact({
            supporterType, firstName, lastName, email, zip,
            organization: supporterType === 'business' ? organization : '',
            publicSupporter: supporterType === 'business' && publicSupporter,
            updates,
            attribution,
        })
        await sendResendEmail({ to: recipient, subject, text, html, replyTo: email })
        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error('Petition submission failed', error)
        return NextResponse.json({ error: 'We could not record your support right now. Please try again.' }, { status: 503 })
    }
}
