import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { createServerClient } from "@/lib/supabase/server"

export const metadata = {
  title: "Analytics - BoardingPass",
  description: "Track onboarding performance and client engagement",
}

export const dynamic = "force-dynamic"

export default async function AnalyticsPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: workspaceMember } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", user.id)
    .single()

  if (!workspaceMember) {
    return null
  }

  // Get analytics data
  const { data: onboardings } = await supabase
    .from("client_onboardings")
    .select(
      `
      *,
      flow:flows(*),
      client:clients(*)
    `,
    )
    .eq("workspace_id", workspaceMember.workspace_id)

  const { data: activities } = await supabase
    .from("activities")
    .select("*")
    .eq("workspace_id", workspaceMember.workspace_id)
    .order("created_at", { ascending: false })
    .limit(100)

  return <AnalyticsDashboard onboardings={onboardings || []} activities={activities || []} />
}
