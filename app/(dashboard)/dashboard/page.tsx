"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { JobStatsCards } from "@/components/job-stats-cards"
import { RecentActivity } from "@/components/recent-activity"
import { ActiveJobsTable } from "@/components/active-jobs-table"
import { QuickActions } from "@/components/quick-actions"
import { OnboardingTour } from "@/components/onboarding-tour"
import { HelpButton } from "@/components/help-button"
import { WelcomeVideoModal } from "@/components/welcome-video-modal"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const isFetching = useRef(false)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)

  const fetchData = useCallback(async () => {
    if (isFetching.current) return
    isFetching.current = true

    try {
      const supabase = createClient()

      // 1. Auth Check
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        router.push("/auth/login")
        return
      }

      // 2. Fetch Profile with Retry Logic
      let { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single()

      if (!profile) {
        console.log("[v0] Profile not found yet, retrying in 2 seconds...")
        await new Promise((resolve) => setTimeout(resolve, 2000))

        const { data: retryProfile, error: retryError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()

        profile = retryProfile
        profileError = retryError
      }

      if (profileError || !profile) {
        console.log("[v0] Redirecting to dashboard - Profile truly missing")
        router.push("/dashboard")
        return
      }

      // 3. Check workspace ID - if missing, redirect to dashboard setup
      if (!profile.current_workspace_id) {
        console.log("[v0] No workspace found, redirecting to dashboard...")
        router.push("/dashboard")
        return
      }

      // 4. Fetch Workspace
      const { data: workspace, error: wsError } = await supabase
        .from("workspaces")
        .select("*")
        .eq("id", profile.current_workspace_id)
        .single()

      if (wsError || !workspace) {
        router.push("/dashboard")
        return
      }

      // 5. Fetch Activity
      const { data: activity } = await supabase
        .from("activity_logs")
        .select("*")
        .eq("workspace_id", workspace.id)
        .order("created_at", { ascending: false })
        .limit(10)

      // 6. Updated copy: "Welcome to" dashboard, removed "onboarding" terminology
      setData({
        user: session.user,
        profile,
        workspace,
        stats: { activeJobs: 0, totalSites: 0, completedThisMonth: 0 },
        recentActivity: activity || [],
        shouldShowWelcomeVideo: workspace.welcome_video_url && !profile.has_seen_welcome_video,
      })

      setError(null)
    } catch (err: any) {
      console.error("[v0] Dashboard Load Error:", err)
      setError(err.message)
    } finally {
      setLoading(false)
      isFetching.current = false
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
        <p className="text-red-500 font-medium">Something went wrong: {error}</p>
        <Button variant="outline" onClick={() => fetchData()}>
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
          <h1 className="text-3xl font-semibold">Welcome to {data.workspace.name}</h1>
          <p className="text-muted-foreground">{data.profile.name || data.profile.email} - JobProof Dashboard</p>
        </div>

        <JobStatsCards workspaceId={data.workspace.id} />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ActiveJobsTable workspaceId={data.workspace.id} />
          </div>
          <div className="space-y-6">
            <RecentActivity activities={data.recentActivity} />
            <QuickActions workspaceId={data.workspace.id} />
          </div>
        </div>
      </div>
    </>
  )
}
