import Link from 'next/link'
import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PostersSection } from '@/components/posters-section'
import { SocialSection } from '@/components/social-section'
import { FlagStripe } from '@/components/flag-stripe'
import { buttonVariants } from '@/components/ui/button'
import { CheckCircle2, Share2 } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Thank You',
    description: 'Thank you for supporting Anne Arundel To Go.',
    robots: {
        index: false,
        follow: true,
        noarchive: true,
    },
}

export default async function ThankYouPage({
    searchParams,
}: {
    searchParams: Promise<{ type?: string }>
}) {
    const { type } = await searchParams
    const isBusiness = type === 'business'

    return (
        <>
            <SiteHeader />
            <main id="main-content">
                <section className="relative bg-md-black py-16 text-md-cream sm:py-20">
                    <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
                        <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                            <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
                        </span>
                        <span className="mt-6 block text-sm font-semibold uppercase tracking-widest text-secondary">
                            {isBusiness ? 'Organization support recorded' : 'Signature recorded'}
                        </span>
                        <h1 className="mt-3 text-balance font-display text-4xl font-bold uppercase leading-tight tracking-tight sm:text-5xl">
                            Thank you for your support
                        </h1>
                        <p className="mx-auto mt-4 max-w-xl text-pretty text-lg leading-relaxed text-md-cream/80">
                            {isBusiness
                                ? 'Thanks for adding your business or organization to the coalition!'
                                : 'Thanks for signing the petition!'}
                        </p>
                        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <a href="#social" className={buttonVariants({ size: 'lg', className: 'h-11 px-5 font-display font-semibold uppercase tracking-wide' })}>
                                <Share2 className="h-5 w-5" aria-hidden="true" />
                                Share the site
                            </a>
                            <Link href="/" className={buttonVariants({ size: 'lg', variant: 'secondary', className: 'h-11 px-5 bg-secondary font-display font-semibold uppercase tracking-wide text-secondary-foreground hover:bg-secondary/90' })}>
                                Back to home
                            </Link>
                        </div>
                    </div>
                    <div className="absolute inset-x-0 bottom-0">
                        <FlagStripe className="h-2" />
                    </div>
                </section>
                <SocialSection />
                <PostersSection />
            </main>
            <SiteFooter />
        </>
    )
}
