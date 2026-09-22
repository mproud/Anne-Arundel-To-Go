'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle2, PenLine } from 'lucide-react'

export function PetitionSection() {
    const router = useRouter()
    const [supporterType, setSupporterType] = useState<'individual' | 'business'>('individual')

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        if (params.get('supporter') === 'business') {
            setSupporterType('business')
        }
    }, [])

    return (
        <section id="petition" className="relative bg-md-black py-20 text-md-cream">
            <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
                <div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary-foreground">
                        <PenLine className="h-3.5 w-3.5" />
                        Add your name
                    </span>
                    <h2 className="mt-5 text-balance font-display text-4xl font-bold uppercase leading-tight tracking-tight sm:text-5xl">
                        Support Cocktails To-Go
                    </h2>
                    <p className="mt-4 max-w-md text-pretty text-lg leading-relaxed text-md-cream/80">
                        Add your name to show state lawmakers that Anne Arundel County and Annapolis support giving 
                        local restaurants the option to sell cocktails to go.
                    </p>

                    {/* <ul className="mt-8 space-y-3 text-sm text-md-cream/85">
                        {[
                            'Your signature is delivered to local decision-makers',
                            'Opt in to campaign updates and hearing alerts',
                            'We never sell or share your information',
                        ].map((item) => (
                            <li key={item} className="flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 shrink-0 text-secondary" />
                                {item}
                            </li>
                        ))}
                    </ul> */}
                </div>

                <div className="rounded-2xl bg-card p-6 text-card-foreground shadow-xl ring-1 ring-md-cream/10 sm:p-8">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            router.push(`/thank-you?type=${supporterType}`)
                        }}
                        className="space-y-4"
                    >
                        <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-md-black">
                            I support to-go cocktails
                        </h3>
                        <fieldset>
                            <legend className="mb-2 text-sm font-medium text-md-black">
                                I am signing as
                            </legend>
                            <div className="grid grid-cols-2 gap-3">
                                {([
                                    { value: 'individual', label: 'An individual' },
                                    { value: 'business', label: 'A business or organization' },
                                ] as const).map((option) => (
                                    <label
                                        key={option.value}
                                        className={`flex min-h-12 cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                                            supporterType === option.value
                                                ? 'border-primary bg-primary/10 text-md-black'
                                                : 'border-input bg-background text-muted-foreground hover:border-primary/60'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="supporterType"
                                            value={option.value}
                                            checked={supporterType === option.value}
                                            onChange={() => setSupporterType(option.value)}
                                            className="h-4 w-4 shrink-0 accent-[var(--md-red)]"
                                        />
                                        {option.label}
                                    </label>
                                ))}
                            </div>
                        </fieldset>
                        {supporterType === 'business' && (
                            <Field
                                label="Business or organization name"
                                name="organization"
                                autoComplete="organization"
                                maxLength={150}
                                required
                            />
                        )}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="First name" name="firstName" autoComplete="given-name" required />
                            <Field label="Last name" name="lastName" autoComplete="family-name" required />
                        </div>
                        <Field
                            label="Email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            placeholder="you@email.com"
                            required
                        />
                        <Field
                            label="ZIP code"
                            name="zip"
                            inputMode="numeric"
                            placeholder="21401"
                            autoComplete="postal-code"
                            required
                        />
                        {supporterType === 'business' && (
                            <label className="flex items-start gap-3 text-sm text-muted-foreground">
                                <input
                                    type="checkbox"
                                    name="authorized"
                                    required
                                    className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--md-red)]"
                                />
                                I am authorized to sign on behalf of this business or organization.
                            </label>
                        )}
                        <label className="flex items-start gap-3 text-sm text-muted-foreground">
                            <input
                                type="checkbox"
                                name="updates"
                                defaultChecked
                                className="mt-0.5 h-4 w-4 accent-[var(--md-red)]"
                            />
                            Send me campaign updates and alerts about upcoming legislative hearings and votes.
                        </label>
                        <Button
                            type="submit"
                            size="lg"
                            className="h-12 w-full font-display text-base font-semibold uppercase tracking-wide"
                        >
                            {supporterType === 'business' ? 'Add organization support' : 'Add my signature'}
                        </Button>
                        <p className="text-center text-xs text-muted-foreground">
                            By signing you confirm you are a Maryland resident aged 21 or older.
                        </p>
                    </form>
                </div>
            </div>
        </section>
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
