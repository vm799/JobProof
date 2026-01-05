# CRITICAL: Run This SQL Script Immediately

The workspace creation trigger is completely broken. Users who sign up are not getting profiles or workspaces created automatically.

## Steps to Fix

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/pvmucyfeayjhbitftpvp/sql/new

2. Run the script at `scripts/005_fix_trigger_completely.sql`

3. Test by creating a new test account

## What This Fixes

- **Broken Trigger**: The `handle_new_user()` trigger was failing silently
- **Missing Profiles**: Users weren't getting profile records
- **Missing Workspaces**: No workspaces were being created
- **Infinite Loading**: Users were stuck at "Setting up your workspace"
- **Redirect Loops**: Login page was redirecting endlessly

## Already Fixed in Code

- ✅ Middleware now checks for workspace existence before redirecting
- ✅ Login page waits for workspace before redirecting
- ✅ Workspace loader has escape buttons (retry, force continue, logout)
- ✅ Multiple GoTrueClient instances fixed with proper singleton pattern
- ✅ Debug logging added to track auth flow

## Manual Fix for Stuck Users

If users are still stuck, you can manually create their workspace:

```sql
-- Replace USER_ID with the actual user ID
INSERT INTO profiles (id, email, created_at)
VALUES ('USER_ID', 'their@email.com', NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO workspaces (id, name, slug, owner_id, created_at)
VALUES (gen_random_uuid(), 'My Workspace', 'workspace-12345', 'USER_ID', NOW())
RETURNING id;

-- Use the returned workspace ID in the next query
UPDATE profiles SET current_workspace_id = 'WORKSPACE_ID' WHERE id = 'USER_ID';

INSERT INTO workspace_members (workspace_id, user_id, role)
VALUES ('WORKSPACE_ID', 'USER_ID', 'owner');
