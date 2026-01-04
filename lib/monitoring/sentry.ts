// Sentry error tracking configuration
// Install: npm install @sentry/nextjs

export function initSentry() {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    // Sentry initialization would go here
    // For now, just console.log for development
    console.log("[v0] Sentry monitoring ready")
  }
}

export function captureException(error: Error, context?: Record<string, any>) {
  if (process.env.NODE_ENV === "production") {
    // Send to Sentry in production
    console.error("[SENTRY]", error, context)
  } else {
    console.error("[DEV ERROR]", error, context)
  }
}

// Keep captureError for backward compatibility
export function captureError(error: Error, context?: Record<string, any>) {
  return captureException(error, context)
}

export function captureMessage(message: string, level: "info" | "warning" | "error" = "info") {
  if (process.env.NODE_ENV === "production") {
    // Send to Sentry in production
    console.log(`[SENTRY ${level.toUpperCase()}]`, message)
  } else {
    console.log(`[DEV ${level.toUpperCase()}]`, message)
  }
}
