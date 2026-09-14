export function FlagStripe({ className = '' }: { className?: string }) {
    return (
        <div className={`flex w-full ${className}`} aria-hidden>
            <span className="h-full flex-1 bg-primary" />
            <span className="h-full flex-1 bg-white" />
            <span className="h-full flex-1 bg-secondary" />
            <span className="h-full flex-1 bg-md-black" />
        </div>
    )
}
