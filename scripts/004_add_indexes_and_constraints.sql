-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_clients_workspace_id ON clients(workspace_id);
CREATE INDEX IF NOT EXISTS idx_client_onboardings_client_id ON client_onboardings(client_id);
CREATE INDEX IF NOT EXISTS idx_client_onboardings_flow_id ON client_onboardings(flow_id);
CREATE INDEX IF NOT EXISTS idx_client_onboardings_status ON client_onboardings(status);
CREATE INDEX IF NOT EXISTS idx_client_step_progress_onboarding_id ON client_step_progress(client_onboarding_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_steps_flow_id ON onboarding_steps(flow_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_workspace_id ON activity_logs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_onboarding_flows_workspace_id ON onboarding_flows(workspace_id);
CREATE INDEX IF NOT EXISTS idx_client_onboardings_workspace_id ON client_onboardings(client_id);
CREATE INDEX IF NOT EXISTS idx_reminders_onboarding_id ON reminders(onboarding_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace_id ON workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_client_notes_client_onboarding_id ON client_notes(client_onboarding_id);

-- Fixed constraint syntax - removed IF NOT EXISTS which is not supported
-- Add constraints and validations (only if they don't already exist)
-- Removed constraint checks since enums already exist in database
-- The database already has proper enum types defined

-- Add file uploads table for proper storage tracking
CREATE TABLE IF NOT EXISTS file_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  client_onboarding_id UUID REFERENCES client_onboardings(id) ON DELETE CASCADE,
  step_id UUID REFERENCES client_step_progress(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  file_type TEXT,
  storage_path TEXT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_file_uploads_workspace_id ON file_uploads(workspace_id);
CREATE INDEX IF NOT EXISTS idx_file_uploads_onboarding_id ON file_uploads(client_onboarding_id);

-- Enable RLS on file_uploads
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;

-- Updated RLS policies to use correct column names
CREATE POLICY "Users can view files in their workspace" ON file_uploads
  FOR SELECT USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can upload files to their workspace" ON file_uploads
  FOR INSERT WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );
