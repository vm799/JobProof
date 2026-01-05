import { NextResponse } from "next/server"
import { Resend } from "resend"
import { createServerClient } from "@/lib/supabase/server"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { title, description } = await request.json()

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    // Get user info if authenticated
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const userEmail = user?.email || "Anonymous User"
    const userId = user?.id || "Not authenticated"

    console.log("[v0] Feature request submitted:", { title, userEmail, userId })

    if (user?.id) {
      const { data: profile } = await supabase.from("profiles").select("workspace_id").eq("id", user.id).single()

      if (profile?.workspace_id) {
        await supabase.from("feature_requests").insert({
          workspace_id: profile.workspace_id,
          user_id: user.id,
          title,
          description: description || null,
          status: "pending",
        })
      }
    }

    // Send email to admin
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@getboardingpass.app",
      to: "admin@getboardingpass.app",
      subject: `Feature Request: ${title}`,
      html: `
        <h2>New Feature Suggestion</h2>
        <p><strong>From:</strong> ${userEmail}</p>
        <p><strong>User ID:</strong> ${userId}</p>
        <hr />
        <h3>${title}</h3>
        <p>${description || "No additional description provided."}</p>
        <hr />
        <p style="color: #666; font-size: 12px;">Submitted from BoardingPass Roadmap</p>
      `,
    })

    console.log("[v0] Feature request email sent successfully")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Feature suggestion error:", error)
    return NextResponse.json({ error: "Failed to submit suggestion" }, { status: 500 })
  }
}
