-- Phase 3: Proof Verification System
-- Adds proof state machine with immutable audit trail

-- 1. Proof States Enum (add to existing proofs table definition)
ALTER TABLE proofs ADD COLUMN IF NOT EXISTS proof_status text DEFAULT 'submitted' CHECK (proof_status IN ('submitted', 'verified', 'rejected'));
ALTER TABLE proofs ADD COLUMN IF NOT EXISTS rejection_reason text;
ALTER TABLE proofs ADD COLUMN IF NOT EXISTS verified_at timestamp without time zone;
ALTER TABLE proofs ADD COLUMN IF NOT EXISTS verified_by uuid REFERENCES auth.users(id);

-- 2. Proof Events Table - Immutable Audit Trail
CREATE TABLE IF NOT EXISTS proof_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proof_id uuid NOT NULL REFERENCES proofs(id) ON DELETE CASCADE,
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  event_type text NOT NULL CHECK (event_type IN ('submitted', 'verified', 'rejected', 'comment_added')),
  actor_id uuid NOT NULL REFERENCES auth.users(id),
  actor_role text NOT NULL,
  previous_state text,
  new_state text,
  metadata jsonb DEFAULT '{}',
  created_at timestamp without time zone DEFAULT now() NOT NULL
);

-- Index for fast queries
CREATE INDEX idx_proof_events_proof_id ON proof_events(proof_id);
CREATE INDEX idx_proof_events_workspace_id ON proof_events(workspace_id);
CREATE INDEX idx_proof_events_created_at ON proof_events(created_at DESC);

-- RLS for proof_events - Admins/Managers can view, all can insert for their actions
CREATE POLICY proof_events_select_policy ON proof_events
  FOR SELECT USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY proof_events_insert_policy ON proof_events
  FOR INSERT WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

ALTER TABLE proof_events ENABLE ROW LEVEL SECURITY;

-- 3. Usage Tracking - Add columns to billing_accounts
ALTER TABLE billing_accounts ADD COLUMN IF NOT EXISTS monthly_active_users integer DEFAULT 0;
ALTER TABLE billing_accounts ADD COLUMN IF NOT EXISTS proofs_verified_this_month integer DEFAULT 0;
ALTER TABLE billing_accounts ADD COLUMN IF NOT EXISTS sites_count integer DEFAULT 0;

-- Create function to check usage limits
CREATE OR REPLACE FUNCTION check_billing_limits(p_workspace_id uuid, p_check_type text)
RETURNS boolean AS $$
DECLARE
  v_billing billing_accounts%rowtype;
  v_current_count integer;
BEGIN
  SELECT * INTO v_billing FROM billing_accounts WHERE workspace_id = p_workspace_id;
  
  IF NOT FOUND THEN
    RETURN true; -- No limits if no billing account
  END IF;

  IF p_check_type = 'sites' THEN
    SELECT COUNT(*) INTO v_current_count FROM sites WHERE workspace_id = p_workspace_id;
    RETURN v_current_count < v_billing.max_monthly_jobs;
  END IF;

  IF p_check_type = 'jobs' THEN
    SELECT COUNT(*) INTO v_current_count FROM client_onboardings 
    WHERE workspace_id = p_workspace_id 
    AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', now());
    RETURN v_current_count < v_billing.max_monthly_jobs;
  END IF;

  IF p_check_type = 'proofs' THEN
    SELECT COUNT(*) INTO v_current_count FROM proofs 
    WHERE workspace_id = p_workspace_id 
    AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', now());
    RETURN v_current_count < v_billing.max_monthly_proofs;
  END IF;

  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- 4. Proof Verification Permissions - enforce in RLS
CREATE POLICY proofs_verify_policy ON proofs
  FOR UPDATE USING (
    proof_status = 'submitted' AND
    workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'manager')
    )
  );
