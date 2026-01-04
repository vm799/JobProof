import { createClient } from "@/lib/supabase/server"
import { sendStepCompletedNotification } from "@/lib/email/send"
import { NextResponse } from "next/server"
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rate-limit"

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const rateLimit = checkRateLimit(`notify-${ip}`, 20) // 20 requests per minute

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: getRateLimitHeaders(rateLimit.remaining, rateLimit.resetAt),
        },
      )
    }

    const { onboardingId, stepTitle, clientName } = await request.json()

    const supabase = await createClient()

    // Get workspace owner email
    const { data: onboarding } = await supabase
      .from("client_onboardings")
      .select(
        `
        onboarding_flows!inner(
          workspaces!inner(
            name,
            profiles!workspace_members(profiles!inner(id, email))
          )
        )
      `,
      )
      .eq("id", onboardingId)
      .single()

    if (!onboarding) {
      return NextResponse.json({ error: "Onboarding not found" }, { status: 404 })
    }

    const workspaceName = onboarding.onboarding_flows.workspaces.name
    const ownerEmail = onboarding.onboarding_flows.workspaces.profiles?.[0]?.profiles?.email

    if (ownerEmail) {
      await sendStepCompletedNotification(ownerEmail, clientName, stepTitle, workspaceName)
    }

    return NextResponse.json(
      { success: true },
      {
        headers: getRateLimitHeaders(rateLimit.remaining, rateLimit.resetAt),
      },
    )
  } catch (error: any) {
    console.error("[v0] Notify error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
