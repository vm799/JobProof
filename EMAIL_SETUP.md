# Email Configuration Guide

## Current Status
Your app uses **Resend** for email delivery with `RESEND_API_KEY` configured.

## Issue
The app references `@getboardingpass.app` email addresses, but this domain needs to be verified in Resend first.

## Setup Steps

### Option 1: Use Resend's Test Domain (Quick Start)
1. No additional setup needed
2. Emails will come from `onboarding@resend.dev`
3. **Limitation**: May land in spam, not branded

### Option 2: Verify Your Domain (Production)
1. Go to [Resend Dashboard](https://resend.com/domains)
2. Add your domain (e.g., `getboardingpass.app` or `yourdomain.com`)
3. Add the DNS records Resend provides (SPF, DKIM, DMARC)
4. Wait for verification (usually 5-15 minutes)
5. Add environment variable:
   ```
   RESEND_FROM_EMAIL=onboarding@yourdomain.com
   ```

### Option 3: Use Existing Verified Domain
If you already have a verified domain in Resend:
1. Find your verified domain in Resend dashboard
2. Add environment variable:
   ```
   RESEND_FROM_EMAIL=onboarding@yourverifieddomain.com
   ```

## Testing Email Delivery

### Check if emails are being sent:
```bash
# Check Resend logs at: https://resend.com/emails
```

### Common issues:
- **No emails received**: Check RESEND_API_KEY is set
- **Emails in spam**: Domain not verified, using test domain
- **"Domain not verified" error**: Complete Option 2 above

## Email Addresses Used in App

The following email addresses are referenced and should be updated to your domain:
- `onboarding@getboardingpass.app` - Automated onboarding emails
- `support@getboardingpass.app` - Support contact (footer, help pages)
- `privacy@getboardingpass.app` - Privacy policy contact
- `legal@getboardingpass.app` - Terms of service contact
- `security@getboardingpass.app` - Security issues contact

## Quick Fix for Testing

To test emails immediately without domain setup:
1. Use Resend's test domain (no action needed)
2. Check your Resend dashboard logs to confirm delivery
3. Emails will work but come from `@resend.dev`

## Production Readiness

Before AppSumo launch:
1. ✅ Verify your domain in Resend
2. ✅ Set `RESEND_FROM_EMAIL` environment variable
3. ✅ Update email addresses throughout app to use your domain
4. ✅ Test email delivery to multiple providers (Gmail, Outlook, etc.)
5. ✅ Monitor Resend logs for delivery issues
