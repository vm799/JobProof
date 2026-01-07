"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, CheckCircle, Clock, MapPin } from "lucide-react"

interface JobStatsCardsProps {
  workspaceId: string
}

export function JobStatsCards({ workspaceId }: JobStatsCardsProps) {
  const [stats, setStats] = useState({
    activeJobs: 0,
    completedToday: 0,
    pendingProofs: 0,
    activeSites: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient()

      // Active jobs (onboardings with 'in_progress' status)
      const { count: activeJobs } = await supabase
        .from("client_onboardings")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspaceId)
        .eq("status", "in_progress")

      // Completed today (onboardings marked 'completed' today)
      const today = new Date().toISOString().split("T")[0]
      const { count: completedToday } = await supabase
        .from("client_onboardings")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspaceId)
        .eq("status", "completed")
        .gte("updated_at", today)

      // Pending proofs (onboarding_step_completions with media but not verified)
      const { count: pendingProofs } = await supabase
        .from("onboarding_step_completions")
        .select("*", { count: "exact", head: true })
        .not("media_url", "is", null)
        .eq("verified", false)

      // Active sites (clients table)
      const { count: activeSites } = await supabase
        .from("clients")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspaceId)

      setStats({
        activeJobs: activeJobs || 0,
        completedToday: completedToday || 0,
        pendingProofs: pendingProofs || 0,
        activeSites: activeSites || 0,
      })
      setLoading(false)
    }

    fetchStats()
  }, [workspaceId])

  const cards = [
    {
      title: "Active Jobs",
      value: stats.activeJobs,
      icon: Briefcase,
      description: "Jobs in progress",
    },
    {
      title: "Completed Today",
      value: stats.completedToday,
      icon: CheckCircle,
      description: "Jobs finished today",
    },
    {
      title: "Pending Proofs",
      value: stats.pendingProofs,
      icon: Clock,
      description: "Awaiting verification",
    },
    {
      title: "Active Sites",
      value: stats.activeSites,
      icon: MapPin,
      description: "Total job sites",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
