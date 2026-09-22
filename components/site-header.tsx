'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'

const navLinks = [
    { href: '/#supporters', label: 'Supporters' },
    { href: '/#facts', label: 'The Facts' },
    { href: '/#faq', label: 'FAQ' },
    { href: '/#about', label: 'Who We Are' },
    { href: '/#posters', label: 'Toolkit' },
    { href: '/#contact', label: 'Contact' },
]

export function SiteHeader() {
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        if (!menuOpen) return
        const close = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setMenuOpen(false)
        }
        window.addEventListener('keydown', close)
        return () => window.removeEventListener('keydown', close)
    }, [menuOpen])

    return (
        <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90">
            <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-3 px-4 sm:h-24 sm:px-6">
                <Link href="/#top" className="flex shrink-0 items-center rounded-md" aria-label="Anne Arundel To Go home">
                    <Image
                        src="/images/anne-arundel-to-go-logo.png"
                        alt="Anne Arundel To Go"
                        width={900}
                        height={521}
                        priority
                        className="h-14 w-auto sm:h-18"
                    />
                </Link>

                <nav className="hidden items-center gap-5 lg:flex" aria-label="Primary navigation">
                    {navLinks.map((link) => (
                        <a key={link.href} href={link.href} className="rounded-sm text-sm font-medium text-foreground/80 transition-colors hover:text-primary">
                            {link.label}
                        </a>
                    ))}
                </nav>

                <div className="flex shrink-0 items-center gap-2">
                    <a
                        href="/#petition"
                        className={buttonVariants({
                            className: 'h-11 px-3 font-display text-xs font-bold uppercase tracking-wide sm:h-12 sm:px-6 sm:text-lg',
                        })}
                    >
                        <span className="sm:hidden">
                            Sign petition
                        </span>
                        <span className="hidden sm:inline">
                            Sign the Petition
                        </span>
                    </a>
                    <button
                        type="button"
                        onClick={() => setMenuOpen((open) => !open)}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-colors hover:bg-muted lg:hidden"
                        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                        aria-expanded={menuOpen}
                        aria-controls="mobile-navigation"
                    >
                        {menuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
                    </button>
                </div>
            </div>

            {menuOpen && (
                <nav id="mobile-navigation" aria-label="Mobile navigation" className="border-t border-border bg-background px-4 py-4 lg:hidden">
                    <div className="mx-auto grid max-w-6xl gap-1">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={() => setMenuOpen(false)}
                                className="rounded-lg px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted hover:text-primary"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                </nav>
            )}
        </header>
    )
}
