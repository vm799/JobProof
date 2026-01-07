import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { jobId } = await request.json()
    const supabase = await createClient()

    // Get job details with completion data
    const { data: job } = await supabase
      .from("client_onboardings")
      .select(`
        *,
        client:clients(name, email),
        flow:onboarding_flows(name),
        assigned_to:profiles(full_name, email),
        progress:client_step_progress(*)
      `)
      .eq("id", jobId)
      .single()

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    // Calculate completion stats
    const totalSteps = job.progress.length
    const completedSteps = job.progress.filter((p: any) => p.completed).length
    const completionRate = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0

    // Get workspace owner/admin email
    const { data: workspace } = await supabase
      .from("workspaces")
      .select("*, owner:profiles(email, full_name)")
      .eq("id", job.workspace_id)
      .single()

    // Send completion notification to admin
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "JobProof <noreply@jobproof.app>",
      to: workspace?.owner?.email || job.client.email,
      subject: `✅ Job Completed: ${job.client.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>✅ Job Completed</h2>
          <p>A job has been marked as completed:</p>
          
          <div style="background: #f0fdf4; border-left: 4px solid #22c55e; padding: 20px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #15803d;">${job.flow.name}</h3>
            <p><strong>Site:</strong> ${job.client.name}</p>
            <p><strong>Completed by:</strong> ${job.assigned_to?.full_name || "Technician"}</p>
            <p><strong>Completion Rate:</strong> ${completionRate}% (${completedSteps}/${totalSteps} steps)</p>
            <p><strong>Completed at:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" style="display: inline-block; background: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
            View Job Details
          </a>

          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Review the completed checklist and proofs of work in your dashboard.
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to send completion notification:", error)
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 })
  }
}
