import { updateSession } from "@/lib/supabase/proxy"
import { NextResponse, type NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  const publicPaths = [
    "/",
    "/demo",
    "/redeem",
    "/help",
    "/templates",
    "/analytics",
    "/auth/login",
    "/auth/sign-up",
    "/auth/check-email",
    "/auth/callback",
    "/auth/reset-password",
    "/welcome",
    "/onboarding",
    "/faq",
    "/privacy",
    "/terms",
    "/portal",
    "/features",
    "/pricing",
    "/about",
    "/blog",
    "/contact",
  ]
  const path = request.nextUrl.pathname

  // Allow public paths and portal routes
  if (publicPaths.some((publicPath) => path.startsWith(publicPath))) {
    if (process.env.NODE_ENV === "development") {
      console.log("[STATE-LOG] Proxy - Public path allowed:", path)
    }
    return NextResponse.next()
  }

  console.log("[STATE-LOG] Proxy - Protected path, checking session:", path)
  return await updateSession(request)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
