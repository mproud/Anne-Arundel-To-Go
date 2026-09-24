import { getRuntimeEnv, escapeHtml, sendResendEmail } from './resend'
import { savePetitionContact } from './resend-contacts'
import { prepareContactEventRecipient, sendResendEvent } from './resend-events'
import { submissionRows } from './form-submissions'
import type { StoredSubmission } from './form-submissions'

type JobKind = 'contact' | 'notification' | 'event'
type Job = { job_kind: JobKind; attempts: number }
type SubmissionRow = { id: string; data: string }

async function executeJob(submissionId: string, jobKind: JobKind, submission: StoredSubmission) {
    const data = submission.data
    if (jobKind === 'contact') {
        if (submission.kind === 'petition') {
            await savePetitionContact(data)
        } else {
            // A contact message is not consent to receive marketing updates.
            await prepareContactEventRecipient(data.email)
        }
        return
    }
    if (jobKind === 'notification') {
        const isPetition = submission.kind === 'petition'
        const recipient = getRuntimeEnv(isPetition ? 'PETITION_RECIPIENT_EMAIL' : 'CONTACT_RECIPIENT_EMAIL') ||
            'hello@annearundeltogo.com'
        const subject = isPetition
            ? (submission.data.supporterType === 'business'
                ? `New organization supporter: ${submission.data.organization}`
                : `New petition signature: ${submission.data.firstName} ${submission.data.lastName}`)
            : `Website contact: ${submission.data.reason} from ${submission.data.name}`
        const rows = submissionRows(submission)
        await sendResendEmail({
            to: recipient,
            subject,
            text: rows.map(([label, value]) => `${label}: ${value}`).join('\n'),
            html: `<h2>New Anne Arundel To Go ${isPetition ? 'petition submission' : 'contact message'}</h2><table cellpadding="6" cellspacing="0" style="border-collapse:collapse">${rows.map(([label, value]) => `<tr><th align="left" style="border-bottom:1px solid #ddd">${escapeHtml(label)}</th><td style="border-bottom:1px solid #ddd;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`).join('')}</table>`,
            replyTo: data.email,
            idempotencyKey: `form-notify/${submissionId}`,
        })
        return
    }
    if (submission.kind === 'petition') {
        await sendResendEvent('petition.submitted', data.email, {
            first_name: data.firstName,
            supporter_type: data.supporterType,
            updates_opt_in: data.updates,
        })
    } else {
        await sendResendEvent('contact.submitted', data.email, {
            first_name: data.name.split(/\s+/)[0] || data.name,
            reason: data.reason,
        })
    }
}

/**
 * Atomic D1 claims prevent simultaneous Cron executions from processing a job.
 * Resend notification emails use a 24h idempotency key. Events API has no
 * documented cross-attempt idempotency: an accepted event followed by a crash
 * before the D1 mark-done can generate an additional acknowledgement.
 */
async function processSubmission(db: D1Database, id: string): Promise<void> {
    const stored = await db.prepare('SELECT id, data FROM form_submissions WHERE id = ?')
        .bind(id).first<SubmissionRow>()
    if (!stored) return
    const submission = JSON.parse(stored.data) as StoredSubmission

    for (const kind of ['contact', 'notification', 'event'] as const) {
        const now = Date.now()
        const claim = await db.prepare(`
            UPDATE form_jobs SET state = 'running', attempts = attempts + 1, lease_expires_at = ?
            WHERE submission_id = ? AND job_kind = ? AND
              ((state = 'pending' AND next_attempt_at <= ?) OR
               (state = 'running' AND lease_expires_at <= ?))
            RETURNING job_kind, attempts
        `).bind(now + 120_000, id, kind, now, now).first<Job>()
        if (!claim) {
            const existing = await db.prepare('SELECT state FROM form_jobs WHERE submission_id = ? AND job_kind = ?')
                .bind(id, kind).first<{ state: string }>()
            if (existing?.state === 'done') continue
            return // This job is leased or waiting for its next retry.
        }
        try {
            await executeJob(id, claim.job_kind, submission)
            await db.prepare(`UPDATE form_jobs SET state = 'done', completed_at = ?,
                lease_expires_at = NULL, last_error = NULL
                WHERE submission_id = ? AND job_kind = ? AND state = 'running'`)
                .bind(Date.now(), id, kind).run()
        } catch (error) {
            const status = error instanceof Error ? error.message.slice(0, 120) : 'unknown error'
            console.error('Form outbox job failed', kind, status) // no email/name/message logged
            const backoff = Math.min(3_600_000, 30_000 * 2 ** Math.min(claim.attempts - 1, 7))
            await db.prepare(`UPDATE form_jobs SET state = 'pending', next_attempt_at = ?,
                lease_expires_at = NULL, last_error = ? WHERE submission_id = ? AND job_kind = ?`)
                .bind(Date.now() + backoff, status, id, kind).run()
            return
        }
    }
}

/** Can be run by the isolated Cron Worker; no public unauthenticated drain route. */
export async function drainFormOutbox(db: D1Database, limit = 20): Promise<number> {
    const now = Date.now()
    const due = await db.prepare(`
        SELECT DISTINCT j.submission_id FROM form_jobs j
        WHERE ((j.state = 'pending' AND j.next_attempt_at <= ?)
            OR (j.state = 'running' AND j.lease_expires_at <= ?))
          AND NOT EXISTS (
            SELECT 1 FROM form_jobs prior
            WHERE prior.submission_id = j.submission_id
              AND prior.priority < j.priority AND prior.state != 'done'
          )
        ORDER BY j.next_attempt_at LIMIT ?
    `).bind(now, now, limit).all<{ submission_id: string }>()
    for (const row of due.results) await processSubmission(db, row.submission_id)
    // Opportunistic cleanup of expired rate-limit buckets.
    await db.prepare('DELETE FROM form_rate_limits WHERE expires_at < ?')
        .bind(Date.now() - 86_400_000).run()
    return due.results.length
}
