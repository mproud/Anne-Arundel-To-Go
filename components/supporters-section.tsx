import { buttonVariants } from '@/components/ui/button'
import { Building2, Store, Users } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { CountUp } from '@/components/count-up'
import { SUPPORTER_COUNTS } from '@/lib/supporter-counts'

const groups = [
    {
        icon: Store,
        label: 'Restaurants & Bars',
        members: [
            "Adam's Taphouse and Grille"
        ],
    },
    {
        icon: Building2,
        label: 'Businesses & Organizations',
        members: [],
    },
    {
        icon: Users,
        label: 'Community Support',
        members: [],
    },
]

export function SupportersSection() {
    return (
        <section id="supporters" aria-labelledby="supporters-heading" className="bg-md-cream py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="max-w-2xl">
                    <span className="text-sm font-semibold uppercase tracking-widest text-primary">The coalition</span>
                    <h2 id="supporters-heading" className="mt-3 text-balance font-display text-4xl font-bold uppercase tracking-tight text-md-black sm:text-5xl">
                        Backed by our neighbors
                    </h2>
                    <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                        Neighbors, restaurants, and local organizations are adding their names in support. Public business and organization supporters are listed here only when they have given permission to be displayed.
                    </p>
                </div>

                <dl className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
                    {[
                        { end: SUPPORTER_COUNTS.restaurantsAndBars, label: 'Restaurants & bars' },
                        { end: SUPPORTER_COUNTS.businessesAndGroups, label: 'Businesses & groups' },
                        { end: SUPPORTER_COUNTS.residents, label: 'Residents signed on' },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-card px-6 py-8 text-center">
                            <dd>
                                <CountUp end={stat.end} suffix="+" className="font-display text-4xl font-bold tracking-tight text-primary sm:text-5xl" />
                            </dd>
                            <dt className="mt-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{stat.label}</dt>
                        </div>
                    ))}
                </dl>

                <div className="mt-10 grid gap-6 lg:grid-cols-3">
                    {groups.map((group, i) => (
                        <Reveal key={group.label} delay={i * 100} className="rounded-xl border border-border bg-card p-7">
                            <div className="flex items-center gap-3">
                                <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-md-black text-md-cream">
                                    <group.icon className="h-5 w-5" aria-hidden="true" />
                                </span>
                                <h3 className="font-display text-lg font-semibold uppercase tracking-wide text-md-black">{group.label}</h3>
                            </div>
                            {group.members.length > 0 ? (
                                <ul className="mt-5 space-y-2.5">
                                    {group.members.map((member) => (
                                        <li key={member} className="flex items-center gap-2.5 border-b border-dashed border-border pb-2.5 text-sm text-foreground/85 last:border-0 last:pb-0">
                                            <span className="h-1.5 w-1.5 rounded-full bg-secondary" aria-hidden="true" />
                                            {member}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="mt-5 text-sm leading-relaxed text-muted-foreground">Additional public supporters will be listed here as they opt in.</p>
                            )}
                        </Reveal>
                    ))}
                </div>

                <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-xl border-2 border-dashed border-primary/40 bg-card p-8 text-center sm:flex-row sm:text-left">
                    <div>
                        <h3 className="font-display text-xl font-bold uppercase tracking-wide text-md-black">Represent a business or group?</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Add your organization&apos;s support through the same petition used by individual supporters.</p>
                    </div>
                    <a href="/?supporter=business#petition" className={buttonVariants({ size: 'lg', className: 'h-11 px-5 font-display font-semibold uppercase tracking-wide' })}>
                        Support as a Business
                    </a>
                </div>
            </div>
        </section>
    )
}
