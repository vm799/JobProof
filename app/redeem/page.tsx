import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { RedeemContent } from "@/components/redeem-content"

export const dynamic = "force-dynamic"

export default async function RedeemPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: member } = await supabase
    .from("workspace_members")
    .select("workspace_id, workspaces!inner(id, name, plan_tier)")
    .eq("user_id", user.id)
    .single()

  if (!member) {
    redirect("/onboarding")
  }

  const workspace = member.workspaces

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("workspace_id", workspace.id)
    .single()

  const { data: licenses } = await supabase
    .from("appsumo_licenses")
    .select("*")
    .eq("workspace_id", workspace.id)
    .order("redeemed_at", { ascending: false })

  return <RedeemContent workspace={workspace} subscription={subscription} licenses={licenses || []} />
}
