"use client"
import { createBrowserClient } from '@supabase/ssr'

// We export a constant so it's stable and unique
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// We also keep the function for compatibility, but make it return the same instance
export function createClient() {
  return supabase
}

// import { createBrowserClient } from "@supabase/ssr"

// let client: ReturnType<typeof createBrowserClient> | undefined
// let lastKnownUserId: string | null = null

// export function createClient() {
//   if (typeof window === "undefined") {
//     return null as any
//   }

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
    const currentUserId = session?.user?.id || null

    console.log("[v0] Auth state changed:", event)
    console.log("[v0] Session exists:", !!session)
    console.log("[v0] User ID:", currentUserId)

    if (event === "SIGNED_IN") {
      // Only log if this is a NEW sign-in (user ID changed)
      if (currentUserId !== lastKnownUserId) {
        console.log("[v0] User successfully signed in (NEW USER)")
        lastKnownUserId = currentUserId
      } else {
        console.log("[v0] SIGNED_IN event (duplicate - same user)")
      }

      if (!session) {
        console.error("[v0] CRITICAL: SIGNED_IN event but no session! Auth may have failed.")
      }
    } else if (event === "SIGNED_OUT") {
      console.log("[v0] User signed out")
      lastKnownUserId = null
    } else if (event === "TOKEN_REFRESHED") {
      console.log("[v0] Session token refreshed")
      if (!session) {
        console.error("[v0] CRITICAL: Token refresh failed - session lost!")
      }
    } else if (event === "USER_UPDATED") {
      console.log("[v0] User data updated")
    } else if (event === "INITIAL_SESSION") {
      console.log("[v0] Initial session check complete. Logged in:", !!session)
      lastKnownUserId = currentUserId
    }
  })

  return client
}
