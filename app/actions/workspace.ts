"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

async function verifyWorkspaceOwnership(workspaceId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized: No user session")
  }

  const { data: membership } = await supabase
    .from("workspace_members")
    .select("role")
    .eq("workspace_id", workspaceId)
    .eq("user_id", user.id)
    .single()

  if (!membership || (membership.role !== "owner" && membership.role !== "admin")) {
    throw new Error("Unauthorized: Only workspace owners and admins can update settings")
  }
}

export async function updateWorkspaceSettings(
  workspaceId: string,
  data: {
    name: string
    logoUrl?: string
    brandColor: string
    removeBranding: boolean
  },
) {
  await verifyWorkspaceOwnership(workspaceId)
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
  await verifyWorkspaceOwnership(workspaceId)
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
