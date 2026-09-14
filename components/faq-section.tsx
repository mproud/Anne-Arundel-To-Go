import { Reveal } from '@/components/reveal'
import { Plus } from 'lucide-react'

const faqs = [
    {
        q: "Won't this hurt liquor stores? They're small businesses too!",
        a: "Liquor stores are important local businesses, and this proposal isn't meant to replace them. A sealed cocktail sold with a restaurant order is fundamentally different from buying bottles, cases, or other alcohol for home. It simply lets a restaurant send a customer home with the drink that would otherwise have been served alongside their meal.",
    },
    {
        q: "Is this just alcohol anywhere, anytime?",
        a: "No. This would apply only to licensed establishments and would operate under specific rules governing packaging, hours, food requirements, and responsible alcohol service. It's a limited extension of restaurant privileges—not unrestricted alcohol sales.",
    },
    {
        q: "What about drunk driving and open containers?",
        a: "Nothing about this proposal changes Maryland’s DUI or open-container laws. Cocktails would have to remain sealed in transit, just like other alcohol being taken home. The rules of the road stay exactly the same.",
    },
    {
        q: "How does this actually become legal, and how can I help?",
        a: "First, the state has to give Anne Arundel County and Annapolis the green light. Then our local licensing boards can decide the details, like how cocktails are packaged, when they can be sold, and what restaurants have to do to participate. Signing the petition helps show lawmakers that people here want that option.",
    },
]

export function FaqSection() {
    return (
        <section id="faq" className="bg-muted py-20">
            <div className="mx-auto max-w-3xl px-4 sm:px-6">
                <div className="max-w-2xl">
                    <span className="text-sm font-semibold uppercase tracking-widest text-primary">
                        The Details
                    </span>
                    <h2 className="mt-3 text-balance font-display text-4xl font-bold uppercase tracking-tight text-md-black sm:text-5xl">
                        Fair Questions, Straight Answers.
                    </h2>
                    <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                        A change like this should work for restaurants, retailers, customers, and the broader 
                        community. Here are straightforward answers to some of the questions we hear most.
                    </p>
                </div>

                <div className="mt-10 space-y-3">
                    {faqs.map((faq, i) => (
                        <Reveal key={faq.q} delay={i * 60}>
                            <details className="group rounded-xl border border-border bg-card px-6 [&_summary::-webkit-details-marker]:hidden">
                                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-display text-lg font-semibold uppercase tracking-wide text-md-black">
                                    {faq.q}
                                    <Plus
                                        className="h-5 w-5 shrink-0 text-primary transition-transform duration-300 group-open:rotate-45"
                                        aria-hidden
                                    />
                                </summary>
                                <p className="pb-6 text-pretty leading-relaxed text-muted-foreground">{faq.a}</p>
                            </details>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    )
}
