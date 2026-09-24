/** Campaign tags are untrusted metadata. Never put form fields or personal data in UTMs. */
export const UTM_KEYS = [
    'utm_source', 'utm_medium', 'utm_campaign',
    'utm_content', 'utm_id', 'utm_term',
] as const

export type UtmKey = (typeof UTM_KEYS)[number]
export type UtmTouch = Partial<Record<UtmKey, string>>
export type Attribution = { first: UtmTouch | null; latest: UtmTouch | null }

const STORAGE_KEY = 'aa_to_go_attribution_v1'
const MAX_VALUE_LENGTH = 120
let memory: Attribution = { first: null, latest: null }

function clean(value: unknown): string {
    if (typeof value !== 'string') return ''
    return value.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, MAX_VALUE_LENGTH)
}

function parseTouch(value: unknown): UtmTouch | null {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null
    const input = value as Record<string, unknown>
    const touch: UtmTouch = {}
    for (const key of UTM_KEYS) {
        const item = clean(input[key])
        if (item) touch[key] = item
    }
    return Object.keys(touch).length ? touch : null
}

/** Also used server-side: never trust a client-supplied attribution payload. */
export function sanitizeAttribution(value: unknown): Attribution {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return { first: null, latest: null }
    }
    const input = value as Record<string, unknown>
    return { first: parseTouch(input.first), latest: parseTouch(input.latest) }
}

export function readUrlUtm(search: string): UtmTouch | null {
    const params = new URLSearchParams(search)
    const touch: UtmTouch = {}
    for (const key of UTM_KEYS) {
        const item = clean(params.get(key))
        if (item) touch[key] = item
    }
    return Object.keys(touch).length ? touch : null
}

/** A browser tab's first tagged link and most recent tagged link. */
export function captureAttribution(): Attribution {
    if (typeof window === 'undefined') return { first: null, latest: null }

    let stored = memory
    try {
        const raw = window.sessionStorage.getItem(STORAGE_KEY)
        if (raw) stored = sanitizeAttribution(JSON.parse(raw))
    } catch {
        // Private browsing / disabled storage: keep a best-effort in-memory copy.
    }

    const current = readUrlUtm(window.location.search)
    if (!current) {
        memory = stored
        return stored
    }

    const next: Attribution = { first: stored.first ?? current, latest: current }
    memory = next
    try {
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
        // Attribution never blocks the form.
    }
    return next
}

/** Call at submit time as well, so a directly opened tagged petition URL is captured. */
export function getAttribution(): Attribution {
    return captureAttribution()
}

export function attributionRows(value: unknown): Array<[string, string]> {
    const attribution = sanitizeAttribution(value)
    const rows: Array<[string, string]> = []
    for (const [label, touch] of [['First tagged link', attribution.first], ['Latest tagged link', attribution.latest]] as const) {
        for (const key of UTM_KEYS) {
            const item = touch?.[key]
            if (item) rows.push([`${label} – ${key}`, item])
        }
    }
    return rows.length ? rows : [['Attribution', 'No tagged link recorded']]
}
