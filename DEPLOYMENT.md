# BoardingPass Deployment Guide

Complete step-by-step guide to deploy BoardingPass to production.

---

## Prerequisites

Before deploying, ensure you have:

- [x] Vercel account
- [x] Supabase project created
- [x] Resend account for email delivery
- [x] GitHub repository (recommended)

---

## Step 1: Set Up Supabase

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Enter project name: `boardingpass-prod`
4. Choose region closest to your users
5. Set a strong database password
6. Click "Create new project"

### 1.2 Run Database Migrations

1. In Supabase dashboard, go to SQL Editor
2. Run each script in order:
   \`\`\`
   scripts/003_appsumo_licensing.sql
   scripts/004_add_indexes_and_constraints.sql
   scripts/006_create_templates.sql
   scripts/007_create_reminders.sql
   scripts/008_personal_connection_features.sql
   scripts/009_performance_indexes.sql
   \`\`\`
3. Or use the v0 scripts runner to execute all at once

### 1.3 Enable Email Authentication

1. Go to Authentication > Providers
2. Enable "Email" provider
3. Configure email templates (optional but recommended)
4. Set redirect URL: `https://yourdomain.com/auth/callback`

### 1.4 Configure Storage

1. Go to Storage
2. Create bucket: `onboarding-files`
3. Set as public bucket (files will have signed URLs)
4. Set file size limit: 10MB

### 1.5 Get API Keys

1. Go to Project Settings > API
2. Copy these values:
   - Project URL
   - `anon` public key
   - `service_role` secret key

---

## Step 2: Set Up Resend

### 2.1 Create Account & Get API Key

