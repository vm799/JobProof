"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

async function verifyWorkspaceAccess(workspaceId: string) {
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

  if (!membership) {
    throw new Error("Unauthorized: You are not a member of this workspace")
  }

  return membership.role
}

export async function inviteTeamMember(workspaceId: string, email: string, role: string) {
  const userRole = await verifyWorkspaceAccess(workspaceId)

  if (userRole !== "owner" && userRole !== "admin") {
    throw new Error("Unauthorized: Only owners and admins can invite team members")
  }

  const supabase = await createClient()

  const { data: existingUser } = await supabase.from("profiles").select("id").eq("email", email).single()

  if (!existingUser) {
    throw new Error("User with this email does not exist. They need to sign up first.")
  }

  const { data: existingMember } = await supabase
    .from("workspace_members")
    .select("id")
    .eq("workspace_id", workspaceId)
    .eq("user_id", existingUser.id)
    .single()

  if (existingMember) {
    throw new Error("This user is already a member of your workspace")
  }

  const { error } = await supabase.from("workspace_members").insert({
    workspace_id: workspaceId,
    user_id: existingUser.id,
    role: role,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/team")
  return { success: true }
}

export async function removeTeamMember(memberId: string, workspaceId: string) {
  const userRole = await verifyWorkspaceAccess(workspaceId)

  if (userRole !== "owner" && userRole !== "admin") {
    throw new Error("Unauthorized: Only owners and admins can remove team members")
  }

  const supabase = await createClient()

  const { data: member } = await supabase.from("workspace_members").select("workspace_id").eq("id", memberId).single()

  if (!member || member.workspace_id !== workspaceId) {
    throw new Error("Unauthorized: Member does not belong to your workspace")
  }

  const { error } = await supabase.from("workspace_members").delete().eq("id", memberId).eq("workspace_id", workspaceId) // Double-lock workspace isolation

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/team")
  return { success: true }
}
