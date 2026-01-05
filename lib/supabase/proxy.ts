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

  console.log("[v0] Middleware - Path:", request.nextUrl.pathname)

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError) {
    console.error("[v0] Middleware - Auth error:", authError.message)
  }

  console.log("[v0] Middleware - User authenticated:", !!user)
  if (user) {
    console.log("[v0] Middleware - User ID:", user.id)
  }

  // Protect dashboard routes - redirect to login if not authenticated
  if (
    !request.nextUrl.pathname.startsWith("/auth") &&
    !request.nextUrl.pathname.startsWith("/portal") &&
    !request.nextUrl.pathname.startsWith("/_next") &&
    !user
  ) {
    console.log("[v0] Middleware - Redirecting to login (no user)")
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  if (request.nextUrl.pathname.startsWith("/auth") && user && !request.nextUrl.pathname.includes("/check-email")) {
    console.log("[v0] Middleware - User on auth page, checking workspace status")

    // Check if user has a workspace before redirecting
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("current_workspace_id")
      .eq("id", user.id)
      .single()

    if (profileError) {
      console.error("[v0] Middleware - Profile check error:", profileError.message)
      // Allow them to proceed to auth pages to see error
      return supabaseResponse
    }

    if (profile?.current_workspace_id) {
      console.log(
        "[v0] Middleware - Workspace exists (ID:",
        profile.current_workspace_id,
        "), redirecting to dashboard",
      )
      const url = request.nextUrl.clone()
      url.pathname = "/dashboard"
      return NextResponse.redirect(url)
    } else {
      console.log("[v0] Middleware - No workspace yet, redirecting to dashboard for workspace loader")
      // Redirect to dashboard which will show WorkspaceLoader
      const url = request.nextUrl.clone()
      url.pathname = "/dashboard"
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
