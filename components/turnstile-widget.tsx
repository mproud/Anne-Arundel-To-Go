'use client'

import { useEffect, useRef, useState } from 'react'

type TurnstileAPI = {
    render: (element: HTMLElement, options: {
        sitekey: string
        action: 'petition' | 'contact'
        callback: (token: string) => void
        'expired-callback': () => void
        'error-callback': () => void
    }) => string
    reset: (id: string) => void
    remove: (id: string) => void
}
type TurnstileWindow = Window & { turnstile?: TurnstileAPI }
let scriptReady: Promise<void> | null = null

function loadScript() {
    if (scriptReady) return scriptReady
    scriptReady = new Promise<void>((resolve, reject) => {
        if ((window as TurnstileWindow).turnstile) return resolve()
        const script = document.createElement('script')
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
        script.async = true
        script.onload = () => resolve()
        script.onerror = () => reject(new Error('Unable to load the security check.'))
        document.head.appendChild(script)
    }).catch((error: unknown) => {
        scriptReady = null // Allow retry if network/script loading failed.
        throw error
    })
    return scriptReady
}

/** Each form owns its own challenge and resets it after a failed submission. */
export function TurnstileWidget({
    action, onTokenChange, resetRef,
}: {
    action: 'petition' | 'contact'
    onTokenChange: (token: string) => void
    resetRef: { current: (() => void) | null }
}) {
    const container = useRef<HTMLDivElement>(null)
    const callbackRef = useRef(onTokenChange)
    const [error, setError] = useState<string | null>(null)
    callbackRef.current = onTokenChange

    useEffect(() => {
        let disposed = false
        let widgetId: string | undefined
        async function initialize() {
            try {
                const response = await fetch('/api/form-security', { cache: 'no-store' })
                if (!response.ok) throw new Error('Form security is not configured.')
                const config = (await response.json()) as { siteKey: string }
                if (!config.siteKey) throw new Error('Form security is not configured.')
                await loadScript()
                const api = (window as TurnstileWindow).turnstile
                if (!api) throw new Error('Security check unavailable.')
                if (disposed || !container.current) return
                widgetId = api.render(container.current, {
                    sitekey: config.siteKey,
                    action,
                    callback: (token) => callbackRef.current(token),
                    'expired-callback': () => callbackRef.current(''),
                    'error-callback': () => callbackRef.current(''),
                })
                resetRef.current = () => {
                    callbackRef.current('')
                    if (widgetId) (window as TurnstileWindow).turnstile?.reset(widgetId)
                }
            } catch (cause) {
                if (!disposed) setError(cause instanceof Error ? cause.message : 'Security check unavailable.')
            }
        }
        void initialize()
        return () => {
            disposed = true
            resetRef.current = null
            if (widgetId) (window as TurnstileWindow).turnstile?.remove(widgetId)
        }
    }, [action, resetRef])

    return (
        <div>
            <div ref={container} aria-label="Security check" />
            {error && <p role="alert" className="mt-2 text-sm text-destructive">{error} Please reload the page.</p>}
        </div>
    )
}
