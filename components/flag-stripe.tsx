export function FlagStripe({ className = '' }: { className?: string }) {
    return (
        <div className={`flex w-full ${className}`} aria-hidden>
            <span className="h-full flex-[5] bg-secondary" />
            <span className="h-full flex-[3] bg-primary" />
            <span className="h-full flex-[2] bg-md-black" />
        </div>
    )
}
