-- Migration: Create achievement_definitions table for YC-themed achievements
-- US-027: Add new YC-themed achievements

-- Create achievement_definitions table
CREATE TABLE IF NOT EXISTS achievement_definitions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    rarity TEXT NOT NULL CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
    category TEXT NOT NULL CHECK (category IN ('voting', 'outcome', 'streak', 'social', 'special')),
    trigger_type TEXT NOT NULL,
    trigger_threshold INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for active achievements lookup
CREATE INDEX IF NOT EXISTS idx_achievement_definitions_active
ON achievement_definitions (is_active) WHERE is_active = true;

-- Create index for category-based queries
CREATE INDEX IF NOT EXISTS idx_achievement_definitions_category
ON achievement_definitions (category);

-- Seed YC-themed achievement definitions
-- Note: Using INSERT ... ON CONFLICT for idempotent seeding

-- Unicorn Hunter: Vote on any unicorn (uncommon)
INSERT INTO achievement_definitions (id, name, description, icon, rarity, category, trigger_type, trigger_threshold)
VALUES ('unicorn_hunter', 'Unicorn Hunter', 'Vote on a unicorn company', 'star', 'uncommon', 'outcome', 'unicorn_voted', 1)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    rarity = EXCLUDED.rarity;

-- Visionary: Correctly ship a unicorn (uncommon)
INSERT INTO achievement_definitions (id, name, description, icon, rarity, category, trigger_type, trigger_threshold)
VALUES ('visionary', 'Visionary', 'Ship a startup that became a unicorn', 'eye', 'uncommon', 'outcome', 'unicorn_shipped', 1)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    rarity = EXCLUDED.rarity;

-- Missed Opportunity: Skip a unicorn (uncommon)
INSERT INTO achievement_definitions (id, name, description, icon, rarity, category, trigger_type, trigger_threshold)
VALUES ('missed_opportunity', 'Missed Opportunity', 'Skip a startup that became a unicorn', 'x-circle', 'uncommon', 'outcome', 'unicorn_skipped', 1)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    rarity = EXCLUDED.rarity;

-- Gravedigger: Vote on a dead company (common)
INSERT INTO achievement_definitions (id, name, description, icon, rarity, category, trigger_type, trigger_threshold)
VALUES ('gravedigger', 'Gravedigger', 'Vote on a startup that failed', 'skull', 'common', 'outcome', 'dead_voted', 1)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    rarity = EXCLUDED.rarity;

-- Fooled: Ship a dead company (uncommon)
INSERT INTO achievement_definitions (id, name, description, icon, rarity, category, trigger_type, trigger_threshold)
VALUES ('fooled', 'Fooled', 'Ship a startup that later failed', 'mask', 'uncommon', 'outcome', 'dead_shipped', 1)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    rarity = EXCLUDED.rarity;

-- Oracle: 80%+ accuracy with 50+ resolved votes (epic)
INSERT INTO achievement_definitions (id, name, description, icon, rarity, category, trigger_type, trigger_threshold)
VALUES ('oracle', 'Oracle', 'Achieve 80%+ prediction accuracy with 50+ resolved votes', 'crystal-ball', 'epic', 'special', 'oracle_score_80', 50)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    rarity = EXCLUDED.rarity;

-- Additional achievements to supplement the core YC-themed ones

-- Good Instincts: Skip a dead company (common)
INSERT INTO achievement_definitions (id, name, description, icon, rarity, category, trigger_type, trigger_threshold)
VALUES ('good_instincts', 'Good Instincts', 'Correctly skip a startup that failed', 'check-circle', 'common', 'outcome', 'dead_skipped', 1)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    rarity = EXCLUDED.rarity;

-- Deal Maker: Vote on an acquired company (common)
INSERT INTO achievement_definitions (id, name, description, icon, rarity, category, trigger_type, trigger_threshold)
VALUES ('deal_maker', 'Deal Maker', 'Vote on a startup that got acquired', 'handshake', 'common', 'outcome', 'acquired_voted', 1)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    rarity = EXCLUDED.rarity;

-- First Vote: Cast your first vote (common)
INSERT INTO achievement_definitions (id, name, description, icon, rarity, category, trigger_type, trigger_threshold)
VALUES ('first_vote', 'First Vote', 'Cast your first prediction', 'rocket', 'common', 'voting', 'total_votes', 1)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    rarity = EXCLUDED.rarity;

-- Prediction Spree: Vote 10 times (common)
INSERT INTO achievement_definitions (id, name, description, icon, rarity, category, trigger_type, trigger_threshold)
VALUES ('prediction_spree', 'Prediction Spree', 'Cast 10 predictions', 'zap', 'common', 'voting', 'total_votes', 10)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    rarity = EXCLUDED.rarity;

-- Venture Scout: Vote 50 times (uncommon)
INSERT INTO achievement_definitions (id, name, description, icon, rarity, category, trigger_type, trigger_threshold)
VALUES ('venture_scout', 'Venture Scout', 'Cast 50 predictions', 'search', 'uncommon', 'voting', 'total_votes', 50)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    rarity = EXCLUDED.rarity;

-- Veteran VC: Vote 100 times (rare)
INSERT INTO achievement_definitions (id, name, description, icon, rarity, category, trigger_type, trigger_threshold)
VALUES ('veteran_vc', 'Veteran VC', 'Cast 100 predictions', 'award', 'rare', 'voting', 'total_votes', 100)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    rarity = EXCLUDED.rarity;
