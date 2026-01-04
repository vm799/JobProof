"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function inviteTeamMember(workspaceId: string, email: string, role: string) {
  const supabase = await createClient()

  // Check if user exists
  const { data: existingUser } = await supabase.from("profiles").select("id").eq("email", email).single()

  if (!existingUser) {
    throw new Error("User with this email does not exist. They need to sign up first.")
  }

  // Check if already a member
  const { data: existingMember } = await supabase
    .from("workspace_members")
    .select("id")
    .eq("workspace_id", workspaceId)
    .eq("user_id", existingUser.id)
    .single()

  if (existingMember) {
    throw new Error("This user is already a member of your workspace")
  }

  // Add member
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

export async function removeTeamMember(memberId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("workspace_members").delete().eq("id", memberId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/team")
  return { success: true }
}
