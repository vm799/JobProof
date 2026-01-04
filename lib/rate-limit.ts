// Simple in-memory rate limiter for API routes
// For production, use Redis or similar

const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS = 10 // 10 requests per minute

interface RateLimitEntry {
  count: number
  resetAt: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up old entries every 5 minutes
setInterval(
  () => {
    const now = Date.now()
    for (const [key, entry] of rateLimitStore.entries()) {
      if (entry.resetAt < now) {
        rateLimitStore.delete(key)
      }
    }
  },
  5 * 60 * 1000,
)

export function checkRateLimit(
  identifier: string,
  maxRequests: number = MAX_REQUESTS,
): {
  allowed: boolean
  remaining: number
  resetAt: number
} {
  const now = Date.now()
  const entry = rateLimitStore.get(identifier)

  if (!entry || entry.resetAt < now) {
    // Create new entry
    const resetAt = now + RATE_LIMIT_WINDOW
    rateLimitStore.set(identifier, { count: 1, resetAt })
    return { allowed: true, remaining: maxRequests - 1, resetAt }
  }

  // Check if limit exceeded
  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt }
  }

  // Increment count
  entry.count++
  rateLimitStore.set(identifier, entry)

  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetAt: entry.resetAt,
  }
}

export function getRateLimitHeaders(remaining: number, resetAt: number) {
  return {
    "X-RateLimit-Limit": MAX_REQUESTS.toString(),
    "X-RateLimit-Remaining": remaining.toString(),
    "X-RateLimit-Reset": Math.ceil(resetAt / 1000).toString(),
  }
}
