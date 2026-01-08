import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { FieldWorkerDashboard } from "@/components/field-worker/dashboard"

export const dynamic = "force-dynamic"

export default async function FieldWorkerPage() {
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

  const { data: profile } = await supabase
    .from("profiles")
    .select("current_workspace_id, role")
    .eq("id", user.id)
    .single()

  if (!profile?.current_workspace_id || profile.role !== "field_worker") {
    redirect("/dashboard")
  }

  // Fetch assigned jobs
  const { data: jobs } = await supabase
    .from("client_onboardings")
    .select(
      `
      *,
      site:clients(name, address),
      proofs(*)
    `,
    )
    .eq("assigned_to", user.id)
    .order("created_at", { ascending: false })

  return <FieldWorkerDashboard jobs={jobs || []} workspaceId={profile.current_workspace_id} />
}
