import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  console.log("[v0] Auth callback - Code present:", !!code)

  if (code) {
    const cookieStore = await cookies()
    const supabase = await createClient()

    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error("[v0] Auth callback - Error exchanging code:", error.message)
      // Redirect to login with error
      return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=auth_callback_failed`)
    }

    console.log("[v0] Auth callback - Session created for user:", data.user?.id)
    console.log("[v0] Auth callback - User email:", data.user?.email)

    // Check if this is a new user (profile might not exist yet)
    const { data: profile } = await supabase
      .from("profiles")
      .select("current_workspace_id, has_seen_onboarding")
      .eq("id", data.user.id)
      .single()

    if (!profile) {
      console.log("[v0] Auth callback - New user, waiting for profile creation")
      // Profile doesn't exist yet (trigger is still running), redirect to dashboard which will show workspace loader
      return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
    }

    if (!profile.current_workspace_id) {
      console.log("[v0] Auth callback - No workspace, redirecting to dashboard with workspace loader")
      return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
    }

    if (!profile.has_seen_onboarding) {
      console.log("[v0] Auth callback - First time user, showing onboarding")
      return NextResponse.redirect(`${requestUrl.origin}/dashboard?onboarding=true`)
    }

    console.log("[v0] Auth callback - Existing user, redirecting to dashboard")
    return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
  }

  console.log("[v0] Auth callback - No code present, redirecting to login")
  // No code present, redirect to login
  return NextResponse.redirect(`${requestUrl.origin}/auth/login`)
}
