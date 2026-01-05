import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StatsCards } from "@/components/stats-cards"
import { RecentActivity } from "@/components/recent-activity"
import { ClientProgressTable } from "@/components/client-progress-table"
import { QuickActions } from "@/components/quick-actions"
import { HelpButton } from "@/components/help-button"
import { OnboardingTour } from "@/components/onboarding-tour"
import { WorkspaceLoader } from "@/components/workspace-loader"
import { WelcomeVideoModal } from "@/components/welcome-video-modal"
import { DashboardSkeleton } from "@/components/loading-skeleton"
import { Suspense } from "react"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile?.current_workspace_id) {
    return <WorkspaceLoader />
  }

  // Fetch workspace separately
  const { data: workspace } = await supabase
    .from("workspaces")
    .select("*")
    .eq("id", profile.current_workspace_id)
    .single()

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent user={user} profile={profile} workspace={workspace} />
    </Suspense>
  )
}

async function DashboardContent({
  user,
  profile,
  workspace,
}: {
  user: any
  profile: any
  workspace: any
}) {
  const supabase = await createClient()

  // Get workspace stats
  const [clientsResult, onboardingsResult, activityResult] = await Promise.all([
    supabase.from("clients").select("id", { count: "exact" }).eq("workspace_id", profile.current_workspace_id),
    supabase
      .from("client_onboardings")
      .select("id, status, created_at, client_id, clients!inner(workspace_id)", { count: "exact" })
      .eq("clients.workspace_id", profile.current_workspace_id),
    supabase
      .from("activity_logs")
      .select("*")
      .eq("workspace_id", profile.current_workspace_id)
      .order("created_at", { ascending: false })
      .limit(10),
  ])

  const totalClients = clientsResult.count || 0
  const allOnboardings = onboardingsResult.data || []
  const activeOnboardings = allOnboardings.filter((o) => o.status === "in_progress").length

  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const completedThisMonth = allOnboardings.filter((o) => {
    if (o.status !== "completed") return false
    const createdDate = new Date(o.created_at)
    return createdDate >= firstDayOfMonth
  }).length

  const recentActivity = activityResult.data || []

  const shouldShowWelcomeVideo = workspace?.welcome_video_url && !profile.has_seen_welcome_video

  return (
    <DashboardLayout user={user} profile={profile}>
      {shouldShowWelcomeVideo && (
        <WelcomeVideoModal videoUrl={workspace.welcome_video_url} workspaceName={workspace.name} userId={user.id} />
      )}
      <OnboardingTour />
      <HelpButton />
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-balance text-3xl font-semibold tracking-tight">Dashboard</h1>
            <p className="mt-1 text-muted-foreground">Welcome back, {profile?.name || user.email}</p>
          </div>
        </div>

        <StatsCards
          stats={{
            activeOnboardings,
            totalClients,
            completedThisMonth,
          }}
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <ClientProgressTable workspaceId={profile.current_workspace_id} />
          </div>
          <div className="space-y-6">
            <RecentActivity activities={recentActivity} />
            <QuickActions workspaceId={profile.current_workspace_id} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
