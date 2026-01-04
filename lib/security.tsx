import { createClient } from "@/lib/supabase/server"
import type { NextRequest } from "next/server"

export async function validateApiKey(request: NextRequest): Promise<{ valid: boolean; workspaceId?: string }> {
  const apiKey = request.headers.get("x-api-key")

  if (!apiKey) {
    return { valid: false }
  }

  // For now, validate against workspace API keys (would need to add to database)
  // This is a placeholder for future API key functionality
  return { valid: false }
}

export async function validateUser(request: NextRequest): Promise<{ valid: boolean; userId?: string }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { valid: false }
    }

    return { valid: true, userId: user.id }
  } catch {
    return { valid: false }
  }
}

export function sanitizeInput(input: string): string {
  // Basic XSS prevention
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validateFileSize(sizeInBytes: number, maxSizeMB = 10): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return sizeInBytes <= maxSizeBytes
}

export function validateFileType(filename: string, allowedTypes: string[]): boolean {
  const extension = filename.split(".").pop()?.toLowerCase()
  return extension ? allowedTypes.includes(extension) : false
}
