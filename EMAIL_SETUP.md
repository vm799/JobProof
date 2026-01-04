# Email Configuration Guide

## Current Status
Your app uses **Resend** for email delivery with `RESEND_API_KEY` configured.

## Default Email Address
The app now defaults to **`admin@getboardingpass.app`** for all sender and contact addresses.

## Setup Steps

### Option 1: Use Default Domain (Quick Start)
1. Verify `getboardingpass.app` domain in Resend
2. Set environment variable:
   ```
   RESEND_FROM_EMAIL=admin@getboardingpass.app
   ```
3. All emails will send from this address

### Option 2: Use Your Custom Domain (Recommended for White-Label)
1. Go to [Resend Dashboard](https://resend.com/domains)
2. Add your domain (e.g., `youragency.com`)
3. Add the DNS records Resend provides (SPF, DKIM, DMARC)
4. Wait for verification (usually 5-15 minutes)
5. Add environment variable:
   ```
   RESEND_FROM_EMAIL=admin@yourdomain.com
   ```

### Option 3: Use Resend's Test Domain (Development Only)
1. No additional setup needed
2. Emails will come from `admin@resend.dev`
3. **Limitation**: May land in spam, not branded
4. The app will automatically fall back to this if `RESEND_FROM_EMAIL` is not set

## Testing Email Delivery

### Check if emails are being sent:
```bash
# Check Resend logs at: https://resend.com/emails
```

### Common issues:
- **No emails received**: Check RESEND_API_KEY is set in environment variables
- **Emails in spam**: Domain not verified, using test domain
- **"Domain not verified" error**: Complete domain verification in Resend dashboard

## Email Addresses Used in App

All contact references now point to **`admin@getboardingpass.app`**:
- Automated onboarding emails
- Support contact (footer, help pages)
- Privacy policy contact
- Terms of service contact
- All mailto: links

## Quick Fix for Testing

To test emails immediately without domain setup:
1. Leave `RESEND_FROM_EMAIL` unset - app will use `admin@getboardingpass.app` as default
2. Check your Resend dashboard logs to confirm delivery
3. For immediate testing with Resend test domain, emails work but come from `@resend.dev`

## Production Readiness Checklist

Before AppSumo launch:
1. ✅ Verify `getboardingpass.app` domain in Resend (or your custom domain)
2. ✅ Set `RESEND_FROM_EMAIL=admin@getboardingpass.app` environment variable
3. ✅ Test email delivery to multiple providers (Gmail, Outlook, Yahoo, etc.)
4. ✅ Monitor Resend logs for delivery issues and bounce rates
5. ✅ Ensure SPF, DKIM, and DMARC records are properly configured

## Environment Variable Configuration

Add this to your Vercel project environment variables:

```bash
RESEND_FROM_EMAIL=admin@getboardingpass.app
```

**Where to add:** Vars section in the v0 in-chat sidebar, or directly in Vercel project settings.
