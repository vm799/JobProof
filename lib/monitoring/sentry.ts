// Sentry error tracking configuration
// Install: npm install @sentry/nextjs
import * as Sentry from "@sentry/nextjs"

export function initSentry() {
  // Sentry is automatically initialized via sentry.server.config.ts and sentry.client.config.ts
  // This function exists for backward compatibility
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    console.log("[v0] Sentry monitoring active")
  }
}

export function captureException(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, {
    extra: context,
  })
}

// Keep captureError for backward compatibility
export function captureError(error: Error, context?: Record<string, any>) {
  return captureException(error, context)
}

export function captureMessage(message: string, level: "info" | "warning" | "error" = "info") {
  Sentry.captureMessage(message, level as Sentry.SeverityLevel)
}
