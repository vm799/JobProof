import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard-layout"
import { SettingsContent } from "@/components/settings-content"

export default async function SettingsPage() {
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

  const workspace = profile.workspaces

  return (
    <DashboardLayout user={user} profile={profile}>
      <SettingsContent workspace={workspace} />
    </DashboardLayout>
  )
}
