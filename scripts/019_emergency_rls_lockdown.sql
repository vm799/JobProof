-- ============================================================================
-- EMERGENCY RLS POLICIES FOR MISSING TABLES
-- LAWSUIT PREVENTION: These tables had RLS enabled but ZERO policies
-- This made them completely inaccessible and broke the app
-- ============================================================================

-- ============================================================================
-- TABLE: flows (this is likely onboarding_flows based on structure)
-- CRITICAL: Has workspace_id directly
-- ============================================================================

-- DROP existing policies if any (shouldn't be any based on audit)
DROP POLICY IF EXISTS "flows_workspace_select" ON flows;
DROP POLICY IF EXISTS "flows_workspace_insert" ON flows;
DROP POLICY IF EXISTS "flows_workspace_update" ON flows;
DROP POLICY IF EXISTS "flows_workspace_delete" ON flows;

-- SELECT: Users can only see flows in their workspace
CREATE POLICY "flows_workspace_select" ON flows
FOR SELECT
USING (
  workspace_id IN (
    SELECT workspace_id 
    FROM workspace_members 
    WHERE user_id = auth.uid()
  )
);

-- INSERT: Users can only create flows in their workspace
CREATE POLICY "flows_workspace_insert" ON flows
FOR INSERT
WITH CHECK (
  workspace_id IN (
    SELECT workspace_id 
    FROM workspace_members 
    WHERE user_id = auth.uid()
  )
);

-- UPDATE: Users can only update flows in their workspace
CREATE POLICY "flows_workspace_update" ON flows
FOR UPDATE
USING (
  workspace_id IN (
    SELECT workspace_id 
    FROM workspace_members 
    WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  workspace_id IN (
    SELECT workspace_id 
    FROM workspace_members 
    WHERE user_id = auth.uid()
  )
);

-- DELETE: Users can only delete flows in their workspace
CREATE POLICY "flows_workspace_delete" ON flows
FOR DELETE
USING (
  workspace_id IN (
    SELECT workspace_id 
    FROM workspace_members 
    WHERE user_id = auth.uid()
  )
);

-- ============================================================================
-- TABLE: flow_steps
-- CRITICAL: Joins via flow_id to flows.workspace_id
-- ============================================================================

DROP POLICY IF EXISTS "flow_steps_workspace_select" ON flow_steps;
DROP POLICY IF EXISTS "flow_steps_workspace_insert" ON flow_steps;
DROP POLICY IF EXISTS "flow_steps_workspace_update" ON flow_steps;
DROP POLICY IF EXISTS "flow_steps_workspace_delete" ON flow_steps;

-- SELECT: Users can only see steps for flows in their workspace
CREATE POLICY "flow_steps_workspace_select" ON flow_steps
FOR SELECT
USING (
  flow_id IN (
    SELECT id FROM flows 
    WHERE workspace_id IN (
      SELECT workspace_id 
      FROM workspace_members 
      WHERE user_id = auth.uid()
    )
  )
);

-- INSERT: Users can only create steps for flows in their workspace
CREATE POLICY "flow_steps_workspace_insert" ON flow_steps
FOR INSERT
WITH CHECK (
  flow_id IN (
    SELECT id FROM flows 
    WHERE workspace_id IN (
      SELECT workspace_id 
      FROM workspace_members 
      WHERE user_id = auth.uid()
    )
  )
);

-- UPDATE: Users can only update steps for flows in their workspace
CREATE POLICY "flow_steps_workspace_update" ON flow_steps
FOR UPDATE
USING (
  flow_id IN (
    SELECT id FROM flows 
    WHERE workspace_id IN (
      SELECT workspace_id 
      FROM workspace_members 
      WHERE user_id = auth.uid()
    )
  )
)
WITH CHECK (
  flow_id IN (
    SELECT id FROM flows 
    WHERE workspace_id IN (
      SELECT workspace_id 
      FROM workspace_members 
      WHERE user_id = auth.uid()
    )
  )
);

-- DELETE: Users can only delete steps for flows in their workspace
CREATE POLICY "flow_steps_workspace_delete" ON flow_steps
FOR DELETE
USING (
  flow_id IN (
    SELECT id FROM flows 
    WHERE workspace_id IN (
      SELECT workspace_id 
      FROM workspace_members 
      WHERE user_id = auth.uid()
    )
  )
);

-- ============================================================================
-- TABLE: notification_logs
-- CRITICAL: Joins via client_onboarding_id
-- ============================================================================

DROP POLICY IF EXISTS "notification_logs_workspace_select" ON notification_logs;
DROP POLICY IF EXISTS "notification_logs_workspace_insert" ON notification_logs;

-- SELECT: Users can only see notification logs for their workspace clients
CREATE POLICY "notification_logs_workspace_select" ON notification_logs
FOR SELECT
USING (
  client_onboarding_id IN (
    SELECT id FROM client_onboardings 
    WHERE client_id IN (
      SELECT id FROM clients 
      WHERE workspace_id IN (
        SELECT workspace_id 
        FROM workspace_members 
        WHERE user_id = auth.uid()
      )
    )
  )
);

-- INSERT: System can insert notification logs (service role)
-- Regular users typically don't insert logs directly
CREATE POLICY "notification_logs_workspace_insert" ON notification_logs
FOR INSERT
WITH CHECK (
  client_onboarding_id IN (
    SELECT id FROM client_onboardings 
    WHERE client_id IN (
      SELECT id FROM clients 
      WHERE workspace_id IN (
        SELECT workspace_id 
        FROM workspace_members 
        WHERE user_id = auth.uid()
      )
    )
  )
);

-- ============================================================================
-- TABLE: flow_template_steps
-- NOTE: Templates might be global (not workspace-specific)
-- Allowing SELECT for all authenticated users
-- Only workspace owners should INSERT/UPDATE/DELETE
-- ============================================================================

DROP POLICY IF EXISTS "flow_template_steps_public_select" ON flow_template_steps;
DROP POLICY IF EXISTS "flow_template_steps_workspace_insert" ON flow_template_steps;
DROP POLICY IF EXISTS "flow_template_steps_workspace_update" ON flow_template_steps;
DROP POLICY IF EXISTS "flow_template_steps_workspace_delete" ON flow_template_steps;

-- SELECT: All authenticated users can see template steps (templates are global)
CREATE POLICY "flow_template_steps_public_select" ON flow_template_steps
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- INSERT: Only workspace members can create template steps
CREATE POLICY "flow_template_steps_workspace_insert" ON flow_template_steps
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM workspace_members 
    WHERE user_id = auth.uid()
  )
);

-- UPDATE: Only workspace members can update template steps
CREATE POLICY "flow_template_steps_workspace_update" ON flow_template_steps
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM workspace_members 
    WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM workspace_members 
    WHERE user_id = auth.uid()
  )
);

-- DELETE: Only workspace members can delete template steps
CREATE POLICY "flow_template_steps_workspace_delete" ON flow_template_steps
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM workspace_members 
    WHERE user_id = auth.uid()
  )
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE (RLS policies use these joins heavily)
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_flow_steps_flow_id ON flow_steps(flow_id);
CREATE INDEX IF NOT EXISTS idx_flows_workspace_id ON flows(workspace_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_client_onboarding_id ON notification_logs(client_onboarding_id);

-- ============================================================================
-- VERIFICATION QUERY
-- Run this to confirm all tables now have policies
-- ============================================================================

-- SELECT 
--   schemaname,
--   tablename,
--   (SELECT COUNT(*) FROM pg_policies p WHERE p.schemaname = t.schemaname AND p.tablename = t.tablename) as policy_count
-- FROM pg_tables t
-- WHERE schemaname = 'public' 
-- AND rowsecurity = true
-- ORDER BY policy_count ASC, tablename;
