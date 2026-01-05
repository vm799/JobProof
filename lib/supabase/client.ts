"use client"

import { createBrowserClient } from "@supabase/ssr"

let client: ReturnType<typeof createBrowserClient> | undefined

export function createClient() {
  if (typeof window === "undefined") {
    throw new Error("createClient should only be called in browser")
  }

  if (client) return client

  client = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: {
      storageKey: "sb-pvmucyfeayjhbitftpvp-auth-token",
      flowType: "pkce",
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  })

  client.auth.onAuthStateChange((event, session) => {
    console.log("[v0] Auth state changed:", event)
    console.log("[v0] Session exists:", !!session)
    console.log("[v0] User ID:", session?.user?.id)

    if (event === "SIGNED_IN") {
      console.log("[v0] User successfully signed in")
      if (!session) {
        console.error("[v0] CRITICAL: SIGNED_IN event but no session! Auth may have failed.")
      }
    } else if (event === "SIGNED_OUT") {
      console.log("[v0] User signed out")
    } else if (event === "TOKEN_REFRESHED") {
      console.log("[v0] Session token refreshed")
      if (!session) {
        console.error("[v0] CRITICAL: Token refresh failed - session lost!")
      }
    } else if (event === "USER_UPDATED") {
      console.log("[v0] User data updated")
    } else if (event === "INITIAL_SESSION") {
      // This is normal - first load may not have a session yet
      console.log("[v0] Initial session check complete. Logged in:", !!session)
    }
  })

  return client
}
