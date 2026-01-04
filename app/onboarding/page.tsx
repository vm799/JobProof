"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function OnboardingPage() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    let pollCount = 0
    const maxPolls = 20 // 10 seconds max (500ms * 20)

    const checkWorkspace = async () => {
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
          setError("Failed to load workspace. Please refresh the page.")
          return
        }

        if (profile?.current_workspace_id) {
          router.push("/dashboard")
          router.refresh()
        } else {
          pollCount++
          if (pollCount < maxPolls) {
            setTimeout(checkWorkspace, 500)
          } else {
            setError(
              "Workspace creation is taking longer than expected. Please refresh the page or contact admin@getboardingpass.app for support.",
            )
          }
        }
      } catch (err) {
        console.error("[v0] Onboarding check error:", err)
        setError("An unexpected error occurred. Please refresh the page.")
      }
    }

    checkWorkspace()
  }, [router, supabase])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <CardTitle className="text-2xl font-semibold">
            {error ? "Setup Issue" : "Setting up your workspace"}
          </CardTitle>
          <CardDescription>
            {error
              ? "We encountered a problem setting up your workspace."
              : "We're creating your BoardingPass workspace. This will only take a moment."}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {error ? (
            <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">{error}</div>
          ) : (
            <>
              <div className="mb-6 flex justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
              <p className="text-sm text-muted-foreground">Creating your workspace and setting up your account...</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
