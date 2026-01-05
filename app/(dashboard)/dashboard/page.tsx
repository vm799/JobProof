"use client"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { StatsCards } from "@/components/stats-cards"
import { RecentActivity } from "@/components/recent-activity"
import { ClientProgressTable } from "@/components/client-progress-table"
import { QuickActions } from "@/components/quick-actions"
import { HelpButton } from "@/components/help-button"
import { OnboardingTour } from "@/components/onboarding-tour"
import { WorkspaceLoader } from "@/components/workspace-loader"
import { WelcomeVideoModal } from "@/components/welcome-video-modal"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

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
    return <ErrorState message="Unable to load profile" />
  }

  if (!profile?.current_workspace_id) {
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
    <>
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
    </>
  )
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
