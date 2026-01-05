import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ClientsList } from "@/components/clients-list"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ClientsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user's profile with workspace
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile?.current_workspace_id) {
    redirect("/onboarding")
  }

  // Fetch all clients with their onboarding data
  const { data: clients } = await supabase
    .from("clients")
    .select(
      `
      id,
      name,
      email,
      created_at,
      client_onboardings(
        id,
        status,
        created_at
      )
    `,
    )
    .eq("workspace_id", profile.current_workspace_id)
    .order("created_at", { ascending: false })
    .limit(50)

  return (
    <DashboardLayout user={user} profile={profile}>
      <ClientsList clients={clients || []} workspaceId={profile.current_workspace_id} />
    </DashboardLayout>
  )
}
