"use client"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { TemplatesLibrary } from "@/components/templates-library"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function TemplatesPage() {
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

  let templates: any[] = []
  try {
    const { data, error } = await supabase
      .from("flow_templates")
      .select(
        `
        id,
        name,
        description,
        category,
        is_public,
        flow_template_steps(
          id,
          title,
          description,
          order_index
        )
      `,
      )
      .or(`is_public.eq.true,workspace_id.eq.${profile.current_workspace_id}`)
      .order("created_at", { ascending: false })
    if (error) throw error
    templates = data || []
  } catch (error) {
    console.error("[v0] Templates fetch failed:", error)
    templates = []
  }

  return <TemplatesLibrary templates={templates} workspaceId={profile.current_workspace_id} />
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
