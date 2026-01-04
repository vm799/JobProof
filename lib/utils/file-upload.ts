import { createClient } from "@/lib/supabase/client"

export async function uploadFile(file: File, onboardingId: string, stepProgressId: string, workspaceId: string) {
  const supabase = createClient()

  // Generate unique file path
  const fileExt = file.name.split(".").pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  const filePath = `${workspaceId}/${onboardingId}/${fileName}`

  // Upload to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("onboarding-files")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

  if (uploadError) throw uploadError

  // Create file record
  const { data: fileRecord, error: fileError } = await supabase
    .from("file_uploads")
    .insert({
      workspace_id: workspaceId,
      onboarding_id: onboardingId,
      step_progress_id: stepProgressId,
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
      storage_path: filePath,
    })
    .select()
    .single()

  if (fileError) throw fileError

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("onboarding-files").getPublicUrl(filePath)

  return {
    ...fileRecord,
    publicUrl,
  }
}

export async function deleteFile(fileId: string) {
  const supabase = createClient()

  // Get file path
  const { data: file } = await supabase.from("file_uploads").select("storage_path").eq("id", fileId).single()

  if (file) {
    // Delete from storage
    await supabase.storage.from("onboarding-files").remove([file.storage_path])
  }

  // Delete record
  await supabase.from("file_uploads").delete().eq("id", fileId)
}
