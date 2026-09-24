import { NextResponse } from 'next/server'
import { getRuntimeEnv } from '@/lib/resend'

export function GET() {
    const siteKey = getRuntimeEnv('TURNSTILE_SITE_KEY')
    if (!siteKey || siteKey.startsWith('REPLACE_')) {
        return NextResponse.json({ error: 'Form security is not configured.' }, { status: 503 })
    }
    return NextResponse.json({ siteKey }, {
        headers: { 'Cache-Control': 'no-store' },
    })
}
