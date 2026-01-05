"use client"

import type React from "react"
import { ArrowLeft, CheckCircle2, XCircle, Clock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState } from "react"

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

export default function FAQClientPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const allFAQs = [
    {
      id: "create-flow",
      category: "Getting Started",
      question: "How do I create my first onboarding flow?",
      answer: (
        <>
          <p>1. Go to Dashboard → Click "Create Flow"</p>
          <p>2. Choose a template or start from scratch</p>
          <p>3. Add steps with titles, descriptions, and due dates</p>
          <p>4. Save and share the flow with your clients</p>
        </>
      ),
      status: "implemented",
      evidence: "components/create-flow-modal.tsx",
    },
    {
      id: "invite-client",
      category: "Getting Started",
      question: "How do I invite my first client?",
      answer: (
        <>
          <p>1. Go to Clients → Click "Add Client"</p>
          <p>2. Enter client name and email</p>
          <p>3. Assign them to a flow</p>
          <p>4. Click "Copy Link" or "Email Invite" to share their portal</p>
        </>
      ),
      status: "implemented",
      evidence: "components/clients-list.tsx",
    },
    {
      id: "branding",
      category: "Getting Started",
      question: "How do I customize my workspace branding?",
      answer: (
        <>
          <p>1. Go to Settings → Upload your logo</p>
          <p>2. Choose your brand color (applies to portal and emails)</p>
          <p>3. Save changes - clients will see your branding in their portal</p>
        </>
      ),
      status: "implemented",
      evidence: "components/settings-content.tsx",
    },
    {
      id: "email-notifications",
      category: "Getting Started",
      question: "How do I set up email notifications?",
      answer: (
        <>
          <p>Email notifications are configured automatically using Resend.</p>
          <p>You'll receive notifications when:</p>
          <ul className="list-disc list-inside ml-4">
            <li>A client completes a step</li>
            <li>A client completes their entire onboarding</li>
            <li>A reminder is due (if configured)</li>
          </ul>
          <p className="mt-2">
            <strong>Not receiving emails?</strong> Check the{" "}
            <a href="#email-troubleshooting" className="text-primary underline">
              troubleshooting section
            </a>
            .
          </p>
        </>
      ),
      status: "implemented",
    },
    {
      id: "templates",
      category: "Advanced",
      question: "How do I use flow templates?",
      answer: (
        <>
          <p>1. Go to Templates page</p>
          <p>2. Browse pre-built templates (SEO Onboarding, Social Media, etc.)</p>
          <p>3. Click "Use Template" on any template</p>
          <p>4. Customize the steps for your needs</p>
        </>
      ),
      status: "implemented",
      evidence: "components/templates-library.tsx",
    },
    {
      id: "reminders",
      category: "Advanced",
      question: "How do I set up automated reminders?",
      answer: "Automated reminders run via cron job. Clients receive reminders 24 hours before step due dates.",
      status: "implemented",
      evidence: "app/api/cron/send-reminders/route.ts",
    },
    {
      id: "email-setup",
      category: "Configuration",
      question: "How do I configure email (SMTP/Resend)?",
      answer: (
        <>
          <p>
            <strong>For Self-Hosted Users:</strong>
          </p>
          <ol className="list-decimal list-inside ml-4">
            <li>Get a Resend API key from resend.com</li>
            <li>
              Add to environment variables: <code className="bg-muted px-2 py-1 rounded">RESEND_API_KEY=your_key</code>
            </li>
            <li>
              Set from email: <code className="bg-muted px-2 py-1 rounded">RESEND_FROM_EMAIL=admin@yourdomain.com</code>
            </li>
            <li>Restart your app - emails will now send automatically</li>
          </ol>
          <p className="mt-2">
            <strong>For BoardingPass Cloud:</strong> Email is preconfigured - no setup needed.
          </p>
        </>
      ),
      status: "implemented",
      evidence: "lib/email/resend.ts",
    },
    {
      id: "email-troubleshooting",
      category: "Troubleshooting",
      question: "Why am I not receiving emails?",
      answer: (
        <>
          <p>
            <strong>Common causes:</strong>
          </p>
          <ul className="list-disc list-inside ml-4">
            <li>
              <strong>Missing API key:</strong> Check that <code>RESEND_API_KEY</code> is set
            </li>
            <li>
              <strong>Spam folder:</strong> Check your spam/junk folder
            </li>
            <li>
              <strong>Invalid from address:</strong> Ensure <code>RESEND_FROM_EMAIL</code> uses a verified domain
            </li>
            <li>
              <strong>Rate limits:</strong> Resend has sending limits on free tier (100 emails/day)
            </li>
          </ul>
          <p className="mt-2">
            <strong>How to debug:</strong> Check your server logs for "[v0] Resend error:" or "[v0] Email send error:"
            messages
          </p>
        </>
      ),
      status: "implemented",
    },
    {
      category: "Architecture & Hosting",
      question: "What is your tech stack?",
      answer:
        "Next.js 15, Supabase (PostgreSQL + Auth + Storage), Tailwind CSS v4, TypeScript, Resend, Vercel hosting.",
      status: "implemented",
      evidence: "package.json, next.config.mjs",
    },
    {
      category: "Architecture & Hosting",
      question: "Where is the data hosted?",
      answer:
        "AWS via Supabase (us-east-1). Your data is stored on AWS infrastructure with RDS PostgreSQL for databases and S3 for files.",
      status: "implemented",
    },
    {
      category: "Security & Compliance",
      question: "Is data encrypted?",
      answer: "YES. Data encrypted at rest (AES-256 via AWS) and in transit (TLS 1.3). All connections use HTTPS.",
      status: "implemented",
    },
    {
      category: "Security & Compliance",
      question: "How are passwords stored?",
      answer: "Hashed with Argon2id via Supabase Auth. We never store plain-text passwords.",
      status: "implemented",
    },
    {
      category: "User Experience",
      question: "Can I customize colors to match my brand?",
      answer: "YES. Choose your brand color in Settings → White-label. Applies to portal, buttons, and email links.",
      status: "implemented",
      evidence: "components/settings-content.tsx",
    },
    {
      category: "User Experience",
      question: "Can clients complete onboarding on mobile?",
      answer: "YES. Client portal is fully mobile-responsive and tested on iOS/Android.",
      status: "implemented",
    },
    {
      category: "Integrations & API",
      question: "Do you integrate with Slack?",
      answer: "Not yet. Slack integration coming in V1.2 (March 2025).",
      status: "roadmap",
      roadmapVersion: "V1.2",
    },
    {
      category: "Business & Pricing",
      question: "Is the lifetime deal really for life?",
      answer:
        "YES. AppSumo lifetime access means no recurring fees, ever. All future updates included within your tier limits.",
      status: "implemented",
    },
  ] as const

  const filteredFAQs = searchQuery
    ? allFAQs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : allFAQs

  const groupedByCategory = filteredFAQs.reduce(
    (acc, faq) => {
      if (!acc[faq.category]) acc[faq.category] = []
      acc[faq.category].push(faq)
      return acc
    },
    {} as Record<string, typeof allFAQs>,
  )

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <p className="text-sm text-muted-foreground mt-2">
              Found {filteredFAQs.length} result{filteredFAQs.length !== 1 ? "s" : ""}
            </p>
          )}
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
          {Object.entries(groupedByCategory).map(([category, faqs]) => (
            <section key={category} id={category.toLowerCase().replace(/\s+/g, "-")}>
              <h2 className="text-2xl font-bold mb-6">{category}</h2>
              <div className="space-y-6">
                {faqs.map((faq, idx) => (
                  <div key={idx} id={faq.id}>
                    <FAQItem
                      status={faq.status as any}
                      question={faq.question}
                      answer={faq.answer}
                      evidence={faq.evidence}
                      roadmapVersion={faq.roadmapVersion}
                    />
                  </div>
                ))}
              </div>
            </section>
          ))}

          {filteredFAQs.length === 0 && (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">
                No results found. Try different keywords or{" "}
                <a
                  href="mailto:admin@getboardingpass.app"
                  className="text-primary hover:underline"
                  rel="noopener noreferrer"
                >
                  contact support
                </a>
                .
              </p>
            </Card>
          )}
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

export { FAQClientPage }
