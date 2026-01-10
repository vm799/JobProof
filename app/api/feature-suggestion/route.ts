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
    const userId = user?.id || null

    console.log("[v0] Feature request submitted:", { title, userEmail, userId })

    if (userId) {
      const { error: insertError } = await supabase.from("feature_requests").insert({
        user_id: userId,
        title,
        description: description || null,
        status: "pending",
        votes: 0,
      })

      if (insertError) {
        console.error("[v0] Failed to insert feature request:", insertError)
      } else {
        console.log("[v0] Feature request saved to database")
      }
    }

    // Send email to admin
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "noreply@jobproof.app",
        to: "admin@jobproof.app",
        subject: `Feature Request: ${title}`,
        html: `
          <h2>New Feature Suggestion</h2>
          <p><strong>From:</strong> ${userEmail}</p>
          <p><strong>User ID:</strong> ${userId || "Anonymous"}</p>
          <hr />
          <h3>${title}</h3>
          <p>${description || "No additional description provided."}</p>
          <hr />
          <p style="color: #666; font-size: 12px;">Submitted from JobProof Roadmap</p>
        `,
      })

      console.log("[v0] Feature request email sent successfully to admin")
    } catch (emailError) {
      console.error("[v0] Failed to send feature request email:", emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Feature suggestion error:", error)
    return NextResponse.json({ error: "Failed to submit suggestion" }, { status: 500 })
  }
}
