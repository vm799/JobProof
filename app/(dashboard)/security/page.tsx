import { Shield, Lock, Eye, Server, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SecurityPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-balance text-3xl font-semibold tracking-tight">Security</h1>
        <p className="mt-1 text-muted-foreground">
          Learn how we protect your data and maintain the highest security standards
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              <CardTitle>Data Encryption</CardTitle>
            </div>
            <CardDescription>End-to-end encryption for all your sensitive data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption.</p>
            <p>Your client data, onboarding flows, and personal information are fully protected.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Authentication</CardTitle>
            </div>
            <CardDescription>Secure authentication powered by Supabase Auth</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Magic link authentication ensures passwordless, secure access to your account.</p>
            <p>Multi-factor authentication and row-level security protect your workspace.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              <CardTitle>Privacy Controls</CardTitle>
            </div>
            <CardDescription>Complete control over your data and privacy settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Your data is isolated per workspace with strict access controls.</p>
            <p>We never share your data with third parties without explicit consent.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-primary" />
              <CardTitle>Infrastructure</CardTitle>
            </div>
            <CardDescription>Enterprise-grade hosting and reliability</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Hosted on Vercel with global CDN for maximum uptime and performance.</p>
            <p>Database powered by Supabase with automatic backups and disaster recovery.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            <CardTitle>Security Best Practices</CardTitle>
          </div>
          <CardDescription>Recommendations for keeping your account secure</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">Use Magic Links</h3>
            <p className="text-sm text-muted-foreground">
              Magic links are more secure than passwords and prevent credential theft.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Monitor Team Access</h3>
            <p className="text-sm text-muted-foreground">
              Regularly review team member permissions and remove access for inactive users.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Client Portal Security</h3>
            <p className="text-sm text-muted-foreground">
              Share unique portal links with clients and revoke access when onboarding is complete.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Report Issues</h3>
            <p className="text-sm text-muted-foreground">
              If you notice any suspicious activity, contact support immediately through the Help Center.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
