-- Add link column to ideas table for company website URLs
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS link TEXT;

-- Index for ideas with links (for future filtering)
CREATE INDEX IF NOT EXISTS idx_ideas_has_link ON ideas (link) WHERE link IS NOT NULL;
