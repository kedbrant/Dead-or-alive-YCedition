-- Add YC company fields to ideas table
-- These columns store Y Combinator company data for the pivot

-- Core YC identifiers
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS yc_id TEXT;
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS yc_name TEXT;
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS yc_slug TEXT;
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS yc_batch TEXT;
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS yc_status TEXT;

-- Company details
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS yc_logo_url TEXT;
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS yc_website TEXT;
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS yc_long_description TEXT;
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS yc_team_size INTEGER;

-- Classification
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS yc_industry TEXT;
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS yc_subindustry TEXT;
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS yc_tags TEXT[];
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS yc_location TEXT;

-- Timestamps and flags
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS yc_launched_at TIMESTAMPTZ;
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS yc_is_top_company BOOLEAN DEFAULT false;

-- Active pool management
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS is_in_active_pool BOOLEAN DEFAULT false;
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS pool_added_at TIMESTAMPTZ;

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_ideas_yc_id ON ideas (yc_id) WHERE yc_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ideas_yc_slug ON ideas (yc_slug) WHERE yc_slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ideas_source_outcome ON ideas (source_outcome) WHERE source_outcome IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ideas_active_pool ON ideas (is_in_active_pool) WHERE is_in_active_pool = true;
CREATE INDEX IF NOT EXISTS idx_ideas_source ON ideas (source);
