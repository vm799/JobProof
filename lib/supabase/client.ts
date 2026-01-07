"use client"

import { createBrowserClient } from "@supabase/ssr"

let client: ReturnType<typeof createBrowserClient> | undefined
let lastKnownUserId: string | null = null

export function createClient() {
  if (typeof window === "undefined") return null as any

  if (client) return client

  // 1. Get the variables safely without the "!"
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // 2. Log if they are missing to confirm our suspicion
  if (!url || !key) {
    console.error("[v0] CRITICAL: Supabase URL or Key is missing from process.env")
  }

  // 3. Provide fallback strings so createBrowserClient doesn't throw a hard error
  client = createBrowserClient(
    url || "https://placeholder.supabase.co", 
    key || "placeholder-key", 
    {
      auth: {
        storageKey: "sb-pvmucyfeayjhbitftpvp-auth-token",
        flowType: "pkce",
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    }
  )

  client.auth.onAuthStateChange((event, session) => {
    const currentUserId = session?.user?.id || null
    if (event === "SIGNED_IN" && currentUserId !== lastKnownUserId) {
      console.log("[v0] New login detected:", currentUserId)
      lastKnownUserId = currentUserId
    } else if (event === "SIGNED_OUT") {
      lastKnownUserId = null
    }
  })

  return client
}

export const supabase = createClient()
