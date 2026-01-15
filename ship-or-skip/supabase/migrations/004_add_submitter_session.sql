-- Add submitter_session_id to ideas table for rate limiting
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS submitter_session_id TEXT;

-- Index for rate limiting queries
CREATE INDEX IF NOT EXISTS idx_ideas_submitter_session ON ideas (submitter_session_id, created_at) WHERE submitter_session_id IS NOT NULL;
