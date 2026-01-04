import { createClient } from "@/lib/supabase/server"
import { cached } from "@/lib/cache/redis"

export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: profile } = await supabase.from("profiles").select("current_workspace_id").eq("id", user.id).single()

  if (!profile?.current_workspace_id) {
    return Response.json({ error: "No workspace found" }, { status: 404 })
  }

  const analytics = await cached(
    `analytics:${profile.current_workspace_id}`,
    async () => {
      // Fetch analytics data
      const { data: onboardings } = await supabase
        .from("client_onboardings")
        .select(
          `
        id,
        status,
        created_at,
        completed_at,
        client_step_progress(id, status, updated_at),
        clients!inner(workspace_id)
      `,
        )
        .eq("clients.workspace_id", profile.current_workspace_id)

      // Calculate metrics
      const total = onboardings?.length || 0
      const completed = onboardings?.filter((o) => o.status === "completed").length || 0
      const inProgress = onboardings?.filter((o) => o.status === "in_progress").length || 0
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

      // Calculate average time to complete
      const completedOnboardings = onboardings?.filter((o) => o.completed_at) || []
      const avgTime =
        completedOnboardings.length > 0
          ? completedOnboardings.reduce((sum, o) => {
              const start = new Date(o.created_at).getTime()
              const end = new Date(o.completed_at!).getTime()
              return sum + (end - start) / (1000 * 60 * 60 * 24) // days
            }, 0) / completedOnboardings.length
          : 0

      return {
        total,
        completed,
        inProgress,
        completionRate,
        avgTimeToComplete: Math.round(avgTime * 10) / 10,
      }
    },
    3600,
  ) // Cache for 1 hour

  return Response.json(analytics)
}
