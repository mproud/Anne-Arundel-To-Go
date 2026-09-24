import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { FactsSection } from '@/components/facts-section'
import { AboutSection } from '@/components/about-section'
import { PetitionSection } from '@/components/petition-section'
import { SupportersSection } from '@/components/supporters-section'
import { FaqSection } from '@/components/faq-section'
import { PostersSection } from '@/components/posters-section'
import { SocialSection } from '@/components/social-section'
import { ContactSection } from '@/components/contact-section'
import { SiteFooter } from '@/components/site-footer'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site'

const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'Organization',
            '@id': `${SITE_URL}/#organization`,
            name: SITE_NAME,
            url: SITE_URL,
            email: 'hello@annearundeltogo.com',
            logo: {
                '@type': 'ImageObject',
                url: `${SITE_URL}/images/anne-arundel-to-go-logo-white-background.png`,
            },
            description: SITE_DESCRIPTION,
            founder: {
                '@type': 'Person',
                name: 'Matt Proud',
            },
            areaServed: [
                { '@type': 'AdministrativeArea', name: 'Anne Arundel County, Maryland' },
                { '@type': 'City', name: 'Annapolis, Maryland' },
            ],
        },
        {
            '@type': 'WebSite',
            '@id': `${SITE_URL}/#website`,
            url: SITE_URL,
            name: SITE_NAME,
            description: SITE_DESCRIPTION,
            inLanguage: 'en-US',
            publisher: { '@id': `${SITE_URL}/#organization` },
        },
        {
            '@type': 'WebPage',
            '@id': `${SITE_URL}/#webpage`,
            url: SITE_URL,
            name: SITE_NAME,
            description: SITE_DESCRIPTION,
            isPartOf: { '@id': `${SITE_URL}/#website` },
            about: { '@id': `${SITE_URL}/#organization` },
            inLanguage: 'en-US',
        },
    ],
}

export default function Page() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}
            />
            <SiteHeader />
            <main id="main-content">
                <Hero />
                <SupportersSection />
                <PetitionSection />
                <FactsSection />
                <FaqSection />
                <AboutSection />
                <PostersSection />
                <SocialSection />
                <ContactSection />
            </main>
            <SiteFooter />
        </>
    )
}
