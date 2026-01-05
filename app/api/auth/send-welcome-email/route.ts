import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/email/resend"
import { getWelcomeEmail } from "@/lib/email/templates"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      console.error("[v0] Welcome email: Missing userId")
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Get user details
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", userId)
      .single()

    if (profileError) {
      console.error("[v0] Welcome email: Error fetching profile:", profileError)
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // Get user email from auth
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.admin.getUserById(userId)

    if (userError || !user) {
      console.error("[v0] Welcome email: Error fetching user:", userError)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    console.log("[v0] Welcome email: Sending to", user.email, "for user", profile.name)

    // Send welcome email
    const template = getWelcomeEmail(profile.name || user.email?.split("@")[0] || "there")
    const result = await sendEmail({
      to: user.email!,
      subject: template.subject,
      html: template.html,
    })

    if (!result.success && !result.skipped) {
      console.error("[v0] Welcome email: Failed to send")
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    console.log("[v0] Welcome email: Successfully sent to", user.email)
    return NextResponse.json({ success: true, skipped: result.skipped })
  } catch (error: any) {
    console.error("[v0] Welcome email: Unexpected error:", error.message, error.stack)
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
  }
}
