import type React from "react"
import { ArrowLeft, CheckCircle2, XCircle, Clock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export const metadata = {
  title: "FAQ - BoardingPass",
  description: "Honest answers to all your questions about BoardingPass - verified against our actual codebase.",
}

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold">Frequently Asked Questions</h1>
          <p className="mt-2 text-muted-foreground text-lg">Honest, evidence-based answers. No marketing fluff.</p>
        </div>
      </div>

      {/* Search */}
      <div className="border-b bg-muted/20">
        <div className="container mx-auto px-4 py-6">
          <Input
            type="search"
            placeholder="Search FAQ... (e.g., 'security', 'Slack integration', 'pricing')"
            className="max-w-2xl"
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Legend */}
        <Card className="p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Answer Status Legend</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium">Implemented</div>
                <div className="text-sm text-muted-foreground">Feature is live and working</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <div className="font-medium">On Roadmap</div>
                <div className="text-sm text-muted-foreground">Planned with timeline</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <XCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <div className="font-medium">Not Planned</div>
                <div className="text-sm text-muted-foreground">Not on our roadmap</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Categories */}
        <div className="space-y-12">
          {/* Architecture & Hosting */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Architecture & Hosting</h2>
            <div className="space-y-6">
              <FAQItem
                status="implemented"
                question="What is your tech stack?"
                answer="Next.js 15, Supabase (PostgreSQL + Auth + Storage), Tailwind CSS v4, TypeScript, Resend, Vercel hosting."
                evidence="package.json, next.config.mjs"
              />
              <FAQItem
                status="implemented"
                question="Where is the data hosted?"
                answer="AWS via Supabase (us-east-1). Your data is stored on AWS infrastructure with RDS PostgreSQL for databases and S3 for files."
              />
              <FAQItem
                status="implemented"
                question="Can I export my data if I leave?"
                answer="YES. Export clients as CSV, flows as CSV, or complete workspace as JSON. Available in Settings → Data Export."
                evidence="app/api/export/*"
              />
              <FAQItem
                status="implemented"
                question="Do you use a CDN?"
                answer="YES. Vercel's Edge Network distributes content globally across 100+ locations for fast load times worldwide."
              />
              <FAQItem
                status="roadmap"
                question="Is there a status page?"
                answer="Not yet. Coming in V1.5 (June 2025)."
                roadmapVersion="V1.5"
              />
            </div>
          </section>

          {/* Security & Compliance */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Security & Compliance</h2>
            <div className="space-y-6">
              <FAQItem
                status="implemented"
                question="Is data encrypted?"
                answer="YES. Data encrypted at rest (AES-256 via AWS) and in transit (TLS 1.3). All connections use HTTPS."
              />
              <FAQItem
                status="implemented"
                question="How are passwords stored?"
                answer="Hashed with Argon2id via Supabase Auth. We never store plain-text passwords."
              />
              <FAQItem
                status="roadmap"
                question="Do you have SOC 2 certification?"
                answer="Not yet. SOC 2 Type II audit starts Q3 2025."
                roadmapVersion="V2.0"
              />
              <FAQItem
                status="roadmap"
                question="Do you support 2FA/MFA?"
                answer="Not yet. Two-factor authentication planned for V2.0 (Enterprise Security)."
                roadmapVersion="V2.0"
              />
              <FAQItem
                status="implemented"
                question="Can I delete my data permanently?"
                answer="YES. Settings → Delete Account removes all your data including workspace, clients, files, and user account."
                evidence="components/delete-account-modal.tsx"
              />
            </div>
          </section>

          {/* UI/UX */}
          <section>
            <h2 className="text-2xl font-bold mb-6">User Experience</h2>
            <div className="space-y-6">
              <FAQItem
                status="implemented"
                question="Can I customize colors to match my brand?"
                answer="YES. Choose your brand color in Settings → White-label. Applies to portal, buttons, and email links."
                evidence="components/settings-content.tsx"
              />
              <FAQItem
                status="implemented"
                question="Can clients complete onboarding on mobile?"
                answer="YES. Client portal is fully mobile-responsive and tested on iOS/Android."
              />
              <FAQItem
                status="implemented"
                question="Does the portal auto-save progress?"
                answer="YES. Form fields save automatically when you click away. Clients never lose their work."
              />
              <FAQItem
                status="roadmap"
                question="Does it support Dark Mode?"
                answer="Not yet. Dark mode coming in V1.1 (February 2025)."
                roadmapVersion="V1.1"
              />
              <FAQItem
                status="implemented"
                question="Are there celebration moments?"
                answer="YES. Confetti animation + success modal when clients complete onboarding. Milestone badges at 50%."
                evidence="components/completion-modal.tsx"
              />
            </div>
          </section>

          {/* Integrations */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Integrations & API</h2>
            <div className="space-y-6">
              <FAQItem
                status="roadmap"
                question="Do you integrate with Slack?"
                answer="Not yet. Slack integration (notifications, slash commands, interactive buttons) coming in V1.2 (March 2025)."
                roadmapVersion="V1.2"
              />
              <FAQItem
                status="roadmap"
                question="Can I connect to Zapier?"
                answer="Not yet. Zapier integration with triggers and actions coming in V1.4 (May 2025). Will connect to 5,000+ apps."
                roadmapVersion="V1.4"
              />
              <FAQItem
                status="roadmap"
                question="Does it integrate with calendars?"
                answer="Not yet. Calendar integration (Calendly, Google Calendar, Microsoft 365) coming in V1.3 (April 2025)."
                roadmapVersion="V1.3"
              />
              <FAQItem
                status="roadmap"
                question="Do you have a public API?"
                answer="Not yet. RESTful API with authentication coming in V1.4 (May 2025) along with Zapier."
                roadmapVersion="V1.4"
              />
              <FAQItem
                status="implemented"
                question="What email service do you use?"
                answer="Resend - modern email API with excellent deliverability. Handles all onboarding invites and reminders."
                evidence="lib/email/resend.ts"
              />
            </div>
          </section>

          {/* Business & Pricing */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Business & Pricing</h2>
            <div className="space-y-6">
              <FAQItem
                status="implemented"
                question="Is the lifetime deal really for life?"
                answer="YES. AppSumo lifetime access means no recurring fees, ever. All future updates included within your tier limits."
              />
              <FAQItem
                status="implemented"
                question="What are the tier limits?"
                answer={
                  <div className="space-y-2">
                    <div>
                      <strong>Tier 1:</strong> 50 active onboardings, 3 team members
                    </div>
                    <div>
                      <strong>Tier 2:</strong> 150 active onboardings, 10 team members
                    </div>
                    <div>
                      <strong>Tier 3:</strong> 500 active onboardings, unlimited team members
                    </div>
                  </div>
                }
                evidence="scripts/003_appsumo_licensing.sql"
              />
              <FAQItem
                status="implemented"
                question="Can I remove BoardingPass branding?"
                answer="PARTIALLY. You can upload your logo and set brand colors. Email footers still mention BoardingPass for deliverability. Full white-label coming in V2.0."
                roadmapVersion="V2.0 for full white-label"
              />
              <FAQItem
                status="implemented"
                question="Do you have pre-made templates?"
                answer="YES. 10+ templates including: Design Client Kickoff, Development Setup, Agency Intake, Freelancer Welcome, and more."
                evidence="scripts/006_create_templates.sql"
              />
            </div>
          </section>

          {/* Technical */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Technical Details</h2>
            <div className="space-y-6">
              <FAQItem
                status="implemented"
                question="What database do you use?"
                answer="PostgreSQL 15 via Supabase. Full SQL database with transactions, constraints, and indexes."
                evidence="scripts/*.sql"
              />
              <FAQItem
                status="implemented"
                question="Is it TypeScript?"
                answer="YES. 100% TypeScript. No JavaScript files in the codebase."
                evidence="tsconfig.json"
              />
              <FAQItem
                status="implemented"
                question="Do you use Server-Side Rendering?"
                answer="YES. Next.js App Router uses React Server Components for better performance and SEO."
              />
              <FAQItem
                status="implemented"
                question="Are there rate limits?"
                answer="YES. Public API endpoints limited to 10 requests/minute per IP. Dashboard requests unlimited for authenticated users."
                evidence="lib/rate-limit.ts"
              />
              <FAQItem
                status="implemented"
                question="How do automated reminders work?"
                answer="Vercel Cron job runs every hour, checks for overdue reminders, sends emails via Resend."
                evidence="app/api/cron/send-reminders/route.ts, vercel.json"
              />
            </div>
          </section>
        </div>

        {/* Footer CTA */}
        <Card className="mt-12 p-8 text-center bg-primary/5">
          <h2 className="text-2xl font-bold mb-2">Still have questions?</h2>
          <p className="text-muted-foreground mb-6">
            Email us at admin@getboardingpass.app - we respond within 24 hours.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild>
              <a href="mailto:admin@getboardingpass.app" rel="noopener noreferrer">
                Contact Support
              </a>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/help">Browse Help Center</Link>
            </Button>
          </div>
        </Card>

        {/* Documentation Links */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            For developers: Additional technical details available in the{" "}
            <Link href="/help" className="underline hover:text-foreground">
              Help Center
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

function FAQItem({
  status,
  question,
  answer,
  evidence,
  roadmapVersion,
}: {
  status: "implemented" | "roadmap" | "not-planned"
  question: string
  answer: React.ReactNode
  evidence?: string
  roadmapVersion?: string
}) {
  const statusConfig = {
    implemented: {
      icon: CheckCircle2,
      color: "text-green-600",
      label: "Implemented",
    },
    roadmap: {
      icon: Clock,
      color: "text-amber-600",
      label: roadmapVersion || "On Roadmap",
    },
    "not-planned": {
      icon: XCircle,
      color: "text-muted-foreground",
      label: "Not Planned",
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Card className="p-6">
      <div className="flex gap-3">
        <Icon className={`h-5 w-5 mt-1 shrink-0 ${config.color}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 className="text-lg font-semibold">{question}</h3>
            <span className={`text-sm font-medium shrink-0 ${config.color}`}>{config.label}</span>
          </div>
          <div className="text-muted-foreground space-y-2">{typeof answer === "string" ? <p>{answer}</p> : answer}</div>
          {evidence && (
            <div className="mt-3 text-xs text-muted-foreground">
              <code className="bg-muted px-2 py-1 rounded">Evidence: {evidence}</code>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
