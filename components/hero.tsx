import Image from 'next/image'
import { buttonVariants } from '@/components/ui/button'
import { FlagStripe } from '@/components/flag-stripe'
import { PenLine } from 'lucide-react'
import { CountUp } from '@/components/count-up'
import { SUPPORTER_COUNTS } from '@/lib/supporter-counts'

export function Hero() {
    return (
        <section id="top" aria-labelledby="hero-heading" className="relative overflow-hidden bg-md-black text-md-cream">
            <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-2 lg:py-24">
                <div className="relative z-10">
                    <h1 id="hero-heading" className="text-balance font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                        Let Anne Arundel
                        <span className="mt-1 block text-secondary">Take it To-Go</span>
                    </h1>

                    <p className="mt-6 max-w-md text-pretty text-lg leading-relaxed text-md-cream/80">
                        Restaurants can already send customers home with beer and wine. We&apos;re supporting a local option for licensed restaurants to offer sealed cocktails to go under clear rules for responsible service.
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <a href="#petition" className={buttonVariants({ size: 'lg', className: 'h-14 px-8 font-display text-lg font-semibold uppercase tracking-wide' })}>
                            <PenLine className="h-5 w-5 mr-2" aria-hidden="true" />
                            Sign the Petition
                        </a>
                    </div>
                    <div className="mt-10 flex items-center gap-6" aria-label="Coalition supporter totals">
                        <div>
                            <CountUp end={SUPPORTER_COUNTS.residents} suffix="+" className="font-display text-3xl font-bold text-secondary" />
                            <div className="text-xs uppercase tracking-widest text-md-cream/75">Residents signed on</div>
                        </div>
                        <div className="h-10 w-px bg-md-cream/20" aria-hidden="true" />
                        <div>
                            <CountUp end={SUPPORTER_COUNTS.businessesAndGroups} suffix="+" className="font-display text-3xl font-bold text-secondary" />
                            <div className="text-xs uppercase tracking-widest text-md-cream/75">Businesses &amp; groups</div>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <div className="relative overflow-hidden rounded-xl ring-1 ring-md-cream/15">
                        <Image
                            src="/images/orange-crush.png"
                            alt="Orange crush cocktail in a clear glass with an orange garnish"
                            width={720}
                            height={720}
                            priority
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="h-full w-full object-cover"
                        />
                    </div>
                </div>
            </div>
            <FlagStripe className="h-3" />
        </section>
    )
}
