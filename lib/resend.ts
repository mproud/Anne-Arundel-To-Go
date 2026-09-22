import { env } from 'cloudflare:workers'

const RESEND_API_URL = 'https://api.resend.com/emails'
const runtimeEnv = env as unknown as Record<string, string | undefined>

export type ResendMessage = {
    to: string | string[]
    subject: string
    text: string
    html: string
    replyTo?: string
}

export function getRuntimeEnv(name: string) {
    return runtimeEnv[name]
}

export function escapeHtml(value: string) {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;')
}

export async function sendResendEmail(message: ResendMessage) {
    const apiKey = getRuntimeEnv('RESEND_API_KEY')
    const from = getRuntimeEnv('RESEND_FROM_EMAIL')

    if (!apiKey || !from) {
        throw new Error('Email delivery is not configured.')
    }

    const response = await fetch(RESEND_API_URL, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from,
            to: message.to,
            subject: message.subject,
            text: message.text,
            html: message.html,
            reply_to: message.replyTo,
        }),
    })

    if (!response.ok) {
        const body = await response.text().catch(() => '')
        console.error('Resend email failed', response.status, body)
        throw new Error('Email delivery failed.')
    }

    return response.json() as Promise<{ id: string }>
}
