-- Add twitter_handle column to sessions table
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS twitter_handle TEXT;
