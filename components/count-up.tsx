'use client'

import { useEffect, useRef, useState } from 'react'

export function CountUp({
    end,
    duration = 1600,
    prefix = '',
    suffix = '',
    className = '',
    separator = ',',
}: {
    end: number
    duration?: number
    prefix?: string
    suffix?: string
    className?: string
    separator?: string
}) {
    const ref = useRef<HTMLSpanElement>(null)
    const [value, setValue] = useState(0)
    const started = useRef(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setValue(end)
            return
        }
        const obs = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting && !started.current) {
                        started.current = true
                        const start = performance.now()
                        const tick = (now: number) => {
                            const p = Math.min((now - start) / duration, 1)
                            const eased = 1 - Math.pow(1 - p, 3)
                            setValue(Math.round(end * eased))
                            if (p < 1) requestAnimationFrame(tick)
                        }
                        requestAnimationFrame(tick)
                        obs.disconnect()
                    }
                }
            },
            { threshold: 0.4 },
        )
        obs.observe(el)
        return () => obs.disconnect()
    }, [end, duration])

    const formatted = value
        .toLocaleString('en-US', { useGrouping: separator !== '' })
        .replace(/,/g, separator)

    return (
        <span ref={ref} className={className}>
            {prefix}
            {formatted}
            {suffix}
        </span>
    )
}
