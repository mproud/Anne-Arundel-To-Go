import assert from 'node:assert/strict'
import test from 'node:test'
import { shouldActivateNewOptIn } from '../lib/consent-decision.ts'

const noUpdates = {
    checkedUpdates: false,
    currentlyUnsubscribed: true,
    createdHereWithoutUpdates: true,
    previouslyOptedIn: false,
}

test('no updates -> explicit opt-in activates a contact initially opted out by this site', () => {
    assert.equal(shouldActivateNewOptIn(noUpdates), false)
    assert.equal(shouldActivateNewOptIn({ ...noUpdates, checkedUpdates: true }), true)
})
test('an unchecked box on a later signature is not a request to unsubscribe', () => {
    assert.equal(shouldActivateNewOptIn({ ...noUpdates, currentlyUnsubscribed: false }), false)
})
test('a genuine later unsubscribe after an earlier opt-in is not overridden', () => {
    assert.equal(shouldActivateNewOptIn({
        ...noUpdates, checkedUpdates: true, previouslyOptedIn: true,
    }), false)
})
test('a contact originally imported/created elsewhere is not resubscribed', () => {
    assert.equal(shouldActivateNewOptIn({
        ...noUpdates, checkedUpdates: true, createdHereWithoutUpdates: false,
    }), false)
})
test('already subscribed contacts are never modified by the activation rule', () => {
    assert.equal(shouldActivateNewOptIn({
        ...noUpdates, checkedUpdates: true, currentlyUnsubscribed: false,
    }), false)
})
