// Performance monitoring utilities

export function measureDatabaseQuery<T>(queryName: string, queryFn: () => Promise<T>): Promise<T> {
  const start = performance.now()

  return queryFn().then(
    (result) => {
      const duration = performance.now() - start

      if (duration > 1000) {
        console.warn(`[v0] Slow query: ${queryName} took ${duration.toFixed(2)}ms`)
      }

      return result
    },
    (error) => {
      const duration = performance.now() - start
      console.error(`[v0] Query error: ${queryName} failed after ${duration.toFixed(2)}ms`, error)
      throw error
    },
  )
}

export function trackPageLoad(pageName: string) {
  if (typeof window !== "undefined" && "performance" in window) {
    const perfData = window.performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming

    if (perfData) {
      console.log(`[v0] Page load: ${pageName}`, {
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
        loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
        firstPaint: perfData.responseEnd - perfData.requestStart,
      })
    }
  }
}