1. Go to [resend.com](https://resend.com)
2. Sign up or log in
3. Go to API Keys
4. Create new API key: `boardingpass-production`
5. Copy the key (starts with `re_`)

### 2.2 Configure Sending Domain

1. Go to Domains
2. Add your domain: `getboardingpass.app`
3. Add DNS records to your domain provider:
   \`\`\`
   TXT  _resend  [verification-code]
   MX   @        feedback-smtp.resend.com (Priority: 10)
   \`\`\`
4. Wait for verification (usually 5-10 minutes)

---

## Step 3: Deploy to Vercel

### 3.1 Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

### 3.2 Configure Environment Variables

Add these environment variables in Vercel:

#### Supabase Variables
\`\`\`bash
NEXT_PUBLIC_SUPABASE_URL=https://[your-project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# For development redirects (optional)
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
\`\`\`

#### Resend Variables
\`\`\`bash
RESEND_API_KEY=re_...
\`\`\`

#### Cron Secret
\`\`\`bash
CRON_SECRET=[generate-random-string]
\`\`\`

**Generate CRON_SECRET:**
\`\`\`bash
openssl rand -base64 32
\`\`\`

#### App URLs
\`\`\`bash
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
\`\`\`

### 3.3 Configure Build Settings

- Framework Preset: `Next.js`
- Build Command: `next build`
- Output Directory: `.next`
- Install Command: `npm install`

### 3.4 Deploy

1. Click "Deploy"
2. Wait for build to complete (~2-3 minutes)
3. Vercel will provide a preview URL

---

## Step 4: Configure Cron Jobs

### 4.1 Verify vercel.json

Ensure `vercel.json` exists in your repo:

\`\`\`json
{
  "crons": [
    {
      "path": "/api/cron/send-reminders",
      "schedule": "0 10 * * *"
    }
  ]
}
\`\`\`

This runs reminders daily at 10 AM UTC.

### 4.2 Test Cron Endpoint

\`\`\`bash
curl -X GET 'https://yourdomain.com/api/cron/send-reminders' \
  -H 'Authorization: Bearer YOUR_CRON_SECRET'
\`\`\`

Expected response: `{"success": true, "sent": 0}`

### 4.3 Monitor Cron Logs

1. Go to Vercel Dashboard
2. Click on your project
3. Go to "Cron Jobs" tab
4. View execution logs

---

## Step 5: Configure Custom Domain

### 5.1 Add Domain in Vercel

1. Go to Project Settings > Domains
2. Add your domain: `getboardingpass.app`
3. Add DNS records to your domain provider:

\`\`\`
A     @    76.76.21.21
CNAME www  cname.vercel-dns.com
\`\`\`

### 5.2 Enable HTTPS

- Vercel automatically provisions SSL certificate
- Wait 5-10 minutes for DNS propagation
- Vercel will show "Valid Configuration" when ready

### 5.3 Update Environment Variables

Update these variables with your custom domain:

\`\`\`bash
NEXT_PUBLIC_APP_URL=https://getboardingpass.app
NEXT_PUBLIC_SITE_URL=https://getboardingpass.app
\`\`\`

Redeploy after updating env vars.

---

## Step 6: Post-Deployment Verification

### 6.1 Test User Flows

1. **Sign Up**
   - Go to `/auth/sign-up`
   - Create new account
   - Check email for verification
   - Verify email works

2. **Onboarding Flow**
   - Create a new flow
   - Add steps
   - Invite a test client
   - Complete onboarding as client

3. **Email Delivery**
   - Check inbox for invite email
   - Verify email doesn't go to spam
   - Test password reset email
   - Test reminder email

4. **File Uploads**
   - Upload a file in portal
   - Verify file appears in Supabase Storage
   - Verify file can be downloaded

5. **Analytics**
   - Create test data
   - Check analytics dashboard
   - Verify calculations are correct

6. **AppSumo Codes**
   - Go to `/redeem`
   - Test a valid code
   - Verify tier upgrade works

### 6.2 Performance Check

1. Run Lighthouse audit:
   - Performance: Target >80
   - Accessibility: Target >90
   - SEO: Target >90

2. Check page load times:
   - Dashboard: <2s
   - Portal: <1.5s
   - Analytics: <2.5s

### 6.3 Security Check

1. Test rate limiting:
   \`\`\`bash
   # Should be rate limited after 10 requests
   for i in {1..15}; do
     curl https://yourdomain.com/api/send-onboarding-invite
   done
   \`\`\`

2. Test authentication:
   - Try accessing `/dashboard` without login
   - Should redirect to `/auth/login`

3. Test authorization:
   - Create two accounts
   - Verify users can't see each other's data

---

## Step 7: Monitoring & Alerting (Optional)

### 7.1 Set Up Sentry (Recommended)

1. Create Sentry account at [sentry.io](https://sentry.io)
2. Create new project for Next.js
3. Install Sentry:
   \`\`\`bash
   npm install @sentry/nextjs
   \`\`\`
4. Run Sentry setup:
   \`\`\`bash
   npx @sentry/wizard@latest -i nextjs
   \`\`\`
5. Add `SENTRY_DSN` to Vercel env vars
6. Redeploy

### 7.2 Set Up Vercel Analytics

1. Go to Project Settings > Analytics
2. Enable Web Analytics
3. Enable Speed Insights

### 7.3 Set Up Uptime Monitoring

Use a service like:
- Uptime Robot
- Pingdom
- Better Uptime

Monitor these endpoints:
- `https://yourdomain.com` (200)
- `https://yourdomain.com/api/health` (if you create one)

---

## Step 8: Backup Strategy

### 8.1 Database Backups

Supabase automatically backs up your database daily.

To create manual backup:
1. Go to Supabase Dashboard > Database
2. Click "Backups"
3. Click "Create Backup"

### 8.2 File Storage Backups

Supabase Storage is replicated across regions automatically.

For additional safety, set up weekly exports:
1. Create a Vercel cron job
2. Export files to AWS S3 or similar

---

## Troubleshooting

### Issue: Emails Going to Spam

**Solution:**
1. Verify Resend domain setup (SPF, DKIM, DMARC)
2. Warm up your sending domain (send gradually)
3. Avoid spam trigger words in emails
4. Ensure "From" email matches your domain

### Issue: Cron Jobs Not Running

**Solution:**
1. Check `vercel.json` is committed to repo
2. Verify `CRON_SECRET` env var is set
3. Check Vercel > Cron Jobs tab for errors
4. Redeploy after changes

### Issue: File Uploads Failing

**Solution:**
1. Check Supabase Storage bucket is public
2. Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
3. Check file size limits (default 10MB)
4. Verify CORS settings in Supabase

### Issue: Database Connection Errors

**Solution:**
1. Verify `SUPABASE_SERVICE_ROLE_KEY` is set correctly
2. Check Supabase project is not paused (free tier pauses after 7 days inactivity)
3. Verify database password is correct
4. Check connection pooling settings

### Issue: Rate Limiting Too Aggressive

**Solution:**
1. Edit `lib/rate-limit.ts`
2. Adjust `windowMs` and `max` values
3. Redeploy

---

## Production Checklist

Before going live, ensure:

- [ ] All environment variables are set
- [ ] Database migrations have run successfully
- [ ] Email delivery is working (check spam folders)
- [ ] Cron jobs are configured and running
- [ ] Custom domain is configured with SSL
- [ ] Test user flows work end-to-end
- [ ] Rate limiting is enabled
- [ ] Error tracking is set up (Sentry)
- [ ] Analytics are tracking
- [ ] Backups are configured
- [ ] Team has access to Vercel, Supabase, and Resend
- [ ] Documentation is up to date

---

## Scaling Considerations

### When to Upgrade

**Supabase:**
- Free tier: 500MB database, 1GB storage
- Upgrade to Pro ($25/month) when:
  - Database > 400MB
  - Storage > 800MB
  - Need more than 2 cron jobs
  - Need daily backups

**Vercel:**
- Hobby tier: Free for personal projects
- Upgrade to Pro ($20/month) when:
  - Need more than 100GB bandwidth
  - Need more than 100 build minutes
  - Need team collaboration

**Resend:**
- Free tier: 100 emails/day, 3,000/month
- Upgrade to Pro ($20/month) when:
  - Sending > 80 emails/day
  - Need dedicated IP
  - Need advanced analytics

### Performance Optimization

As you scale:
1. Implement Redis caching for analytics
2. Add CDN for static assets
3. Enable database connection pooling
4. Optimize database queries with indexes
5. Implement lazy loading for large lists
6. Add server-side pagination

---

## Security Best Practices

1. **Rotate secrets regularly**
   - Change `CRON_SECRET` every 90 days
   - Rotate API keys annually

2. **Monitor for breaches**
   - Set up Supabase security alerts
   - Monitor Vercel logs for suspicious activity

3. **Keep dependencies updated**
   \`\`\`bash
   npm audit
   npm update
   \`\`\`

4. **Enable Vercel Security Headers**
   - Already configured in `vercel.json`
   - Includes CSP, HSTS, X-Frame-Options

5. **Review Supabase RLS policies**
   - Test that users can't access other workspaces
   - Use `workspace_id` checks in all policies

---

## Support & Resources

- **Documentation:** `/README.md`, `/ROADMAP.md`, `/QA_EVIDENCE_REPORT.md`
- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Resend Docs:** https://resend.com/docs
- **Next.js Docs:** https://nextjs.org/docs

---

**Last Updated:** January 2025  
**Deployment Time:** ~30-45 minutes  
**Difficulty:** Intermediate

*Follow this guide step-by-step for a smooth deployment. If you encounter issues, refer to the Troubleshooting section or contact support.*
