# BoardingPass Deployment Guide

This guide will help you deploy BoardingPass to production with all features working correctly.

## Prerequisites

- Vercel account
- Supabase project
- Resend account for email
- Custom domain (optional but recommended)

## Environment Variables

Set these in your Vercel project settings:

### Database (Supabase)
```
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=
POSTGRES_HOST=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_JWT_SECRET=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### Email (Resend)
```
RESEND_API_KEY=your_resend_api_key
```

### Application
```
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
CRON_SECRET=random_secure_string_for_cron_auth
```

## Supabase Setup

1. Run all migration scripts in order (001 through 009):
   ```sql
   -- Run each file in scripts/ folder in Supabase SQL editor
   ```

2. Enable Row Level Security (RLS) on all tables

3. Configure Storage bucket:
   - Create bucket: `onboarding-files`
   - Set to public
   - Add policy for authenticated uploads

4. Set up authentication:
   - Enable email/password auth
   - Configure email templates
   - Set site URL to your domain

## Vercel Deployment

1. Connect your GitHub repository to Vercel

2. Configure build settings:
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. Add all environment variables

4. Deploy

## Post-Deployment

### 1. Configure Cron Jobs

The reminder system requires a cron job to run every 4 hours.

In `vercel.json`, we've configured:
```json
{
  "crons": [
    {
      "path": "/api/cron/send-reminders",
      "schedule": "0 */4 * * *"
    }
  ]
}
```

Verify in Vercel dashboard: Settings > Cron Jobs

### 2. Set Up Custom Domain (Recommended)

1. Go to Vercel project settings
2. Add your custom domain
3. Configure DNS records
4. Update `NEXT_PUBLIC_APP_URL` to your domain

### 3. Configure Email Sending Domain

1. In Resend dashboard, add your domain
2. Add DNS records (SPF, DKIM, DMARC)
3. Verify domain
4. Update email templates to use your domain

### 4. Test Critical Flows

- Sign up and create workspace
- Create a flow
- Invite a client
- Test client portal
- Verify email delivery
- Check cron job runs
- Test file uploads
- Verify analytics tracking

## Security Checklist

- [ ] All environment variables set
- [ ] CRON_SECRET is unique and secure
- [ ] RLS policies enabled on all tables
- [ ] File upload size limits enforced
- [ ] Rate limiting active on APIs
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Security headers configured
- [ ] Error logging set up (optional: Sentry)

## Monitoring

### Built-in Monitoring

- Vercel Analytics for performance
- Vercel Logs for errors
- Supabase Dashboard for database health

### Recommended Additional Tools

- Sentry for error tracking
- LogRocket for session replay
- Posthog for product analytics

## Troubleshooting

### Emails not sending
- Verify RESEND_API_KEY is set
- Check domain is verified in Resend
- Review Vercel function logs

### Reminders not sending
- Check cron job is configured in Vercel
- Verify CRON_SECRET matches in env and cron request
- Check function logs for errors

### Database connection issues
- Verify all Supabase env vars are correct
- Check connection pooling limits
- Review RLS policies

### File uploads failing
- Verify Supabase Storage bucket exists
- Check bucket is public
- Review storage policies
- Confirm file size limits

## Scaling Considerations

As you grow:

1. **Database**: Upgrade Supabase plan for more connections
2. **File Storage**: Monitor storage usage, implement cleanup
3. **Email**: Upgrade Resend plan for higher limits
4. **Caching**: Add Redis for rate limiting in production
5. **CDN**: Vercel Edge Network handles this automatically

## Support

For issues:
1. Check Vercel deployment logs
2. Review Supabase logs
3. Test in local development first
4. Contact support if needed

## Future Integrations

The codebase is ready for:

### Webhooks
Add webhook URLs in settings for:
- Client completed onboarding
- Step completed
- Client stalled (no activity for X days)

### Slack Integration
Endpoint ready for:
- POST /api/integrations/slack/notify
- Sends notifications to Slack channels

### Calendar Integration
Endpoint ready for:
- POST /api/integrations/calendar/schedule
- Books kickoff calls automatically

### Zapier
Webhooks ready for Zapier triggers:
- New client
- Onboarding completed
- Custom events

See `/api/integrations/*` for implementation examples.
