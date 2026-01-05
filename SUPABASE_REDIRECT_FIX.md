# Fix Magic Link Localhost Redirect Issue

## Problem
Magic links in emails redirect to `http://localhost:3000` instead of your production URL (`https://getboardingpass.app`).

## Root Cause
The **Site URL** in your Supabase project settings is still set to localhost.

## Solution

### Step 1: Update Supabase Site URL
1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/pvmucyfeayjhbitftpvp
2. Navigate to **Authentication** → **URL Configuration**
3. Change **Site URL** from `http://localhost:3000` to `https://getboardingpass.app`
4. Click **Save**

### Step 2: Add Redirect URLs to Whitelist
In the same **URL Configuration** page, add these to the **Redirect URLs** list:

```
http://localhost:3000/**
https://getboardingpass.app/**
https://*.vercel.app/**
https://*.vusercontent.net/**
```

The wildcards allow:
- Local development (localhost)
- Production site (getboardingpass.app)
- Vercel preview deployments
- v0 preview environments

### Step 3: Test Magic Links
1. Clear your browser cache/cookies
2. Try the magic link login again at https://getboardingpass.app/auth/login
3. Check your email - the link should now redirect to `https://getboardingpass.app/dashboard`

### Step 4: Delete Old Users (Optional)
If users signed up when the Site URL was localhost, you may need to delete and recreate them:

```sql
-- Delete old user accounts created with localhost tokens
DELETE FROM auth.users WHERE email = 'vaishalimehmi@yahoo.co.uk';
-- They can now sign up fresh with correct redirect URLs
```

## Verification
After making these changes, all new magic links will correctly redirect to your production domain.
