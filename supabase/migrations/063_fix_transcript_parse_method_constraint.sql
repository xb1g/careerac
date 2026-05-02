-- Migration 063: Fix transcripts_parse_method_check constraint
-- The constraint might not have been created correctly or is missing 'manual' value

-- Drop the existing constraint if it exists
ALTER TABLE transcripts DROP CONSTRAINT IF EXISTS transcripts_parse_method_check;

-- Re-add the constraint with correct values including 'manual'
-- Using ALTER COLUMN to set the default instead of ADD COLUMN
ALTER TABLE transcripts ALTER COLUMN parse_method SET DEFAULT 'regex';

-- Add the check constraint with 'manual' included and allowing NULL
ALTER TABLE transcripts
ADD CONSTRAINT transcripts_parse_method_check CHECK (parse_method IS NULL OR parse_method IN ('ai', 'regex', 'manual'));
