-- Create private storage bucket for transcript PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('transcripts', 'transcripts', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Users can upload own transcript files" ON storage.objects;
DROP POLICY IF EXISTS "Users can read own transcript files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own transcript files" ON storage.objects;

-- Allow authenticated users to upload only into their own folder
CREATE POLICY "Users can upload own transcript files"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'transcripts'
    AND (storage.foldername(name))[1] = (auth.uid())::text
  );

-- Allow authenticated users to read only their own transcript files
CREATE POLICY "Users can read own transcript files"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'transcripts'
    AND (storage.foldername(name))[1] = (auth.uid())::text
  );

-- Allow authenticated users to delete only their own transcript files
CREATE POLICY "Users can delete own transcript files"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'transcripts'
    AND (storage.foldername(name))[1] = (auth.uid())::text
  );
