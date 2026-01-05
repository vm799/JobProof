import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  console.log("[STATE-LOG] Auth callback - Code present:", !!code)
  console.log("[STATE-LOG] Auth callback - Request URL:", requestUrl.toString())

  if (code) {
    const cookieStore = await cookies()
    const supabase = await createClient()

    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error("[STATE-LOG] Auth callback - Error exchanging code:", error.message)
      console.error("[STATE-LOG] Auth callback - Error details:", JSON.stringify(error))
      return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=auth_callback_failed`)
    }

    console.log("[STATE-LOG] Auth callback - Session created for user:", data.user?.id)
    console.log("[STATE-LOG] Auth callback - User email:", data.user?.email)
    console.log("[STATE-LOG] Auth callback - Email confirmed:", data.user?.email_confirmed_at)

    // Check if this is a new user (profile might not exist yet)
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("current_workspace_id, has_seen_onboarding")
      .eq("id", data.user.id)
      .single()

    if (profileError) {
      console.error("[STATE-LOG] Auth callback - Profile fetch error:", profileError.message)
    }

    if (!profile) {
      console.log("[STATE-LOG] Auth callback - NEW_USER → Sending welcome email and redirecting to /welcome")

      try {
        const response = await fetch(`${requestUrl.origin}/api/auth/send-welcome-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: data.user.id }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          console.error("[STATE-LOG] Auth callback - Welcome email failed:", errorData)
        } else {
          const result = await response.json()
          console.log(
            "[STATE-LOG] Auth callback - Welcome email sent:",
            result.skipped ? "skipped (no API key)" : "success",
          )
        }
      } catch (emailError) {
        console.error("[STATE-LOG] Auth callback - Welcome email error:", emailError)
      }

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
  return NextResponse.redirect(`${requestUrl.origin}/auth/login`)
}
