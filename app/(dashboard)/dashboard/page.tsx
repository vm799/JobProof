import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { StatsCards } from "@/components/stats-cards"
import { RecentActivity } from "@/components/recent-activity"
import { ClientProgressTable } from "@/components/client-progress-table"
import { QuickActions } from "@/components/quick-actions"
import { DashboardClientWrapper } from "@/components/dashboard-client-wrapper"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function DashboardPage() {
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
    return (
      <DashboardClientWrapper showError errorMessage="Unable to load profile">
        <div />
      </DashboardClientWrapper>
    )
  }

  if (!profile?.current_workspace_id) {
    const { WorkspaceLoader } = await import("@/components/workspace-loader")
    return <WorkspaceLoader />
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
    workspace = null
  }

  let clientsCount = 0
  let onboardings: any[] = []
  let recentActivity: any[] = []

  try {
    const { count, error } = await supabase
      .from("clients")
      .select("id", { count: "exact" })
      .eq("workspace_id", profile.current_workspace_id)
    if (error) throw error
    clientsCount = count || 0
  } catch (error) {
    console.error("[v0] Clients count failed:", error)
  }

  try {
    const { data, error } = await supabase
      .from("client_onboardings")
      .select("id, status, created_at, client_id, clients!inner(workspace_id)")
      .eq("clients.workspace_id", profile.current_workspace_id)
    if (error) throw error
    onboardings = data || []
  } catch (error) {
    console.error("[v0] Onboardings fetch failed:", error)
  }

  try {
    const { data, error } = await supabase
      .from("activity_logs")
      .select("*")
      .eq("workspace_id", profile.current_workspace_id)
      .order("created_at", { ascending: false })
      .limit(10)
    if (error) throw error
    recentActivity = data || []
  } catch (error) {
    console.error("[v0] Activity logs failed:", error)
  }

  const activeOnboardings = onboardings.filter((o) => o.status === "in_progress").length
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const completedThisMonth = onboardings.filter((o) => {
    if (o.status !== "completed") return false
    const createdDate = new Date(o.created_at)
    return createdDate >= firstDayOfMonth
  }).length

  const shouldShowWelcomeVideo = workspace?.welcome_video_url && !profile.has_seen_welcome_video

  return (
    <DashboardClientWrapper
      shouldShowWelcomeVideo={shouldShowWelcomeVideo}
      welcomeVideoUrl={workspace?.welcome_video_url}
      workspaceName={workspace?.name}
      userId={user.id}
    >
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
            totalClients: clientsCount,
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
    </DashboardClientWrapper>
  )
}
