"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function deleteClient(clientId: string) {
  const supabase = await createClient()

  // Get all onboardings for this client
  const { data: onboardings } = await supabase.from("client_onboardings").select("id").eq("client_name", clientId) // Note: Using client_name as identifier

  if (onboardings) {
    // Delete all related files from storage
    for (const onboarding of onboardings) {
      const { data: files } = await supabase
        .from("client_step_progress")
        .select("file_url")
        .eq("onboarding_id", onboarding.id)
        .not("file_url", "is", null)

      if (files) {
        for (const file of files) {
          if (file.file_url) {
            const filePath = file.file_url.split("/").pop()
            if (filePath) {
              await supabase.storage.from("onboarding-files").remove([filePath])
            }
          }
        }
      }
    }
  }

  // Delete the client (cascade will handle onboardings)
  const { error } = await supabase.from("client_onboardings").delete().eq("id", clientId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/clients")
  return { success: true }
}

export async function deleteOnboarding(onboardingId: string) {
  const supabase = await createClient()

  // Delete all related files from storage
  const { data: files } = await supabase
    .from("client_step_progress")
    .select("file_url")
    .eq("onboarding_id", onboardingId)
    .not("file_url", "is", null)

  if (files) {
    for (const file of files) {
      if (file.file_url) {
        const filePath = file.file_url.split("/").pop()
        if (filePath) {
          await supabase.storage.from("onboarding-files").remove([filePath])
        }
      }
    }
  }

  // Delete the onboarding
  const { error } = await supabase.from("client_onboardings").delete().eq("id", onboardingId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/clients")
  revalidatePath("/dashboard")
  return { success: true }
}
