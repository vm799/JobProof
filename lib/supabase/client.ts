"use client"

import { getSupabaseBrowser } from "./browser"

let authListenerSetup = false

export function initAuthListener() {
  if (authListenerSetup) return
  authListenerSetup = true

  const supabase = getSupabaseBrowser()
  supabase.auth.onAuthStateChange((event, session) => {
    const userId = session?.user?.id
    if (event === "SIGNED_IN" && userId) {
      console.log("[v0] Auth: User signed in:", userId)
    } else if (event === "SIGNED_OUT") {
      console.log("[v0] Auth: User signed out")
    }
  })
}

export function createClient() {
  return getSupabaseBrowser()
}
