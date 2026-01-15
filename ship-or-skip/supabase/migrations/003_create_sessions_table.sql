-- Create sessions table for Ship or Skip
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  total_votes INTEGER NOT NULL DEFAULT 0,
  ship_votes INTEGER NOT NULL DEFAULT 0,
  skip_votes INTEGER NOT NULL DEFAULT 0,
  crowd_agreements INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_activity_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for session activity tracking
CREATE INDEX IF NOT EXISTS idx_sessions_last_activity ON sessions (last_activity_at);
