-- Add correctness tracking columns to votes table
-- These columns track whether predictions were correct and snapshot the outcome at vote time

-- is_correct: whether the prediction was correct
-- ship + unicorn/acquired = correct
-- skip + dead = correct
-- null for active companies (no outcome yet)
ALTER TABLE votes ADD COLUMN IF NOT EXISTS is_correct BOOLEAN;

-- idea_outcome: snapshot of source_outcome at vote time
-- Stores: 'unicorn', 'acquired', 'dead', 'active', or null
ALTER TABLE votes ADD COLUMN IF NOT EXISTS idea_outcome TEXT;

-- Index for querying correct predictions
CREATE INDEX IF NOT EXISTS idx_votes_is_correct ON votes (is_correct) WHERE is_correct IS NOT NULL;

-- Index for querying by outcome type
CREATE INDEX IF NOT EXISTS idx_votes_idea_outcome ON votes (idea_outcome) WHERE idea_outcome IS NOT NULL;
