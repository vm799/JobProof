"use client"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SettingsContent } from "@/components/settings-content"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function SettingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  let profile
  try {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()
    if (error) throw error
    profile = data
  } catch (error) {
    console.error("[v0] Profile fetch failed:", error)
    return <ErrorState message="Unable to load profile" />
  }

  if (!profile?.current_workspace_id) {
    redirect("/onboarding")
  }

  let workspace
  try {
    const { data, error } = await supabase
      .from("workspaces")
      .select("*")
      .eq("id", profile.current_workspace_id)
      .single()
    if (error) throw error
    workspace = data
  } catch (error) {
    console.error("[v0] Workspace fetch failed:", error)
    return <ErrorState message="Unable to load workspace" />
  }

  return <SettingsContent workspace={workspace} profile={profile} />
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <p className="text-muted-foreground">{message}</p>
      <Button variant="outline" onClick={() => window.location.reload()}>
        <RefreshCw className="mr-2 h-4 w-4" />
        Refresh Page
      </Button>
    </div>
  )
}
