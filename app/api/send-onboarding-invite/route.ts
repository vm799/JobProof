import { createClient } from "@/lib/supabase/server"
import { sendOnboardingInvite } from "@/lib/email/send"
import { NextResponse } from "next/server"
import { handleApiError } from "@/lib/utils/error-handler"
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rate-limit"

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const rateLimit = checkRateLimit(`invite-${ip}`, 5) // 5 requests per minute

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: getRateLimitHeaders(rateLimit.remaining, rateLimit.resetAt),
        },
      )
    }

    const { onboardingId } = await request.json()

    if (!onboardingId) {
      return NextResponse.json({ error: "Onboarding ID is required" }, { status: 400 })
    }

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: onboarding, error: fetchError } = await supabase
      .from("client_onboardings")
      .select(
        `
        id,
        onboarding_link_token,
        clients!inner(name, email),
        onboarding_flows!inner(workspaces!inner(name, owner_id))
      `,
      )
      .eq("id", onboardingId)
      .single()

    if (fetchError) {
      const errorResponse = handleApiError(fetchError)
      return NextResponse.json({ error: errorResponse.error }, { status: errorResponse.statusCode })
    }

    if (!onboarding) {
      return NextResponse.json({ error: "Onboarding not found" }, { status: 404 })
    }

    if (onboarding.onboarding_flows.workspaces.owner_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const portalLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/portal/${onboarding.onboarding_link_token}`
    const workspaceName = onboarding.onboarding_flows.workspaces.name

    const result = await sendOnboardingInvite(
      onboarding.clients.email,
      onboarding.clients.name,
      portalLink,
      workspaceName,
    )

    if (!result.success) {
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    return NextResponse.json(
      { success: true },
      {
        headers: getRateLimitHeaders(rateLimit.remaining, rateLimit.resetAt),
      },
    )
  } catch (error: any) {
    console.error("[v0] Send invite error:", error)
    const errorResponse = handleApiError(error)
    return NextResponse.json({ error: errorResponse.error }, { status: errorResponse.statusCode })
  }
}
