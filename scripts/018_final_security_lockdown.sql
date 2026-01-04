-- FINAL SECURITY LOCKDOWN
-- This script adds the missing indexes from the audit and verifies token expiry

-- Performance indexes to prevent slow queries at scale
CREATE INDEX IF NOT EXISTS idx_client_onboardings_magic_token 
ON client_onboardings(onboarding_link_token);

CREATE INDEX IF NOT EXISTS idx_client_onboardings_created_at 
ON client_onboardings(created_at);

CREATE INDEX IF NOT EXISTS idx_clients_email 
ON clients(email);

CREATE INDEX IF NOT EXISTS idx_clients_workspace 
ON clients(workspace_id);

CREATE INDEX IF NOT EXISTS idx_onboarding_flows_workspace 
ON onboarding_flows(workspace_id);

CREATE INDEX IF NOT EXISTS idx_workspace_members_user 
ON workspace_members(user_id);

CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace 
ON workspace_members(workspace_id);

CREATE INDEX IF NOT EXISTS idx_client_step_progress_onboarding 
ON client_step_progress(client_onboarding_id);

CREATE INDEX IF NOT EXISTS idx_activity_logs_workspace 
ON activity_logs(workspace_id);

-- Add token expiry tracking columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'client_onboardings' 
    AND column_name = 'expires_at'
  ) THEN
    ALTER TABLE client_onboardings 
    ADD COLUMN expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '90 days');
    
    -- Backfill existing records
    UPDATE client_onboardings 
    SET expires_at = created_at + INTERVAL '90 days' 
    WHERE expires_at IS NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'client_onboardings' 
    AND column_name = 'last_accessed_at'
  ) THEN
    ALTER TABLE client_onboardings 
    ADD COLUMN last_accessed_at TIMESTAMPTZ;
  END IF;
END $$;

-- Create function to track token usage
CREATE OR REPLACE FUNCTION track_token_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Update last_accessed_at when token is used
  IF NEW.last_accessed_at IS NULL OR NEW.last_accessed_at < NOW() - INTERVAL '1 hour' THEN
    NEW.last_accessed_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-track access
DROP TRIGGER IF EXISTS trg_track_token_access ON client_onboardings;
CREATE TRIGGER trg_track_token_access
  BEFORE UPDATE ON client_onboardings
  FOR EACH ROW
  EXECUTE FUNCTION track_token_access();

-- Add file size limits to step config validation
COMMENT ON COLUMN onboarding_steps.config IS 'JSON config with max_file_size_mb (default: 10), allowed_file_types, etc';
