-- Add indexes for performance optimization
-- These indexes will speed up common queries

-- Onboardings indexes
CREATE INDEX IF NOT EXISTS idx_onboardings_workspace_status 
  ON client_onboardings(workspace_id, status);

CREATE INDEX IF NOT EXISTS idx_onboardings_created_at 
  ON client_onboardings(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_onboardings_completed_at 
  ON client_onboardings(completed_at DESC) 
  WHERE completed_at IS NOT NULL;

-- Flows indexes
CREATE INDEX IF NOT EXISTS idx_flows_workspace 
  ON onboarding_flows(workspace_id);

-- Steps indexes  
CREATE INDEX IF NOT EXISTS idx_steps_flow 
  ON onboarding_steps(flow_id, step_order);

-- Progress indexes
CREATE INDEX IF NOT EXISTS idx_progress_onboarding 
  ON client_step_progress(onboarding_id, step_order);

CREATE INDEX IF NOT EXISTS idx_progress_status 
  ON client_step_progress(onboarding_id, status);

-- Team indexes
CREATE INDEX IF NOT EXISTS idx_team_workspace 
  ON team_members(workspace_id, role);

-- Activities indexes
CREATE INDEX IF NOT EXISTS idx_activities_workspace 
  ON activities(workspace_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_activities_type 
  ON activities(type, created_at DESC);

-- Reminders indexes
CREATE INDEX IF NOT EXISTS idx_reminders_status_scheduled 
  ON reminders(status, scheduled_for) 
  WHERE status = 'pending';
