-- Migration: Create achievement_progress table for tracking outcome-based achievements
-- US-028: Update achievement progress tracking for outcomes

-- Create achievement_progress table
CREATE TABLE IF NOT EXISTS achievement_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL,
    -- Basic voting counters
    total_votes INTEGER NOT NULL DEFAULT 0,
    -- Unicorn outcome tracking
    unicorns_voted INTEGER NOT NULL DEFAULT 0,
    unicorns_shipped INTEGER NOT NULL DEFAULT 0,
    unicorns_skipped INTEGER NOT NULL DEFAULT 0,
    -- Dead company outcome tracking
    dead_voted INTEGER NOT NULL DEFAULT 0,
    dead_shipped INTEGER NOT NULL DEFAULT 0,
    dead_skipped INTEGER NOT NULL DEFAULT 0,
    -- Acquired company outcome tracking
    acquired_voted INTEGER NOT NULL DEFAULT 0,
    acquired_shipped INTEGER NOT NULL DEFAULT 0,
    acquired_skipped INTEGER NOT NULL DEFAULT 0,
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    -- Unique constraint on session_id
    CONSTRAINT unique_session_progress UNIQUE (session_id)
);

-- Create index for session lookup
CREATE INDEX IF NOT EXISTS idx_achievement_progress_session
ON achievement_progress (session_id);

-- Create session_achievements junction table for unlocked achievements
CREATE TABLE IF NOT EXISTS session_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL,
    achievement_id TEXT NOT NULL,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    -- Unique constraint to prevent duplicate unlocks
    CONSTRAINT unique_session_achievement UNIQUE (session_id, achievement_id)
);

-- Create indexes for session_achievements
CREATE INDEX IF NOT EXISTS idx_session_achievements_session
ON session_achievements (session_id);

CREATE INDEX IF NOT EXISTS idx_session_achievements_achievement
ON session_achievements (achievement_id);
