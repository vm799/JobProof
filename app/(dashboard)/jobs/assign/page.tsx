import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { JobAssignmentWizard } from "@/components/jobs/assignment-wizard"
import { requireRole } from "@/lib/rbac"

export const dynamic = "force-dynamic"

export default async function AssignJobPage() {
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

  await requireRole(["admin", "manager"], profile.current_workspace_id)

  // Fetch data for wizard
  const { data: sites } = await supabase.from("clients").select("*").order("name")

  const { data: templates } = await supabase.from("onboarding_flows").select("*").order("name")

  const { data: fieldWorkers } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "field_worker")
    .eq("workspace_id", profile.current_workspace_id)

  return (
    <JobAssignmentWizard
      sites={sites || []}
      templates={templates || []}
      fieldWorkers={fieldWorkers || []}
      workspaceId={profile.current_workspace_id}
    />
  )
}
