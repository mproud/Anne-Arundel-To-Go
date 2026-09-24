/**
 * Only a *new, explicit* checkbox opt-in may reverse the original automatic
 * unsubscribed state of a contact created by this site's no-opt-in flow.
 * A known earlier opt-in followed by an unsubscribe must remain unsubscribed.
 * WARNING: Resend's single global unsubscribed boolean cannot distinguish an
 * explicit opt-out by a person who had NEVER opted in from our initial default.
 * If that must be enforced, add verified Resend unsubscribe webhook history.
 */
export function shouldActivateNewOptIn(input: {
    checkedUpdates: boolean
    currentlyUnsubscribed: boolean
    createdHereWithoutUpdates: boolean
    previouslyOptedIn: boolean
}): boolean {
    return input.checkedUpdates && input.currentlyUnsubscribed &&
        input.createdHereWithoutUpdates && !input.previouslyOptedIn
}
