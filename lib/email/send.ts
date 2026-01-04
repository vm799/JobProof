export { sendEmail } from "./resend"
import { sendEmail } from "./resend"
import { getOnboardingInviteEmail, getStepCompletedEmail, getOnboardingCompletedEmail } from "./templates"

export async function sendOnboardingInvite(
  email: string,
  clientName: string,
  portalLink: string,
  workspaceName: string,
) {
  const template = getOnboardingInviteEmail(clientName, portalLink, workspaceName)
  return sendEmail({ to: email, subject: template.subject, html: template.html })
}

export async function sendStepCompletedNotification(
  email: string,
  clientName: string,
  stepTitle: string,
  workspaceName: string,
) {
  const template = getStepCompletedEmail(clientName, stepTitle, workspaceName)
  return sendEmail({ to: email, subject: template.subject, html: template.html })
}

export async function sendOnboardingCompletedNotification(email: string, clientName: string, workspaceName: string) {
  const template = getOnboardingCompletedEmail(clientName, workspaceName)
  return sendEmail({ to: email, subject: template.subject, html: template.html })
}
