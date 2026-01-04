export function getOnboardingInviteEmail(
  clientName: string,
  portalLink: string,
  workspaceName: string,
  teamMemberName?: string,
) {
  return {
    subject: `${clientName}, welcome! Let's make something amazing together`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                  <tr>
                    <td style="padding: 48px 40px;">
                      <div style="text-align: center; font-size: 48px; margin-bottom: 24px;">👋</div>
                      <h1 style="margin: 0 0 16px 0; font-size: 28px; font-weight: 700; color: #111827; text-align: center;">Hey ${clientName}!</h1>
                      <p style="margin: 0 0 24px 0; font-size: 18px; line-height: 1.6; color: #374151;">
                        We're genuinely excited to have you here! This is the beginning of something special, and we can't wait to see what we'll create together.
                      </p>
                      <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #6b7280;">
                        ${teamMemberName ? `Your dedicated guide, <strong>${teamMemberName}</strong>, has` : "Our team has"} put together a simple onboarding process to help us understand your vision. It won't take long, and honestly? This is the fun part where we get to dream together.
                      </p>
                      <div style="background: #f3f4f6; border-left: 4px solid #3b82f6; padding: 16px; margin-bottom: 32px; border-radius: 4px;">
                        <p style="margin: 0; font-size: 14px; color: #4b5563; font-style: italic;">
                          💡 <strong>Pro tip:</strong> New beginnings can feel a bit overwhelming. Take your time, grab a coffee, and know that we're here if you need anything. Just hit reply!
                        </p>
                      </div>
                      <div style="text-align: center;">
                        <a href="${portalLink}" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);">
                          Let's Get Started 🚀
                        </a>
                      </div>
                      <p style="margin: 32px 0 0 0; font-size: 14px; color: #9ca3af; line-height: 1.5;">
                        <strong>P.S.</strong> Seriously, if anything feels confusing or you just want to chat, reply to this email. A real human${teamMemberName ? ` (${teamMemberName})` : ""} will respond, usually within an hour. We're here for you.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 24px 40px; border-top: 1px solid #e5e7eb; background-color: #f9fafb; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;">
                      <p style="margin: 0; font-size: 13px; color: #6b7280; text-align: center;">
                        With gratitude,<br>
                        <strong>The ${workspaceName} Team</strong>
                      </p>
                      <p style="margin: 8px 0 0 0; font-size: 11px; color: #9ca3af; text-align: center;">
                        Powered by BoardingPass • Where onboarding feels human
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  }
}

export function getStepCompletedEmail(
  clientName: string,
  stepTitle: string,
  workspaceName: string,
  stepNumber: number,
  totalSteps: number,
) {
  const progressPercent = Math.round((stepNumber / totalSteps) * 100)

  return {
    subject: `${clientName} just completed "${stepTitle}" - nice!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                  <tr>
                    <td style="padding: 40px;">
                      <div style="text-align: center; margin-bottom: 24px;">
                        <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
                          <span style="font-size: 32px;">✨</span>
                        </div>
                      </div>
                      <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #111827; text-align: center;">Progress alert!</h1>
                      <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #374151; text-align: center;">
                        <strong style="color: #111827;">${clientName}</strong> just completed<br>
                        <span style="color: #3b82f6; font-weight: 600;">"${stepTitle}"</span>
                      </p>
                      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                          <span style="font-size: 14px; color: #166534; font-weight: 600;">Overall Progress</span>
                          <span style="font-size: 14px; color: #166534; font-weight: 700;">${progressPercent}%</span>
                        </div>
                        <div style="width: 100%; height: 8px; background-color: #dcfce7; border-radius: 4px; overflow: hidden;">
                          <div style="width: ${progressPercent}%; height: 100%; background: linear-gradient(90deg, #10b981 0%, #059669 100%); transition: width 0.3s ease;"></div>
                        </div>
                        <p style="margin: 12px 0 0 0; font-size: 13px; color: #15803d;">
                          ${stepNumber} of ${totalSteps} steps complete
                        </p>
                      </div>
                      <p style="margin: 0 0 16px 0; font-size: 15px; color: #6b7280; line-height: 1.5;">
                        ${
                          progressPercent >= 50
                            ? `They're past the halfway point! ${clientName} is really committed to this.`
                            : `They're making solid progress. Keep the momentum going!`
                        }
                      </p>
                      <p style="margin: 0; font-size: 14px; color: #9ca3af; font-style: italic;">
                        💡 Maybe drop them a quick note of encouragement? A little "great work!" goes a long way in making clients feel valued.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 24px 40px; border-top: 1px solid #e5e7eb; background-color: #f9fafb; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;">
                      <p style="margin: 0; font-size: 12px; color: #6b7280; text-align: center;">
                        View full progress in your <strong>${workspaceName}</strong> dashboard
                      </p>
                      <p style="margin: 8px 0 0 0; font-size: 11px; color: #9ca3af; text-align: center;">
                        BoardingPass • Building relationships, not just processes
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  }
}

