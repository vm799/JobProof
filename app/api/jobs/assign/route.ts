import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { jobId, technicianId, siteId } = await request.json()
    const supabase = await createClient()

    // Get job details
    const { data: job } = await supabase
      .from("client_onboardings")
      .select(`
        *,
        client:clients(name, email, location),
        flow:onboarding_flows(name, description)
      `)
      .eq("id", jobId)
      .single()

    // Get technician details
    const { data: technician } = await supabase.from("profiles").select("*").eq("id", technicianId).single()

    if (!job || !technician) {
      return NextResponse.json({ error: "Job or technician not found" }, { status: 404 })
    }

    // Generate secure token for mobile access
    const { data: tokenData } = await supabase.rpc("regenerate_onboarding_token", {
      onboarding_id: jobId,
    })

    const jobLink = `${process.env.NEXT_PUBLIC_SITE_URL}/job/${jobId}?token=${tokenData}`

    // Send email via Resend
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "JobProof <noreply@jobproof.app>",
      to: technician.email,
      subject: `New Job Assigned: ${job.client.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>🔧 New Job Assignment</h2>
          <p>Hi ${technician.full_name},</p>
          <p>You've been assigned a new job:</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">${job.flow.name}</h3>
            <p><strong>Site:</strong> ${job.client.name}</p>
            <p><strong>Location:</strong> ${job.client.location || "See job details"}</p>
            ${job.scheduled_date ? `<p><strong>Scheduled:</strong> ${new Date(job.scheduled_date).toLocaleString()}</p>` : ""}
          </div>

          <a href="${jobLink}" style="display: inline-block; background: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
            Open Job Checklist
          </a>

          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            This link is secure and will work on any device. Access it to view the full job checklist and upload proofs of work.
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to send job assignment:", error)
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 })
  }
}
