import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  console.log("[STATE-LOG] Auth callback - Code present:", !!code)

  if (code) {
    const cookieStore = await cookies()
    const supabase = await createClient()

    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error("[STATE-LOG] Auth callback - Error exchanging code:", error.message)
      // Redirect to login with error
      return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=auth_callback_failed`)
    }

    console.log("[STATE-LOG] Auth callback - Session created for user:", data.user?.id)
    console.log("[STATE-LOG] Auth callback - User email:", data.user?.email)

    // Check if this is a new user (profile might not exist yet)
    const { data: profile } = await supabase
      .from("profiles")
      .select("current_workspace_id, has_seen_onboarding")
      .eq("id", data.user.id)
      .single()

    if (!profile) {
      console.log("[STATE-LOG] Auth callback - NEW_USER → Redirecting to /welcome")
      return NextResponse.redirect(`${requestUrl.origin}/welcome`)
    }

    if (!profile.current_workspace_id) {
      console.log("[STATE-LOG] Auth callback - EXISTING_NO_WS → Redirecting to /dashboard for workspace creation")
      return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
    }

    if (!profile.has_seen_onboarding) {
      console.log("[STATE-LOG] Auth callback - EXISTING_WITH_WS (first time) → Dashboard with onboarding")
      return NextResponse.redirect(`${requestUrl.origin}/dashboard?onboarding=true`)
    }

    console.log("[STATE-LOG] Auth callback - EXISTING_WITH_WS → Redirecting to dashboard")
    return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
  }

  console.log("[STATE-LOG] Auth callback - No code present, redirecting to login")
  // No code present, redirect to login
  return NextResponse.redirect(`${requestUrl.origin}/auth/login`)
}
