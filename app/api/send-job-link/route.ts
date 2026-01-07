import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { email, jobLink, siteName } = await req.json()

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "noreply@getboardingpass.app",
      to: email,
      subject: `New Job Assigned: ${siteName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; }
              .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
              .header { background: #000; color: #fff; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; padding: 14px 28px; background: #000; color: #fff !important; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">New Job Assignment</h1>
              </div>
              <div class="content">
                <h2>You have a new job at ${siteName}</h2>
                <p>A job has been assigned to you. Click the button below to view details and start the job.</p>
                <div style="text-align: center;">
                  <a href="${jobLink}" class="button">Start Job</a>
                </div>
                <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                  <strong>Job Details:</strong><br>
                  Site: ${siteName}<br>
                  Status: Pending
                </p>
              </div>
              <div class="footer">
                <p>This link expires in 30 days. If you have questions, contact your supervisor.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error("[Job Link Email Error]:", error)
      throw error
    }

    console.log("[v0] Job assignment email sent successfully to:", email)
    return NextResponse.json({ success: true, messageId: data?.id })
  } catch (error) {
    console.error("[Job Link Email Error]:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
