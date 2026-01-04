# How to Access Your Supabase Dashboard

## Direct Link

https://supabase.com/dashboard/project/pvmucyfeayjhbitftpvp

## Navigation Path

1. Go to https://supabase.com/dashboard
2. Select project: **Client-onboarding** (ID: pvmucyfeayjhbitftpvp)
3. In the left sidebar, click:
   - **Authentication** → **Providers** → **Email** (to disable confirmation)
   - **Authentication** → **Settings** → **SMTP** (to configure custom email)

## Critical Settings to Change

### To Disable Email Confirmation (Testing):
1. Authentication → Providers → Email
2. Uncheck "Confirm email"
3. Save

### To Enable Custom SMTP (Production):
1. Authentication → Settings
2. Scroll to "SMTP Settings"
3. Enable "Enable Custom SMTP"
4. Fill in Resend credentials:
   - Host: `smtp.resend.com`
   - Port: `587`
   - Username: `resend`
   - Password: `[Your Resend API Key]`
5. Save

## You CANNOT Fix This in v0

The email sending issue is a Supabase configuration problem that can ONLY be fixed in the Supabase Dashboard. The code is working correctly - Supabase is just not configured to send emails to non-team-members.
