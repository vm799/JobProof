-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_clients_workspace_id ON clients(workspace_id);
CREATE INDEX IF NOT EXISTS idx_client_onboardings_client_id ON client_onboardings(client_id);
CREATE INDEX IF NOT EXISTS idx_client_onboardings_flow_id ON client_onboardings(flow_id);
CREATE INDEX IF NOT EXISTS idx_client_onboardings_status ON client_onboardings(status);
CREATE INDEX IF NOT EXISTS idx_client_step_progress_onboarding_id ON client_step_progress(onboarding_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_steps_flow_id ON onboarding_steps(flow_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_workspace_id ON activity_logs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);

-- Add constraints and validations
ALTER TABLE client_onboardings 
ADD CONSTRAINT valid_status CHECK (status IN ('not_started', 'in_progress', 'completed', 'archived'));

ALTER TABLE onboarding_steps
ADD CONSTRAINT valid_step_type CHECK (type IN ('form', 'upload', 'contract', 'video', 'text', 'approval'));

ALTER TABLE subscriptions
ADD CONSTRAINT valid_plan_tier CHECK (plan_tier IN ('tier_1', 'tier_2', 'tier_3'));

-- Add file uploads table for proper storage tracking
CREATE TABLE IF NOT EXISTS file_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  onboarding_id UUID REFERENCES client_onboardings(id) ON DELETE CASCADE,
  step_progress_id UUID REFERENCES client_step_progress(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  file_type TEXT,
  storage_path TEXT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_file_uploads_workspace_id ON file_uploads(workspace_id);
CREATE INDEX idx_file_uploads_onboarding_id ON file_uploads(onboarding_id);

-- Enable RLS on file_uploads
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view files in their workspace" ON file_uploads
  FOR SELECT USING (
    workspace_id IN (
      SELECT current_workspace_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can upload files to their workspace" ON file_uploads
  FOR INSERT WITH CHECK (
    workspace_id IN (
      SELECT current_workspace_id FROM profiles WHERE id = auth.uid()
    )
  );
