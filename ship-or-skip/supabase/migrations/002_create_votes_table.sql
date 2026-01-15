-- Create votes table for Ship or Skip
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  session_id UUID NOT NULL,
  vote TEXT NOT NULL CHECK (vote IN ('ship', 'skip')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Unique constraint: one vote per idea per session
  CONSTRAINT unique_vote_per_session UNIQUE (idea_id, session_id)
);

-- Index for finding votes by session
CREATE INDEX IF NOT EXISTS idx_votes_session_id ON votes (session_id);
CREATE INDEX IF NOT EXISTS idx_votes_idea_id ON votes (idea_id);
