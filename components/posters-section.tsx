import Image from 'next/image'
import { Download } from 'lucide-react'
import { trackEvent } from './google-analytics'

// When the designer supplies a poster PNG, set its ready flag to true.
// The card automatically switches from the shared preview image to the PNG.
const posters = [
    {
        title: 'Sign the Petition',
        description: 'Poster for windows and community boards.',
        src: '/posters/poster-sign.png',
        file: 'anne-arundel-to-go-poster-sign-the-petition.png',
        ready: false,
    },
    {
        title: 'Support Local',
        description: 'Poster for restaurants and neighborhood businesses.',
        src: '/posters/poster-support-local.png',
        file: 'anne-arundel-to-go-poster-support-local.png',
        ready: false,
    },
    {
        title: 'Cheers to Choice',
        description: 'Poster for bars and tasting rooms.',
        src: '/posters/poster-cheers.png',
        file: 'anne-arundel-to-go-poster-cheers-to-choice.png',
        ready: false,
    },
]

export function PostersSection() {
    return (
        <section id="posters" aria-labelledby="posters-heading" className="border-t border-border bg-background py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="max-w-2xl">
                    <span className="text-sm font-semibold uppercase tracking-widest text-primary">
                        Campaign toolkit
                    </span>
                    <h2 id="posters-heading" className="mt-3 text-balance font-display text-4xl font-bold uppercase tracking-tight text-md-black sm:text-5xl">
                        Posters &amp; print materials
                    </h2>
                    <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                        Choose a poster for your window, counter, or community board.
                    </p>
                </div>

                <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {posters.map((poster) => (
                        <article key={poster.title} className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card">
                            <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                                <Image
                                    src={poster.ready ? poster.src : '/posters/poster-placeholder.svg'}
                                    alt={poster.ready ? `${poster.title} printable poster` : 'Anne Arundel To Go poster preview'}
                                    fill
                                    className="object-cover transition-transform duration-300 motion-safe:group-hover:scale-105"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                />
                            </div>
                            <div className="flex flex-1 flex-col p-5">
                                <h3 className="font-display text-lg font-semibold uppercase tracking-wide text-md-black">
                                    {poster.title}
                                </h3>
                                <p className="mt-1 flex-1 text-sm text-muted-foreground">{poster.description}</p>
                                {poster.ready ? (
                                    <a
                                        href={poster.src}
                                        download={poster.file}
                                        onClick={() => {
                                            trackEvent('poster_download', {
                                                poster: poster.file,
                                            })
                                        }}
                                        className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-md-black font-display text-sm font-semibold uppercase tracking-wide text-md-cream transition-colors hover:bg-primary"
                                    >
                                        <Download className="h-4 w-4" aria-hidden="true" />
                                        Download poster
                                    </a>
                                ) : (
                                    <button
                                        type="button"
                                        disabled
                                        aria-label={`Download ${poster.title} poster (currently unavailable)`}
                                        className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-md-black px-4 font-display text-sm font-semibold uppercase tracking-wide text-md-cream opacity-50"
                                    >
                                        <Download className="h-4 w-4" aria-hidden="true" />
                                        Download poster
                                    </button>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}
