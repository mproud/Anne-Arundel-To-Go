import type { Metadata, Viewport } from 'next'
import { Oswald, Public_Sans } from 'next/font/google'
import './globals.css'

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
    metadataBase: new URL('https://annearundeltogo.com'),

    title: {
        default: 'Sign the Petition - Support To Go Cocktails in Annapolis and Anne Arundel County',
        template: '%s | Anne Arundel To Go',
    },

    description:
        'Join neighbors, restaurants, and local businesses supporting cocktails to go in Anne Arundel County and Annapolis. Add your name to the petition.',

    applicationName: 'Anne Arundel To Go',

    creator: 'Anne Arundel To Go',
    publisher: 'Anne Arundel To Go',

    keywords: [
        'Anne Arundel County',
        'Annapolis',
        'cocktails to go',
        'to-go cocktails',
        'Maryland restaurants',
        'Anne Arundel To Go',
    ],

    alternates: {
        canonical: '/',
    },

    openGraph: {
        type: 'website',
        url: '/',
        siteName: 'Anne Arundel To Go',
        locale: 'en_US',
        title: 'Let Anne Arundel Take It To-Go',
        description:
            'Restaurants can already send customers home with beer and wine. Join the coalition supporting sealed cocktails to go in Anne Arundel County and Annapolis.',
        images: [
            {
                url: '/images/anne-arundel-to-go-og.jpg',
                width: 1200,
                height: 630,
                alt: 'Anne Arundel To Go — Let Anne Arundel Take It To-Go',
            },
        ],
    },

    twitter: {
        card: 'summary_large_image',
        title: 'Let Anne Arundel Take It To-Go',
        description:
            'Join neighbors, restaurants, and local businesses supporting sealed cocktails to go in Anne Arundel County and Annapolis.',
        images: ['/images/anne-arundel-to-go-og.jpg'],
    },

    icons: {
        icon: [
            { url: '/favicon.ico' },
            { url: '/icon-32.png', sizes: '32x32', type: 'image/png' },
            { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        ],
        apple: [
            {
                url: '/apple-touch-icon.png',
                sizes: '180x180',
                type: 'image/png',
            },
        ],
    },

    manifest: '/site.webmanifest',
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
                {children}
            </body>
        </html>
    )
}
