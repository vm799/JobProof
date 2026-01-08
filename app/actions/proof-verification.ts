"use server"

import { createClient } from "@/lib/supabase/server"
import { requireRole } from "@/lib/rbac"
import { revalidatePath } from "next/cache"

export async function verifyProof(data: {
  proofId: string
  workspaceId: string
  verificationNotes?: string
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  await requireRole(["admin", "manager"], data.workspaceId)

  const { data: proof, error: proofError } = await supabase
    .from("proofs")
    .select("*")
    .eq("id", data.proofId)
    .eq("workspace_id", data.workspaceId)
    .single()

  if (proofError || !proof) throw new Error("Proof not found")

  if (proof.proof_status !== "submitted") {
    throw new Error("Only submitted proofs can be verified")
  }

  const { data: updatedProof, error: updateError } = await supabase
    .from("proofs")
    .update({
      proof_status: "verified",
      verified_at: new Date().toISOString(),
      verified_by: user.id,
    })
    .eq("id", data.proofId)
    .select()
    .single()

  if (updateError) throw updateError

  const { error: eventError } = await supabase.from("proof_events").insert({
    proof_id: data.proofId,
    workspace_id: data.workspaceId,
    event_type: "verified",
    actor_id: user.id,
    actor_role: "manager", // Will be fetched from requireRole in real code
    previous_state: "submitted",
    new_state: "verified",
    metadata: {
      verification_notes: data.verificationNotes || "",
      verified_timestamp: new Date().toISOString(),
    },
  })

  if (eventError) throw eventError

  revalidatePath(`/admin/proofs`)
  return updatedProof
}

export async function rejectProof(data: {
  proofId: string
  workspaceId: string
  rejectionReason: string
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  await requireRole(["admin", "manager"], data.workspaceId)

  const { data: proof, error: proofError } = await supabase
    .from("proofs")
    .select("*")
    .eq("id", data.proofId)
    .eq("workspace_id", data.workspaceId)
    .single()

  if (proofError || !proof) throw new Error("Proof not found")

  if (proof.proof_status !== "submitted") {
    throw new Error("Only submitted proofs can be rejected")
  }

  const { data: updatedProof, error: updateError } = await supabase
    .from("proofs")
    .update({
      proof_status: "rejected",
      rejection_reason: data.rejectionReason,
      verified_at: new Date().toISOString(),
      verified_by: user.id,
    })
    .eq("id", data.proofId)
    .select()
    .single()

  if (updateError) throw updateError

  const { error: eventError } = await supabase.from("proof_events").insert({
    proof_id: data.proofId,
    workspace_id: data.workspaceId,
    event_type: "rejected",
    actor_id: user.id,
    actor_role: "manager",
    previous_state: "submitted",
    new_state: "rejected",
    metadata: {
      rejection_reason: data.rejectionReason,
      rejected_timestamp: new Date().toISOString(),
    },
  })

  if (eventError) throw eventError

  revalidatePath(`/admin/proofs`)
  return updatedProof
}

export async function getProofAuditTrail(proofId: string, workspaceId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  await requireRole(["admin", "manager"], workspaceId)

  const { data: events, error } = await supabase
    .from("proof_events")
    .select(
      `
      id,
      event_type,
      actor_id,
      actor_role,
      previous_state,
      new_state,
      metadata,
      created_at
    `,
    )
    .eq("proof_id", proofId)
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: true })

  if (error) throw error
  return events
}
