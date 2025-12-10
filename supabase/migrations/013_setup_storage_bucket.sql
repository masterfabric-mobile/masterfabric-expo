-- Setup storage bucket for the Storage case
-- Note: Storage buckets are typically created via Supabase Dashboard or API
-- This migration documents the setup and creates policies

-- Create storage bucket (if it doesn't exist)
-- Note: This requires the storage extension to be enabled
-- You may need to create the bucket manually via Supabase Dashboard > Storage

-- Insert bucket metadata (if bucket creation via SQL is supported)
-- Most Supabase setups require bucket creation via Dashboard or API
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'case-files',
  'case-files',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain']
)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for public read access
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'case-files');

-- Create storage policy for authenticated upload
CREATE POLICY "Authenticated upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'case-files');

-- Create storage policy for authenticated update (own files)
CREATE POLICY "Authenticated update own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'case-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage policy for authenticated delete (own files)
CREATE POLICY "Authenticated delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'case-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Note: For anonymous uploads, you can add:
-- CREATE POLICY "Public upload"
-- ON storage.objects FOR INSERT
-- TO public
-- WITH CHECK (bucket_id = 'case-files');

