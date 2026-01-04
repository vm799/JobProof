"use server"

import { createClient } from "@/lib/supabase/server"

export interface TokenValidationResult {
  isValid: boolean
  onboardingId?: string
  expiresAt?: string
  clientName?: string
  clientEmail?: string
  error?: string
}

export async function validateOnboardingToken(token: string): Promise<TokenValidationResult> {
  const supabase = await createClient()

  try {
    // Call the database function to validate token
    const { data, error } = await supabase.rpc("validate_onboarding_token", { p_token: token }).single()

    if (error) {
      console.error("[v0] Token validation error:", error)
      return {
        isValid: false,
        error: "Invalid or expired access link",
      }
    }

    if (!data || !data.is_valid) {
      return {
        isValid: false,
        error: "This access link has expired. Please request a new one.",
      }
    }

    // Update last accessed timestamp
    await supabase
      .from("client_onboardings")
      .update({ token_last_accessed_at: new Date().toISOString() })
      .eq("id", data.onboarding_id)

    return {
      isValid: true,
      onboardingId: data.onboarding_id,
      expiresAt: data.expires_at,
      clientName: data.client_name,
      clientEmail: data.client_email,
    }
  } catch (err) {
    console.error("[v0] Token validation exception:", err)
    return {
      isValid: false,
      error: "An error occurred while validating your access link",
    }
  }
}

export async function regenerateToken(onboardingId: string): Promise<string | null> {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .rpc("regenerate_onboarding_token", { p_onboarding_id: onboardingId })
      .single()

    if (error) {
      console.error("[v0] Token regeneration error:", error)
      return null
    }

    return data
  } catch (err) {
    console.error("[v0] Token regeneration exception:", err)
    return null
  }
}

export async function extendTokenExpiry(token: string, days = 90): Promise<boolean> {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.rpc("extend_token_expiry", {
      p_token: token,
      p_days: days,
    })

    if (error) {
      console.error("[v0] Token extension error:", error)
      return false
    }

    return data === true
  } catch (err) {
    console.error("[v0] Token extension exception:", err)
    return false
  }
}
