import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { OperationsMonitor } from "@/components/admin/operations-monitor"
import { requireRole } from "@/lib/rbac"

export const dynamic = "force-dynamic"

export default async function OperationsPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options)
        })
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase.from("profiles").select("current_workspace_id").eq("id", user.id).single()

  if (!profile?.current_workspace_id) redirect("/onboarding")

  await requireRole(["admin"], profile.current_workspace_id)

  // Fetch real-time operations data
  const { data: liveJobs } = await supabase
    .from("client_onboardings")
    .select(`*, assigned_to:profiles(full_name)`)
    .eq("workspace_id", profile.current_workspace_id)
    .eq("status", "in_progress")

  const { data: recentProofs } = await supabase
    .from("proofs")
    .select(`*, uploaded_by:profiles(full_name), job:client_onboardings(name)`)
    .eq("workspace_id", profile.current_workspace_id)
    .order("created_at", { ascending: false })
    .limit(10)

  const { data: teamLocations } = await supabase
    .from("profiles")
    .select("*")
    .eq("workspace_id", profile.current_workspace_id)
    .eq("role", "field_worker")

  return (
    <OperationsMonitor
      liveJobs={liveJobs || []}
      recentProofs={recentProofs || []}
      teamLocations={teamLocations || []}
    />
  )
}
