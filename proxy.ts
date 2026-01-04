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
  ]
  const path = request.nextUrl.pathname

  if (publicPaths.some((publicPath) => path.startsWith(publicPath))) {
    return NextResponse.next()
  }

  return await updateSession(request)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
