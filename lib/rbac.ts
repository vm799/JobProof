// Role-Based Access Control utilities
import { createClient } from "@/lib/supabase/server"

export type Role = "admin" | "manager" | "field_worker"

export async function getUserRole(userId: string, workspaceId: string): Promise<Role | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("workspace_members")
    .select("role")
    .eq("user_id", userId)
    .eq("workspace_id", workspaceId)
    .single()

  if (error) return null
  return (data?.role as Role) || null
}

export async function requireRole(requiredRoles: Role[], workspaceId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  const userRole = await getUserRole(user.id, workspaceId)
  if (!userRole || !requiredRoles.includes(userRole)) {
    throw new Error(`Access denied. Required role: ${requiredRoles.join(" or ")}`)
  }

  return userRole
}

export async function canManageSite(userId: string, siteId: string, workspaceId: string): Promise<boolean> {
  const userRole = await getUserRole(userId, workspaceId)
  return userRole === "admin" || userRole === "manager"
}

export async function canAssignJob(userId: string, workspaceId: string): Promise<boolean> {
  const userRole = await getUserRole(userId, workspaceId)
  return userRole === "admin" || userRole === "manager"
}

export async function canViewProofs(userId: string, workspaceId: string): Promise<boolean> {
  const userRole = await getUserRole(userId, workspaceId)
  return userRole !== null // All workspace members can view proofs
}
