-- Migration: Create battle_votes table for tracking battle mode participation
-- Tracks which companies users compared and their choices

CREATE TABLE IF NOT EXISTS battle_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL,
    winner_idea_id UUID NOT NULL REFERENCES ideas(id),
    loser_idea_id UUID NOT NULL REFERENCES ideas(id),
    user_choice TEXT NOT NULL CHECK (user_choice IN ('left', 'right')),
    correct_answer TEXT NOT NULL CHECK (correct_answer IN ('left', 'right')),
    is_correct BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- Ensure each session only sees each pair once
    CONSTRAINT unique_battle_pair UNIQUE (session_id, winner_idea_id, loser_idea_id)
);

-- Indexes for query performance
CREATE INDEX IF NOT EXISTS idx_battle_votes_session_id ON battle_votes(session_id);
CREATE INDEX IF NOT EXISTS idx_battle_votes_winner_id ON battle_votes(winner_idea_id);
CREATE INDEX IF NOT EXISTS idx_battle_votes_loser_id ON battle_votes(loser_idea_id);
CREATE INDEX IF NOT EXISTS idx_battle_votes_is_correct ON battle_votes(is_correct);

-- Comment for documentation
COMMENT ON TABLE battle_votes IS 'Tracks battle mode votes where users guess which company was more successful';
