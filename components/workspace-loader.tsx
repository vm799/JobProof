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
  const [isCreating, setIsCreating] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    let pollCount = 0
    const maxPolls = 10 // Reduced from 30 to 10 (5 seconds)
    let mounted = true

    const createWorkspace = async (userId: string, userEmail: string) => {
      console.log("[v0] WorkspaceLoader - Auto-creating workspace for user:", userId)
      setIsCreating(true)

      try {
        const workspaceSlug = `workspace-${userEmail.split("@")[0]}-${Date.now()}`

        const { data: newWorkspace, error: workspaceError } = await supabase
          .from("workspaces")
          .insert({
            name: "My First Workspace",
            slug: workspaceSlug,
            owner_id: userId,
          })
          .select()
          .single()

        if (workspaceError) {
          console.error("[v0] WorkspaceLoader - Failed to create workspace:", workspaceError)
          throw new Error("Failed to create workspace")
        }

        console.log("[v0] WorkspaceLoader - Workspace created:", newWorkspace.id)

        // Create workspace member
        const { error: memberError } = await supabase.from("workspace_members").insert({
          workspace_id: newWorkspace.id,
          user_id: userId,
          role: "owner",
        })

        if (memberError) {
          console.error("[v0] WorkspaceLoader - Failed to create member:", memberError)
        }

        // Update profile
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ current_workspace_id: newWorkspace.id })
          .eq("id", userId)

        if (profileError) {
          console.error("[v0] WorkspaceLoader - Failed to update profile:", profileError)
          throw new Error("Failed to link workspace to profile")
        }

        console.log("[v0] WorkspaceLoader - Workspace setup complete! Redirecting...")

        // Force clean redirect
        window.location.href = "/dashboard"
      } catch (err) {
        console.error("[v0] WorkspaceLoader - Error creating workspace:", err)
        setError("Failed to create your workspace. Please contact support.")
        setIsCreating(false)
      }
    }

    const checkWorkspace = async () => {
      if (!mounted) return

      try {
        console.log("[v0] WorkspaceLoader - Checking workspace, attempt:", pollCount + 1)

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError || !user) {
          console.error("[v0] WorkspaceLoader - No user, redirecting to login")
          window.location.href = "/auth/login"
          return
        }

        console.log("[v0] WorkspaceLoader - User found:", user.id)

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("current_workspace_id")
          .eq("id", user.id)
          .single()

        if (profileError) {
          console.error("[v0] WorkspaceLoader - Profile error:", profileError.message)

          if (profileError.code === "PGRST116") {
            // Profile doesn't exist - create it and a workspace
            console.log("[v0] WorkspaceLoader - No profile found, creating workspace...")

            // First create profile
            const { error: createProfileError } = await supabase.from("profiles").insert({
              id: user.id,
              email: user.email,
            })

            if (createProfileError) {
              console.error("[v0] WorkspaceLoader - Failed to create profile:", createProfileError)
            }

            await createWorkspace(user.id, user.email!)
            return
          }

          setError("Failed to load your account. Please try again.")
          setIsChecking(false)
          return
        }

        console.log("[v0] WorkspaceLoader - Profile workspace ID:", profile?.current_workspace_id)

        if (profile?.current_workspace_id) {
          console.log("[v0] WorkspaceLoader - Workspace exists! Redirecting to dashboard...")
          window.location.href = "/dashboard"
        } else {
          pollCount++
          setAttempts(pollCount)
          console.log("[v0] WorkspaceLoader - No workspace yet, attempt", pollCount, "of", maxPolls)

          if (pollCount < maxPolls) {
            setTimeout(checkWorkspace, 500)
          } else {
            console.log("[v0] WorkspaceLoader - Timeout reached, creating workspace automatically...")
            await createWorkspace(user.id, user.email!)
          }
        }
      } catch (err) {
        console.error("[v0] WorkspaceLoader - Unexpected error:", err)
        setError("An unexpected error occurred. Please try again.")
        setIsChecking(false)
      }
    }

    checkWorkspace()

    return () => {
      mounted = false
    }
  }, [router, supabase])

  const handleLogout = async () => {
    console.log("[v0] WorkspaceLoader - User logging out")
    await supabase.auth.signOut()
    window.location.href = "/auth/login"
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
            {error ? "Setup Issue" : isCreating ? "Creating your workspace" : "Loading your workspace"}
          </CardTitle>
          <CardDescription>
            {error
              ? "We encountered a problem setting up your workspace."
              : isCreating
                ? "Setting up your workspace for the first time..."
                : "This will only take a moment."}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {error ? (
            <>
              <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive mb-4">{error}</div>
              <Button onClick={handleLogout} variant="outline" className="w-full bg-transparent">
                Back to Login
              </Button>
              <p className="text-xs text-muted-foreground mt-4">
                Need help? Contact{" "}
                <a
                  href="mailto:admin@getboardingpass.app?subject=Workspace Setup Failed"
                  className="text-primary hover:underline"
                >
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
                {isCreating ? "Setting up your workspace..." : `Checking workspace... (${attempts + 1}/10)`}
              </p>
              <div className="text-xs text-muted-foreground mt-2">
                {isCreating ? "Creating your first workspace" : "Usually takes 2-3 seconds"}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
