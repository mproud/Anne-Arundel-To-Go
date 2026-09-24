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
    const [enhanced, setEnhanced] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        // Start visible on the server. Only enhance items below the viewport
        // when JavaScript, reduced-motion detection and IO are available.
        if (typeof IntersectionObserver === 'undefined' ||
            window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setShown(true)
            return
        }
        if (el.getBoundingClientRect().top <= window.innerHeight * 0.9) {
            setShown(true)
            return
        }
        setEnhanced(true)
        const reveal = () => setShown(true)
        el.addEventListener('focusin', reveal)
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
        return () => {
            obs.disconnect()
            el.removeEventListener('focusin', reveal)
        }
    }, [])

    return (
        <div
            ref={ref}
            data-shown={shown}
            data-enhanced={enhanced}
            style={{ transitionDelay: `${delay}ms`, opacity: enhanced ? undefined : 1, transform: enhanced ? undefined : 'none' }}
            className={`reveal ${className}`}
        >
            {children}
        </div>
    )
}
