import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard-layout"
import { BillingContent } from "@/components/billing-content"

export default async function BillingPage() {
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

  // Fetch subscription data
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("workspace_id", profile.current_workspace_id)
    .single()

  // Get usage stats
  const [onboardingsCount, flowsCount, membersCount] = await Promise.all([
    supabase
      .from("client_onboardings")
      .select("id", { count: "exact" })
      .eq("status", "in_progress")
      .in("client_id", supabase.from("clients").select("id").eq("workspace_id", profile.current_workspace_id)),
    supabase.from("onboarding_flows").select("id", { count: "exact" }).eq("workspace_id", profile.current_workspace_id),
    supabase
      .from("workspace_members")
      .select("id", { count: "exact" })
      .eq("workspace_id", profile.current_workspace_id),
  ])

  const usage = {
    activeOnboardings: onboardingsCount.count || 0,
    customFlows: flowsCount.count || 0,
    teamMembers: membersCount.count || 0,
  }

  return (
    <DashboardLayout user={user} profile={profile}>
      <BillingContent subscription={subscription} usage={usage} workspaceId={profile.current_workspace_id} />
    </DashboardLayout>
  )
}
