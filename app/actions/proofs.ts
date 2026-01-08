"use server"

import { createClient } from "@/lib/supabase/server"
import { requireRole } from "@/lib/rbac"
import { revalidatePath } from "next/cache"

export async function uploadProof(data: {
  jobId: string
  filePath: string
  fileName: string
  fileType: "image" | "video"
  fileSize: number
  workspaceId: string
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  await requireRole(["admin", "manager", "field_worker"], data.workspaceId)

  const { data: proof, error } = await supabase
    .from("proofs")
    .insert({
      job_id: data.jobId,
      uploaded_by: user.id,
      workspace_id: data.workspaceId,
      file_path: data.filePath,
      file_type: data.fileType,
      file_size: data.fileSize,
      metadata: {
        original_name: data.fileName,
        uploaded_at: new Date().toISOString(),
      },
    })
    .select()
    .single()

  if (error) throw error

  revalidatePath(`/jobs/${data.jobId}`)
  return proof
}

export async function verifyProof(proofId: string, workspaceId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  await requireRole(["admin", "manager"], workspaceId)

  const { data: proof, error } = await supabase
    .from("proofs")
    .update({
      verified_at: new Date().toISOString(),
      verified_by: user.id,
    })
    .eq("id", proofId)
    .eq("workspace_id", workspaceId)
    .select()
    .single()

  if (error) throw error

  revalidatePath(`/jobs/${proof.job_id}`)
  return proof
}

export async function getProofsForJob(jobId: string, workspaceId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  await requireRole(["admin", "manager", "field_worker"], workspaceId)

  const { data: proofs, error } = await supabase
    .from("proofs")
    .select("*")
    .eq("job_id", jobId)
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return proofs
}
