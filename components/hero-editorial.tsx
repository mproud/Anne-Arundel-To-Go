import { PetitionSection } from '@/components/petition-section'
import formStyles from './hero-petition.module.css'
import layout from './hero-editorial.module.css'
import { buttonVariants } from '@/components/ui/button'
import { FlagStripe } from '@/components/flag-stripe'
import { PenLine } from 'lucide-react'
import { CountUp } from '@/components/count-up'
import { SUPPORTER_COUNTS } from '@/lib/supporter-counts'
import { SHOW_COALITION } from '@/lib/site-features'

/** The existing petition form remains mounted once; only the surrounding hero changes. */
export function Hero() {
    return (
        <section id="top" aria-labelledby="hero-heading" className={`${layout.hero} relative isolate overflow-hidden bg-md-black text-md-cream`}>
            <div className="relative z-10 mx-auto grid max-w-6xl items-start gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-14 lg:py-20">
                <div className="min-w-0 lg:pt-7">
                    <div className="mb-6 hidden items-center gap-3 lg:flex">
                        <span className="h-px w-9 shrink-0 bg-secondary" aria-hidden="true" />
                        <span className="text-xs font-semibold uppercase tracking-[0.17em] text-md-cream/65">Anne Arundel County · Annapolis</span>
                    </div>
                    <h1 id="hero-heading" className="text-balance font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                        Let Anne Arundel
                        <span className="mt-1 block text-secondary">Take it To-Go</span>
                    </h1>
                    <p className="mt-6 max-w-md text-pretty text-lg leading-relaxed text-md-cream/80">
                        Restaurants can already send customers home with beer and wine. We&apos;re supporting a local option for licensed restaurants to offer sealed cocktails to go under clear rules for responsible service.
                    </p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:hidden">
                        <a href="#petition" className={buttonVariants({ size: 'lg', className: 'h-14 px-8 font-display text-lg font-semibold uppercase tracking-wide' })}>
                            <PenLine className="mr-2 h-5 w-5" aria-hidden="true" />
                            Sign the Petition
                        </a>
                    </div>
                    {SHOW_COALITION && (
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
                    )}
                </div>
                <div className={`${formStyles.formColumn} relative z-10 min-w-0`}>
                    <PetitionSection />
                </div>
            </div>
            <FlagStripe className="relative z-10 h-2" />
        </section>
    )
}
