import Link from 'next/link'
import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PostersSection } from '@/components/posters-section'
import { SocialSection } from '@/components/social-section'
import { FlagStripe } from '@/components/flag-stripe'
import { buttonVariants } from '@/components/ui/button'
import { CheckCircle2, Share2, Printer, Users } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Thank You for Signing | Anne Arundel To Go',
    description:
        'Thanks for supporting to-go cocktails in Anne Arundel County and Annapolis. Share the campaign and grab a poster to spread the word.',
    robots: {
        index: false,
        follow: false,
        noarchive: true,
    },
}

const nextSteps = [
    {
        icon: Share2,
        title: 'Share the campaign',
        body: 'Post to your feed or story with one tap. Every share puts the message in front of more neighbors and lawmakers.',
    },
    {
        icon: Printer,
        title: 'Print a poster',
        body: 'Display one in your business window, community board, or break room so others can find and sign the petition.',
    },
    {
        icon: Users,
        title: 'Bring a friend',
        body: 'Text the link to a few people who love our local spots. Momentum is what moves this bill forward.',
    },
]

export default async function ThankYouPage({
    searchParams,
}: {
    searchParams: Promise<{ type?: string }>
}) {
    const { type } = await searchParams
    const isBusiness = type === 'supporter' || type === 'business'

    return (
        <main>
            <SiteHeader />

            <section className="relative bg-md-black py-20 text-md-cream sm:py-24">
                <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
                    <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                        <CheckCircle2 className="h-8 w-8" />
                    </span>
                    <span className="mt-6 block text-sm font-semibold uppercase tracking-widest text-secondary">
                        {isBusiness ? "You're on the list" : 'Your name is in'}
                    </span>
                    <h1 className="mt-3 text-balance font-display text-4xl font-bold uppercase leading-tight tracking-tight sm:text-5xl">
                        {isBusiness ? 'Thank you for your support!' : 'Thank you for signing!'}
                    </h1>
                    <p className="mx-auto mt-4 max-w-xl text-pretty text-lg leading-relaxed text-md-cream/80">
                        {isBusiness
                            ? "You're now part of the coalition standing up for our local restaurants. Here's how to help the campaign reach more of Anne Arundel County and Annapolis."
                            : "You've added your voice for to-go cocktails in Anne Arundel County and Annapolis. Now help us grow the movement in a few seconds."}
                    </p>
                    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <a
                            href="#share"
                            className={buttonVariants({
                                size: 'lg',
                                className: 'font-display font-semibold uppercase tracking-wide',
                            })}
                        >
                            <Share2 className="h-5 w-5" />
                            Share the campaign
                        </a>
                        <Link
                            href="/"
                            className={buttonVariants({
                                size: 'lg',
                                variant: 'secondary',
                                className:
                                    'bg-secondary font-display font-semibold uppercase tracking-wide text-secondary-foreground hover:bg-secondary/90',
                            })}
                        >
                            Back to home
                        </Link>
                    </div>

                    <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-md-cream/15 bg-md-cream/15 text-left sm:grid-cols-3">
                        {nextSteps.map((step) => (
                            <div key={step.title} className="flex flex-col gap-3 bg-md-black p-6">
                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                                    <step.icon className="h-5 w-5" />
                                </span>
                                <h2 className="font-display text-base font-semibold uppercase tracking-wide text-md-cream">
                                    {step.title}
                                </h2>
                                <p className="text-sm leading-relaxed text-md-cream/70">{step.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="absolute inset-x-0 bottom-0">
                    <FlagStripe className="h-2" />
                </div>
            </section>

            <div id="share">
                <SocialSection />
            </div>
            <PostersSection />

            <SiteFooter />
        </main>
    )
}
