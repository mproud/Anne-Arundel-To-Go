import Image from 'next/image'
import { Download } from 'lucide-react'

const posters = [
    {
        title: 'Sign the Petition',
        description: 'Classic call-to-action poster for windows and community boards.',
        src: '/posters/poster-sign.png',
        file: 'anne-arundel-to-go-poster-sign-the-petition.png',
    },
    {
        title: 'Support Local',
        description: 'Rally support for neighborhood restaurants and small businesses.',
        src: '/posters/poster-support-local.png',
        file: 'anne-arundel-to-go-poster-support-local.png',
    },
    {
        title: 'Cheers to Choice',
        description: 'A friendly, celebratory print for bars and tasting rooms.',
        src: '/posters/poster-cheers.png',
        file: 'anne-arundel-to-go-poster-cheers-to-choice.png',
    },
]

export function PostersSection() {
    return (
        <section id="posters" className="border-t border-border bg-background py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="max-w-2xl">
                    <span className="text-sm font-semibold uppercase tracking-widest text-primary">
                        Campaign toolkit
                    </span>
                    <h2 className="mt-3 text-balance font-display text-4xl font-bold uppercase tracking-tight text-md-black sm:text-5xl">
                        Download &amp; display a poster
                    </h2>
                    <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                        Print these and post them in your restaurant window or community board to help more 
                        neighbors show their support!
                    </p>
                </div>

                <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {posters.map((poster) => (
                        <div
                            key={poster.title}
                            className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card"
                        >
                            <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                                <Image
                                    src={poster.src || '/placeholder.svg'}
                                    alt={`${poster.title} campaign poster in Maryland flag colors`}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                />
                            </div>
                            <div className="flex flex-1 flex-col p-5">
                                <h3 className="font-display text-lg font-semibold uppercase tracking-wide text-md-black">
                                    {poster.title}
                                </h3>
                                <p className="mt-1 flex-1 text-sm text-muted-foreground">{poster.description}</p>
                                <a
                                    href={poster.src}
                                    download={poster.file}
                                    className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-md-black font-display text-sm font-semibold uppercase tracking-wide text-md-cream transition-colors hover:bg-primary"
                                >
                                    <Download className="h-4 w-4" />
                                    Download Poster
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
