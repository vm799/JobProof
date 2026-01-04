import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const checks = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    checks: {
      database: false,
      auth: false,
    },
  }

  try {
    // Check database connection
    const supabase = await createClient()
    const { error: dbError } = await supabase.from("workspaces").select("count").limit(1).single()
    checks.checks.database = !dbError

    // Check auth service
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    checks.checks.auth = !authError

    if (!checks.checks.database || !checks.checks.auth) {
      checks.status = "degraded"
    }
  } catch (error) {
    checks.status = "unhealthy"
  }

  return Response.json(checks, {
    status: checks.status === "healthy" ? 200 : checks.status === "degraded" ? 207 : 503,
  })
}
