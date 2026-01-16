-- Combined YC Migrations
-- Run this in Supabase SQL Editor to set up all YC-related columns
-- Combines migrations 012, 013, and 014

-- ============================================
-- Migration 012: Add YC company fields to ideas table
-- ============================================

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

-- Unique constraint on yc_id for upsert operations
-- Note: We need an actual constraint, not just a partial index, for ON CONFLICT to work
-- First drop the index if it exists, then create a proper unique constraint
DROP INDEX IF EXISTS idx_ideas_yc_id_unique;
ALTER TABLE ideas DROP CONSTRAINT IF EXISTS ideas_yc_id_unique;
ALTER TABLE ideas ADD CONSTRAINT ideas_yc_id_unique UNIQUE (yc_id);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_ideas_yc_slug ON ideas (yc_slug) WHERE yc_slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ideas_source_outcome ON ideas (source_outcome) WHERE source_outcome IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ideas_active_pool ON ideas (is_in_active_pool) WHERE is_in_active_pool = true;
CREATE INDEX IF NOT EXISTS idx_ideas_source ON ideas (source);

-- ============================================
-- Migration 013: Add correctness tracking columns to votes table
-- ============================================

ALTER TABLE votes ADD COLUMN IF NOT EXISTS is_correct BOOLEAN;
ALTER TABLE votes ADD COLUMN IF NOT EXISTS idea_outcome TEXT;

CREATE INDEX IF NOT EXISTS idx_votes_is_correct ON votes (is_correct) WHERE is_correct IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_votes_idea_outcome ON votes (idea_outcome) WHERE idea_outcome IS NOT NULL;

-- ============================================
-- Migration 014: Add Oracle Score tracking to sessions table
-- ============================================

ALTER TABLE sessions ADD COLUMN IF NOT EXISTS oracle_score FLOAT DEFAULT NULL;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS resolved_votes INTEGER DEFAULT 0;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS correct_predictions INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_sessions_oracle_score ON sessions (oracle_score DESC NULLS LAST) WHERE oracle_score IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_sessions_resolved_votes ON sessions (resolved_votes DESC) WHERE resolved_votes >= 10;

-- ============================================
-- Done! All YC columns added successfully.
-- ============================================
