# Sentry Error Monitoring Setup

## Status: ✅ PRODUCTION READY

Sentry is fully configured for production error tracking and performance monitoring.

## Configuration Files

- `sentry.client.config.ts` - Client-side error tracking with Session Replay
- `sentry.server.config.ts` - Server-side error tracking with sensitive data filtering
- `sentry.edge.config.ts` - Edge runtime error tracking
- `instrumentation.ts` - Next.js instrumentation for automatic initialization
- `next.config.mjs` - Sentry webpack plugin for source map upload

## Environment Variables

Add to your Vercel project:

```bash
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@o12345.ingest.sentry.io/67890
SENTRY_AUTH_TOKEN=your-auth-token-from-sentry
```

## Features Enabled

1. **Error Tracking**: All uncaught errors are automatically sent to Sentry
2. **Performance Monitoring**: 10% of transactions sampled in production
3. **Session Replay**: Records user sessions when errors occur (with sensitive data masked)
4. **Sensitive Data Filtering**: Passwords, tokens, and keys are redacted from error reports
5. **Source Maps**: Uploaded automatically during build for readable stack traces

## Usage in Code

```typescript
import { captureException, captureMessage } from "@/lib/monitoring/sentry"

// Capture errors
try {
  await riskyOperation()
} catch (error) {
  captureException(error as Error, { userId, workspaceId })
}

// Capture messages
captureMessage("User completed onboarding", "info")
```

## Sentry Dashboard

Organization: `syneticx`
Project: `boardingpass-project`

Access: https://sentry.io/organizations/syneticx/projects/boardingpass-project/

## What's Being Monitored

- All unhandled exceptions
- API route errors
- Database query failures
- Authentication failures
- Portal access attempts
- Form submission errors

## Production Sampling Rates

- Error capture: 100% (all errors)
- Performance tracing: 10% (1 in 10 requests)
- Session replay: 10% normal, 100% on error
- Profiling: 10% (detailed performance data)
