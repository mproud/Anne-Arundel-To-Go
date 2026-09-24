# Resend petition Contacts and Segments

Resend now uses global Contacts and Segments (the older single-audience contact API is deprecated). Every valid petition submission creates or updates a contact identified by email, and the existing petition notification email still records the specific submission.

## Resend dashboard setup (once)

1. Create two **Segments** in Resend: **Petition Signers** and **Coalition Updates (Opt-In)**. Copy each segment's UUID. They must be different.
2. Under **Audience → Contact Properties**, create these custom properties with type **string** (no fallback values): `aa_first_name`, `aa_last_name`, `aa_zip`, `aa_supporter_type`, `aa_organization`, `aa_authorized`, `aa_public_listing`, `aa_last_signed_at`, `aa_updates_opt_in_at`. The name and email are also stored using Resend's standard Contact fields for newly created contacts; the custom names retain recent form values for existing contacts.
3. Set the following additional Cloudflare Worker variables, for **each environment** handling real submissions:

   ```text
   RESEND_PETITION_SEGMENT_ID=<Petition Signers UUID>
   RESEND_UPDATES_SEGMENT_ID=<Coalition Updates (Opt-In) UUID>
   ```

4. Ensure `RESEND_API_KEY` is a **Full access** key (a Send-only key cannot manage Contacts). Keep it in Cloudflare secrets. Existing `RESEND_FROM_EMAIL` and `PETITION_RECIPIENT_EMAIL` settings stay as they are.
5. To send coalition updates, target **only** the Coalition Updates (Opt-In) segment, not Petition Signers or All Contacts. Configure Resend's unsubscribe options on those Broadcasts.

## Behavior

- Everyone goes to Petition Signers. Only a checked updates checkbox adds them to Coalition Updates (Opt-In). Neither permission to publish a business name nor an unchecked updates checkbox grants email marketing consent.
- New people who do not opt in are created with `unsubscribed: true`, an additional safeguard if someone accidentally targets all contacts. Resend uses global unsubscribe status, so **all-contact or Petition Signers Broadcasts must never be used as an updates mailing list**.
- Existing contacts are updated without changing their global unsubscribe status. A previous unsubscribe is **not cleared** by re-signing, even when updates is checked; an already-unsubscribed person may be in the opt-in segment but still won't receive Broadcasts. Handle their re-subscription through Resend's preference/consent workflow if needed.
- The contact's ZIP, supporter type and last signed timestamp reflect their **most recent** submission. Business/organization and permission fields are only updated on business submissions. One email may represent several organizations or sign multiple times; Contacts is **not** a per-signature database. The notification email remains the per-submission record; use a separate database for durable event-level history, deduplication and official signature totals.
- A failed contact API call prevents a success response and the submission notification email. If the contact succeeds but the notification email fails, the form returns an error even though the contact was saved; retrying updates the same contact and reattempts notification. For exactly-once event processing, use a database and a reliable queue/outbox.
- A blank updates checkbox on a subsequent signature is not an unsubscribe request; it does not remove someone who had already opted in. Provide explicit unsubscribe/preference controls for that case.

Do not set arbitrary audiences/segments as a replacement for marketing consent. The privacy notice should reflect that petition data, including custom properties, is stored by Resend as well as emailed to the coalition.
