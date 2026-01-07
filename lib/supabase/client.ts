"use client"

import { createBrowserClient } from "@supabase/ssr"

// 1. Never call createClient() at the top level of the file
let client: ReturnType<typeof createBrowserClient> | undefined

export function getSupabase() {
  if (typeof window === "undefined") return null

  if (client) return client

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // 2. Fallback to your project URL directly if the env var is missing
  // This is safe for PUBLIC keys and prevents the boot-loop
  client = createBrowserClient(
    url || "https://pvmucyfeayjhbitftpvp.supabase.co",
    key || "placeholder-key", 
    {
      auth: {
        storageKey: "sb-pvmucyfeayjhbitftpvp-auth-token",
        flowType: "pkce",
        persistSession: true,
      },
    }
  )

  return client
}

// 3. IMPORTANT: Remove the "export const supabase = createClient()" line
