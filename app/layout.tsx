import type { Metadata, Viewport } from 'next'
import { Oswald, Public_Sans } from 'next/font/google'
import {
    SITE_DESCRIPTION,
    SITE_NAME,
    SITE_OG_DESCRIPTION,
    SITE_OG_IMAGE,
    SITE_OG_TITLE,
    SITE_TITLE,
    SITE_URL,
} from '@/lib/site'
import './globals.css'
import './accessibility.css'
import { GoogleAnalytics } from '@/components/google-analytics'
import { AttributionTracker } from '@/components/attribution-tracker'
import { Suspense } from 'react'

const publicSans = Public_Sans({
    subsets: ['latin'],
    variable: '--font-public-sans',
    display: 'swap',
})

const oswald = Oswald({
    subsets: ['latin'],
    variable: '--font-oswald',
    display: 'swap',
})

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),

    title: {
        default: SITE_TITLE,
        template: `%s | ${SITE_NAME}`,
    },

    description: SITE_DESCRIPTION,
    applicationName: SITE_NAME,
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: 'Community advocacy',
    referrer: 'origin-when-cross-origin',

    keywords: [
        'Anne Arundel County',
        'Annapolis',
        'cocktails to go',
        'to-go cocktails',
        'Maryland restaurants',
        'local restaurants',
        'Anne Arundel To Go',
    ],

    alternates: {
        canonical: '/',
    },

    openGraph: {
        type: 'website',
        url: '/',
        siteName: SITE_NAME,
        locale: 'en_US',
        title: SITE_OG_TITLE,
        description: SITE_OG_DESCRIPTION,
        images: [
            {
                url: SITE_OG_IMAGE,
                width: 1200,
                height: 630,
                alt: 'Anne Arundel To Go - Let Anne Arundel Take It To-Go',
            },
        ],
    },

    twitter: {
        card: 'summary_large_image',
        title: SITE_OG_TITLE,
        description: SITE_OG_DESCRIPTION,
        images: [SITE_OG_IMAGE],
    },

    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
        },
    },

    icons: {
        icon: [
            { url: '/favicon.ico', sizes: 'any' },
            { url: '/icon-32.png', sizes: '32x32', type: 'image/png' },
            { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
            { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
        apple: [
            {
                url: '/apple-touch-icon.png',
                sizes: '180x180',
                type: 'image/png',
            },
        ],
    },

    manifest: '/manifest.webmanifest',

    appleWebApp: {
        capable: true,
        title: SITE_NAME,
        statusBarStyle: 'default',
    },

    formatDetection: {
        telephone: false,
        address: false,
        email: false,
    },
}

export const viewport: Viewport = {
    colorScheme: 'light',
    themeColor: '#C8102E',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className={`bg-background ${publicSans.variable} ${oswald.variable}`}>
            <body className="font-sans antialiased">
                <a
                    href="#main-content"
                    className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-md bg-md-black px-4 py-3 text-sm font-semibold text-md-cream shadow-lg transition-transform focus:translate-y-0"
                >
                    Skip to main content
                </a>
                
                {children}

                <Suspense fallback={null}><AttributionTracker /></Suspense>
                <GoogleAnalytics />
            </body>
        </html>
    )
}
