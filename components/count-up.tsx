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
    const [value, setValue] = useState(end)
    const started = useRef(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setValue(end)
            return
        }
        if (typeof IntersectionObserver === 'undefined') return
        let animationFrame: number | null = null
        const obs = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting && !started.current) {
                        started.current = true
                        setValue(0)
                        const start = performance.now()
                        const tick = (now: number) => {
                            const p = Math.min((now - start) / duration, 1)
                            const eased = 1 - Math.pow(1 - p, 3)
                            setValue(Math.round(end * eased))
                            if (p < 1) animationFrame = requestAnimationFrame(tick)
                        }
                        animationFrame = requestAnimationFrame(tick)
                        obs.disconnect()
                    }
                }
            },
            { threshold: 0.4 },
        )
        obs.observe(el)
        return () => {
            obs.disconnect()
            if (animationFrame !== null) cancelAnimationFrame(animationFrame)
        }
    }, [end, duration])

    const format = (number: number) => number
        .toLocaleString('en-US', { useGrouping: separator !== '' })
        .replace(/,/g, separator)

    return (
        <span ref={ref} className={className}>
            <span aria-hidden="true">{prefix}{format(value)}{suffix}</span>
            <span className="sr-only">{prefix}{format(end)}{suffix}</span>
        </span>
    )
}
