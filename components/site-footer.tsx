import Image from 'next/image'
import Link from 'next/link'
import { FlagStripe } from '@/components/flag-stripe'

export function SiteFooter() {
    return (
        <footer className="bg-md-black text-md-cream">
            <FlagStripe className="h-3" />
            <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
                <div className="flex flex-col items-start justify-between gap-8 sm:flex-row">
                    <div className="max-w-sm">
                        <Link href="/#top" className="inline-flex rounded-lg bg-md-cream px-3 py-2" aria-label="Anne Arundel To Go home">
                            <Image src="/images/anne-arundel-to-go-logo.png" alt="Anne Arundel To Go" width={900} height={521} className="h-20 w-auto" />
                        </Link>
                        <p className="mt-4 text-sm leading-relaxed text-md-cream/70">
                            A community coalition supporting the option for licensed restaurants to offer sealed cocktails to go in Anne Arundel County and Annapolis, Maryland.
                        </p>
                    </div>

                    <nav className="flex flex-col gap-2.5 text-sm" aria-label="Footer navigation">
                        <a href="/#facts" className="text-md-cream/70 transition-colors hover:text-secondary">The Facts</a>
                        <a href="/#supporters" className="text-md-cream/70 transition-colors hover:text-secondary">Supporters</a>
                        <a href="/#posters" className="text-md-cream/70 transition-colors hover:text-secondary">Toolkit</a>
                        <a href="/#petition" className="text-md-cream/70 transition-colors hover:text-secondary">Sign the Petition</a>
                        <a href="/#contact" className="text-md-cream/70 transition-colors hover:text-secondary">Contact</a>
                        <Link href="/privacy" className="text-md-cream/70 transition-colors hover:text-secondary">Privacy</Link>
                    </nav>
                </div>

                <div className="mt-10 flex flex-col gap-2 border-t border-md-cream/15 pt-6 text-xs text-md-cream/50 sm:flex-row sm:items-center sm:justify-between">
                    <p>&copy; {new Date().getFullYear()} Anne Arundel To Go</p>
                    <p className="text-right">Not affiliated with any government agency or political campaign/organization.<br />Please drink responsibly.</p>
                </div>
            </div>
        </footer>
    )
}
