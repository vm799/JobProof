import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Lock, Database, Clock, Eye, CheckCircle2 } from "lucide-react"
import { ThemeLogo } from "@/components/theme-logo"

export const metadata = {
  title: "Privacy Policy | BoardingPass",
  description: "BoardingPass privacy policy and data protection practices",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <ThemeLogo width={600} height={140} className="h-[8.75rem] w-auto" priority />
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: January 2025</p>
        </div>

        {/* Key Security Highlights */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-lg border border-border bg-card">
            <Database className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-semibold mb-2">Data Isolation</h3>
            <p className="text-sm text-muted-foreground">
              Row Level Security ensures your agency data is logically isolated
            </p>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card">
            <Lock className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-semibold mb-2">Encryption</h3>
            <p className="text-sm text-muted-foreground">TLS 1.3 in transit, AES-256 at rest</p>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card">
            <Clock className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-semibold mb-2">Secure Links</h3>
            <p className="text-sm text-muted-foreground">Magic links expire after 7 days automatically</p>
          </div>
        </div>

        {/* Privacy Policy Content */}
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              Data Protection
            </h2>
            <p className="text-muted-foreground mb-4">
              BoardingPass is committed to protecting the privacy and security of your data. We implement
              industry-leading security practices to ensure your client information remains safe and private.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">1. Data Isolation & Row Level Security (RLS)</h3>
                <p className="text-muted-foreground mb-3">
                  We utilize <strong>Row Level Security (RLS)</strong> at the database level to ensure complete
                  workspace isolation:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Agency A can never access Agency B's clients, flows, or onboarding data</li>
                  <li>All database queries automatically filter by workspace_id</li>
                  <li>Zero-trust architecture prevents cross-workspace data leakage</li>
                  <li>Each agency workspace operates as a logically isolated environment</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">2. Data Encryption</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>
                    <strong>In Transit:</strong> All data transmitted between your browser and our servers uses TLS 1.3
                    encryption
                  </li>
                  <li>
                    <strong>At Rest:</strong> All stored data is encrypted using AES-256 encryption
                  </li>
                  <li>Database backups are encrypted and stored in secure, geographically distributed locations</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">3. Authentication & Access Control</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>
                    <strong>Magic Links:</strong> Client onboarding portals use cryptographically secure magic links
                    that automatically expire after 7 days
                  </li>
                  <li>Email verification required for all new accounts</li>
                  <li>Role-based access control (RBAC) for team members</li>
                  <li>Session management with automatic timeout after inactivity</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Eye className="h-6 w-6 text-primary" />
              Data Collection & Usage
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Information We Collect</h3>
                <p className="text-muted-foreground mb-3">We collect the following types of information:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>
                    <strong>Account Information:</strong> Name, email address, company name
                  </li>
                  <li>
                    <strong>Client Data:</strong> Information you enter about your clients (names, emails, contact
                    details)
                  </li>
                  <li>
                    <strong>Onboarding Content:</strong> Custom forms, flows, and client responses
                  </li>
                  <li>
                    <strong>Usage Data:</strong> Analytics on feature usage, completion rates, and system performance
                  </li>
                  <li>
                    <strong>Technical Data:</strong> IP addresses, browser type, device information
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">How We Use Your Data</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>To provide and maintain the BoardingPass service</li>
                  <li>To send onboarding links and automated reminders to your clients</li>
                  <li>To provide customer support and respond to your requests</li>
                  <li>To improve our product and develop new features</li>
                  <li>To detect and prevent fraud, abuse, and security incidents</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Data Retention</h3>
                <p className="text-muted-foreground">
                  We retain your data for as long as your account is active. If you close your account, we will delete
                  your data within 30 days unless we are required to retain it for legal compliance. You can request
                  data deletion at any time by contacting{" "}
                  <a href="mailto:admin@getboardingpass.app" className="text-primary hover:underline">
                    admin@getboardingpass.app
                  </a>
                  .
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-primary" />
              Your Rights (GDPR & CCPA)
            </h2>
            <p className="text-muted-foreground mb-4">
              If you are located in the European Union or California, you have the following rights:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                <strong>Right to Access:</strong> Request a copy of all personal data we hold about you
              </li>
              <li>
                <strong>Right to Rectification:</strong> Correct any inaccurate or incomplete data
              </li>
              <li>
                <strong>Right to Erasure:</strong> Request deletion of your personal data ("right to be forgotten")
              </li>
              <li>
                <strong>Right to Restrict Processing:</strong> Limit how we use your data
              </li>
              <li>
                <strong>Right to Data Portability:</strong> Receive your data in a structured, machine-readable format
              </li>
              <li>
                <strong>Right to Object:</strong> Opt-out of certain data processing activities
              </li>
            </ul>
            <p className="text-muted-foreground mt-4">
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:admin@getboardingpass.app" className="text-primary hover:underline">
                admin@getboardingpass.app
              </a>
              .
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Third-Party Services</h2>
            <p className="text-muted-foreground mb-4">We use the following trusted third-party services:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                <strong>Supabase:</strong> Database hosting and authentication (SOC 2 Type II certified)
              </li>
              <li>
                <strong>Vercel:</strong> Application hosting and CDN
              </li>
              <li>
                <strong>Resend:</strong> Transactional email delivery
              </li>
            </ul>
            <p className="text-muted-foreground mt-4">
              These providers are carefully selected for their security practices and GDPR compliance.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Security Incidents</h2>
            <p className="text-muted-foreground">
              In the unlikely event of a data breach, we will notify affected users within 72 hours as required by GDPR
              and applicable laws. We maintain an incident response plan and conduct regular security audits.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Children's Privacy</h2>
            <p className="text-muted-foreground">
              BoardingPass is not intended for use by individuals under the age of 18. We do not knowingly collect
              personal information from children.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Updates to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by email
              or through an in-app notification. Your continued use of BoardingPass after such changes constitutes
              acceptance of the updated policy.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-muted/50 p-6 rounded-lg border border-border">
              <p className="text-muted-foreground">
                <strong>Email:</strong>{" "}
                <a href="mailto:admin@getboardingpass.app" className="text-primary hover:underline">
                  admin@getboardingpass.app
                </a>
              </p>
              <p className="text-muted-foreground mt-2">
                <strong>Response Time:</strong> Within 48 hours for privacy-related inquiries
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-muted/30 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 BoardingPass. All rights reserved. |{" "}
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
            </Link>{" "}
            |{" "}
            <Link href="/terms" className="hover:text-foreground">
              Terms
            </Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
