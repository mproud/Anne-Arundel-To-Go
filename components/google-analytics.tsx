'use client'

import { useEffect } from 'react'

const GA_ID = 'G-QRRV13J762'

type AnalyticsWindow = Window & {
    dataLayer?: unknown[][]
    gtag?: (...args: unknown[]) => void
}

export function GoogleAnalytics() {
    useEffect(() => {
        // Only track visitors on the production website.
        const allowedHosts = [
            'annearundeltogo.com',
            'www.annearundeltogo.com',
        ]

        if (!allowedHosts.includes(window.location.hostname)) {
            return
        }

        // Prevent the tag from being initialized multiple times.
        if (document.getElementById('google-analytics')) {
            return
        }

        const gaWindow = window as AnalyticsWindow

        // Initialize the Google Analytics data layer.
        gaWindow.dataLayer = gaWindow.dataLayer || []

        gaWindow.gtag = (...args: unknown[]) => {
            gaWindow.dataLayer?.push(args)
        }

        gaWindow.gtag('js', new Date())

        gaWindow.gtag('config', GA_ID)

        // Load the Google Analytics script asynchronously.
        const script = document.createElement('script')

        script.id = 'google-analytics'

        script.src =
            `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`

        script.async = true

        document.head.appendChild(script)
    }, [])

    return null
}

/**
 * Send a custom event to Google Analytics.
 *
 * Only include non-personal information in event parameters.
 */
export function trackEvent(
    eventName: string,
    parameters: Record<string, string | number | boolean> = {},
) {
    if (typeof window === 'undefined') {
        return
    }

    const gaWindow = window as AnalyticsWindow

    gaWindow.gtag?.('event', eventName, parameters)
}