'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, PenLine, UserRound, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

type SupporterType = 'individual' | 'business'

type PetitionFormState = {
    supporterType: SupporterType
    firstName: string
    lastName: string
    email: string
    zip: string
    organization: string
    authorized: boolean
    publicSupporter: boolean
    updates: boolean
}

const initialFormState: PetitionFormState = {
    supporterType: 'individual',
    firstName: '',
    lastName: '',
    email: '',
    zip: '',
    organization: '',
    authorized: false,
    publicSupporter: false,
    updates: false,
}

export function PetitionSection() {
    const router = useRouter()
    const [form, setForm] = useState(initialFormState)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        if (params.get('supporter') === 'business') {
            setForm((current) => ({ ...current, supporterType: 'business' }))
        }
    }, [])

    const setSupporterType = (supporterType: SupporterType) => {
        setError(null)
        setForm((current) => ({
            ...current,
            supporterType,
            organization: supporterType === 'individual' ? '' : current.organization,
            authorized: supporterType === 'individual' ? false : current.authorized,
            publicSupporter: supporterType === 'individual' ? false : current.publicSupporter,
        }))
    }

    const submit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (isSubmitting) return

        setError(null)
        setIsSubmitting(true)

        try {
            const response = await fetch('/api/petition', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })

            const result = (await response.json().catch(() => null)) as { error?: string } | null

            if (!response.ok) {
                throw new Error(result?.error || 'We could not record your support. Please try again.')
            }

            router.push(`/thank-you?type=${form.supporterType}`)
        } catch (submissionError) {
            setError(
                submissionError instanceof Error
                    ? submissionError.message
                    : 'We could not record your support. Please try again.',
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <section id="petition" aria-labelledby="petition-heading" className="relative bg-md-black py-20 text-md-cream">
            <div className="mx-auto grid max-w-6xl items-start gap-12 px-4 sm:px-6 lg:grid-cols-2">
                <div className="lg:sticky lg:top-32">
                    <span className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary-foreground">
                        <PenLine className="h-3.5 w-3.5" aria-hidden="true" />
                        Add your support
                    </span>
                    <h2 id="petition-heading" className="mt-5 text-balance font-display text-4xl font-bold uppercase leading-tight tracking-tight sm:text-5xl">
                        Support Cocktails To-Go
                    </h2>
                    <p className="mt-4 max-w-md text-pretty text-lg leading-relaxed text-md-cream/80">
                        Add your name—or your business or organization—to show support for giving local restaurants the option to sell cocktails to go.
                    </p>
                </div>

                <div className="rounded-2xl bg-card p-6 text-card-foreground shadow-xl ring-1 ring-md-cream/10 sm:p-8">
                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-md-black">
                                I support to-go cocktails
                            </h3>
                        </div>

                        <fieldset>
                            <legend className="mb-2 text-sm font-medium text-md-black">I am signing as</legend>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <SupporterTypeOption
                                    value="individual"
                                    label="An individual"
                                    description="Add my personal signature"
                                    icon={UserRound}
                                    selected={form.supporterType === 'individual'}
                                    onSelect={() => setSupporterType('individual')}
                                />
                                <SupporterTypeOption
                                    value="business"
                                    label="A business or organization"
                                    description="Sign on behalf of a business"
                                    icon={Building2}
                                    selected={form.supporterType === 'business'}
                                    onSelect={() => setSupporterType('business')}
                                />
                            </div>
                        </fieldset>

                        {form.supporterType === 'business' && (
                            <Field
                                label="Business or organization name"
                                name="organization"
                                autoComplete="organization"
                                value={form.organization}
                                onChange={(event) => setForm((current) => ({ ...current, organization: event.target.value }))}
                                required
                            />
                        )}

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field
                                label="First name"
                                name="firstName"
                                autoComplete="given-name"
                                value={form.firstName}
                                onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))}
                                required
                            />
                            <Field
                                label="Last name"
                                name="lastName"
                                autoComplete="family-name"
                                value={form.lastName}
                                onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))}
                                required
                            />
                        </div>
                        <Field
                            label="Email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            inputMode="email"
                            placeholder="you@email.com"
                            value={form.email}
                            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                            required
                        />
                        <Field
                            label="ZIP code"
                            name="zip"
                            inputMode="numeric"
                            pattern="[0-9]{5}(-[0-9]{4})?"
                            placeholder="21401"
                            autoComplete="postal-code"
                            value={form.zip}
                            onChange={(event) => setForm((current) => ({ ...current, zip: event.target.value }))}
                            required
                        />

                        {form.supporterType === 'business' && (
                            <div className="space-y-3 rounded-lg border border-border bg-muted/50 p-4">
                                <Checkbox
                                    name="authorized"
                                    checked={form.authorized}
                                    onChange={(checked) => setForm((current) => ({ ...current, authorized: checked }))}
                                    required
                                >
                                    I am authorized to add this business or organization&apos;s support.
                                </Checkbox>
                                <Checkbox
                                    name="publicSupporter"
                                    checked={form.publicSupporter}
                                    onChange={(checked) => setForm((current) => ({ ...current, publicSupporter: checked }))}
                                >
                                    You may publicly list this business or organization as a supporter.
                                </Checkbox>
                            </div>
                        )}

                        <Checkbox
                            name="updates"
                            checked={form.updates}
                            onChange={(checked) => setForm((current) => ({ ...current, updates: checked }))}
                        >
                            Send me occasional updates about the coalition and relevant hearings or votes.
                        </Checkbox>

                        {error && (
                            <div role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            size="lg"
                            disabled={isSubmitting}
                            className="h-12 w-full font-display text-base font-semibold uppercase tracking-wide"
                        >
                            {isSubmitting
                                ? 'Submitting…'
                                : form.supporterType === 'business'
                                  ? 'Add my business'
                                  : 'Add my signature'}
                        </Button>
                        <p className="text-center text-xs leading-relaxed text-muted-foreground">
                            This petition is only open to Marylanders 21+. Don't sign if you're underage.
                        </p>
                    </form>
                </div>
            </div>
        </section>
    )
}

function SupporterTypeOption({
    value,
    label,
    description,
    icon: Icon,
    selected,
    onSelect,
}: {
    value: SupporterType
    label: string
    description: string
    icon: LucideIcon
    selected: boolean
    onSelect: () => void
}) {
    return (
        <label
            className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary ${
                selected ? 'border-primary bg-primary/5 ring-2 ring-primary/15' : 'border-input bg-background hover:border-primary/50'
            }`}
        >
            <input
                type="radio"
                name="supporterType"
                value={value}
                checked={selected}
                onChange={onSelect}
                className="sr-only"
            />
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <span>
                <span className="block text-sm font-semibold text-md-black">{label}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{description}</span>
            </span>
        </label>
    )
}

function Checkbox({
    name,
    checked,
    onChange,
    children,
    required = false,
}: {
    name: string
    checked: boolean
    onChange: (checked: boolean) => void
    children: React.ReactNode
    required?: boolean
}) {
    return (
        <label className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
            <input
                type="checkbox"
                name={name}
                checked={checked}
                onChange={(event) => onChange(event.target.checked)}
                required={required}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--md-red)]"
            />
            <span>{children}</span>
        </label>
    )
}

function Field({
    label,
    name,
    type = 'text',
    ...props
}: {
    label: string
    name: string
    type?: string
} & React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-md-black">{label}</span>
            <input
                name={name}
                type={type}
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
                {...props}
            />
        </label>
    )
}
