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
    title: 'Anne Arundel To Go | Legalize To-Go Cocktails in Anne Arundel County & Annapolis',
    description:
        'Sign the petition to let Anne Arundel County and Annapolis restaurants sell sealed to-go cocktails. Support local jobs, small businesses, and consumer choice in Maryland.',
    openGraph: {
        title: 'Legalize To-Go Cocktails in Anne Arundel County & Annapolis',
        description:
            'Join the coalition of restaurants, businesses, and residents supporting sealed to-go cocktails across Anne Arundel County and Annapolis, Maryland.',
        type: 'website',
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
                {children}
            </body>
        </html>
    )
}
