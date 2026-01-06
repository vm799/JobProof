"use client"

import { useEffect, useState, useRef, useCallback } from "react"
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
  const hasInitialized = useRef(false)
  const isFetching = useRef(false)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)

  const fetchData = useCallback(async () => {
    if (isFetching.current) return
    isFetching.current = true

    try {
      const supabase = createClient()

      // 1. Auth Check using getSession (More stable for redirects)
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push("/auth/login")
        return
      }

      const user = session.user

      // 2. Fetch Profile and Workspace separately to avoid complex join errors
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (profileError) throw new Error("Profile fetch failed")

      let workspace = null
      if (profile.current_workspace_id) {
        const { data: wsData } = await supabase
          .from("workspaces")
          .select("*")
          .eq("id", profile.current_workspace_id)
          .single()
        workspace = wsData
      }

      // 3. Fetch Recent Activity
      const { data: activity } = await supabase
        .from("activity_logs")
        .select("*")
        .eq("workspace_id", profile.current_workspace_id)
        .order("created_at", { ascending: false })
        .limit(10)

      setData({
        user,
        profile,
        workspace,
        stats: { activeOnboardings: 0, totalClients: 0, completedThisMonth: 0 },
        recentActivity: activity || [],
        shouldShowWelcomeVideo: workspace?.welcome_video_url && !profile.has_seen_welcome_video,
      })
      
      setError(null)
    } catch (err: any) {
      console.error("Dashboard error:", err)
      setError(err.message)
    } finally {
      setLoading(false)
      isFetching.current = false
      hasInitialized.current = true
    }
  }, [router])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) {
    return (
      <div className="flex flex-col gap-6 p-8">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-red-500 font-medium">Error: {error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RefreshCw className="mr-2 h-4 w-4" /> Try Again
        </Button>
      </div>
    )
  }

  return (
    <>
      {data?.shouldShowWelcomeVideo && (
        <WelcomeVideoModal
          videoUrl={data.workspace.welcome_video_url}
          workspaceName={data.workspace.name}
          userId={data.user.id}
        />
      )}
      <OnboardingTour />
      <HelpButton />

      <div className="flex flex-col gap-6 p-4">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {data?.profile?.name || data?.user?.email}
          </p>
        </div>

        <StatsCards stats={data?.stats} />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ClientProgressTable workspaceId={data?.profile?.current_workspace_id} />
          </div>
          <div className="space-y-6">
            <RecentActivity activities={data?.recentActivity} />
            <QuickActions workspaceId={data?.profile?.current_workspace_id} />
          </div>
        </div>
      </div>
    </>
  )
}
