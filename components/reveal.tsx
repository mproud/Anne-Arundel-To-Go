'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

export function Reveal({
    children,
    className = '',
    delay = 0,
}: {
    children: ReactNode
    className?: string
    delay?: number
}) {
    const ref = useRef<HTMLDivElement>(null)
    const [shown, setShown] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setShown(true)
            return
        }
        const obs = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setShown(true)
                        obs.disconnect()
                    }
                }
            },
            { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
        )
        obs.observe(el)
        return () => obs.disconnect()
    }, [])

    return (
        <div
            ref={ref}
            data-shown={shown}
            style={{ transitionDelay: `${delay}ms` }}
            className={`reveal ${className}`}
        >
            {children}
        </div>
    )
}
