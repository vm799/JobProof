-- Fix infinite recursion in workspace_members RLS policies
-- The issue: policies reference workspace_members to check membership, 
-- creating circular dependency

-- Drop existing problematic policies
DROP POLICY IF EXISTS "workspace_members_select_policy" ON workspace_members;
DROP POLICY IF EXISTS "workspace_members_insert_policy" ON workspace_members;
DROP POLICY IF EXISTS "workspace_members_delete_policy" ON workspace_members;

-- Recreate policies WITHOUT circular references
-- Use auth.uid() directly instead of checking workspace_members

-- SELECT: Users can view members in workspaces they own or are members of
CREATE POLICY "workspace_members_select_policy" ON workspace_members
FOR SELECT
USING (
  -- User is viewing their own membership record
  auth.uid() = user_id
  OR
  -- User owns the workspace (check workspaces.owner_id directly)
  workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  )
);

-- INSERT: Only workspace owners can add members
CREATE POLICY "workspace_members_insert_policy" ON workspace_members
FOR INSERT
WITH CHECK (
  workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  )
);

-- DELETE: Only workspace owners can remove members
CREATE POLICY "workspace_members_delete_policy" ON workspace_members
FOR DELETE
USING (
  workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  )
);

-- Also fix workspaces policies to avoid circular references
DROP POLICY IF EXISTS "workspace_select_policy" ON workspaces;
DROP POLICY IF EXISTS "workspace_update_policy" ON workspaces;
DROP POLICY IF EXISTS "Users see their own workspace" ON workspaces;

-- Recreate workspace policies WITHOUT checking workspace_members
CREATE POLICY "workspace_select_policy" ON workspaces
FOR SELECT
USING (
  owner_id = auth.uid()
);

CREATE POLICY "workspace_update_policy" ON workspaces
FOR UPDATE
USING (
  owner_id = auth.uid()
)
WITH CHECK (
  owner_id = auth.uid()
);

-- Now fix other tables that might reference workspace_members

-- Fix clients table policies
DROP POLICY IF EXISTS "clients_select_policy" ON clients;
DROP POLICY IF EXISTS "clients_insert_policy" ON clients;
DROP POLICY IF EXISTS "clients_update_policy" ON clients;
DROP POLICY IF EXISTS "clients_delete_policy" ON clients;
DROP POLICY IF EXISTS "Users can only see their workspace data" ON clients;

CREATE POLICY "clients_select_policy" ON clients
FOR SELECT
USING (
  workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  )
);

CREATE POLICY "clients_insert_policy" ON clients
FOR INSERT
WITH CHECK (
  workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  )
);

CREATE POLICY "clients_update_policy" ON clients
FOR UPDATE
USING (
  workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  )
)
WITH CHECK (
  workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  )
);

CREATE POLICY "clients_delete_policy" ON clients
FOR DELETE
USING (
  workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  )
);

-- Fix activity_logs policies
DROP POLICY IF EXISTS "activity_logs_select_policy" ON activity_logs;
DROP POLICY IF EXISTS "activity_logs_insert_policy" ON activity_logs;

CREATE POLICY "activity_logs_select_policy" ON activity_logs
FOR SELECT
USING (
  workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  )
);

CREATE POLICY "activity_logs_insert_policy" ON activity_logs
FOR INSERT
WITH CHECK (
  workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  )
);

-- Success message
SELECT 'RLS policies fixed - infinite recursion eliminated' as status;
