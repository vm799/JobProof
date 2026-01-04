"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateReminderSettings(onboardingId: string, enabled: boolean, dueDate?: string) {
  const supabase = await createServerClient()

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

export async function sendManualReminder(onboardingId: string) {
  const supabase = await createServerClient()

  // Get onboarding details
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

  // Create immediate reminder
  const { error } = await supabase.from("reminders").insert({
    workspace_id: onboarding.workspace_id,
    onboarding_id: onboardingId,
    reminder_type: "followup",
    scheduled_for: new Date().toISOString(),
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}
