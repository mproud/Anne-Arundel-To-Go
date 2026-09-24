# Resend acknowledgement automations

The website emits **two separate named events** only after the respective form's
notification email has been accepted by Resend:

| Event name | Recipient | Event payload |
| --- | --- | --- |
| `petition.submitted` | Petition signer's email | `first_name` (string), `supporter_type` (`individual` or `business`), `updates_opt_in` (boolean) |
| `contact.submitted` | Contact form sender's email | `first_name` (string), `reason` (`question`, `volunteer`, or `other`) |

These events are **not** Resend's delivery webhooks (`email.sent`, etc.). Set up
named Events and Automations with matching triggers in the Resend dashboard.
The site does not create or publish Automations and does not send the
acknowledgement email itself.

1. In Resend, create named events `petition.submitted` and `contact.submitted`.
   If adding event schemas, use the payload keys/types in the table above.
2. Create **two separate Automations**, each triggered by the matching named
   event, with one immediate **Send email** step. Publish both Automations.
3. Configure the sender and Reply-To for both templates as
   `Anne Arundel To Go <hello@annearundeltogo.com>`. Ensure that mailbox can
   receive replies in Google Workspace. Do not configure a personal address.
4. Suggested petition subject: `Thanks for signing the petition`. Include a
   first-name greeting, confirmation that the petition was received, and a
   link to `https://annearundeltogo.com/` for visitors who want to share it.
   Only say someone is subscribed to updates if `updates_opt_in` is true.
   Suggested contact subject: `We received your message`; confirm receipt and
   say that the coalition will be in touch.
5. Send test petition signatures with updates **unchecked and checked**, and
   a test contact message to separate mailboxes. Check Resend Automation Runs
   and the recipient inbox/spam folder for each case.

The events carry **first names and simple form choices only**; contact-message
contents, organization names, ZIP codes and UTM attribution remain in the
existing submission notifications rather than being copied into Automation
Runs. Contact messages never add someone to the coalition-updates segment.

**Unsubscribed contacts:** Resend can automatically create a contact when an
event is sent to an unknown email. To avoid inadvertently enrolling contact
form senders in marketing, the site first creates a missing contact with
`unsubscribed: true`. Petition signers without updates opt-in are also marked
unsubscribed by the existing petition flow. Test whether your Resend Automation
email step delivers acknowledgement emails to globally unsubscribed contacts;
if Resend suppresses them, use the transactional Email API for acknowledgements
instead. Do not clear an unsubscribe merely to send an acknowledgement.

**Failure behavior:** if a notification email fails, the form still reports its
existing error and no event is emitted. If the notification succeeds but the
event fails, the form still reports success; inspect Worker logs for
`acknowledgement event failed` and Resend Automation Runs. The current
application has no persistent outbox or event deduplication, so event delivery
is best effort and submitting the same form twice can send two confirmations.
