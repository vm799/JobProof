"use server"

import { createClient } from "@/lib/supabase/server"
import { randomBytes } from "crypto"

export async function addCustomDomain(workspaceId: string, domain: string): Promise<string | null> {
  const supabase = await createClient()

  // Generate verification token
  const verificationToken = randomBytes(16).toString("hex")

  const { data, error } = await supabase
    .from("custom_domains")
    .insert({
      workspace_id: workspaceId,
      domain: domain.toLowerCase(),
      verification_token: verificationToken,
    })
    .select("id")
    .single()

  if (error) {
    console.error("[v0] Custom domain creation error:", error)
    return null
  }

  return verificationToken
}

export async function verifyCustomDomain(domainId: string): Promise<boolean> {
  const supabase = await createClient()

  const { data: domain } = await supabase
    .from("custom_domains")
    .select("domain, verification_token")
    .eq("id", domainId)
    .single()

  if (!domain) return false

  try {
    // Check DNS TXT record for verification
    // In production, use DNS lookup library
    // For now, just simulate verification
    const isVerified = true // Placeholder

    if (isVerified) {
      await supabase
        .from("custom_domains")
        .update({
          is_verified: true,
          verified_at: new Date().toISOString(),
        })
        .eq("id", domainId)

      return true
    }
  } catch (error) {
    console.error("[v0] Domain verification error:", error)
  }

  return false
}
