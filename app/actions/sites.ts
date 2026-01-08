"use server"

import { createClient } from "@/lib/supabase/server"
import { requireRole, canManageSite } from "@/lib/rbac"
import { revalidatePath } from "next/cache"

export async function createSite(data: { name: string; email: string }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data: profile } = await supabase.from("profiles").select("current_workspace_id").eq("id", user.id).single()

  if (!profile?.current_workspace_id) throw new Error("No workspace")

  await requireRole(["admin", "manager"], profile.current_workspace_id)

  const { enforceLimit } = await import("@/lib/billing")
  await enforceLimit(profile.current_workspace_id, "sites")

  const { data: site, error } = await supabase
    .from("clients")
    .insert({
      name: data.name,
      email: data.email,
      workspace_id: profile.current_workspace_id,
      status: "active",
    })
    .select()
    .single()

  if (error) throw error

  await supabase
    .from("billing_accounts")
    .update({
      sites_count: "sites_count+1",
      updated_at: new Date().toISOString(),
    })
    .eq("workspace_id", profile.current_workspace_id)

  revalidatePath("/sites")
  return site
}

export async function updateSite(siteId: string, data: { name?: string; email?: string }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data: profile } = await supabase.from("profiles").select("current_workspace_id").eq("id", user.id).single()

  if (!profile?.current_workspace_id) throw new Error("No workspace")

  const canManage = await canManageSite(user.id, siteId, profile.current_workspace_id)
  if (!canManage) throw new Error("Access denied")

  const { data: site, error } = await supabase
    .from("clients")
    .update(data)
    .eq("id", siteId)
    .eq("workspace_id", profile.current_workspace_id)
    .select()
    .single()

  if (error) throw error

  revalidatePath("/sites")
  revalidatePath(`/sites/${siteId}`)
  return site
}

export async function deleteSite(siteId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data: profile } = await supabase.from("profiles").select("current_workspace_id").eq("id", user.id).single()

  if (!profile?.current_workspace_id) throw new Error("No workspace")

  await requireRole(["admin"], profile.current_workspace_id)

  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", siteId)
    .eq("workspace_id", profile.current_workspace_id)

  if (error) throw error

  revalidatePath("/sites")
  return { success: true }
}
