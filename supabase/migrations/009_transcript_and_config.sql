-- Transcripts table for storing uploaded transcript files and parsed data
CREATE TABLE transcripts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  parsed_data JSONB,
  parse_status TEXT DEFAULT 'pending' CHECK (parse_status IN ('pending', 'parsing', 'completed', 'failed')),
  parse_error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE transcripts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own transcripts"
  ON transcripts FOR ALL
  USING (auth.uid() = user_id);

-- Extend transfer_plans with new config columns
ALTER TABLE transfer_plans
  ADD COLUMN max_credits_per_semester INTEGER,
  ADD COLUMN transcript_id UUID REFERENCES transcripts(id),
  ADD COLUMN has_target_school BOOLEAN DEFAULT TRUE;
