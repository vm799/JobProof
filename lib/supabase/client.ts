"use client"

import { createBrowserClient } from "@supabase/ssr"

let client: ReturnType<typeof createBrowserClient> | undefined
let lastKnownUserId: string | null = null

export function createClient() {
  if (typeof window === "undefined") return null as any

  // If the client already exists, just return it (Stops the tug-of-war)
  if (client) return client

  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, 
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

  // Listen for auth changes once
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

// Export the instance directly as well for easier importing
export const supabase = createClient()
