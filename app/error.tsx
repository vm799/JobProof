"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[v0] Application error:", error)
  }, [error])

  const handleClearAndLogin = async () => {
    console.log("[v0] Error page - Clearing session and redirecting to login")
    if (typeof window !== "undefined") {
      localStorage.clear()
      sessionStorage.clear()
    }
    const supabase = createClient()
    await supabase?.auth.signOut()
    window.location.href = "/auth/login"
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <h1 className="mb-2 text-2xl font-semibold">Something went wrong</h1>
          <p className="mb-6 text-muted-foreground">
            {error.message || "An unexpected error occurred. Please try again."}
          </p>
          <div className="flex flex-col gap-3 w-full">
            <Button asChild>
              <Link href="/dashboard">Reload Page</Link>
            </Button>
            <Button variant="outline" onClick={handleClearAndLogin}>
              Clear Session & Login
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
