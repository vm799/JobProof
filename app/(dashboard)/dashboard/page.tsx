"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { StatsCards } from "@/components/stats-cards"
import { RecentActivity } from "@/components/recent-activity"
import { ClientProgressTable } from "@/components/client-progress-table"
import { QuickActions } from "@/components/quick-actions"
import { OnboardingTour } from "@/components/onboarding-tour"
import { HelpButton } from "@/components/help-button"
import { WelcomeVideoModal } from "@/components/welcome-video-modal"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        console.log("[v0] Dashboard: Starting data fetch")
        const supabase = createClient()

        // Check auth
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser()
        if (authError || !user) {
          console.log("[v0] Dashboard: No user, redirecting to login")
          router.push("/auth/login")
          return
        }

        // Fetch profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()

        if (profileError) {
          console.error("[v0] Profile fetch failed:", profileError)
          setError("Unable to load profile")
          setLoading(false)
          return
        }

        if (!profile?.current_workspace_id) {
          console.log("[v0] Dashboard: No workspace, showing loader")
          // Import and show workspace loader
          const { WorkspaceLoader } = await import("@/components/workspace-loader")
          setData({ showWorkspaceLoader: true })
          setLoading(false)
          return
        }

        // Fetch workspace
        const { data: workspace, error: workspaceError } = await supabase
          .from("workspaces")
          .select("*")
          .eq("id", profile.current_workspace_id)
          .single()

        if (workspaceError) {
          console.error("[v0] Workspace fetch failed:", workspaceError)
        }

        // Fetch clients count
        const { count: clientsCount, error: clientsError } = await supabase
          .from("clients")
          .select("id", { count: "exact" })
          .eq("workspace_id", profile.current_workspace_id)

        if (clientsError) {
          console.error("[v0] Clients count failed:", clientsError)
        }

        // Fetch onboardings
        const { data: onboardings, error: onboardingsError } = await supabase
          .from("client_onboardings")
          .select("id, status, created_at, client_id, clients!inner(workspace_id)")
          .eq("clients.workspace_id", profile.current_workspace_id)

        if (onboardingsError) {
          console.error("[v0] Onboardings fetch failed:", onboardingsError)
        }

        // Fetch activity
        const { data: recentActivity, error: activityError } = await supabase
          .from("activity_logs")
          .select("*")
          .eq("workspace_id", profile.current_workspace_id)
          .order("created_at", { ascending: false })
          .limit(10)

        if (activityError) {
          console.error("[v0] Activity logs failed:", activityError)
        }

        const activeOnboardings = (onboardings || []).filter((o: any) => o.status === "in_progress").length
        const now = new Date()
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const completedThisMonth = (onboardings || []).filter((o: any) => {
          if (o.status !== "completed") return false
          const createdDate = new Date(o.created_at)
          return createdDate >= firstDayOfMonth
        }).length

        setData({
          user,
          profile,
          workspace,
          stats: {
            activeOnboardings,
            totalClients: clientsCount || 0,
            completedThisMonth,
          },
          recentActivity: recentActivity || [],
          shouldShowWelcomeVideo: workspace?.welcome_video_url && !profile.has_seen_welcome_video,
        })
        setLoading(false)
        console.log("[v0] Dashboard: Data loaded successfully")
      } catch (err: any) {
        console.error("[v0] Dashboard fetch error:", err)
        setError(err.message || "Something went wrong")
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-64" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-muted-foreground">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Page
        </Button>
      </div>
    )
  }

  if (data?.showWorkspaceLoader) {
    const { WorkspaceLoader } = require("@/components/workspace-loader")
    return <WorkspaceLoader />
  }

  if (!data) {
    return null
  }

  return (
    <>
      {data.shouldShowWelcomeVideo && data.workspace?.welcome_video_url && (
        <WelcomeVideoModal
          videoUrl={data.workspace.welcome_video_url}
          workspaceName={data.workspace.name}
          userId={data.user.id}
        />
      )}
      <OnboardingTour />
      <HelpButton />

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-balance text-3xl font-semibold tracking-tight">Dashboard</h1>
            <p className="mt-1 text-muted-foreground">Welcome back, {data.profile?.name || data.user.email}</p>
          </div>
        </div>

        <StatsCards stats={data.stats} />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <ClientProgressTable workspaceId={data.profile.current_workspace_id} />
          </div>
          <div className="space-y-6">
            <RecentActivity activities={data.recentActivity} />
            <QuickActions workspaceId={data.profile.current_workspace_id} />
          </div>
        </div>
      </div>
    </>
  )
}
