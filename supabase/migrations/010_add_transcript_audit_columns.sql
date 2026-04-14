-- Add transcript parsing metadata columns used by API routes
ALTER TABLE transcripts
  ADD COLUMN IF NOT EXISTS parse_method TEXT DEFAULT 'regex' CHECK (parse_method IN ('ai', 'regex')),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Backfill updated_at for existing rows
UPDATE transcripts
SET updated_at = created_at
WHERE updated_at IS NULL;

-- Keep updated_at fresh on updates
CREATE OR REPLACE FUNCTION update_transcripts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_transcripts_updated_at ON transcripts;

CREATE TRIGGER set_transcripts_updated_at
  BEFORE UPDATE ON transcripts
  FOR EACH ROW
  EXECUTE FUNCTION update_transcripts_updated_at();
