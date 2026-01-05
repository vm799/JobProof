"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Loader2 } from "lucide-react"

export default function WelcomePage() {
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    console.log("[STATE-LOG] Welcome page - NEW_USER flow starting")
  }, [])

  const handleGetStarted = async () => {
    console.log("[STATE-LOG] Welcome - Creating workspace for new user")
    setIsCreating(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        console.error("[STATE-LOG] Welcome - No user found")
        router.push("/auth/login")
        return
      }

      // Create profile if it doesn't exist
      const { error: profileError } = await supabase.from("profiles").insert({
        id: user.id,
        email: user.email,
      })

      if (profileError && profileError.code !== "23505") {
        console.error("[STATE-LOG] Welcome - Profile creation error:", profileError)
      }

      // Create workspace
      const workspaceSlug = `workspace-${user.email?.split("@")[0]}-${Date.now()}`
      const { data: newWorkspace, error: workspaceError } = await supabase
        .from("workspaces")
        .insert({
          name: "My First Workspace",
          slug: workspaceSlug,
          owner_id: user.id,
        })
        .select()
        .single()

      if (workspaceError) {
        console.error("[STATE-LOG] Welcome - Workspace creation error:", workspaceError)
        throw new Error("Failed to create workspace")
      }

      console.log("[STATE-LOG] Welcome - Workspace created:", newWorkspace.id)

      // Create workspace member
      await supabase.from("workspace_members").insert({
        workspace_id: newWorkspace.id,
        user_id: user.id,
        role: "owner",
      })

      // Update profile
      await supabase.from("profiles").update({ current_workspace_id: newWorkspace.id }).eq("id", user.id)

      console.log("[STATE-LOG] Welcome - Setup complete → Redirect to dashboard")
      window.location.href = "/dashboard?onboarding=true"
    } catch (error) {
      console.error("[STATE-LOG] Welcome - Error:", error)
      setIsCreating(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mb-6 flex justify-center">
            <Image
              src="/boardingpass-logo.png"
              alt="BoardingPass"
              width={120}
              height={120}
              className="h-24 w-24 object-contain"
              priority
            />
          </div>
          <CardTitle className="text-3xl font-bold">Welcome to BoardingPass!</CardTitle>
          <CardDescription className="text-base mt-2">
            Let's set up your workspace and start onboarding clients seamlessly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-primary">1</span>
              </div>
              <p>Create custom onboarding flows for your clients</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-primary">2</span>
              </div>
              <p>Send branded portals and track progress in real-time</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-primary">3</span>
              </div>
              <p>Automate reminders and communications</p>
            </div>
          </div>

          <Button onClick={handleGetStarted} disabled={isCreating} className="w-full" size="lg">
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting up your workspace...
              </>
            ) : (
              "Get Started"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
