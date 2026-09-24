# Attribution tracking

This patch extends the earlier Resend Contacts and Segments patch. Apply that patch first.

## UTM URLs

Use consistent lowercase names and distinct `utm_content` values for printed materials and distribution points. For example:

```text
https://annearundeltogo.com/?utm_source=qr&utm_medium=print&utm_campaign=site_launch&utm_content=poster_a
https://annearundeltogo.com/?utm_source=qr&utm_medium=print&utm_campaign=site_launch&utm_content=poster_b
```

Generate each QR code from the complete tagged URL (including query parameters). Existing poster artwork/QR images are **not** modified by this code patch. Redirect services must preserve query parameters. Do not embed names, emails, ZIP codes, or any other personal information in UTM values.

The share controls now use separate tagged links: `facebook/social/site_share/facebook_button`, `shared_link/referral/site_share/native_share`, and `shared_link/referral/site_share/copy_link`. The native share API cannot tell the site which app was selected.

## Submission attribution

The first and most recent tagged links are retained in browser **sessionStorage** for that browser tab. An untagged internal URL does not overwrite a tagged link. The form captures attribution at submission as well as at initial page load. A different tab or a closed tab has no guaranteed continuity; an untagged visitor may have no recorded UTM. These values are visitor-supplied and cannot independently prove the origin of a submission.

Petition **and contact** notification emails contain available UTM fields from both captured links. Resend Contact custom properties contain the most recently recorded **petition visit** values and are updated on a repeat signature; notification emails retain each submission's separate history.

In Resend **Contact Properties**, create these 12 string properties, in addition to those in `RESEND_CONTACTS_SETUP.md`:

```text
aa_first_utm_source
aa_first_utm_medium
aa_first_utm_campaign
aa_first_utm_content
aa_first_utm_id
aa_first_utm_term
aa_last_utm_source
aa_last_utm_medium
aa_last_utm_campaign
aa_last_utm_content
aa_last_utm_id
aa_last_utm_term
```

Also create a string property `aa_created_no_updates`. It marks only contacts created by the updated petition flow with no updates opt-in, and prevents resubscribing an externally created contact who was previously unsubscribed.

They hold the first and latest tagged links **within the most recent submitted visit**, not the first lifetime acquisition of the email address. On an untagged repeat submission, they are reset to empty strings to avoid falsely attributing that submission to an older campaign. For immutable per-signature reporting and exact deduplication, use a database in addition to Resend Contacts.

## Google Analytics 4

GA4 already reads UTMs from tagged landing-page URLs; the existing `petition_submission` and `contact_submission` events remain free of personal information. Mark `petition_submission` as a **key event** in GA4 and inspect traffic acquisition / explorations using source, medium, campaign and manual ad content. GA4 may count fewer submissions than Resend notifications (e.g. ad blocking and client-side failures). This patch does not transmit PII or raw form data to GA4 and does not add new analytics cookies. Respect applicable analytics consent requirements.

## Repeated opt-in

The earlier Resend patch created a new no-opt-in signer with `unsubscribed: true` (Resend's global Broadcast flag). If that same signer later checks the updates checkbox, this patch recognizes a contact marked `aa_created_no_updates=yes` by the updated petition flow which has no prior opt-in timestamp, adds the opt-in segment and sets `unsubscribed: false`. It **does not** globally resubscribe an external contact, someone who previously opted in and later unsubscribed, or older no-opt-in signers created before the origin marker existed; use a separately verified resubscription workflow for those cases. A later unchecked checkbox is not treated as an unsubscribe request. Keep Broadcasts restricted to the opt-in segment and maintain an explicit unsubscribe/preference-change mechanism.
