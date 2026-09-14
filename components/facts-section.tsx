import {
    Beer,
    Utensils,
    ShieldCheck,
    MapPin,
} from 'lucide-react'
import { Reveal } from '@/components/reveal'

const facts = [
    {
        icon: Beer,
        title: 'Restaurants Already Offer Alcohol To-Go',
        body: 'Restaurants can already send customers home with beer and wine. Allowing a sealed cocktail simply adds another option under clear, responsible rules.',
    },
    {
        icon: ShieldCheck,
        title: 'Sealed From Restaurant to Home',
        body: 'Cocktails to go would be sold in sealed, tamper-evident containers that must remain closed in transit.',
    },
    {
        icon: Utensils,
        title: 'Part of a Restaurant Order',
        body: 'The proposal can tie cocktails to a food purchase, keeping the focus on restaurants and making the drink an extension of the meal.',
    },
    {
        icon: MapPin,
        title: 'Our Maryland Neighbors Already Allow It',
        body: 'Other Maryland jurisdictions already allow cocktails to go. Anne Arundel County and Annapolis can build on approaches that are already working close to home.',
    },
]

export function FactsSection() {
    return (
        <section id="facts" className="bg-background py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="max-w-2xl">
                    <span className="text-sm font-semibold uppercase tracking-widest text-primary">
                        Know the Facts
                    </span>

                    <h2 className="mt-3 text-balance font-display text-4xl font-bold uppercase tracking-tight text-md-black sm:text-5xl">
                        Simple Rules. Local Benefits.
                    </h2>

                    <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                        To-go cocktails are a straightforward way to give local restaurants more
                        flexibility and customers more choice—with clear rules designed around
                        responsible service.
                    </p>
                </div>

                <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
                    {facts.map((fact, i) => (
                        <Reveal
                            key={fact.title}
                            delay={(i % 2) * 90}
                            className="flex flex-col gap-4 bg-card p-7"
                        >
                            <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                                <fact.icon className="h-5 w-5" />
                            </span>

                            <h3 className="font-display text-lg font-semibold uppercase tracking-wide text-md-black">
                                {fact.title}
                            </h3>

                            <p className="text-sm leading-relaxed text-muted-foreground">
                                {fact.body}
                            </p>
                        </Reveal>
                    ))}
                </div>

                <Reveal className="mt-10 overflow-hidden rounded-xl bg-md-black">
                    <div className="p-8 sm:p-10">
                        <span className="text-sm font-semibold uppercase tracking-widest text-secondary">
                            We Know How This Works
                        </span>

                        <h3 className="mt-3 font-display text-2xl font-bold uppercase tracking-tight text-md-cream sm:text-3xl">
                            A Small Change to Rules We Already Know.
                        </h3>

                        <div className="mt-4 space-y-4 text-pretty leading-relaxed text-md-cream/70">
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
                </Reveal>
            </div>
        </section>
    )
}