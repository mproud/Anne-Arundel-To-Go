'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FlagStripe } from '@/components/flag-stripe'
import { CheckCircle2, Mail } from 'lucide-react'

type ContactReason = 'question' | 'volunteer' | 'other'

const reasonOptions: { value: ContactReason; label: string }[] = [
    { value: 'question', label: 'I have a question' },
    { value: 'volunteer', label: 'I want to help / volunteer' },
    { value: 'other', label: 'Something else' },
]

const messageCopy: Record<
    ContactReason,
    { label: string; placeholder: string; required: boolean }
> = {
    question: {
        label: 'Message',
        placeholder: "What's your question?",
        required: true,
    },
    volunteer: {
        label: 'How would you like to help?',
        placeholder: 'Optional',
        required: false,
    },
    other: {
        label: 'Message',
        placeholder: 'Tell us what you have in mind...',
        required: true,
    },
}

const submitLabels: Record<ContactReason, string> = {
    question: 'Send Question',
    volunteer: "I'd Like to Help",
    other: 'Send Message',
}

export function ContactSection() {
    const [submitted, setSubmitted] = useState(false)
    const [reason, setReason] = useState<ContactReason>('question')

    const currentMessage = messageCopy[reason]

    return (
        <section id="contact" className="border-t border-border bg-background py-20">
            <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2">
                <div>
                    <span className="text-sm font-semibold uppercase tracking-widest text-primary">
                        Get involved
                    </span>
                    <h2 className="mt-3 text-balance font-display text-4xl font-bold uppercase tracking-tight text-md-black sm:text-5xl">
                        Contact the coalition
                    </h2>
                    <p className="mt-4 max-w-md text-pretty text-lg leading-relaxed text-muted-foreground">
                        Have a question or want to help out?
                        Choose an option and send us a note.
                    </p>

                    <div className="mt-8 space-y-4">
                        <div className="flex items-center gap-3 text-foreground/85">
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                                <Mail className="h-5 w-5" />
                            </span>
                            <span className="text-sm">hello@annearundeltogo.com</span>
                        </div>
                    </div>

                    <div className="mt-8 overflow-hidden rounded-xl">
                        <FlagStripe className="h-3" />
                    </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
                    {submitted ? (
                        <div className="flex flex-col items-center gap-4 py-12 text-center">
                            <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                                <CheckCircle2 className="h-8 w-8" />
                            </span>
                            <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-md-black">
                                Message sent!
                            </h3>
                            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                                Thanks for reaching out. A member of the coalition will get back to you soon.
                            </p>
                            <Button variant="outline" onClick={() => setSubmitted(false)}>
                                Send another
                            </Button>
                        </div>
                    ) : (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                setSubmitted(true)
                            }}
                            className="space-y-4"
                        >
                            <label className="block">
                                <span className="mb-1.5 block text-sm font-medium text-md-black">
                                    What are you reaching out about?
                                </span>
                                <select
                                    name="reason"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value as ContactReason)}
                                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
                                >
                                    {reasonOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <Field label="Your name" name="name" autoComplete="name" required />
                            <Field
                                label="Email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                placeholder="you@email.com"
                                required
                            />

                            <label className="block">
                                <span className="mb-1.5 block text-sm font-medium text-md-black">
                                    {currentMessage.label}
                                    {!currentMessage.required && (
                                        <span className="font-normal text-muted-foreground"> (optional)</span>
                                    )}
                                </span>
                                <textarea
                                    name="message"
                                    rows={4}
                                    required={currentMessage.required}
                                    className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
                                    placeholder={currentMessage.placeholder}
                                />
                            </label>

                            <Button
                                type="submit"
                                size="lg"
                                className="h-12 w-full font-display text-base font-semibold uppercase tracking-wide"
                            >
                                {submitLabels[reason]}
                            </Button>
                        </form>
                    )}
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
