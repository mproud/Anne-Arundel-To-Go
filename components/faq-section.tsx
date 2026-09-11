import { Reveal } from '@/components/reveal'
import { Plus } from 'lucide-react'

const faqs = [
    {
        q: "Won't this hurt liquor stores? They're small businesses too!",
        a: "We hear this a lot, and we take it seriously \u2014 liquor stores are valued neighbors and local employers. But a single sealed cocktail served alongside a meal isn't the same product a package store sells. You can't stock a party or your home bar from a restaurant to-go order; it's one drink with your dinner, made by the kitchen you're already ordering from. During the pandemic, restaurants and package stores operated with to-go cocktails side by side, and package stores stayed strong. It is already permanent in Howard County and Baltimore County, where liquor stores continue to thrive. This is about restaurants keeping the food-and-drink experience they already offer, not competing with retail.",
    },
    {
        q: 'Is this just alcohol anywhere, anytime?',
        a: 'No. To-go cocktails are tightly regulated: drinks must be in sealed, tamper-evident containers, are tied to a food order, are limited by the hours in the restaurant\u2019s existing license, and can only be sold by licensed establishments. It is a narrow, common-sense extension of rules that already exist.',
    },
    {
        q: 'What about drunk driving and open containers?',
        a: 'Sealed, tamper-evident packaging is treated like any other closed container \u2014 it travels in the trunk or back of the vehicle, not open in the cupholder. Existing open-container and DUI laws stay fully in force. Nothing here changes the rules of the road.',
    },
    {
        q: "Didn't we already have this during COVID?",
        a: 'Yes \u2014 and it worked. Maryland allowed to-go cocktails as a temporary emergency measure during the pandemic. Customers loved it, restaurants gained a real revenue stream, and there was no wave of problems. That authorization expired a few years ago, so today it is no longer allowed. Our goal is simply to bring that proven success back \u2014 permanently \u2014 for Anne Arundel County and Annapolis.',
    },
    {
        q: 'How does this actually become legal, and how can I help?',
        a: 'It takes two steps. First, the Maryland General Assembly has to pass a bill authorizing to-go cocktails in our area. Once that law is in place, it permits the Anne Arundel County Board of License Commissioners and the Annapolis Alcohol Beverage Control Board to adopt the specific regulations \u2014 container standards, hours, food requirements \u2014 that make it work. The most powerful thing you can do is sign the petition and share it, so our state lawmakers see how much local demand there is to pass the bill.',
    },
]

export function FaqSection() {
    return (
        <section id="faq" className="bg-muted py-20">
            <div className="mx-auto max-w-3xl px-4 sm:px-6">
                <div className="max-w-2xl">
                    <span className="text-sm font-semibold uppercase tracking-widest text-primary">
                        Questions & answers
                    </span>
                    <h2 className="mt-3 text-balance font-display text-4xl font-bold uppercase tracking-tight text-md-black sm:text-5xl">
                        Fair questions, straight answers
                    </h2>
                    <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                        To-go cocktails work best when they work for everyone &mdash; restaurants, retailers,
                        and residents alike. Here is how we think about the concerns we hear most.
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
