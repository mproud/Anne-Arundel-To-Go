'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Check, Copy, Download, MessageCircle, Send, Share2 } from 'lucide-react'

const CAMPAIGN_URL = 'https://annearundeltogo.org'

const posts = [
    {
        id: 'jobs',
        text: 'To-go cocktails helped our local restaurants survive \u2014 now let\u2019s make them permanent in Anne Arundel County & Annapolis. Add your name and support local jobs. #AnneArundelToGo #Annapolis',
    },
    {
        id: 'choice',
        text: 'We can already carry out beer and wine in Maryland. A sealed to-go cocktail from your favorite restaurant should be just as easy. Sign the petition! #AnneArundelToGo #ToGoCocktails',
    },
    {
        id: 'call',
        text: 'Maryland let us get to-go cocktails during the pandemic and it worked \u2014 then it expired. Tell our state lawmakers to pass the bill and bring it back for Anne Arundel County & Annapolis. #AnneArundelToGo',
    },
]

const graphics = [
    {
        title: 'Instagram / Facebook Post',
        ratio: 'aspect-square',
        src: '/social/social-square.png',
        file: 'anne-arundel-to-go-social-square.png',
    },
    {
        title: 'Instagram / TikTok Story',
        ratio: 'aspect-[9/16]',
        src: '/social/social-story.png',
        file: 'anne-arundel-to-go-social-story.png',
    },
]

export function SocialSection() {
    const [copiedId, setCopiedId] = useState<string | null>(null)

    const copy = async (id: string, text: string) => {
        try {
            await navigator.clipboard.writeText(`${text} ${CAMPAIGN_URL}`)
            setCopiedId(id)
            setTimeout(() => setCopiedId(null), 2000)
        } catch {
            setCopiedId(null)
        }
    }

    return (
        <section className="border-t border-border bg-muted py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="max-w-2xl">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary">
                        <Share2 className="h-4 w-4" />
                        Spread the word
                    </span>
                    <h2 className="mt-3 text-balance font-display text-4xl font-bold uppercase tracking-tight text-md-black sm:text-5xl">
                        Share it in one tap
                    </h2>
                    <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                        Copy a ready-to-post message or grab a graphic. The more people who see it, the louder
                        our message to local decision-makers.
                    </p>
                </div>

                <div className="mt-12 grid gap-8 lg:grid-cols-2">
                    <div className="space-y-4">
                        <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                            Ready-to-post messages
                        </h3>
                        {posts.map((post) => (
                            <div key={post.id} className="rounded-xl border border-border bg-card p-5">
                                <p className="text-sm leading-relaxed text-foreground/90">{post.text}</p>
                                <div className="mt-4 flex flex-wrap items-center gap-2">
                                    <button
                                        onClick={() => copy(post.id, post.text)}
                                        className="inline-flex h-9 items-center gap-2 rounded-md bg-md-black px-3 text-xs font-semibold uppercase tracking-wide text-md-cream transition-colors hover:bg-primary"
                                    >
                                        {copiedId === post.id ? (
                                            <>
                                                <Check className="h-4 w-4" /> Copied
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="h-4 w-4" /> Copy text
                                            </>
                                        )}
                                    </button>
                                    <a
                                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.text)}&url=${encodeURIComponent(CAMPAIGN_URL)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-md-black transition-colors hover:bg-secondary"
                                        aria-label="Share on X / Twitter"
                                    >
                                        <Send className="h-4 w-4" />
                                    </a>
                                    <a
                                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(CAMPAIGN_URL)}&quote=${encodeURIComponent(post.text)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-md-black transition-colors hover:bg-secondary"
                                        aria-label="Share on Facebook"
                                    >
                                        <MessageCircle className="h-4 w-4" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                            Downloadable graphics
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {graphics.map((graphic) => (
                                <div
                                    key={graphic.title}
                                    className="flex flex-col overflow-hidden rounded-xl border border-border bg-card"
                                >
                                    <div className={`relative ${graphic.ratio} overflow-hidden bg-muted`}>
                                        <Image
                                            src={graphic.src || '/placeholder.svg'}
                                            alt={`${graphic.title} shareable graphic in Maryland flag colors`}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 1024px) 50vw, 25vw"
                                        />
                                    </div>
                                    <div className="flex flex-1 flex-col p-4">
                                        <p className="flex-1 text-sm font-medium text-md-black">{graphic.title}</p>
                                        <a
                                            href={graphic.src}
                                            download={graphic.file}
                                            className="mt-3 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-md-black text-xs font-semibold uppercase tracking-wide text-md-cream transition-colors hover:bg-primary"
                                        >
                                            <Download className="h-4 w-4" />
                                            Download
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
