# CRITICAL: Email Not Sending - Complete Fix Guide

## Why Emails Are NOT Being Sent

**ROOT CAUSE:** Supabase's built-in email service has severe limitations:
- Only sends 2 emails per hour
- **ONLY sends to team members** (people you've added to your Supabase project team)
- NOT suitable for production use

## IMMEDIATE FIX - Choose One Option:

### Option 1: Disable Email Confirmation (For Testing Only)

Go to your Supabase Dashboard and manually disable email confirmation:

1. Open https://supabase.com/dashboard/project/pvmucyfeayjhbitftpvp
2. Go to **Authentication** → **Providers** → **Email**
3. **UNCHECK** "Confirm email"
4. Click **Save**

Users can now sign up and log in immediately without email confirmation.

---

### Option 2: Setup Custom SMTP with Resend (Production-Ready)

#### Step 1: Get Resend API Key

1. Go to https://resend.com/api-keys
2. Create an API key
3. Copy the key (starts with `re_`)

#### Step 2: Configure Supabase SMTP

1. Open https://supabase.com/dashboard/project/pvmucyfeayjhbitftpvp/settings/auth
2. Scroll to **SMTP Settings**
3. Enable **Enable Custom SMTP**
4. Configure as follows:

```
Sender Email: admin@getboardingpass.app (or your verified domain)
Sender Name: BoardingPass
Host: smtp.resend.com
Port: 587
Username: resend
Password: [Your Resend API Key from Step 1]
```

5. Click **Save**

#### Step 3: Verify Domain in Resend

1. Go to https://resend.com/domains
2. Add `getboardingpass.app`
3. Follow DNS verification steps
4. Wait for verification (usually 5-15 minutes)

#### Step 4: Test

Try signing up with a real email address - you should receive confirmation email within seconds.

---

## Why This Matters

Without working emails, your onboarding portal CANNOT:
- Verify new users
- Send password resets
- Notify clients about onboarding steps
- Send reminders about incomplete tasks

This is a **blocking issue** for production launch.

---

## Current Status

Based on the debug logs:
- ✅ Signup code works correctly
- ✅ Users are being created in database
- ✅ Workspaces are being assigned
- ❌ Confirmation emails are NOT being sent (Supabase limitation)
- ❌ Users cannot access their accounts without email confirmation

## Next Steps

1. **RIGHT NOW:** Go to Supabase Dashboard and disable email confirmation (Option 1) so you can test the app
2. **Before Production:** Set up Resend SMTP (Option 2) for reliable email delivery
3. **Optional:** Add environment variable `NEXT_PUBLIC_SUPABASE_SKIP_EMAIL_CONFIRMATION=true` to your project for easier testing

---

## Need Help?

Contact Supabase support if you have issues configuring SMTP:
https://supabase.com/dashboard/support/new
