export function getWelcomeEmail(name: string) {
  return {
    subject: "Welcome to JobProof!",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Welcome to JobProof!</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>Thanks for signing up! We're excited to help you streamline your field service operations.</p>

              <h3>Quick Start Guide:</h3>
              <ol>
                <li><strong>Create your first workflow</strong> - Build a custom job template or use an existing one</li>
                <li><strong>Add your sites</strong> - Set up job locations</li>
                <li><strong>Assign jobs</strong> - Send job links to your field workers</li>
                <li><strong>Track progress</strong> - Monitor completion in real-time from your dashboard</li>
              </ol>

              <p>Need help getting started? Check out our <a href="https://jobproof.app/help">Help Center</a> or <a href="https://jobproof.app/faq">FAQ</a>.</p>

              <div style="text-align: center;">
                <a href="https://jobproof.app/dashboard" class="button">Go to Dashboard</a>
              </div>

              <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
                Questions? Reply to this email - we typically respond within 24 hours.
              </p>
            </div>
            <div class="footer">
              <p>JobProof - Field Service Proof of Work</p>
              <p><a href="https://jobproof.app" style="color: #667eea;">jobproof.app</a></p>
            </div>
          </div>
        </body>
      </html>
    `,
  }
}

export function getOnboardingInviteEmail(clientName: string, portalLink: string, workspaceName: string) {
  return {
    subject: `${workspaceName} - Your Job Portal is Ready`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 14px 40px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: 600; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Job Assignment: ${clientName}</h1>
            </div>
            <div class="content">
              <p>Hi,</p>
              <p>You have a new job assignment from <strong>${workspaceName}</strong>.</p>

              <p>Your job portal includes:</p>
              <ul>
                <li>Step-by-step instructions</li>
                <li>Required tasks and documentation</li>
                <li>Photo upload for proof of work</li>
                <li>Real-time progress tracking</li>
              </ul>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${portalLink}" class="button">Start Job</a>
              </div>

              <p style="color: #6b7280; font-size: 14px;">
                Bookmark this link for easy access. You can return anytime to track your progress and complete steps.
              </p>

              <p style="margin-top: 30px;">
                Questions? Contact your supervisor or reply to this email.
              </p>
            </div>
            <div class="footer">
              <p>${workspaceName}</p>
              <p style="font-size: 12px; color: #9ca3af;">Powered by JobProof</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }
}

export function getStepCompletedEmail(clientName: string, stepTitle: string, workspaceName: string) {
  return {
    subject: `${clientName} completed: ${stepTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #10b981; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
            .success-badge { display: inline-block; background: #d1fae5; color: #065f46; padding: 8px 16px; border-radius: 20px; font-weight: 600; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Step Completed</h1>
            </div>
            <div class="content">
              <div style="text-align: center; margin-bottom: 20px;">
                <span class="success-badge">Progress Update</span>
              </div>

              <p><strong>${clientName}</strong> has completed a step in their job:</p>

              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin: 0; color: #374151;">${stepTitle}</h3>
              </div>

              <p>Check your dashboard to see their overall completion status and next steps.</p>

              <div style="text-align: center;">
                <a href="https://jobproof.app/dashboard" class="button">View Dashboard</a>
              </div>
            </div>
            <div class="footer">
              <p>${workspaceName}</p>
              <p style="font-size: 12px; color: #9ca3af;">Powered by JobProof</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }
}

export function getOnboardingCompletedEmail(clientName: string, workspaceName: string) {
  return {
    subject: `${clientName} completed their job!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); color: white; padding: 40px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
            .celebration { font-size: 48px; text-align: center; margin: 20px 0; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Job Complete!</h1>
            </div>
            <div class="content">
              <div class="celebration">✓</div>

              <p><strong>${clientName}</strong> has successfully completed their job!</p>

              <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0; color: #92400e;">
                  <strong>All steps completed!</strong> The job is now ready for review.
                </p>
              </div>

              <p>Next steps:</p>
              <ul>
                <li>Review their submitted proof of work</li>
                <li>Verify uploaded photos and documentation</li>
                <li>Mark job as verified if satisfactory</li>
              </ul>

              <div style="text-align: center;">
                <a href="https://jobproof.app/sites" class="button">View Job Details</a>
              </div>
            </div>
            <div class="footer">
              <p>${workspaceName}</p>
              <p style="font-size: 12px; color: #9ca3af;">Powered by JobProof</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }
}
