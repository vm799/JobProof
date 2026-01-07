import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { JobAnalyticsDashboard } from "@/components/job-analytics-dashboard"

export const dynamic = "force-dynamic"

export default async function AnalyticsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("current_workspace_id").eq("id", user.id).single()

  if (!profile?.current_workspace_id) {
    redirect("/dashboard")
  }

  const { data: jobs } = await supabase
    .from("client_onboardings")
    .select("*")
    .eq("workspace_id", profile.current_workspace_id)
    .order("created_at", { ascending: false })

  const { data: activities } = await supabase
    .from("onboarding_activities")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100)

  return (
    <div className="p-8">
      <Suspense fallback={<div>Loading analytics...</div>}>
        <JobAnalyticsDashboard jobs={jobs || []} activities={activities || []} />
      </Suspense>
    </div>
  )
}
