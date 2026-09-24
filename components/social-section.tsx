'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import {
    Check,
    ChevronDown,
    Copy,
    Download,
    Share2,
} from 'lucide-react'

import { sharingUrl } from '@/lib/tracking-links'
import { trackEvent } from './google-analytics'

/* -------------------------------------------------------
   Social graphics
------------------------------------------------------- */

const graphics = [
    {
        id: 'post',
        title: 'Share a Post',
        subtitle: 'Instagram & Facebook',
        ratio: 'aspect-square',
        src: '/social/social-square.png',
        file: 'anne-arundel-to-go-social-square.png',
    },
    {
        id: 'story',
        title: 'Share a Story',
        subtitle: 'Instagram & Facebook Stories',
        ratio: 'aspect-[9/16]',
        src: '/social/social-story.png',
        file: 'anne-arundel-to-go-social-story.png',
    },
]

type Graphic = (typeof graphics)[number]

/* -------------------------------------------------------
   Suggested captions
------------------------------------------------------- */

const captions = [
    {
        id: 'proposal',
        text: 'What would allowing sealed cocktails to go mean for Anne Arundel County and Annapolis? Learn more about the proposal.',
    },
    {
        id: 'question',
        text: 'Should local restaurants be able to offer sealed cocktails for takeout? Here’s what’s being proposed in Anne Arundel County and Annapolis.',
    },
]

/* -------------------------------------------------------
   Social icons
------------------------------------------------------- */

function FacebookIcon({
    className = 'h-5 w-5',
}: {
    className?: string
}) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
            aria-hidden="true"
        >
            <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
        </svg>
    )
}

function InstagramIcon({
    className = 'h-5 w-5',
}: {
    className?: string
}) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle
                cx="17.5"
                cy="6.5"
                r="1"
                fill="currentColor"
                stroke="none"
            />
        </svg>
    )
}

/* -------------------------------------------------------
   Component
------------------------------------------------------- */

