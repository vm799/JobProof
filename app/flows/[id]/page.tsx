import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard-layout"
import { FlowBuilder } from "@/components/flow-builder"

export default async function FlowBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
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

  // Fetch flow with steps
  const { data: flow } = await supabase
    .from("onboarding_flows")
    .select(
      `
      *,
      onboarding_steps(*)
    `,
    )
    .eq("id", id)
    .eq("workspace_id", profile.current_workspace_id)
    .single()

  if (!flow) {
    redirect("/flows")
  }

  // Sort steps by order
  const sortedSteps = (flow.onboarding_steps || []).sort((a: any, b: any) => a.step_order - b.step_order)

  return (
    <DashboardLayout user={user} profile={profile}>
      <FlowBuilder flow={{ ...flow, onboarding_steps: sortedSteps }} />
    </DashboardLayout>
  )
}
