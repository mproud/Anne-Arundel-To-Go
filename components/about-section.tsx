import { Reveal } from '@/components/reveal'

export function AboutSection() {
    return (
        <section id="about" className="border-t border-border bg-muted py-20 sm:py-24">
            <div className="mx-auto max-w-5xl px-4 sm:px-6">
                <Reveal>
                    <div className="mx-auto max-w-4xl">
                        <span className="text-sm font-semibold uppercase tracking-widest text-primary">
                            Who We Are
                        </span>

                        <h2 className="mt-3 text-balance font-display text-4xl font-bold uppercase tracking-tight text-md-black sm:text-5xl lg:text-6xl">
                            How This Got Started
                        </h2>

                        <div className="mt-8 space-y-5 text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
                            <p>
                                My name is Matt Proud. I've lived and worked in Annapolis for more than 15 years,
                                and like everyone else, I have my go-to places - El Toro Bravo, Boatyard, Adam's, 
                                and so, so many others.
                            </p>

                            <p>
                                At some point, I started wondering why I could take home beer or a
                                corked bottle of wine from a restaurant, but not a cocktail
                                from that same restaurant. It worked during COVID, so why not bring it back?
                            </p>

                            <p>
                                The more I looked into it, the more I realized that it's not complicated. 
                                Other Maryland counties are already doing it. Why can't we do it too?
                            </p>

                            <p>
                                So I started talking to friends about it. What began as a pretty
                                simple question has grown into a coalition of neighbors,
                                restaurants, and local businesses working to bring cocktails to go
                                to Anne Arundel County and Annapolis.
                            </p>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    )
}