export function getWelcomeEmail(name: string) {
  return {
    subject: "Welcome to BoardingPass! 🎉",
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
              <h1 style="margin: 0;">Welcome to BoardingPass!</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>Thanks for signing up! We're excited to help you streamline your client onboarding process.</p>
              
              <h3>Quick Start Guide:</h3>
              <ol>
                <li><strong>Create your first flow</strong> - Build a custom onboarding workflow or use a template</li>
                <li><strong>Add your clients</strong> - Invite clients and assign them to flows</li>
                <li><strong>Share their portal</strong> - Send clients their personalized onboarding link</li>
                <li><strong>Track progress</strong> - Monitor completion in real-time from your dashboard</li>
              </ol>

              <p>Need help getting started? Check out our <a href="https://getboardingpass.app/help">Help Center</a> or <a href="https://getboardingpass.app/faq">FAQ</a>.</p>

              <div style="text-align: center;">
                <a href="https://getboardingpass.app/dashboard" class="button">Go to Dashboard</a>
              </div>

              <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
                Questions? Reply to this email - we typically respond within 24 hours.
              </p>
            </div>
            <div class="footer">
              <p>BoardingPass - Client Onboarding Made Simple</p>
              <p><a href="https://getboardingpass.app" style="color: #667eea;">getboardingpass.app</a></p>
            </div>
          </div>
        </body>
      </html>
    `,
  }
}

export function getOnboardingInviteEmail(clientName: string, portalLink: string, workspaceName: string) {
  return {
    subject: `${workspaceName} - Your Onboarding Portal is Ready`,
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
              <h1 style="margin: 0;">Welcome, ${clientName}!</h1>
            </div>
            <div class="content">
              <p>Hi ${clientName},</p>
              <p>We've created a personalized onboarding portal for you at <strong>${workspaceName}</strong>.</p>
              
              <p>Your portal includes:</p>
              <ul>
                <li>✅ Step-by-step guidance</li>
                <li>📋 All required tasks and documents</li>
                <li>📆 Clear timelines and due dates</li>
                <li>✨ Real-time progress tracking</li>
              </ul>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${portalLink}" class="button">Access Your Portal</a>
              </div>

              <p style="color: #6b7280; font-size: 14px;">
                Bookmark this link for easy access. You can return anytime to track your progress and complete steps.
              </p>

              <p style="margin-top: 30px;">
                Questions? Just reply to this email - we're here to help!
              </p>
            </div>
            <div class="footer">
              <p>${workspaceName}</p>
              <p style="font-size: 12px; color: #9ca3af;">Powered by BoardingPass</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }
}

export function getStepCompletedEmail(clientName: string, stepTitle: string, workspaceName: string) {
  return {
    subject: `✅ ${clientName} completed: ${stepTitle}`,
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
              <h1 style="margin: 0;">🎉 Step Completed!</h1>
            </div>
            <div class="content">
              <div style="text-align: center; margin-bottom: 20px;">
                <span class="success-badge">Progress Update</span>
              </div>
              
              <p><strong>${clientName}</strong> has completed a step in their onboarding:</p>
              
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin: 0; color: #374151;">${stepTitle}</h3>
              </div>

              <p>Great progress! Check your dashboard to see their overall completion status and next steps.</p>

              <div style="text-align: center;">
                <a href="https://getboardingpass.app/dashboard" class="button">View Dashboard</a>
              </div>
            </div>
            <div class="footer">
              <p>${workspaceName}</p>
              <p style="font-size: 12px; color: #9ca3af;">Powered by BoardingPass</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }
}

export function getOnboardingCompletedEmail(clientName: string, workspaceName: string) {
  return {
    subject: `🎊 ${clientName} completed their onboarding!`,
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
              <h1 style="margin: 0;">Onboarding Complete! 🎊</h1>
            </div>
            <div class="content">
              <div class="celebration">🎉 🎊 ✨</div>
              
              <p><strong>${clientName}</strong> has successfully completed their entire onboarding process!</p>
              
              <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0; color: #92400e;">
                  <strong>All steps completed!</strong> Your client is now fully onboarded and ready to go.
                </p>
              </div>

              <p>Next steps:</p>
              <ul>
                <li>Review their completed information</li>
                <li>Send a follow-up thank you message</li>
                <li>Mark them as active in your system</li>
              </ul>

              <div style="text-align: center;">
                <a href="https://getboardingpass.app/clients" class="button">View Client Details</a>
              </div>
            </div>
            <div class="footer">
              <p>${workspaceName}</p>
              <p style="font-size: 12px; color: #9ca3af;">Powered by BoardingPass</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }
}
