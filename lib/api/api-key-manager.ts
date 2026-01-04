"use server"

import { createClient } from "@/lib/supabase/server"
import { createHash, randomBytes } from "crypto"

export async function generateApiKey(
  workspaceId: string,
  name: string,
): Promise<{ key: string; prefix: string } | null> {
  const supabase = await createClient()

  // Generate secure API key
  const apiKey = `bp_${randomBytes(32).toString("hex")}`
  const keyHash = createHash("sha256").update(apiKey).digest("hex")
  const keyPrefix = apiKey.substring(0, 12) // Show first 12 chars

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { error } = await supabase.from("api_keys").insert({
    workspace_id: workspaceId,
    name,
    key_prefix: keyPrefix,
    key_hash: keyHash,
    created_by: user.id,
  })

  if (error) {
    console.error("[v0] API key creation error:", error)
    return null
  }

  return { key: apiKey, prefix: keyPrefix }
}

export async function validateApiKey(apiKey: string): Promise<{ workspaceId: string; keyId: string } | null> {
  const supabase = await createClient()

  const keyHash = createHash("sha256").update(apiKey).digest("hex")

  const { data, error } = await supabase
    .from("api_keys")
    .select("id, workspace_id, expires_at, revoked_at")
    .eq("key_hash", keyHash)
    .single()

  if (error || !data) return null

  // Check if revoked
  if (data.revoked_at) return null

  // Check if expired
  if (data.expires_at && new Date(data.expires_at) < new Date()) return null

  // Update last used timestamp
  await supabase.from("api_keys").update({ last_used_at: new Date().toISOString() }).eq("id", data.id)

  return {
    workspaceId: data.workspace_id,
    keyId: data.id,
  }
}

export async function revokeApiKey(keyId: string): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase.from("api_keys").update({ revoked_at: new Date().toISOString() }).eq("id", keyId)

  return !error
}
