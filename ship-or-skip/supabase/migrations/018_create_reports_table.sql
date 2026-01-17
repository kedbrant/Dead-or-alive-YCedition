-- Migration: Create reports table for storing validation reports
-- US-008: Create reports database table

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idea TEXT NOT NULL,
    score INTEGER NOT NULL,
    report_data JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on created_at for fetching recent reports
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports (created_at DESC);

-- Add comment for documentation
COMMENT ON TABLE reports IS 'Stores generated validation reports for startup ideas';
COMMENT ON COLUMN reports.id IS 'Unique identifier for the report (UUID)';
COMMENT ON COLUMN reports.idea IS 'The startup idea that was validated';
COMMENT ON COLUMN reports.score IS 'Overall validation score (0-100)';
COMMENT ON COLUMN reports.report_data IS 'Full structured report data as JSONB';
COMMENT ON COLUMN reports.created_at IS 'When the report was generated';
