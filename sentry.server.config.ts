import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // Reduce in production (0.1 = 10%)
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Set profilesSampleRate to 1.0 to profile every transaction.
  // Reduce in production
  profilesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Filter out sensitive data
  beforeSend(event) {
    // Remove sensitive database credentials and tokens from error messages
    if (event.exception?.values) {
      event.exception.values.forEach((exception) => {
        if (exception.value) {
          exception.value = exception.value
            .replace(/password[=:]\s*\S+/gi, "password=***")
            .replace(/token[=:]\s*\S+/gi, "token=***")
            .replace(/key[=:]\s*\S+/gi, "key=***")
        }
      })
    }
    return event
  },

  environment: process.env.NODE_ENV,
})