export function SocialSection() {
    const [copiedId, setCopiedId] = useState<string | null>(null)

    const [notice, setNotice] = useState<string | null>(null)

    const [graphicFiles, setGraphicFiles] = useState<
        Record<string, File>
    >({})

    const [sharing, setSharing] = useState(false)

    const [showCaptions, setShowCaptions] = useState(false)

    /* -------------------------------------------------------
       Preload images for native sharing
    ------------------------------------------------------- */

    useEffect(() => {
        let active = true

        async function loadGraphics() {
            for (const graphic of graphics) {
                try {
                    const response = await fetch(graphic.src)

                    if (!response.ok) continue

                    const blob = await response.blob()

                    const file = new File(
                        [blob],
                        graphic.file,
                        {
                            type: blob.type || 'image/png',
                        }
                    )

                    if (active) {
                        setGraphicFiles((previous) => ({
                            ...previous,
                            [graphic.id]: file,
                        }))
                    }
                } catch (error) {
                    console.error(
                        'Unable to load social graphic:',
                        error
                    )
                }
            }
        }

        void loadGraphics()

        return () => {
            active = false
        }
    }, [])

    /* -------------------------------------------------------
       Copy text
    ------------------------------------------------------- */

    const copyText = async (id: string, text: string) => {
        try {
            await navigator.clipboard.writeText(text)

            setCopiedId(id)
            setNotice(null)

            window.setTimeout(() => {
                setCopiedId((current) =>
                    current === id ? null : current
                )
            }, 2000)
        } catch {
            setNotice('Unable to copy. Please copy the text manually.')
        }
    }

    /* -------------------------------------------------------
       Download graphic
    ------------------------------------------------------- */

    const downloadGraphic = (graphic: Graphic) => {
        const link = document.createElement('a')

        link.href = graphic.src
        link.download = graphic.file

        document.body.appendChild(link)

        link.click()

        link.remove()
    }

    /* -------------------------------------------------------
       Share graphic

       Uses native sharing on supported devices.
       Falls back to downloading the image.
    ------------------------------------------------------- */

    const shareGraphic = async (graphic: Graphic) => {
        if (sharing) return

        const file = graphicFiles[graphic.id]

        const canShare =
            file &&
            typeof navigator.share === 'function' &&
            typeof navigator.canShare === 'function' &&
            navigator.canShare({
                files: [file],
            })

        if (!canShare) {
            downloadGraphic(graphic)

            setNotice(
                'Image downloaded. Open Instagram or Facebook to upload it.'
            )

            return
        }

        setSharing(true)
        setNotice(null)

        try {
            await navigator.share({
                files: [file],
                title: 'Anne Arundel To Go',
            })
        } catch (error) {
            if (
                error instanceof DOMException &&
                error.name === 'AbortError'
            ) {
                return
            }

            setNotice(
                'Sharing is unavailable. Use the download button to save the image.'
            )
        } finally {
            setSharing(false)
        }
    }

    /* -------------------------------------------------------
       Share website using native sharing
    ------------------------------------------------------- */

    const shareWebsite = async () => {
        if (!navigator.share) {
            await copyText('link', sharingUrl('shared_link', 'referral', 'copy_link'))

            setNotice('Link copied. You can paste it into any app.')

            return
        }

        try {
            await navigator.share({
                title: 'Anne Arundel To Go',
                url: sharingUrl('shared_link', 'referral', 'native_share'),
            })
            trackEvent('social_share', { platform: 'native' })
        } catch (error) {
            if (
                error instanceof DOMException &&
                error.name === 'AbortError'
            ) {
                return
            }

            setNotice(
                'Unable to open the sharing menu. Try copying the link.'
            )
        }
    }

    const facebookUrl =
        'https://www.facebook.com/sharer/sharer.php?u=' +
        encodeURIComponent(sharingUrl('facebook', 'social', 'facebook_button'))

    /* -------------------------------------------------------
       Render
    ------------------------------------------------------- */

    return (
        <section
            id="social"
            className="border-t border-border bg-muted py-20"
        >
            <div className="mx-auto max-w-6xl px-4 sm:px-6">

                {/* -------------------------------------------
                    Heading
                ------------------------------------------- */}

                <div className="mx-auto max-w-2xl text-center">

                    <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary">
                        <Share2 className="h-4 w-4" />
                        Spread the Word
                    </span>

                    <h2 className="mt-3 font-display text-4xl font-bold uppercase tracking-tight text-md-black sm:text-5xl">
                        Share Anne Arundel To Go
                    </h2>

                    <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                        Share the website or use one of our graphics
                        on your social media, and encourage your friends &amp; neighbors to sign!
                    </p>

                </div>

                {/* -------------------------------------------
                    Main social sharing buttons
                ------------------------------------------- */}

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">

                    {/* Facebook */}

                    <a
                        href={facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                            trackEvent('social_share', {
                                platform: 'facebook',
                            })
                        }}
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#1877F2] px-6 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:opacity-90"
                    >
                        <FacebookIcon />

                        Facebook
                    </a>

                    {/* Native sharing */}

                    <button
                        type="button"
                        onClick={shareWebsite}
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-md-black px-6 text-sm font-semibold text-md-cream transition-all hover:-translate-y-0.5 hover:bg-primary"
                    >
                        <Share2 className="h-4 w-4" />

                        Share Link
                    </button>

                    {/* Copy URL */}

                    <button
                        type="button"
                        onClick={() => copyText('link', sharingUrl('shared_link', 'referral', 'copy_link'))}
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-background px-6 text-sm font-semibold text-md-black transition-colors hover:bg-secondary"
                    >
                        {copiedId === 'link' ? (
                            <>
                                <Check className="h-4 w-4" />
                                Copied
                            </>
                        ) : (
                            <>
                                <Copy className="h-4 w-4" />
                                Copy Link
                            </>
                        )}
                    </button>

                </div>

                {/* -------------------------------------------
                    Graphic cards
                ------------------------------------------- */}

                <div className="mx-auto mt-14 max-w-4xl">
                    <div className="mb-6 text-center">
                        <h3 className="font-display text-xl font-bold uppercase text-md-black">
                            Grab a Graphic
                        </h3>
                    </div>

                    <div className="grid items-start gap-5 sm:grid-cols-2">

                        {graphics.map((graphic) => (

                            <div
                                key={graphic.id}
                                className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
                            >

                                {/* Image */}

                                <div className="flex h-72 items-center justify-center overflow-hidden bg-secondary/30 p-5 sm:h-80">

                                    <div
                                        className={`relative ${
                                            graphic.ratio
                                        } ${
                                            graphic.id === 'story'
                                                ? 'h-full w-auto'
                                                : 'h-auto w-full max-w-[280px]'
                                        } overflow-hidden rounded-lg shadow-md`}
                                    >
                                        <Image
                                            src={graphic.src}
                                            alt={graphic.title}
                                            fill
                                            className="object-contain"
                                            sizes="(max-width: 640px) 80vw, 400px"
                                        />
                                    </div>

                                </div>

                                {/* Card footer */}

                                <div className="flex items-center justify-between gap-3 p-4 sm:p-5">

                                    <div className="min-w-0">

                                        <h4 className="font-display text-base font-bold text-md-black">
                                            {graphic.title}
                                        </h4>

                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                            {graphic.subtitle}
                                        </p>

                                    </div>

                                    <div className="flex shrink-0 items-center gap-2">

                                        {/* Download icon */}

                                        <a
                                            href={graphic.src}
                                            download={graphic.file}
                                            title="Download image"
                                            aria-label={`Download ${graphic.title} graphic`}
                                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-md-black transition-colors hover:bg-secondary"
                                        >
                                            <Download className="h-4 w-4" />
                                        </a>

                                        {/* Share image */}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                shareGraphic(graphic)
                                            }
                                            disabled={sharing}
                                            className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-4 text-xs font-bold uppercase tracking-wide text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50 sm:px-5"
                                        >
                                            <InstagramIcon className="h-4 w-4" />

                                            Share
                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                    <p className="mt-4 text-center text-xs text-muted-foreground">
                        On mobile, tap Share and choose Instagram or
                        another available app. On desktop, the image
                        will download so you can upload it manually.
                    </p>

                </div>

            </div>
        </section>
    )
}