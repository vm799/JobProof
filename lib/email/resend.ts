import { Resend } from "resend"

let resendInstance: Resend | null = null

function getResendClient() {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.warn("[v0] RESEND_API_KEY not found. Email functionality will be disabled.")
      return null
    }
    resendInstance = new Resend(apiKey)
  }
  return resendInstance
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  try {
    const resend = getResendClient()

    if (!resend) {
      console.log("[v0] Email not sent (no API key):", { to, subject })
      return { success: true, data: null, skipped: true }
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev"

    const { data, error } = await resend.emails.send({
      from: `BoardingPass <${fromEmail}>`,
      to: [to],
      subject,
      html,
    })

    if (error) {
      console.error("[v0] Resend error:", error)
      throw new Error(error.message)
    }

    return { success: true, data }
  } catch (error: any) {
    console.error("[v0] Email send error:", error)
    throw error
  }
}
