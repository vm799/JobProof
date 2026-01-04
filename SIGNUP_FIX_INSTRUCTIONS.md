# Signup Email Issue - Resolution Steps

## Problem Identified
Users are not receiving confirmation emails on signup due to a database trigger failure. The trigger partially completes (creates user profile) but fails to create the workspace due to RLS policy restrictions.

## Root Cause
The `handle_new_user()` trigger function runs with the authenticated user's permissions, which don't have INSERT rights on the `workspaces` table during signup because RLS policies block it.

## Solution Applied

### 1. Fixed Database Trigger (scripts/002_fix_workspace_trigger.sql)
The trigger has been updated with `SECURITY DEFINER` to run with elevated permissions and bypass RLS policies during the automatic workspace setup.

### 2. Run the SQL Script
Execute the `scripts/002_fix_workspace_trigger.sql` file in your Supabase project to apply the fix.

### 3. Email Confirmation Settings
After fixing the trigger, configure email confirmations in Supabase:

**Option A: Disable Email Confirmation (For Testing)**
1. Go to Supabase Dashboard → Authentication → Settings
2. Find "Enable email confirmations"
3. Toggle OFF
4. Users will be able to sign in immediately without email verification

**Option B: Configure Custom SMTP (For Production)**
1. Go to Supabase Dashboard → Project Settings → Auth
2. Scroll to "SMTP Settings"
3. Configure your SMTP provider (Resend, SendGrid, etc.)
4. Test email delivery

**Option C: Use Supabase Default (Rate Limited)**
- Keep email confirmation enabled
- Use Supabase's default email service (limited to ~4 emails/hour)
- Best for initial testing only

## Testing the Fix
1. Run the SQL script: `002_fix_workspace_trigger.sql`
2. Try signing up with a new email address
3. Check console logs for successful workspace creation
4. Verify user can access dashboard after login

## Expected Behavior After Fix
- User signs up → confirmation email sent (if enabled)
- Database trigger creates: profile, workspace, and workspace_member
- User confirms email (if required) → can access dashboard
- No "Database error saving new user" messages
</parameter>
