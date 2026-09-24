-- D1: each accepted form has an immutable ID and a durable copy of the submission.
-- Treat the data column as personal information; restrict access and define retention.
CREATE TABLE IF NOT EXISTS form_submissions (
    id TEXT PRIMARY KEY,
    kind TEXT NOT NULL CHECK (kind IN ('petition', 'contact')),
    email TEXT NOT NULL,
    data TEXT NOT NULL,
    submitted_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS form_submissions_by_date ON form_submissions(submitted_at);
CREATE INDEX IF NOT EXISTS form_submissions_by_email ON form_submissions(email, submitted_at);

CREATE TABLE IF NOT EXISTS form_jobs (
    submission_id TEXT NOT NULL REFERENCES form_submissions(id),
    job_kind TEXT NOT NULL CHECK (job_kind IN ('contact', 'notification', 'event')),
    priority INTEGER NOT NULL,
    state TEXT NOT NULL DEFAULT 'pending' CHECK (state IN ('pending', 'running', 'done')),
    attempts INTEGER NOT NULL DEFAULT 0,
    next_attempt_at INTEGER NOT NULL,
    lease_expires_at INTEGER,
    last_error TEXT,
    completed_at INTEGER,
    PRIMARY KEY (submission_id, job_kind)
);
CREATE INDEX IF NOT EXISTS form_jobs_due ON form_jobs(state, next_attempt_at, lease_expires_at);

-- Keyed, one-hour digests; never store raw visitor IPs.
CREATE TABLE IF NOT EXISTS form_rate_limits (
    key TEXT PRIMARY KEY,
    hits INTEGER NOT NULL,
    expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS form_rate_limits_expiry ON form_rate_limits(expires_at);
