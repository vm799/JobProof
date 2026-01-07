"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createJobSession(data: {
  siteId: string
  templateId: string
  dueDate: string
  technicianEmail: string
  siteName: string
}) {
  const supabase = await createClient()

  if (!data.templateId) {
    throw new Error("A job template/workflow is required to create a job")
  }

  // 1. Get current user & workspace
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data: profile } = await supabase.from("profiles").select("current_workspace_id").eq("id", user.id).single()

  if (!profile?.current_workspace_id) throw new Error("No workspace")

  // 2. Create job session (reuses client_onboardings table)
  const { data: job, error: jobError } = await supabase
    .from("client_onboardings")
    .insert({
      client_id: data.siteId,
      flow_id: data.templateId,
      due_date: data.dueDate,
      status: "pending",
      workspace_id: profile.current_workspace_id,
    })
    .select()
    .single()

  if (jobError) throw jobError

  // 3. Generate secure token (reuses existing function)
  const { data: tokenData, error: tokenError } = await supabase.rpc("regenerate_onboarding_token", {
    onboarding_id: job.id,
  })

  if (tokenError) throw tokenError

  const jobLink = `${process.env.NEXT_PUBLIC_SITE_URL}/portal/${tokenData}`

  // 4. Send email to technician (reuses existing email system)
  await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/send-job-link`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: data.technicianEmail,
      jobLink,
      siteName: data.siteName,
    }),
  })

  revalidatePath("/dashboard")
  revalidatePath("/sites")
  revalidatePath(`/sites/${data.siteId}`)

  return { success: true, jobId: job.id, jobLink }
}

export async function completeJob(jobId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("client_onboardings")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
    })
    .eq("id", jobId)
    .select()
    .single()

  if (error) throw error

  revalidatePath("/dashboard")
  revalidatePath(`/portal/${data.onboarding_link_token}`)

  return { success: true }
}
