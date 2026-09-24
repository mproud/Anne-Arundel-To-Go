'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { captureAttribution } from '@/lib/attribution'

export function AttributionTracker() {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        // Runs on the initial tagged landing page and subsequent URL changes, including query-only changes.
        // Each form also checks the current URL at the moment of submission.
        captureAttribution()
    }, [pathname, searchParams])

    return null
}
