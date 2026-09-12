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

export default function Page() {
    return (
        <main>
            <SiteHeader />
            <Hero />
            <FactsSection />
            <PetitionSection />
            <AboutSection />
            <SupportersSection />
            <FaqSection />
            <PostersSection />
            <SocialSection />
            <ContactSection />
            <SiteFooter />
        </main>
    )
}
