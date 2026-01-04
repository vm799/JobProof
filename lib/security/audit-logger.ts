"use server"

import { createClient } from "@/lib/supabase/server"
import { headers } from "next/headers"

export type AuditAction = "create" | "update" | "delete" | "download" | "access" | "invite" | "login"
export type EntityType = "client" | "flow" | "onboarding" | "file" | "team_member" | "workspace" | "step"

interface AuditLogParams {
  workspaceId: string
  action: AuditAction
  entityType: EntityType
  entityId?: string
  details?: Record<string, any>
}

export async function createAuditLog(params: AuditLogParams): Promise<boolean> {
  const supabase = await createClient()

  try {
    // Get user from session
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Get IP and user agent from headers
    const headersList = await headers()
    const ipAddress = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown"
    const userAgent = headersList.get("user-agent") || "unknown"

    const { error } = await supabase.rpc("log_audit", {
      p_workspace_id: params.workspaceId,
      p_user_id: user?.id || null,
      p_action: params.action,
      p_entity_type: params.entityType,
      p_entity_id: params.entityId || null,
      p_details: params.details || {},
      p_ip_address: ipAddress,
      p_user_agent: userAgent,
    })

    if (error) {
      console.error("[v0] Audit log creation error:", error)
      return false
    }

    return true
  } catch (err) {
    console.error("[v0] Audit log creation exception:", err)
    return false
  }
}

// Helper functions for common audit actions
export async function logClientCreated(workspaceId: string, clientId: string, clientName: string) {
  return createAuditLog({
    workspaceId,
    action: "create",
    entityType: "client",
    entityId: clientId,
    details: { client_name: clientName },
  })
}

export async function logFlowCreated(workspaceId: string, flowId: string, flowName: string) {
  return createAuditLog({
    workspaceId,
    action: "create",
    entityType: "flow",
    entityId: flowId,
    details: { flow_name: flowName },
  })
}

export async function logFileDownload(workspaceId: string, fileId: string, fileName: string) {
  return createAuditLog({
    workspaceId,
    action: "download",
    entityType: "file",
    entityId: fileId,
    details: { file_name: fileName },
  })
}

export async function logTeamMemberInvited(workspaceId: string, email: string, role: string) {
  return createAuditLog({
    workspaceId,
    action: "invite",
    entityType: "team_member",
    details: { email, role },
  })
}
