import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard-layout"
import { TeamContent } from "@/components/team-content"

export default async function TeamPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, workspaces!current_workspace_id(*)")
    .eq("id", user.id)
    .single()

  if (!profile?.current_workspace_id) {
    redirect("/onboarding")
  }

  // Get workspace members
  const { data: members } = await supabase
    .from("workspace_members")
    .select(
      `
      id,
      role,
      created_at,
      profiles!inner(id, email, name)
    `,
    )
    .eq("workspace_id", profile.current_workspace_id)

  return (
    <DashboardLayout user={user} profile={profile}>
      <TeamContent workspaceId={profile.current_workspace_id} members={members || []} currentUserId={user.id} />
    </DashboardLayout>
  )
}
