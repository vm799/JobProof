import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { TechnicianJobView } from "@/components/technician-job-view"

export const dynamic = "force-dynamic"

export default async function TechnicianJobPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { token?: string }
}) {
  const supabase = await createClient()

  // Verify token if provided
  if (searchParams.token) {
    const { data: tokenCheck } = await supabase
      .from("client_onboardings")
      .select("*")
      .eq("id", params.id)
      .eq("access_token", searchParams.token)
      .single()

    if (!tokenCheck) {
      notFound()
    }
  }

  // Fetch job with all details
  const { data: job, error } = await supabase
    .from("client_onboardings")
    .select(`
      *,
      client:clients(*),
      flow:onboarding_flows(
        *,
        steps:onboarding_flow_steps(*)
      ),
      progress:client_step_progress(*)
    `)
    .eq("id", params.id)
    .single()

  if (error || !job) {
    notFound()
  }

  return <TechnicianJobView job={job} />
}
