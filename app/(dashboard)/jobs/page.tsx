import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { JobsScheduler } from "@/components/jobs-scheduler"

export const dynamic = "force-dynamic"

export default async function JobsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: jobs } = await supabase
    .from("client_onboardings")
    .select(`
      *,
      client:clients(name, email),
      assigned_to:profiles(full_name, email)
    `)
    .order("created_at", { ascending: false })

  const { data: sites } = await supabase.from("clients").select("*").order("name")

  const { data: technicians } = await supabase.from("profiles").select("*").order("full_name")

  const { data: templates } = await supabase.from("onboarding_flows").select("*").order("name")

  return (
    <div className="p-8">
      <JobsScheduler
        jobs={jobs || []}
        sites={sites || []}
        technicians={technicians || []}
        templates={templates || []}
      />
    </div>
  )
}
