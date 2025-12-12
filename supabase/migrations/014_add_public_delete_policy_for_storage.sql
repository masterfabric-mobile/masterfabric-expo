-- Add public delete policy for storage bucket
-- This allows deletion of files uploaded to the root of the case-files bucket
-- Files are uploaded without user folder structure, so we need public delete access

-- Drop policy if it exists (in case migration is run multiple times)
DROP POLICY IF EXISTS "Public delete" ON storage.objects;

-- Create the public delete policy
CREATE POLICY "Public delete"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'case-files');

