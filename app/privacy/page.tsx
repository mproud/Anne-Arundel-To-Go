import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export const metadata: Metadata = {
    title: 'Privacy',
    description:
        'How Anne Arundel To Go handles petition submissions, contact messages, and website analytics.',
    alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
    return (
        <>
            <SiteHeader />

            <main id="main-content" className="bg-background">
                <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
                    <span className="text-sm font-semibold uppercase tracking-widest text-primary">
                        Privacy
                    </span>

                    <h1 className="mt-3 font-display text-4xl font-bold uppercase tracking-tight text-md-black sm:text-5xl">
                        Privacy notice
                    </h1>

                    <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                        This notice explains what information we collect when
                        you visit Anne Arundel To Go, sign the petition, or
                        contact us.
                    </p>

                    <div className="mt-10 space-y-8 text-base leading-relaxed text-foreground/85">
                        <section>
                            <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-md-black">
                                Petition submissions
                            </h2>

                            <p className="mt-3">
                                When you sign the petition, we collect your
                                name, email address, ZIP code, and whether
                                you&apos;re signing as an individual or on behalf
                                of a business or organization. If you sign for
                                a business or organization, we also collect
                                its name and the permissions you select on
                                the form.
                            </p>

                            <p className="mt-3">
                                We use this information to record and manage support for the petition, 
                                verify submissions when necessary, and communicate with you about your 
                                submission.
                            </p>

                            <p className="mt-3">
                                We may share petition signatures and relevant information with members of the 
                                Maryland General Assembly and their staff to demonstrate public support for 
                                legislation allowing cocktails to go in Anne Arundel County and Annapolis. 
                                We do not share your email address for this purpose.
                            </p>

                            <p className="mt-3">
                                Individual petition signatures are not displayed publicly on this website.
                            </p>

                            <p className="mt-3">
                                We also store petition contact details in a secured database.
                                Everyone who signs is added to our petition contacts list. Only people 
                                who separately choose to receive updates are added to our coalition 
                                updates mailing list.
                            </p>

                            <p className="mt-3">
                                When you arrive through a link with campaign tracking parameters, we
                                keep those parameters during your visit and include them with your
                                petition submission so we can understand where submissions come from.
                                They may also be saved with your contact details in Resend.
                            </p>

                            <p className="mt-3">
                                We do not sell your personal information or provide petition contact 
                                information to third parties for their own marketing purposes.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-md-black">
                                Public business supporters
                            </h2>

                            <p className="mt-3">
                                We may display the name of a business or
                                organization on the website when its
                                representative gives us permission to do so.
                                Choosing to sign on behalf of an organization
                                does not automatically give us permission to
                                display its name publicly.
                            </p>

                            <p className="mt-3">
                                Individual petition signatures are not
                                displayed publicly on this website.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-md-black">
                                Contact messages
                            </h2>

                            <p className="mt-3">
                                When you contact us, we collect your name,
                                email address, and the information you include
                                in your message. We use that information to
                                read and respond to your inquiry. We also record any campaign
                                tracking parameters associated with your visit. Contact form
                                submissions are also stored in our secured Cloudflare database
                                so we can reliably process and respond to them.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-md-black">
                                Information retention
                            </h2>

                            <p className="mt-3">
                                We retain petition submissions and related contact information for as long as 
                                reasonably necessary to operate the initiative, demonstrate public support for 
                                the proposed legislation, and maintain accurate petition records.
                            </p>

                            <p className="mt-3">
                                You may request the removal of your personal information from our records by 
                                contacting{' '}
                                <a
                                    href="mailto:hello@annearundeltogo.com"
                                    className="font-medium text-primary underline underline-offset-2"
                                >
                                    hello@annearundeltogo.com
                                </a>, subject to any applicable legal or recordkeeping requirements.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-md-black">
                                Coalition updates
                            </h2>

                            <p className="mt-3">
                                You can choose to receive occasional updates
                                when signing the petition. This is optional,
                                and the checkbox is not selected by default.
                                Sending us a contact message does not sign you
                                up for updates.
                            </p>

                            <p className="mt-3">
                                If you no longer want to receive updates,
                                contact us at{' '}
                                <a
                                    href="mailto:hello@annearundeltogo.com"
                                    className="font-medium text-primary underline underline-offset-2"
                                >
                                    hello@annearundeltogo.com
                                </a>
                                .
                            </p>
                        </section>

                        <section>
                            <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-md-black">
                                Website analytics
                            </h2>

                            <p className="mt-3">
                                We use Google Analytics to understand how
                                people find and use this website. It helps us
                                see which pages receive visitors, how people
                                navigate the site, and whether features such
                                as the petition and contact forms are being
                                used.
                            </p>

                            <p className="mt-3">
                                Google Analytics may collect information
                                such as the pages you visit, the time of your
                                visit, how you arrived at the site, your
                                general geographic area, and information
                                about your browser and device. It uses cookies
                                and similar technologies to recognize visits
                                and measure website activity.
                            </p>

                            <p className="mt-3">
                                We may also measure actions such as successful
                                petition submissions, contact form submissions,
                                social-sharing clicks, and poster downloads.
                                We do not intentionally send the names,
                                email addresses, ZIP codes, organization
                                names, or message contents entered into our
                                forms to Google Analytics.
                            </p>

                            <p className="mt-3">
                                Google processes analytics information on
                                our behalf. To learn more about how Google
                                collects and uses information from websites
                                that use its services, visit{' '}
                                <a
                                    href="https://www.google.com/policies/privacy/partners/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium text-primary underline underline-offset-2"
                                >
                                    How Google uses information from sites
                                    or apps that use its services
                                </a>
                                .
                            </p>

                            <p className="mt-3">
                                You can control or delete cookies through
                                your browser settings. Google also provides
                                a{' '}
                                <a
                                    href="https://tools.google.com/dlpage/gaoptout"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium text-primary underline underline-offset-2"
                                >
                                    Google Analytics opt-out browser add-on
                                </a>
                                . Browser settings and opt-out tools may
                                affect how Google Analytics measures your
                                visit.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-md-black">
                                Email delivery
                            </h2>

                            <p className="mt-3">
                                Petition submissions and contact messages
                                are delivered to the coalition using Resend,
                                an email delivery provider. Resend processes
                                the information included in those submissions
                                to deliver the messages.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-md-black">
                                Questions
                            </h2>

                            <p className="mt-3">
                                If you have questions about this privacy notice, want to update 
                                your communication preferences, or would like to request access to, 
                                correction of, or removal of personal information you have submitted, 
                                please contact us at{' '}
                                <a
                                    href="mailto:hello@annearundeltogo.com"
                                    className="font-medium text-primary underline underline-offset-2"
                                >
                                    hello@annearundeltogo.com
                                </a>
                                .
                            </p>

                            <p className="mt-3">
                                We will review and respond to requests in accordance with applicable 
                                law and our recordkeeping obligations.
                            </p>
                        </section>
                    </div>
                </article>
            </main>

            <SiteFooter />
        </>
    )
}