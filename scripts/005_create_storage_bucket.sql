-- Create storage bucket for onboarding files
INSERT INTO storage.buckets (id, name, public)
VALUES ('onboarding-files', 'onboarding-files', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
CREATE POLICY "Users can view files in their workspace" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'onboarding-files' AND
    (storage.foldername(name))[1] IN (
      SELECT w.id::text FROM workspaces w
      INNER JOIN profiles p ON p.current_workspace_id = w.id
      WHERE p.id = auth.uid()
    )
  );

CREATE POLICY "Users can upload files to their workspace" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'onboarding-files' AND
    (storage.foldername(name))[1] IN (
      SELECT w.id::text FROM workspaces w
      INNER JOIN profiles p ON p.current_workspace_id = w.id
      WHERE p.id = auth.uid()
    )
  );

CREATE POLICY "Users can delete files in their workspace" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'onboarding-files' AND
    (storage.foldername(name))[1] IN (
      SELECT w.id::text FROM workspaces w
      INNER JOIN profiles p ON p.current_workspace_id = w.id
      WHERE p.id = auth.uid()
    )
  );
