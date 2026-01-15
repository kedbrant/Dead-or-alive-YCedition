-- Create ideas table for Ship or Skip
CREATE TABLE IF NOT EXISTS ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  hero TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'user',
  source_company TEXT,
  source_batch TEXT,
  source_outcome TEXT,
  submitter_twitter TEXT,
  ship_count INTEGER NOT NULL DEFAULT 0,
  skip_count INTEGER NOT NULL DEFAULT 0,
  total_votes INTEGER NOT NULL DEFAULT 0,
  ship_percentage DECIMAL(5, 2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fetching random unvoted ideas efficiently
CREATE INDEX IF NOT EXISTS idx_ideas_active ON ideas (is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_ideas_total_votes ON ideas (total_votes);
CREATE INDEX IF NOT EXISTS idx_ideas_slug ON ideas (slug);
