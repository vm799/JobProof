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
  const currentUserId = useRef<string | null>(null)
  const isFetching = useRef(false)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)

  const fetchData = useCallback(async () => {
    // 1. Guard: Prevent double-fetching
    if (isFetching.current) return
    isFetching.current = true

    try {
      const supabase = createClient()

      // 2. Auth Check
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        router.push("/auth/login")
        return
      }

      currentUserId.current = user.id

      // 3. Fetch Profile AND Workspace in one go (Optimized)
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select(`
          *,
          workspaces!current_workspace_id (*)
        `)
        .eq("id", user.id)
        .single()

      if (profileError) throw new Error("Profile fetch failed")

      const workspace = profile?.workspaces

      // 4. Fetch Stats & Activity (Only if workspace exists)
      let stats = { activeOnboardings: 0, totalClients: 0, completedThisMonth: 0 }
      let recentActivity = []

      if (workspace) {
        const { count: clientsCount } = await supabase
          .from("clients")
          .select("id", { count: "exact" })
          .eq("workspace_id", workspace.id)

        const { data: activity } = await supabase
          .from("activity_logs")
          .select("*")
          .eq("workspace_id", workspace.id)
          .order("created_at", { ascending: false })
          .limit(10)
        
        recentActivity = activity || []
        stats.totalClients = clientsCount || 0
      }

      // 5. Set State ONCE
      setData({
        user,
        profile,
        workspace,
        stats,
        recentActivity,
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
  }, [router]) // REMOVED 'data' from here - this stops the infinite loop

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <Skeleton className="h-12 w-1/4" />
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
        <p className="text-red-500 font-medium">{error}</p>
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

      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {data?.profile?.email || data?.user?.email}
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
