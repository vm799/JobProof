"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

async function verifyOnboardingAccess(onboardingId: string, workspaceId: string) {
  const supabase = await createClient()
  const { data: onboarding } = await supabase
    .from("client_onboardings")
    .select("workspace_id:clients!inner(workspace_id)")
    .eq("id", onboardingId)
    .single()

  if (!onboarding) {
    throw new Error("Unauthorized: Onboarding not found")
  }

  // TypeScript workaround for nested query
  const workspaceIdValue = (onboarding as any).workspace_id?.workspace_id

  if (workspaceIdValue !== workspaceId) {
    throw new Error("Unauthorized: Onboarding does not belong to your workspace")
  }
}

export async function updateReminderSettings(
  onboardingId: string,
  workspaceId: string,
  enabled: boolean,
  dueDate?: string,
) {
  await verifyOnboardingAccess(onboardingId, workspaceId)
  const supabase = await createClient()

  const { error } = await supabase
    .from("client_onboardings")
    .update({
      reminder_enabled: enabled,
      due_date: dueDate || null,
    })
    .eq("id", onboardingId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/clients")
  return { success: true }
}

export async function sendManualReminder(onboardingId: string, workspaceId: string) {
  await verifyOnboardingAccess(onboardingId, workspaceId)
  const supabase = await createClient()

  const { data: onboarding } = await supabase
    .from("client_onboardings")
    .select(
      `
      *,
      client:clients(*),
      workspace:workspaces(*)
    `,
    )
    .eq("id", onboardingId)
    .single()

  if (!onboarding) {
    return { success: false, error: "Onboarding not found" }
  }

  const { error } = await supabase.from("reminders").insert({
    workspace_id: workspaceId,
    onboarding_id: onboardingId,
    reminder_type: "followup",
    scheduled_for: new Date().toISOString(),
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}
