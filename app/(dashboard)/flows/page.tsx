"use client"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { JobTemplatesList } from "@/components/job-templates-list"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function FlowsPage() {
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
    redirect("/dashboard")
  }

  let flows: any[] = []
  try {
    const { data, error } = await supabase
      .from("onboarding_flows")
      .select(
        `
        id,
        name,
        description,
        status,
        created_at,
        onboarding_steps(id),
        client_onboardings(id, status)
      `,
      )
      .eq("workspace_id", profile.current_workspace_id)
      .order("created_at", { ascending: false })
    if (error) throw error
    flows = data || []
  } catch (error) {
    console.error("[v0] Flows fetch failed:", error)
    flows = []
  }

  return <JobTemplatesList templates={flows} workspaceId={profile.current_workspace_id} />
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
