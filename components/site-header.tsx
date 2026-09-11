import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

const navLinks = [
    { href: '/#facts', label: 'The Facts' },
    { href: '/#about', label: 'Who We Are' },
    { href: '/#supporters', label: 'Supporters' },
    { href: '/#faq', label: 'FAQ' },
    { href: '/#posters', label: 'Toolkit' },
    { href: '/#contact', label: 'Get Involved' },
]

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
                <Link href="#top" className="flex items-center gap-2.5">
                    <span className="font-display text-xl font-bold uppercase tracking-tight text-md-black">
                        Anne Arundel <span className="text-primary">To Go</span>
                    </span>
                </Link>

                <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                <a
                    href="#petition"
                    className={buttonVariants({
                        className: 'font-display font-semibold uppercase tracking-wide',
                    })}
                >
                    Sign the Petition
                </a>
            </div>
        </header>
    )
}
