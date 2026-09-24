# Form hardening deployment and verification

**Breaking deployment change:** do not deploy this patch until the D1 database,
Turnstile keys, and separate scheduled Worker are configured. A form returns 503
rather than accepting a submission it cannot store, and the forms are disabled
until Turnstile is operational. The existing Resend Automations must remain published.

## 1. Create the database and apply the migration

```sh
npx wrangler d1 create anne-arundel-to-go-forms
# Copy the returned UUID into BOTH wrangler.jsonc and wrangler.outbox.jsonc.
npx wrangler d1 execute anne-arundel-to-go-forms --remote --file=migrations/0001_form_records.sql
```

D1 stores one immutable `form_submissions` row per client-generated UUID and three
`form_jobs` rows (contact sync, coalition notification, acknowledgement event).
Resending the same request UUID and identical payload does not create another
signature or set of jobs. A new submission UUID does create another record even if
someone reuses an email; do not equate raw submission totals with unique signers.
The database contains names, emails, ZIPs, contact messages and UTM values. Protect
D1 access and exports; handle deletion/retention requests consistently across D1,
Resend, and any copies of coalition notification emails. Do not log submission data.

## 2. Turnstile and per-IP limits

Create a Turnstile widget allowing the exact domain(s) that host these forms.
Set the public **TURNSTILE_SITE_KEY** Worker variable in `wrangler.jsonc`, and store
**TURNSTILE_SECRET** as a Cloudflare Worker secret. Set a random 32-byte-or-longer
**FORM_RATE_LIMIT_SECRET** secret used to hash the Cloudflare-supplied client IP.
For example:

```sh
npx wrangler secret put TURNSTILE_SECRET --name anne-arundel-to-go
npx wrangler secret put FORM_RATE_LIMIT_SECRET --name anne-arundel-to-go
```

Every form request validates a unique, unexpired Turnstile token on Cloudflare's
Siteverify API, including its action and hostname. Tokens expire and are single-use:
a failed request resets its widget so the visitor can retry with a fresh token.
The D1 rate limiter allows up to 10 petition / 5 contact submissions per client IP
per rolling hour. Real users behind a shared public IP share that budget; adjust
`lib/form-security.ts` if that is too restrictive. Only a keyed digest of the IP
is retained. Without `CF-Connecting-IP`, the endpoint fails closed (403).

**Also configure Cloudflare WAF/rate-limit rules** for the two `/api/` endpoints;
Turnstile and D1 do not make your API invulnerable to distributed abuse. Test
legitimate visitors on mobile, browsers with script blockers, and shared Wi-Fi.
Turnstile sitekey can be public; never expose TURNSTILE_SECRET or the rate salt.
For local development, bind a separate local D1 database and use Turnstile test
keys plus a mock `CF-Connecting-IP` header. Preview and production currently use
the same Worker routes; preview test submissions will land in the same D1 database
unless a separate staging Worker, DB and Resend account are configured.

## 3. Deploy the site and the outbox Worker

Copy the existing Resend segment IDs from `wrangler.jsonc` into
`wrangler.outbox.jsonc`. Both Workers must point to the same D1 UUID. Set the
Resend API key as a secret **on the outbox Worker as well** (Worker secrets are
not shared between Workers):

```sh
npx wrangler secret put RESEND_API_KEY --name anne-arundel-to-go-form-outbox
npm run cf-typegen
npm run build
npm run deploy
npx wrangler deploy --config wrangler.outbox.jsonc
```

The website first commits the submission and all associated jobs to D1. It then
reports success. The independent outbox Worker drains pending jobs every minute,
processing contact sync -> notification email -> acknowledgement event in order.
If Resend is temporarily unavailable, the job is retried with capped exponential
backoff. A *form success* means D1 accepted the record, **not** that an email reached
an inbox. Review the scheduled Worker logs for `Form outbox job failed`.
Do not deploy just the site without the outbox Worker, or no notification or
acknowledgement emails will be sent.

Resend email notifications use an idempotency key per submission; Resend keeps keys
for 24h. The Events API has no documented cross-attempt idempotency guarantee:
an event accepted immediately before a Worker crash can be emitted a second time.
A genuine exactly-once acknowledgement requires provider support or additional
end-to-end deduplication. Accepted Resend events do not guarantee inbox delivery.

## 4. Check the queue and event delivery

```sh
npx wrangler d1 execute anne-arundel-to-go-forms --remote --command="SELECT kind, COUNT(*) FROM form_submissions GROUP BY kind;"
npx wrangler d1 execute anne-arundel-to-go-forms --remote --command="SELECT job_kind, state, COUNT(*) FROM form_jobs GROUP BY job_kind, state;"
npx wrangler d1 execute anne-arundel-to-go-forms --remote --command="SELECT job_kind, attempts, last_error FROM form_jobs WHERE state != 'done' ORDER BY next_attempt_at LIMIT 20;"
node --experimental-strip-types --test tests/consent.test.ts
```

For a live end-to-end test, use distinct test emails: petition with unchecked
updates, petition with checked updates, a repeat signature going from unchecked to
checked using the same email, a previously opted-in contact who unsubscribed, and a
contact-form sender. Verify D1 row/job counts, both Resend segment memberships,
global unsubscribed status, notification emails, Automation Runs, and *recipient*
inbox/spam delivery. Check the unchecked test **specifically**: a Resend Automation
may suppress its acknowledgement because the contact is globally unsubscribed. If
so, implement a separate transactional acknowledgement (and disable that event's
Automation email) without changing their marketing preference. The source code
cannot prove real inbox delivery or the behavior of your Resend account.

## 5. Consent limitations

`tests/consent.test.ts` covers a site's initial no-opt-in -> later explicit opt-in,
a previously opted-in contact that unsubscribed, unchanged preference on a later
unchecked checkbox, and an external existing contact. The site preserves Resend's
previously recorded opt-in timestamp and never re-enables someone who once opted
in and subsequently unsubscribed. However, Resend's global boolean does not tell
us whether an existing *never-opted-in* contact manually unsubscribed after its
initial no-opt-in creation. The site cannot distinguish those two cases and a
new explicit checkbox may re-enable that contact. To honor that rarer case, keep
a separate verified Resend unsubscribe-webhook history / confirmed-resubscription
flow before enabling contact reactivation from the petition form.
