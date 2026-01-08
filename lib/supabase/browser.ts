"use client"

import { createBrowserClient } from "@supabase/ssr"

let browserClient: ReturnType<typeof createBrowserClient> | null = null

declare global {
  interface Window {
    __SUPABASE_BROWSER_CLIENT__?: boolean
  }
}

export function getSupabaseBrowser() {
  if (typeof window !== "undefined") {
    if (window.__SUPABASE_BROWSER_CLIENT__) {
      console.warn("[v0] SECOND Supabase browser client requested - checking stack trace:")
      console.trace("[v0] Stack trace for duplicate call:")
    }
    window.__SUPABASE_BROWSER_CLIENT__ = true
  }

  if (!browserClient) {
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          flowType: "pkce",
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
        },
      },
    )
  }
  return browserClient
}
