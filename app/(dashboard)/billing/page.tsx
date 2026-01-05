import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { BillingContent } from "@/components/billing-content"

export const dynamic = "force-dynamic"

export default async function BillingPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("workspace_id").eq("id", user.id).single()

  const workspaceId = profile?.workspace_id

  if (!workspaceId) {
    redirect("/welcome")
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("workspace_id", workspaceId)
    .single()

  // Calculate usage
  const { data: onboardings } = await supabase
    .from("client_onboardings")
    .select("id")
    .eq("workspace_id", workspaceId)
    .eq("status", "active")

  const { data: flows } = await supabase.from("onboarding_flows").select("id").eq("workspace_id", workspaceId)

  const { data: members } = await supabase.from("workspace_members").select("id").eq("workspace_id", workspaceId)

  const usage = {
    activeOnboardings: onboardings?.length || 0,
    customFlows: flows?.length || 0,
    teamMembers: members?.length || 1,
  }

  return (
    <div className="p-8">
      <BillingContent subscription={subscription} usage={usage} workspaceId={workspaceId} />
    </div>
  )
}
