import { createServerClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/email/send"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET || "dev-secret-change-in-production"

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createServerClient()

    // Get pending reminders that are due
    const { data: reminders } = await supabase
      .from("reminders")
      .select(
        `
        *,
        onboarding:client_onboardings(
          *,
          client:clients(*),
          flow:flows(*)
        ),
        workspace:workspaces(*)
      `,
      )
      .eq("status", "pending")
      .lte("scheduled_for", new Date().toISOString())
      .limit(50)

    if (!reminders || reminders.length === 0) {
      return NextResponse.json({ message: "No reminders to send", count: 0 })
    }

    let successCount = 0
    let failureCount = 0

    for (const reminder of reminders) {
      try {
        const { onboarding, workspace } = reminder

        if (!onboarding || !onboarding.client) {
          await supabase.from("reminders").update({ status: "failed" }).eq("id", reminder.id)
          failureCount++
          continue
        }

        // Generate portal link
        const portalUrl = `${process.env.NEXT_PUBLIC_APP_URL}/portal/${onboarding.access_token}`

        // Send reminder email based on type
        let subject = ""
        let htmlContent = ""

        if (reminder.reminder_type === "incomplete_onboarding") {
          const daysInactive = Math.floor(
            (Date.now() - new Date(onboarding.last_activity_at || onboarding.created_at).getTime()) /
              (1000 * 60 * 60 * 24),
          )

          subject = `Reminder: Complete your ${workspace.name} onboarding`
          htmlContent = `
            <!DOCTYPE html>
            <html>
              <head>
                <style>
                  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                  .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
                  .progress { background: #f3f4f6; height: 8px; border-radius: 4px; overflow: hidden; margin: 20px 0; }
                  .progress-bar { background: #667eea; height: 100%; }
                  .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                  .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 20px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>👋 Quick Reminder</h1>
                  </div>
                  <div class="content">
                    <p>Hi there,</p>
                    <p>We noticed you haven't completed your onboarding yet. You're <strong>${onboarding.progress}% done</strong> – just a few more steps to go!</p>
                    
                    <div class="progress">
                      <div class="progress-bar" style="width: ${onboarding.progress}%"></div>
                    </div>
                    
                    <p>It's been ${daysInactive} days since you last checked in. Let's finish this up so we can get started working together!</p>
                    
                    <p style="text-align: center;">
                      <a href="${portalUrl}" class="button">Continue Onboarding →</a>
                    </p>
                    
                    <p>If you have any questions or need help, just reply to this email.</p>
                    
                    <p>Best regards,<br>${workspace.name} Team</p>
                  </div>
                  <div class="footer">
                    <p>Powered by BoardingPass | getboardingpass.app</p>
                  </div>
                </div>
              </body>
            </html>
          `
        }

        // Send email
        await sendEmail({
          to: onboarding.client.email,
          subject,
          html: htmlContent,
        })

        // Mark reminder as sent
        await supabase
          .from("reminders")
          .update({
            status: "sent",
            sent_at: new Date().toISOString(),
          })
          .eq("id", reminder.id)

        successCount++
      } catch (error) {
        console.error(`Failed to send reminder ${reminder.id}:`, error)
        await supabase.from("reminders").update({ status: "failed" }).eq("id", reminder.id)
        failureCount++
      }
    }

    return NextResponse.json({
      message: "Reminders processed",
      success: successCount,
      failed: failureCount,
      total: reminders.length,
    })
  } catch (error) {
    console.error("Reminder cron error:", error)
    return NextResponse.json({ error: "Failed to process reminders" }, { status: 500 })
  }
}
