import { SITE_URL } from '@/lib/site'

/** Source/medium/content identify the distribution method, not the original visitor. */
export function sharingUrl(source: string, medium: string, content: string): string {
    const url = new URL(SITE_URL)
    url.searchParams.set('utm_source', source)
    url.searchParams.set('utm_medium', medium)
    url.searchParams.set('utm_campaign', 'site_share')
    url.searchParams.set('utm_content', content)
    return url.toString()
}
