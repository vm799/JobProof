import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { FlowBuilder } from "@/components/flow-builder"

export const dynamic = "force-dynamic"

export default async function FlowDetailsPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch flow data
  const { data: flow, error } = await supabase
    .from("onboarding_flows")
    .select("*, onboarding_flow_steps(*)")
    .eq("id", params.id)
    .single()

  if (error || !flow) {
    notFound()
  }

  return (
    <div className="p-8">
      <FlowBuilder flow={flow} />
    </div>
  )
}
