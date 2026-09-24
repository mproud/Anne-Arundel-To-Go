'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

type TurnstileAPI = {
    render: (element: HTMLElement, options: {
        sitekey: string
        action: 'petition' | 'contact'
        appearance: 'interaction-only'
        'refresh-expired': 'auto'
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
    // Leave only an invisible anchor at the original JSX position. Mount the
    // actual challenge immediately before this form's submit button using a
    // React portal; neither petition nor contact form markup needs editing.
    const anchor = useRef<HTMLSpanElement>(null)
    const [mount, setMount] = useState<HTMLDivElement | null>(null)
    const container = useRef<HTMLDivElement>(null)
    const callbackRef = useRef(onTokenChange)
    const [error, setError] = useState<string | null>(null)
    callbackRef.current = onTokenChange

    useEffect(() => {
        const form = anchor.current?.closest('form')
        const button = form?.querySelector('button[type="submit"], input[type="submit"]')
        if (!button) return

        // Mount the portal before the submit button; retain the original form's
        // spacing and permit Managed mode to show a challenge here when needed.
        const host = document.createElement('div')
        button.before(host)
        setMount(host)
        return () => {
            // React removes the portaled children when the component unmounts.
            host.remove()
        }
    }, [])

    useEffect(() => {
        if (!mount) return

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
                    // Invisible mode is selected in Cloudflare for this sitekey.
                    // For Managed mode, only display the widget if interaction is needed.
                    appearance: 'interaction-only',
                    'refresh-expired': 'auto',
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
    }, [action, resetRef, mount])

    return (
        <>
            <span ref={anchor} hidden aria-hidden="true" />
            {mount && createPortal(
                <div>
                    <div ref={container} aria-label="Security check" />
                    {error && <p role="alert" className="mt-2 text-sm text-destructive">{error} Please reload the page.</p>}
                </div>,
                mount,
            )}
        </>
    )
}
