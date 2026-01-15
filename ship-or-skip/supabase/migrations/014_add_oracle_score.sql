-- Migration: Add Oracle Score tracking to sessions table
-- This stores the calculated Oracle Score and resolved votes count for each user

-- Add oracle_score column (percentage 0-100, null if insufficient votes)
ALTER TABLE sessions
ADD COLUMN IF NOT EXISTS oracle_score FLOAT DEFAULT NULL;

-- Add resolved_votes column (count of votes on resolved companies)
ALTER TABLE sessions
ADD COLUMN IF NOT EXISTS resolved_votes INTEGER DEFAULT 0;

-- Add correct_predictions column for tracking correct predictions count
ALTER TABLE sessions
ADD COLUMN IF NOT EXISTS correct_predictions INTEGER DEFAULT 0;

-- Add index for leaderboard queries by oracle_score
CREATE INDEX IF NOT EXISTS idx_sessions_oracle_score
ON sessions (oracle_score DESC NULLS LAST)
WHERE oracle_score IS NOT NULL;

-- Add index for queries filtering by resolved_votes threshold
CREATE INDEX IF NOT EXISTS idx_sessions_resolved_votes
ON sessions (resolved_votes DESC)
WHERE resolved_votes >= 10;
