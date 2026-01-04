-- ============================================================================
-- FIX CRITICAL RLS SECURITY GAPS
-- ============================================================================
-- This script patches 3 critical security holes in existing RLS policies:
-- 1. INSERT policies with no workspace checks (using_expression: null)
-- 2. Duplicate/conflicting policies
-- 3. Weak workspace_members SELECT policy
-- ============================================================================

-- First, drop the weak/duplicate policies
DROP POLICY IF EXISTS "Users see their own clients" ON clients;
DROP POLICY IF EXISTS "Members can view workspace members" ON workspace_members;
DROP POLICY IF EXISTS "Service role can insert workspace members" ON workspace_members;

-- ============================================================================
-- FIX INSERT POLICIES - Add workspace verification on INSERT
-- ============================================================================

-- Clients INSERT: Verify user is workspace member before allowing insert
DROP POLICY IF EXISTS "clients_insert_policy" ON clients;
CREATE POLICY "clients_insert_policy" ON clients
FOR INSERT
TO public
WITH CHECK (
  workspace_id IN (
    SELECT workspace_id FROM workspace_members 
    WHERE user_id = auth.uid()
  )
);

-- Flows INSERT: Verify user is workspace member
DROP POLICY IF EXISTS "flows_insert_policy" ON onboarding_flows;
CREATE POLICY "flows_insert_policy" ON onboarding_flows
FOR INSERT
TO public
WITH CHECK (
  workspace_id IN (
    SELECT workspace_id FROM workspace_members 
    WHERE user_id = auth.uid()
  )
);

-- Steps INSERT: Verify flow belongs to user's workspace
DROP POLICY IF EXISTS "steps_insert_policy" ON onboarding_steps;
CREATE POLICY "steps_insert_policy" ON onboarding_steps
FOR INSERT
TO public
WITH CHECK (
  flow_id IN (
    SELECT id FROM onboarding_flows 
    WHERE workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid()
    )
  )
);

-- Onboardings INSERT: Verify client belongs to user's workspace
DROP POLICY IF EXISTS "onboardings_insert_policy" ON client_onboardings;
CREATE POLICY "onboardings_insert_policy" ON client_onboardings
FOR INSERT
TO public
WITH CHECK (
  client_id IN (
    SELECT id FROM clients 
    WHERE workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid()
    )
  )
);

-- Step Progress INSERT: Verify onboarding belongs to user's workspace
DROP POLICY IF EXISTS "step_progress_insert_policy" ON client_step_progress;
CREATE POLICY "step_progress_insert_policy" ON client_step_progress
FOR INSERT
TO public
WITH CHECK (
  client_onboarding_id IN (
    SELECT id FROM client_onboardings 
    WHERE client_id IN (
      SELECT id FROM clients 
      WHERE workspace_id IN (
        SELECT workspace_id FROM workspace_members 
        WHERE user_id = auth.uid()
      )
    )
  )
);

-- Workspace Members INSERT: Only admins can add members
DROP POLICY IF EXISTS "workspace_members_insert_policy" ON workspace_members;
CREATE POLICY "workspace_members_insert_policy" ON workspace_members
FOR INSERT
TO public
WITH CHECK (
  workspace_id IN (
    SELECT workspace_id FROM workspace_members 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- ============================================================================
-- STRENGTHEN workspace_members SELECT - Prevent team info leakage
-- ============================================================================

DROP POLICY IF EXISTS "workspace_members_select_policy" ON workspace_members;
CREATE POLICY "workspace_members_select_policy" ON workspace_members
FOR SELECT
TO public
USING (
  -- Can only see members of workspaces you belong to
  workspace_id IN (
    SELECT workspace_id FROM workspace_members 
    WHERE user_id = auth.uid()
  )
);

-- ============================================================================
-- VERIFICATION QUERY
-- ============================================================================
-- Run this after migration to verify all policies are correct:
-- 
-- SELECT tablename, policyname, cmd, 
--        CASE WHEN qual IS NULL THEN 'NO CHECK' ELSE 'HAS CHECK' END as has_check
-- FROM pg_policies 
-- WHERE schemaname = 'public' 
-- AND tablename IN ('clients', 'onboarding_flows', 'client_onboardings', 
--                   'onboarding_steps', 'client_step_progress', 'workspace_members')
-- ORDER BY tablename, cmd;
-- 
-- Expected result: All INSERT policies should show 'HAS CHECK'
-- ============================================================================
