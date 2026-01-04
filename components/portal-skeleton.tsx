export function PortalSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 animate-pulse" />
              <div className="h-4 w-32 bg-muted rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-6 w-16 bg-muted rounded-full animate-pulse" />
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          <div className="lg:sticky lg:top-12 lg:h-fit">
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="h-5 w-32 bg-muted rounded mb-6 animate-pulse" />
              <div className="space-y-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                    <div className="h-4 w-40 bg-muted rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-8">
            <div className="max-w-2xl space-y-6">
              <div className="h-8 w-64 bg-muted rounded animate-pulse" />
              <div className="h-4 w-full bg-muted rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
              <div className="h-40 w-full bg-muted rounded animate-pulse mt-8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
