-- Phase 2: Domain Entity Remap (Non-destructive)
-- This migration treats the existing onboarding schema as field service jobs

-- 1. Create roles enum (if not exists)
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'manager', 'field_worker');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 2. Add role column to workspace_members (if not exists)
ALTER TABLE workspace_members
ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'field_worker';

-- 3. Create jobs view (maps client_onboardings → jobs context)
CREATE OR REPLACE VIEW jobs AS
SELECT
  id,
  client_id as site_id,
  flow_id as workflow_id,
  status as job_status,
  created_at,
  updated_at,
  due_date,
  workspace_id,
  onboarding_link_token as job_token
FROM client_onboardings;

-- 4. Create sites view (maps clients → sites context)
CREATE OR REPLACE VIEW sites AS
SELECT
  id,
  name as site_name,
  email as site_contact_email,
  workspace_id,
  created_at,
  status
FROM clients;

-- 5. Create proofs table (photos/videos from jobs)
CREATE TABLE IF NOT EXISTS proofs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES client_onboardings(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('image', 'video')),
  file_size BIGINT NOT NULL,
  verified_at TIMESTAMP,
  verified_by UUID REFERENCES auth.users(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  CONSTRAINT workspace_isolation UNIQUE (id, workspace_id)
);

-- 6. Create billing_accounts table
CREATE TABLE IF NOT EXISTS billing_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL UNIQUE REFERENCES workspaces(id),
  plan_tier TEXT NOT NULL DEFAULT 'starter' CHECK (plan_tier IN ('starter', 'professional', 'enterprise')),
  monthly_usage_jobs INTEGER DEFAULT 0,
  monthly_usage_proofs INTEGER DEFAULT 0,
  max_monthly_jobs INTEGER NOT NULL DEFAULT 100,
  max_monthly_proofs INTEGER NOT NULL DEFAULT 500,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  billing_email TEXT NOT NULL,
  billing_status TEXT DEFAULT 'active' CHECK (billing_status IN ('active', 'canceled', 'past_due')),
  current_period_start DATE,
  current_period_end DATE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 7. Add RLS to proofs table
ALTER TABLE proofs ENABLE ROW LEVEL SECURITY;

CREATE POLICY proofs_workspace_isolation ON proofs
  USING (workspace_id = (SELECT current_workspace_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY proofs_insert_policy ON proofs
  FOR INSERT WITH CHECK (workspace_id = (SELECT current_workspace_id FROM profiles WHERE id = auth.uid()) AND uploaded_by = auth.uid());

CREATE POLICY proofs_select_policy ON proofs
  FOR SELECT USING (workspace_id = (SELECT current_workspace_id FROM profiles WHERE id = auth.uid()));

-- 8. Add RLS to billing_accounts table
ALTER TABLE billing_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY billing_admin_only ON billing_accounts
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_id = billing_accounts.workspace_id
        AND user_id = auth.uid()
        AND role = 'admin'
    )
  );

-- 9. Create audit log for role changes
CREATE TABLE IF NOT EXISTS role_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  member_id UUID NOT NULL REFERENCES workspace_members(id),
  changed_by UUID NOT NULL REFERENCES auth.users(id),
  old_role user_role,
  new_role user_role NOT NULL,
  reason TEXT,
  created_at TIMESTAMP DEFAULT now()
);

ALTER TABLE role_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY role_audit_admin_only ON role_audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_id = role_audit_logs.workspace_id
        AND user_id = auth.uid()
        AND role = 'admin'
    )
  );

-- 10. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_proofs_job_id ON proofs(job_id);
CREATE INDEX IF NOT EXISTS idx_proofs_workspace_id ON proofs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_proofs_uploaded_by ON proofs(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_billing_workspace_id ON billing_accounts(workspace_id);
CREATE INDEX IF NOT EXISTS idx_role_audit_workspace_id ON role_audit_logs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_role ON workspace_members(role, workspace_id);
