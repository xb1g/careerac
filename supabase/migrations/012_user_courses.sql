-- User courses table: stores courses a user has taken or plans to take
CREATE TABLE IF NOT EXISTS user_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_code TEXT NOT NULL,
  course_title TEXT NOT NULL,
  units NUMERIC(4, 1) NOT NULL DEFAULT 3,
  grade TEXT, -- e.g. A, B+, C, P, NP, W, or null for planned
  term TEXT, -- e.g. "Fall 2024", "Spring 2025"
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'in_progress', 'planned')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_user_courses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_courses_updated_at
  BEFORE UPDATE ON user_courses
  FOR EACH ROW
  EXECUTE FUNCTION update_user_courses_updated_at();

-- RLS policies
ALTER TABLE user_courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own courses"
  ON user_courses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own courses"
  ON user_courses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own courses"
  ON user_courses FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own courses"
  ON user_courses FOR DELETE
  USING (auth.uid() = user_id);

-- Index for fast user lookups
CREATE INDEX idx_user_courses_user_id ON user_courses(user_id);
