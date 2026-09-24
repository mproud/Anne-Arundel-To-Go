import Image from 'next/image'
import { Beer, MapPin, ShieldCheck, Utensils } from 'lucide-react'
import { Reveal } from '@/components/reveal'

// Keep the existing FactsSection in the repository; this component is the
// light-background layout used on the homepage.
const facts = [
    {
        icon: Beer,
        title: 'Restaurants Already Offer Alcohol To-Go',
        body: 'Restaurants can already send customers home with beer and wine. Allowing a cocktail simply adds another option under clear rules.',
    },
    {
        icon: MapPin,
        title: 'Our Maryland Neighbors Already Allow It',
        body: 'Other Maryland jurisdictions already allow cocktails to go. Anne Arundel County and Annapolis can build on approaches that are already working close to home.',
    },
    {
        icon: Utensils,
        title: 'Part of a Restaurant Order',
        body: 'The proposal can tie cocktails to a food purchase, keeping the focus on restaurants and making the drink an extension of the meal.',
    },
    {
        icon: ShieldCheck,
        title: 'Sealed From Restaurant to Home',
        body: 'Cocktails to go would be sold in containers that must remain closed in transit.',
    },
]

export function FactsSection() {
    return (
        <section id="facts" aria-labelledby="facts-heading" className="bg-white py-20 text-md-black sm:py-24">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="max-w-3xl">
                    <span className="text-sm font-semibold uppercase tracking-widest text-primary">
                        Know the Facts
                    </span>
                    <h2 id="facts-heading" className="mt-3 text-balance font-display text-4xl font-bold uppercase tracking-tight text-md-black sm:text-5xl">
                        Simple Rules. Local Benefits.
                    </h2>
                    <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                        To-go cocktails are a straightforward way to give local restaurants more
                        flexibility and customers more choice—with clear rules designed around
                        responsible service.
                    </p>
                </div>

                <div className="mt-11 grid gap-4 sm:grid-cols-2">
                    {facts.map((fact, i) => (
                        <Reveal
                            key={fact.title}
                            delay={(i % 2) * 90}
                            className="flex flex-col gap-4 rounded-xl border border-border bg-md-cream/65 p-7"
                        >
                            <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                                <fact.icon className="h-5 w-5" aria-hidden="true" />
                            </span>
                            <h3 className="font-display text-lg font-semibold uppercase tracking-wide text-md-black">
                                {fact.title}
                            </h3>
                            <p className="text-sm leading-relaxed text-muted-foreground">{fact.body}</p>
                        </Reveal>
                    ))}
                </div>

                <Reveal className="mt-10 overflow-hidden rounded-2xl bg-[#f5efe4] shadow-sm ring-1 ring-md-black/10">
                    <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(300px,390px)]">
                        <div className="min-w-0 p-7 sm:p-10 lg:p-12">
                            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
                                We Know How This Works
                            </span>
                            <h3 className="mt-3 font-display text-2xl font-bold uppercase tracking-tight text-md-black sm:text-3xl">
                                A Small Change to Rules We Already Know.
                            </h3>
                            <div className="mt-4 space-y-4 text-pretty leading-relaxed text-md-black/75">
                                <p>
                                    Taking alcohol home from a restaurant isn&apos;t new. Customers can
                                    already leave with beer and wine. Cocktails to go apply that same
                                    idea to a sealed drink prepared by the restaurant you&apos;re already
                                    ordering from.
                                </p>
                                <p>
                                    Maryland also allowed the practice temporarily during the pandemic,
                                    giving restaurants and regulators real-world experience with how it
                                    can work responsibly.
                                </p>
                            </div>
                        </div>
                        <div className="relative order-first min-h-[290px] bg-secondary/10 sm:min-h-[340px] lg:order-last lg:min-h-[380px]">
                            <Image
                                src="/images/orange-crush.png"
                                alt="Orange crush cocktail in a clear glass with an orange garnish"
                                fill
                                sizes="(max-width: 1024px) 100vw, 390px"
                                className="object-cover object-center"
                            />
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    )
}
