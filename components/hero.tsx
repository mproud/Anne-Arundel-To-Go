import Image from 'next/image'
import { buttonVariants } from '@/components/ui/button'
import { FlagStripe } from '@/components/flag-stripe'
import { CountUp } from '@/components/count-up'
import { MapPin, PenLine } from 'lucide-react'

export function Hero() {
    return (
        <section id="top" className="relative overflow-hidden bg-md-black text-md-cream">
            <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
                <div className="relative z-10">
                    <h1 className="mt-5 text-balance font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                        Bring Home the
                        <span className="mt-1 block text-secondary">To-Go Cocktail</span>
                    </h1>

                    <p className="mt-6 max-w-md text-pretty text-lg leading-relaxed text-md-cream/80">
                        Our restaurants kept us going. Now let&apos;s keep them going. Sign the petition to
                        permanently allow sealed to-go cocktails from licensed restaurants across Anne Arundel
                        County and Annapolis.
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <a
                            href="#petition"
                            className={buttonVariants({
                                size: 'lg',
                                className: 'h-12 font-display text-base font-semibold uppercase tracking-wide',
                            })}
                        >
                            <PenLine className="h-5 w-5" />
                            Sign the Petition
                        </a>
                        <a
                            href="#supporters"
                            className={buttonVariants({
                                size: 'lg',
                                variant: 'secondary',
                                className:
                                    'h-12 bg-secondary font-display text-base font-semibold uppercase tracking-wide text-secondary-foreground hover:bg-secondary/90',
                            })}
                        >
                            Join as a Business
                        </a>
                    </div>

                    <div className="mt-10 flex items-center gap-6">
                        <div>
                            <CountUp
                                end={5}
                                suffix="+"
                                className="font-display text-3xl font-bold text-secondary"
                            />
                            <div className="text-xs uppercase tracking-widest text-md-cream/60">
                                Neighbors signed
                            </div>
                        </div>
                        <div className="h-10 w-px bg-md-cream/20" />
                        <div>
                            <CountUp
                                end={3}
                                suffix="+"
                                className="font-display text-3xl font-bold text-secondary"
                            />
                            <div className="text-xs uppercase tracking-widest text-md-cream/60">
                                Local businesses
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    {/* There was a flag mark here */}
                    <div className="relative overflow-hidden rounded-xl ring-1 ring-md-cream/15">
                        <Image
                            src="/images/hero-annapolis.png"
                            alt="A sealed to-go craft cocktail on a restaurant bar with the Annapolis waterfront and sailboats behind it"
                            width={720}
                            height={720}
                            priority
                            className="h-full w-full object-cover"
                        />
                    </div>
                </div>
            </div>
            <FlagStripe className="h-3" />
        </section>
    )
}
