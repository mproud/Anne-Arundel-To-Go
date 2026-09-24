import { attributionRows } from './attribution'
import type { Attribution } from './attribution'
import { FormRequestError, enforceFormRateLimit, formDb, verifyFormChallenge } from './form-security'

export type PetitionSubmission = {
    supporterType: 'individual' | 'business'
    firstName: string
    lastName: string
    email: string
    zip: string
    organization: string
    authorized: boolean
    publicSupporter: boolean
    updates: boolean
    attribution: Attribution
}
export type ContactSubmission = {
    reason: 'question' | 'volunteer' | 'other'
    name: string
    email: string
    message: string
    attribution: Attribution
}
export type StoredSubmission =
    | { kind: 'petition'; data: PetitionSubmission }
    | { kind: 'contact'; data: ContactSubmission }

/** Browser-generated ID remains stable across retries and uniquely identifies a form submission. */
export async function recordFormSubmission(
    request: Request,
    submissionId: unknown,
    token: unknown,
    submission: StoredSubmission,
): Promise<{ duplicate: boolean }> {
    if (typeof submissionId !== 'string' ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(submissionId)) {
        throw new FormRequestError('Invalid submission ID. Please refresh the page and try again.', 400)
    }
    const db = formDb()
    await verifyFormChallenge(request, token, submission.kind)
    await enforceFormRateLimit(db, request, submission.kind)

    const normalized = JSON.stringify(submission)
    const now = Date.now()
    // Atomic: the signature/message and all three outbound tasks are committed
    // together, or none are. Do NOT call Resend before this transaction.
    const writes = await db.batch([
        db.prepare(`INSERT INTO form_submissions (id, kind, email, data, submitted_at)
                    VALUES (?, ?, ?, ?, ?) ON CONFLICT(id) DO NOTHING`)
            .bind(submissionId, submission.kind, submission.data.email, normalized, now),
        ...(['contact', 'notification', 'event'] as const).map((kind, index) =>
            db.prepare(`INSERT INTO form_jobs (submission_id, job_kind, priority, next_attempt_at)
                        SELECT id, ?, ?, ? FROM form_submissions WHERE id = ? AND data = ?
                        ON CONFLICT(submission_id, job_kind) DO NOTHING`)
                .bind(kind, index, now, submissionId, normalized)),
    ])
    const saved = await db.prepare('SELECT kind, email, data, submitted_at FROM form_submissions WHERE id = ?')
        .bind(submissionId).first<{ kind: string; email: string; data: string; submitted_at: number }>()
    if (!saved || saved.data !== normalized || saved.kind !== submission.kind || saved.email !== submission.data.email) {
        throw new FormRequestError('This submission ID has already been used. Please refresh the page.', 409)
    }
    return { duplicate: writes[0].meta.changes === 0 }
}

/** The submission email remains the historical attribution record for that submission. */
export function submissionRows(submission: StoredSubmission): Array<[string, string]> {
    if (submission.kind === 'contact') {
        const data = submission.data
        return [
            ['Reason', data.reason], ['Name', data.name], ['Email', data.email],
            ['Message', data.message], ...attributionRows(data.attribution),
        ]
    }
    const data = submission.data
    return [
        ['Supporter type', data.supporterType], ['Name', `${data.firstName} ${data.lastName}`],
        ['Email', data.email], ['ZIP code', data.zip],
        ...(data.supporterType === 'business' ? [
            ['Business / organization', data.organization],
            ['Authorized representative', data.authorized ? 'Yes' : 'No'],
            ['May be listed publicly', data.publicSupporter ? 'Yes' : 'No'],
        ] : []),
        ['Opted into updates', data.updates ? 'Yes' : 'No'],
        ...attributionRows(data.attribution),
    ]
}
