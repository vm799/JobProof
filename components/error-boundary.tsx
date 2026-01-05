"use client"

import { Component, type ReactNode } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { captureError } from "@/lib/monitoring/sentry"
import { createClient } from "@/lib/supabase/client"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("[v0] Error boundary caught:", error, errorInfo)

    // Report to Sentry for production monitoring
    captureError(error, {
      level: "error",
      tags: { component: "ErrorBoundary" },
      extra: { errorInfo },
    })
  }

  handleReload = async () => {
    if (typeof window !== "undefined") {
      try {
        console.log("[v0] ErrorBoundary: Clearing Supabase session before reload")
        const supabase = createClient()
        if (supabase) {
          await supabase.auth.signOut()
        }
        localStorage.clear()
        sessionStorage.clear()
      } catch (error) {
        console.error("[v0] Error clearing session:", error)
      } finally {
        window.location.href = "/auth/login"
      }
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="p-8 max-w-md w-full">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <h2 className="mb-2 text-xl font-semibold">Something went wrong</h2>
              <p className="mb-4 text-sm text-muted-foreground">
                {this.state.error?.message || "An unexpected error occurred"}
              </p>
              <p className="mb-6 text-xs text-muted-foreground">
                Our team has been notified and we're working on a fix. Please try reloading the page or contact support
                if the issue persists.
              </p>
              <div className="flex gap-3">
                <Button onClick={() => (window.location.href = "/")} variant="outline">
                  Go Home
                </Button>
                <Button onClick={this.handleReload}>Reload Page</Button>
              </div>
            </div>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
