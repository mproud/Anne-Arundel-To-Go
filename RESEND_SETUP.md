# Resend form delivery

The petition and contact forms send email from server-side route handlers through the Resend HTTPS API. The routes read Cloudflare Worker bindings at runtime, so the Resend API key is never exposed to browser JavaScript.

Configure these values for the deployed Worker:

```text
RESEND_API_KEY=re_xxxxxxxxx
RESEND_FROM_EMAIL=Anne Arundel To Go <forms@annearundeltogo.com>
PETITION_RECIPIENT_EMAIL=hello@annearundeltogo.com
CONTACT_RECIPIENT_EMAIL=hello@annearundeltogo.com
```

`RESEND_API_KEY` and `RESEND_FROM_EMAIL` are required. The two recipient variables are optional and default to `hello@annearundeltogo.com`.

Store `RESEND_API_KEY` as a Cloudflare secret, not as plaintext in `wrangler.jsonc`. The other values can be Worker variables or secrets. For local development, use an ignored `.dev.vars` or `.env` file.

The domain used in `RESEND_FROM_EMAIL` must be verified in Resend before production delivery will succeed.

The counts shown in `lib/supporter-counts.ts` are **manual display figures**, not live Resend counts. The D1 submission database and retryable outbox described in `FORM_HARDENING_SETUP.md` provide a durable record of submissions but do not automatically update these display figures or deduplicate people across different submission IDs.

Configure a Cloudflare WAF/rate-limit rule for the two form endpoints before public launch. The email endpoints should not be left without abuse protections.
