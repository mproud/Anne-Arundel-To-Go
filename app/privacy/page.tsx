import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export const metadata: Metadata = {
    title: 'Privacy',
    description: 'How Anne Arundel To Go handles information submitted through the petition and contact forms.',
    alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
    return (
        <>
            <SiteHeader />
            <main id="main-content" className="bg-background">
                <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
                    <span className="text-sm font-semibold uppercase tracking-widest text-primary">Privacy</span>
                    <h1 className="mt-3 font-display text-4xl font-bold uppercase tracking-tight text-md-black sm:text-5xl">Privacy notice</h1>
                    <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                        This notice explains how information submitted through Anne Arundel To Go is used.
                    </p>

                    <div className="prose-a:text-primary mt-10 space-y-8 text-base leading-relaxed text-foreground/85">
                        <section>
                            <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-md-black">Petition submissions</h2>
                            <p className="mt-3">
                                The petition collects the information shown on the form, including your name, email address, Zip code, 
                                supporter type, and any business or organization information you provide. The information is sent to the 
                                coalition so it can record and manage support for the initiative.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-md-black">Public business supporters</h2>
                            <p className="mt-3">
                                A business or organization may be listed publicly only when the person submitting the form selects the 
                                public-supporter option. This site does not automatically publish petition submissions. Individual petition 
                                signatures are not displayed publicly by this website.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-md-black">Updates</h2>
                            <p className="mt-3">
                                Coalition updates are optional. The petition offers a separate updates checkbox, unchecked by default. 
                                Contact messages do not opt you into updates. If you choose to subscribe to updates, you'll receive a handful 
                                of messages at most to keep you updated as the bill progresses through the Maryland General Assembly. You can 
                                unsubscribe at any point by clicking the unsubscribe  link in the email.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-md-black">Email delivery</h2>
                            <p className="mt-3">
                                Petition and contact submissions are delivered to the coalition using Resend, an email delivery provider. 
                                Information submitted through these forms is processed by Resend for the purpose of delivering 
                                the message.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-md-black">Questions</h2>
                            <p className="mt-3">
                                Questions about this notice can be sent to{' '}
                                <a href="mailto:hello@annearundeltogo.com" className="font-medium text-primary underline underline-offset-2">
                                    hello@annearundeltogo.com
                                </a>
                                .
                            </p>
                        </section>
                    </div>
                </article>
            </main>
            <SiteFooter />
        </>
    )
}
