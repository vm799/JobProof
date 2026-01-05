import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"

export const dynamic = "force-dynamic"

export default async function AnalyticsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: onboardings } = await supabase
    .from("client_onboardings")
    .select("*")
    .order("created_at", { ascending: false })

  const { data: activities } = await supabase
    .from("onboarding_activities")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100)

  return (
    <div className="p-8">
      <Suspense fallback={<div>Loading analytics...</div>}>
        <AnalyticsDashboard onboardings={onboardings || []} activities={activities || []} />
      </Suspense>
    </div>
  )
}
