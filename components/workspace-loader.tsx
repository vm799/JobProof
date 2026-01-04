"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function WorkspaceLoader() {
  const [error, setError] = useState<string | null>(null)
  const [isChecking, setIsChecking] = useState(true)
  const [timeoutReached, setTimeoutReached] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    let pollCount = 0
    const maxPolls = 20 // 10 seconds max (500ms * 20)
    let mounted = true

    const checkWorkspace = async () => {
      if (!mounted) return

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push("/auth/login")
          return
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("current_workspace_id")
          .eq("id", user.id)
          .single()

        if (profileError) {
          console.error("[v0] Profile fetch error:", profileError)
          setError("Failed to load workspace. Please try again.")
          setIsChecking(false)
          setTimeoutReached(true)
          return
        }

        if (profile?.current_workspace_id) {
          if (mounted) {
            router.push("/dashboard")
            router.refresh()
          }
        } else {
          pollCount++
          if (pollCount < maxPolls) {
            setTimeout(checkWorkspace, 500)
          } else {
            setError("Workspace setup is taking longer than expected.")
            setIsChecking(false)
            setTimeoutReached(true)
          }
        }
      } catch (err) {
        console.error("[v0] Workspace check error:", err)
        setError("An unexpected error occurred.")
        setIsChecking(false)
        setTimeoutReached(true)
      }
    }

    checkWorkspace()

    return () => {
      mounted = false
    }
  }, [router, supabase])

  const handleRetry = () => {
    setError(null)
    setIsChecking(true)
    setTimeoutReached(false)
    window.location.reload()
  }

  const handleForceDashboard = () => {
    router.push("/dashboard")
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Image
              src="/boardingpass-logo.png"
              alt="BoardingPass"
              width={120}
              height={120}
              className="h-24 w-24 object-contain"
              priority
            />
          </div>
          <CardTitle className="text-2xl font-semibold">
            {error ? "Setup Issue" : "Setting up your workspace"}
          </CardTitle>
          <CardDescription>
            {error
              ? "We encountered a problem setting up your workspace."
              : "Creating your BoardingPass workspace. This will only take a moment."}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {error ? (
            <>
              <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive mb-4">{error}</div>
              <div className="flex flex-col gap-2">
                <Button onClick={handleRetry} className="w-full">
                  Retry Setup
                </Button>
                <Button onClick={handleForceDashboard} variant="outline" className="w-full bg-transparent">
                  Go to Dashboard Anyway
                </Button>
                <Button onClick={handleLogout} variant="ghost" className="w-full text-muted-foreground">
                  Log Out
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Still having issues? Contact{" "}
                <a href="mailto:admin@getboardingpass.app" className="text-primary hover:underline">
                  admin@getboardingpass.app
                </a>
              </p>
            </>
          ) : (
            <>
              <div className="mb-6 flex justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
              <p className="text-sm text-muted-foreground">
                {isChecking ? "Creating workspace and setting up your account..." : "Loading dashboard..."}
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
