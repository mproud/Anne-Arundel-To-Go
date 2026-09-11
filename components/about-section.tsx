import Image from 'next/image'
import { Reveal } from '@/components/reveal'
import { Heart, MapPin, Handshake } from 'lucide-react'

const values = [
    {
        icon: MapPin,
        title: 'Rooted here',
        body: 'Fifteen years in Annapolis and counting. These are the restaurants I walk to, celebrate at, and bring friends to \u2014 our neighborhood spots, not chains.',
    },
    {
        icon: Heart,
        title: 'For our local spots',
        body: 'A sealed cocktail with my takeout is a small thing that puts real dollars back into the family-owned places that make this town what it is.',
    },
    {
        icon: Handshake,
        title: 'Nonpartisan & volunteer-led',
        body: 'Anne Arundel To Go is a grassroots effort started by one resident. No corporate backers, no political agenda \u2014 just neighbors who want common-sense rules.',
    },
]

export function AboutSection() {
    return (
        <section id="about" className="bg-background py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                    <Reveal className="relative order-last lg:order-first">
                        <div className="relative overflow-hidden rounded-xl border border-border">
                            <Image
                                src="/images/founder-portrait.png"
                                alt="Founder of Anne Arundel To Go, a longtime Annapolis resident, holding a to-go cocktail on a downtown sidewalk"
                                width={720}
                                height={820}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-4 -right-4 hidden max-w-[13rem] rounded-lg bg-md-black p-4 text-md-cream shadow-lg sm:block">
                            <p className="font-display text-sm font-semibold uppercase tracking-wide text-secondary">
                                Your Name Here
                            </p>
                            <p className="mt-0.5 text-xs leading-relaxed text-md-cream/70">
                                Founder &amp; 15-year Annapolis resident
                            </p>
                        </div>
                    </Reveal>

                    <div>
                        <span className="text-sm font-semibold uppercase tracking-widest text-primary">
                            Who we are
                        </span>
                        <h2 className="mt-3 text-balance font-display text-4xl font-bold uppercase tracking-tight text-md-black sm:text-5xl">
                            Neighbors, not lobbyists
                        </h2>
                        <div className="mt-5 space-y-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                            <p>
                                I&apos;ve lived in Annapolis for 15 years, and this campaign started with a simple
                                wish: to bring a favorite drink home from the places I already love &mdash; a
                                margarita from El Toro Bravo, an Orange Crush from Adam&apos;s, a bourbon drink from
                                Dry 85, or a cocktail from the EDC.
                            </p>
                            <p>
                                We could do exactly that during the pandemic, and it worked &mdash; but that
                                temporary allowance expired a few years ago. So I started Anne Arundel To Go to
                                bring it back for good. It&apos;s one resident&apos;s effort, growing into a
                                coalition of neighbors and local businesses united by one simple belief: adults
                                should be able to order a sealed cocktail with their takeout, just like they already
                                can with beer and wine.
                            </p>
                        </div>

                        <div className="mt-8 grid gap-5 sm:grid-cols-3">
                            {values.map((value, i) => (
                                <Reveal key={value.title} delay={i * 90} className="flex flex-col gap-2">
                                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                                        <value.icon className="h-5 w-5" />
                                    </span>
                                    <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-md-black">
                                        {value.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground">{value.body}</p>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
