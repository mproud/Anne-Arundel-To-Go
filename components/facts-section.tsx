import {
    Beer,
    Utensils,
    Clock,
    ShieldCheck,
    Landmark,
    TrendingUp,
    DollarSign,
    Briefcase,
    Store,
    MapPin,
} from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { CountUp } from '@/components/count-up'

const facts = [
    {
        icon: Landmark,
        title: 'First a law, then local rules',
        body: 'The General Assembly must pass a bill authorizing to-go cocktails here. That law then lets the Anne Arundel County and Annapolis liquor boards adopt the regulations to allow it.',
    },
    {
        icon: MapPin,
        title: 'Maryland neighbors already do it',
        body: 'Howard County and Baltimore County have already made permanent to-go cocktails legal. Anne Arundel County and Annapolis can follow the same proven path our neighbors have paved.',
    },
    {
        icon: ShieldCheck,
        title: 'Sold in sealed, tamper-evident containers',
        body: 'To-go cocktails travel in secure, sealed containers that must stay closed in transit \u2014 the same responsible standard used successfully in jurisdictions across the country.',
    },
    {
        icon: Utensils,
        title: 'Tied to a food order',
        body: 'Proposals pair each cocktail with a food purchase, keeping the focus on full-service restaurants rather than unregulated sales.',
    },
    {
        icon: TrendingUp,
        title: 'A lifeline that became a favorite',
        body: 'Temporary pandemic-era allowances proved popular with customers and gave restaurants a real revenue stream. Making it permanent protects that progress.',
    },
    {
        icon: Beer,
        title: 'Consumer choice, done responsibly',
        body: 'Marylanders can already carry out beer and wine. Extending the same convenience to a sealed craft cocktail is a common-sense next step.',
    },
]

export function FactsSection() {
    return (
        <section id="facts" className="bg-background py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="max-w-2xl">
                    <span className="text-sm font-semibold uppercase tracking-widest text-primary">
                        Know the facts
                    </span>
                    <h2 className="mt-3 text-balance font-display text-4xl font-bold uppercase tracking-tight text-md-black sm:text-5xl">
                        Responsible, local, and overdue
                    </h2>
                    <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                        To-go cocktails are not a free-for-all. They are a carefully regulated way to support
                        neighborhood restaurants while giving customers the choice they have asked for.
                    </p>
                </div>

                <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
                    {facts.map((fact, i) => (
                        <Reveal
                            key={fact.title}
                            delay={(i % 3) * 90}
                            className="flex flex-col gap-4 bg-card p-7"
                        >
                            <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                                <fact.icon className="h-5 w-5" />
                            </span>
                            <h3 className="font-display text-lg font-semibold uppercase tracking-wide text-md-black">
                                {fact.title}
                            </h3>
                            <p className="text-sm leading-relaxed text-muted-foreground">{fact.body}</p>
                        </Reveal>
                    ))}
                </div>

                <Reveal className="mt-10 overflow-hidden rounded-xl bg-md-black">
                    <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
                        <div>
                            <span className="text-sm font-semibold uppercase tracking-widest text-secondary">
                                We already know it works
                            </span>
                            <h3 className="mt-3 text-balance font-display text-2xl font-bold uppercase tracking-tight text-md-cream sm:text-3xl">
                                It got us through COVID. Let&apos;s make it permanent.
                            </h3>
                            <p className="mt-4 text-pretty leading-relaxed text-md-cream/70">
                                When dining rooms closed in 2020, Maryland let restaurants sell to-go cocktails to
                                stay afloat. Customers loved the convenience, restaurants added a much-needed
                                revenue stream, and there was no wave of problems. The emergency ended &mdash; but
                                the demand, and the benefits, never did.
                            </p>
                        </div>
                        <dl className="grid grid-cols-3 gap-4 border-t border-md-cream/15 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                            <div>
                                <dd>
                                    <CountUp
                                        end={2020}
                                        separator=""
                                        className="font-display text-3xl font-bold text-secondary sm:text-4xl"
                                    />
                                </dd>
                                <dt className="mt-1 text-xs uppercase tracking-widest text-md-cream/60">
                                    Allowed since
                                </dt>
                            </div>
                            <div>
                                <dd>
                                    <CountUp
                                        end={35}
                                        suffix="+"
                                        className="font-display text-3xl font-bold text-secondary sm:text-4xl"
                                    />
                                </dd>
                                <dt className="mt-1 text-xs uppercase tracking-widest text-md-cream/60">
                                    States that adopted it
                                </dt>
                            </div>
                            <div>
                                <dd>
                                    <CountUp
                                        end={79}
                                        suffix="%"
                                        className="font-display text-3xl font-bold text-secondary sm:text-4xl"
                                    />
                                </dd>
                                <dt className="mt-1 text-xs uppercase tracking-widest text-md-cream/60">
                                    Want it made permanent
                                </dt>
                            </div>
                        </dl>
                    </div>
                </Reveal>

                <p className="mt-6 text-xs text-muted-foreground">
                    Specific rules such as container standards, food requirements, and sale hours are set by
                    local regulation and may change. Figures shown are illustrative of national trends;
                    contact the Anne Arundel County Board of License Commissioners or the Annapolis Alcohol
                    Beverage Control Board for current details.
                </p>
            </div>
        </section>
    )
}