export function getOnboardingCompletedEmail(clientName: string, workspaceName: string, completionTime: string) {
  return {
    subject: `🎉 ${clientName} completed their onboarding - time to celebrate!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; box-shadow: 0 8px 16px rgba(251, 191, 36, 0.3);">
                  <tr>
                    <td style="padding: 48px 40px; text-align: center;">
                      <div style="font-size: 72px; margin-bottom: 16px; animation: bounce 1s ease infinite;">🎊</div>
                      <h1 style="margin: 0 0 16px 0; font-size: 32px; font-weight: 800; color: #78350f;">
                        They did it!
                      </h1>
                      <p style="margin: 0 0 32px 0; font-size: 20px; line-height: 1.5; color: #92400e; font-weight: 600;">
                        <strong>${clientName}</strong> just completed their onboarding!
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 0 40px 40px 40px;">
                      <div style="background: #ffffff; border-radius: 8px; padding: 32px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
                        <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #111827;">
                          This is a big moment!
                        </h2>
                        <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #374151;">
                          ${clientName} trusted you with their project and put in the work to complete every step. That kind of commitment deserves recognition.
                        </p>
                        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin-bottom: 24px; border-radius: 4px;">
                          <p style="margin: 0 0 8px 0; font-size: 14px; color: #92400e; font-weight: 600;">
                            ⏱️ Completed in: ${completionTime}
                          </p>
                          <p style="margin: 0; font-size: 13px; color: #b45309;">
                            This partnership is off to a great start!
                          </p>
                        </div>
                        <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                          <p style="margin: 0 0 12px 0; font-size: 14px; color: #065f46; font-weight: 600;">
                            💚 Action items:
                          </p>
                          <ul style="margin: 0; padding-left: 20px; color: #047857; font-size: 14px; line-height: 1.8;">
                            <li>Send them a personal thank you note</li>
                            <li>Schedule your kickoff call</li>
                            <li>Surprise them with a welcome gift or bonus</li>
                            <li>Share their details with the delivery team</li>
                          </ul>
                        </div>
                        <p style="margin: 0; font-size: 15px; color: #6b7280; line-height: 1.6; font-style: italic;">
                          Remember: Every great partnership starts with gratitude. Take a moment to thank ${clientName} for choosing you. It matters more than you think.
                        </p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 24px 40px; border-top: 1px solid #fbbf24;">
                      <p style="margin: 0; font-size: 12px; color: #92400e; text-align: center; font-weight: 500;">
                        Celebrate this win! View full details in <strong>${workspaceName}</strong>
                      </p>
                      <p style="margin: 8px 0 0 0; font-size: 11px; color: #b45309; text-align: center;">
                        BoardingPass • Where relationships thrive
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  }
}

export function getReminderEmail(clientName: string, portalLink: string, workspaceName: string, daysWaiting: number) {
  return {
    subject: `${clientName}, we're still here whenever you're ready!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                  <tr>
                    <td style="padding: 40px;">
                      <div style="text-align: center; font-size: 48px; margin-bottom: 16px;">👋</div>
                      <h1 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 600; color: #111827; text-align: center;">
                        Hey ${clientName}, just checking in
                      </h1>
                      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #374151;">
                        No pressure at all - we just wanted to make sure you didn't forget about your onboarding. We know life gets busy!
                      </p>
                      <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; margin-bottom: 24px; border-radius: 4px;">
                        <p style="margin: 0; font-size: 14px; color: #1e40af; line-height: 1.5;">
                          <strong>💙 Real talk:</strong> We get it. New partnerships can feel overwhelming, and maybe you're not sure where to start. That's totally normal! We're here to help make this easy and even enjoyable.
                        </p>
                      </div>
                      <p style="margin: 0 0 24px 0; font-size: 15px; color: #6b7280; line-height: 1.5;">
                        Whenever you're ready, your personalized onboarding portal is waiting. And if anything feels confusing or you just want to talk it through first, hit reply. A real human will answer.
                      </p>
                      <div style="text-align: center;">
                        <a href="${portalLink}" style="display: inline-block; padding: 14px 28px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">
                          Continue Where You Left Off
                        </a>
                      </div>
                      <p style="margin: 24px 0 0 0; font-size: 13px; color: #9ca3af; text-align: center; font-style: italic;">
                        No rush. We're patient. You're worth the wait. ❤️
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 20px 40px; border-top: 1px solid #e5e7eb; background-color: #f9fafb; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;">
                      <p style="margin: 0; font-size: 12px; color: #6b7280; text-align: center;">
                        With patience and support,<br>
                        <strong>The ${workspaceName} Team</strong>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  }
}
