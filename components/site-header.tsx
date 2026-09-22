import Image from 'next/image'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

const navLinks = [
    { href: '/#supporters', label: 'Supporters' },
    { href: '/#facts', label: 'The Facts' },
    { href: '/#faq', label: 'FAQ' },
    { href: '/#about', label: 'Who We Are' },
    { href: '/#posters', label: 'Toolkit' },
    { href: '/#contact', label: 'Get Involved' },
]

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
            <div className="mx-auto flex h-24 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
                <Link
                    href="/#top"
                    className="flex shrink-0 items-center"
                    aria-label="Anne Arundel To Go home"
                >
                    <Image
                        src="/images/anne-arundel-to-go-logo.png"
                        alt="Anne Arundel To Go"
                        width={900}
                        height={521}
                        priority
                        className="h-16 w-auto sm:h-18"
                    />
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
                        className: 'shrink-0 h-12 px-8 text-lg font-display font-bold uppercase tracking-wide',
                    })}
                >
                    Sign the Petition
                </a>
            </div>
        </header>
    )
}
