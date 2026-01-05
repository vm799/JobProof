# Supabase Email Configuration Guide

## Problem: No Confirmation Emails Received

### Why This Happens
Supabase requires email confirmation by default, but emails won't send without proper configuration.

### Solution 1: Disable Email Confirmation (Fastest - For Testing)

**Steps:**
1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/pvmucyfeayjhbitftpvp
2. Navigate to: **Authentication → Providers → Email**
3. Toggle **OFF**: "Confirm email"
4. Save changes
5. Users can now sign up without email confirmation

**⚠️ Warning:** Only use this for testing. Production apps should have email confirmation enabled.

---

### Solution 2: Configure Custom SMTP (Recommended for Production)

**Steps:**
1. Go to: **Project Settings → Auth → SMTP Settings**
2. Enable Custom SMTP
3. Add your SMTP provider details:
   - **Host**: smtp.resend.com (if using Resend)
   - **Port**: 587
   - **Username**: resend
   - **Password**: Your Resend API key
   - **Sender email**: admin@getboardingpass.app
   - **Sender name**: BoardingPass

4. Save and test

**Recommended Provider: Resend**
- Free tier: 3,000 emails/month
- Easy setup: https://resend.com/emails
- Already configured in app: Just add SMTP settings

---

### Solution 3: Use Supabase's Default Email (Limited)

Supabase provides a default email service, but it has strict rate limits:
- **3 emails per hour per project**
- Suitable only for initial testing
- Not recommended for production

If using default:
1. Ensure "Confirm email" is **enabled**
2. Check spam folder
3. Wait a few minutes (can be slow)
4. If no email after 5 minutes, check Solution 1 or 2

---

## Current App Configuration

Your app is set up to use:
- **From address**: `admin@getboardingpass.app`
- **Email provider**: Resend (via `RESEND_API_KEY`)
- **Auth flow**: Supabase native auth with email confirmation

**Environment Variable:**
\`\`\`bash
RESEND_FROM_EMAIL=admin@getboardingpass.app
\`\`\`

---

## Verification Steps

### 1. Check Supabase Auth Settings
\`\`\`
Dashboard → Authentication → Providers → Email
- Confirm email: Check status
- Secure email change: Recommended ON
- Secure password change: Recommended ON
\`\`\`

### 2. Test Signup Flow
\`\`\`
1. Sign up with a new email
2. Check Supabase Logs: Dashboard → Logs → Auth
3. Look for: "signup" or "confirmation" events
4. If no logs appear: Client-side error
5. If logs show error: SMTP configuration issue
\`\`\`

### 3. Check Email Deliverability
- Verify domain DNS records (SPF, DKIM) if using custom SMTP
- Check spam folder
- Try different email provider (Gmail, Yahoo, etc.)

---

## Quick Test Command

To verify SMTP is working, run this in Supabase SQL Editor:

\`\`\`sql
-- Check if users are being created
SELECT email, confirmed_at, created_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;
\`\`\`

**Expected Result:**
- `confirmed_at` is NULL → Email not confirmed yet
- `created_at` is recent → Signup worked, email issue
- No rows → Signup failing at client level

---

## Need Help?

1. **Check Supabase Logs**: Dashboard → Logs → Auth
2. **Email Resend**: support@resend.com
3. **BoardingPass Support**: admin@getboardingpass.app

---

## Production Checklist

Before launching:
- ✅ Custom SMTP configured with verified domain
- ✅ Email confirmation enabled
- ✅ SPF/DKIM records set up
- ✅ Test signup flow with multiple email providers
- ✅ Monitor auth logs for delivery issues
- ✅ Rate limiting configured appropriately
\`\`\`

\`\`\`tsx file="" isHidden
