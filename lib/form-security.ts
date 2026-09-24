import { env } from 'cloudflare:workers'

const runtimeEnv = env as unknown as Record<string, string | undefined>

export class FormRequestError extends Error {
    constructor(message: string, public readonly status: number) {
        super(message)
        this.name = 'FormRequestError'
    }
}

export function formDb(): D1Database {
    const db = (env as unknown as { FORM_DB?: D1Database }).FORM_DB
    if (!db) throw new Error('FORM_DB binding is missing.')
    return db
}

/** Never expose the secret or the Siteverify response to the browser. */
export async function verifyFormChallenge(request: Request, token: unknown, action: 'petition' | 'contact') {
    const secret = runtimeEnv.TURNSTILE_SECRET
    if (!secret) throw new Error('TURNSTILE_SECRET is not configured.')
    if (typeof token !== 'string' || !token || token.length > 2048) {
        throw new FormRequestError('Please complete the security check and try again.', 400)
    }

    let result: { success?: boolean; hostname?: string; action?: string }
    try {
        const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ secret, response: token }),
            signal: AbortSignal.timeout(8_000),
        })
        if (!response.ok) throw new Error(`Siteverify HTTP ${response.status}`)
        result = (await response.json()) as typeof result
    } catch (error) {
        console.error('Turnstile Siteverify unavailable', error instanceof Error ? error.name : 'unknown')
        throw new FormRequestError('Security check temporarily unavailable. Please try again.', 503)
    }
    // Also verify the configured widget action and hostname. A forged or replayed
    // token must never bypass validation merely because the widget rendered.
    if (!result.success || result.action !== action || result.hostname !== new URL(request.url).hostname) {
        throw new FormRequestError('Security check expired or failed. Please try again.', 403)
    }
}

/** Atomic, bounded per-IP window. Only a keyed digest is stored in D1, never a raw IP. */
export async function enforceFormRateLimit(db: D1Database, request: Request, action: 'petition' | 'contact') {
    const salt = runtimeEnv.FORM_RATE_LIMIT_SECRET
    if (!salt) throw new Error('FORM_RATE_LIMIT_SECRET is not configured.')
    const address = request.headers.get('cf-connecting-ip')
    if (!address) throw new FormRequestError('Unable to verify this request. Please try again.', 403)

    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${salt}:${action}:${address}`))
    const key = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
    const now = Date.now()
    const maximum = action === 'petition' ? 10 : 5
    const row = await db.prepare(`
        INSERT INTO form_rate_limits (key, hits, expires_at)
        VALUES (?, 1, ?)
        ON CONFLICT(key) DO UPDATE SET
            hits = CASE WHEN expires_at <= ? THEN 1 ELSE hits + 1 END,
            expires_at = CASE WHEN expires_at <= ? THEN excluded.expires_at ELSE expires_at END
        WHERE form_rate_limits.expires_at <= ? OR form_rate_limits.hits < ?
        RETURNING hits
    `).bind(key, now + 3_600_000, now, now, now, maximum).first<{ hits: number }>()
    if (!row) throw new FormRequestError('Too many submissions. Please try again later.', 429)
}
