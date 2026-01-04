"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateWorkspaceSettings(
  workspaceId: string,
  data: {
    name: string
    logoUrl?: string
    brandColor: string
    removeBranding: boolean
  },
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("workspaces")
    .update({
      name: data.name,
      logo_url: data.logoUrl,
      brand_color: data.brandColor,
      remove_branding: data.removeBranding,
      updated_at: new Date().toISOString(),
    })
    .eq("id", workspaceId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/settings")
  return { success: true }
}

export async function uploadWorkspaceLogo(workspaceId: string, formData: FormData) {
  const supabase = await createClient()
  const file = formData.get("logo") as File

  if (!file) {
    throw new Error("No file provided")
  }

  const fileExt = file.name.split(".").pop()
  const fileName = `${workspaceId}-logo.${fileExt}`
  const filePath = `logos/${fileName}`

  const { error: uploadError } = await supabase.storage.from("onboarding-files").upload(filePath, file, {
    cacheControl: "3600",
    upsert: true,
  })

  if (uploadError) {
    throw new Error(uploadError.message)
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("onboarding-files").getPublicUrl(filePath)

  return { logoUrl: publicUrl }
}
