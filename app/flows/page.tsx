import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard-layout"
import { FlowsList } from "@/components/flows-list"

export const dynamic = "force-dynamic"

export default async function FlowsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile?.current_workspace_id) {
    redirect("/onboarding")
  }

  // Fetch all flows with step counts and active client counts
  const { data: flows } = await supabase
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

  return (
    <DashboardLayout user={user} profile={profile}>
      <FlowsList flows={flows || []} workspaceId={profile.current_workspace_id} />
    </DashboardLayout>
  )
}
