// Simple in-memory cache for development
// In production, replace with Upstash Redis

interface CacheEntry {
  data: any
  expiresAt: number
}

class MemoryCache {
  private cache: Map<string, CacheEntry> = new Map()

  get(key: string): any | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  set(key: string, data: any, ttlSeconds = 3600): void {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttlSeconds * 1000,
    })
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key)
      }
    }
  }
}

export const cache = new MemoryCache()

// Run cleanup every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => cache.cleanup(), 5 * 60 * 1000)
}

// Helper to cache database queries
export async function cached<T>(key: string, fetcher: () => Promise<T>, ttl = 3600): Promise<T> {
  const cached = cache.get(key)
  if (cached !== null) {
    return cached as T
  }

  const data = await fetcher()
  cache.set(key, data, ttl)
  return data
}
