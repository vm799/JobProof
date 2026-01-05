import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
      auth: {
        storageKey: "sb-pvmucyfeayjhbitftpvp-auth-token",
        flowType: "pkce",
      },
    },
  )

  const path = request.nextUrl.pathname
  console.log("[STATE-LOG] Middleware - Processing path:", path)

  // Get user session
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError) {
    console.error("[STATE-LOG] Middleware - Auth error:", authError.message)
  }

  // GUEST STATE: Portal routes (always allow)
  if (path.startsWith("/portal/")) {
    console.log("[STATE-LOG] Middleware - Portal route (GUEST) → Allow")
    return supabaseResponse
  }

  // SESSION_EXPIRED STATE: No user on protected route
  if (!user && !path.startsWith("/auth") && !path.startsWith("/_next")) {
    console.log("[STATE-LOG] Middleware - No user on protected route (SESSION_EXPIRED) → Redirect to /auth/login")
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    url.searchParams.set("message", "session_expired")
    return NextResponse.redirect(url)
  }

  // Allow access to auth pages if no user
  if (!user) {
    console.log("[STATE-LOG] Middleware - No user, on public route → Allow")
    return supabaseResponse
  }

  // User is authenticated - check state
  console.log("[STATE-LOG] Middleware - User authenticated:", user.id)

  // PASSWORD_RECOVERY STATE: Check for password recovery flow
  const isPasswordRecovery = request.nextUrl.searchParams.get("type") === "recovery"
  if (isPasswordRecovery) {
    console.log("[STATE-LOG] Middleware - Password recovery flow (PASSWORD_RECOVERY) → Allow /auth/reset-password")
    if (!path.startsWith("/auth/reset-password")) {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/reset-password"
      return NextResponse.redirect(url)
    }
    return supabaseResponse
  }

  // Check profile and workspace state
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("current_workspace_id, has_seen_onboarding")
    .eq("id", user.id)
    .single()

  // NEW_USER STATE: No profile exists
  if (profileError || !profile) {
    console.log("[STATE-LOG] Middleware - No profile (NEW_USER) → Redirect to /welcome")
    if (!path.startsWith("/welcome") && !path.startsWith("/auth/callback")) {
      const url = request.nextUrl.clone()
      url.pathname = "/welcome"
      return NextResponse.redirect(url)
    }
    return supabaseResponse
  }

  // EXISTING_NO_WS STATE: Profile exists but no workspace
  if (!profile.current_workspace_id) {
    console.log("[STATE-LOG] Middleware - No workspace (EXISTING_NO_WS) → Allow workspace creation flow")
    if (!path.startsWith("/dashboard") && !path.startsWith("/auth/callback")) {
      const url = request.nextUrl.clone()
      url.pathname = "/dashboard"
      return NextResponse.redirect(url)
    }
    return supabaseResponse
  }

  // EXISTING_WITH_WS STATE: User has everything
  console.log("[STATE-LOG] Middleware - User has workspace (EXISTING_WITH_WS):", profile.current_workspace_id)

  // Redirect authenticated users away from auth pages
  if (path.startsWith("/auth") && !path.includes("/check-email")) {
    console.log("[STATE-LOG] Middleware - User on auth page with workspace → Redirect to /dashboard")
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
