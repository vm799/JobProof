import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, AlertCircle, CreditCard, Users, Scale } from "lucide-react"
import { ThemeLogo } from "@/components/theme-logo"

export const metadata = {
  title: "Terms of Service | BoardingPass",
  description: "BoardingPass terms of service and usage agreement",
}

export default function TermsPage() {
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
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: January 2025</p>
        </div>

        {/* Key Terms Highlights */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-lg border border-border bg-card">
            <CreditCard className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-semibold mb-2">AppSumo License</h3>
            <p className="text-sm text-muted-foreground">Lifetime access subject to AppSumo refund policy</p>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card">
            <Users className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-semibold mb-2">One Workspace</h3>
            <p className="text-sm text-muted-foreground">One license = one agency workspace</p>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card">
            <AlertCircle className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-semibold mb-2">As-Is Product</h3>
            <p className="text-sm text-muted-foreground">V1 Early Access with active development</p>
          </div>
        </div>

        {/* Terms Content */}
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Agreement to Terms
            </h2>
            <p className="text-muted-foreground mb-4">
              By accessing or using BoardingPass ("the Service"), you agree to be bound by these Terms of Service
              ("Terms"). If you do not agree to these Terms, do not use the Service.
            </p>
            <p className="text-muted-foreground">
              These Terms constitute a legal agreement between you (the "User" or "Customer") and BoardingPass ("we,"
              "us," or "our").
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <CreditCard className="h-6 w-6 text-primary" />
              License & Subscription (AppSumo Edition)
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">1. AppSumo License Grant</h3>
                <p className="text-muted-foreground mb-3">
                  Your AppSumo purchase grants you a <strong>lifetime license</strong> to the BoardingPass platform with
                  the following terms:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>License is non-transferable and tied to the email address used for activation</li>
                  <li>Subject to AppSumo's 60-day refund policy (contact AppSumo for refunds, not BoardingPass)</li>
                  <li>Includes all future updates and improvements to the core platform</li>
                  <li>Does not include premium add-ons or enterprise features (if introduced)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">2. Usage Limits & Restrictions</h3>
                <p className="text-muted-foreground mb-3">
                  <strong>One license is valid for ONE agency workspace.</strong> The following restrictions apply:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>
                    You may not create multiple workspaces under a single license to service separate business entities
                  </li>
                  <li>You may invite team members to your single workspace at no additional cost</li>
                  <li>You may create unlimited clients, flows, and onboarding portals within your workspace</li>
                  <li>White-label customization (logos, colors) applies to your single workspace</li>
                  <li>
                    If you operate multiple agencies or need multiple workspaces, you must purchase additional licenses
                  </li>
                </ul>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  Prohibited Use
                </h3>
                <p className="text-muted-foreground">
                  Creating multiple workspaces under one license, reselling access, or using the platform for purposes
                  other than your own agency's client onboarding is strictly prohibited and may result in license
                  termination.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Scale className="h-6 w-6 text-primary" />
              Service Availability & Liability
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">1. "As-Is" Service</h3>
                <p className="text-muted-foreground mb-3">
                  BoardingPass is provided <strong>"AS-IS"</strong> and <strong>"AS AVAILABLE"</strong> without
                  warranties of any kind. You acknowledge:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>This is a V1 product in active development</li>
                  <li>Features and functionality are subject to change</li>
                  <li>We do not guarantee uninterrupted, error-free, or secure operation</li>
                  <li>You use the Service at your own risk</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">2. Uptime & Service Level</h3>
                <p className="text-muted-foreground mb-3">
                  While we maintain a <strong>99% uptime goal</strong>, we make no guarantees regarding:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Service availability or performance</li>
                  <li>Data backup or recovery (though we implement best practices)</li>
                  <li>Compatibility with third-party services</li>
                  <li>Scheduled maintenance windows (we will provide advance notice when possible)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">3. Limitation of Liability</h3>
                <p className="text-muted-foreground mb-3">TO THE MAXIMUM EXTENT PERMITTED BY LAW:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>We are NOT liable for any business interruption, lost profits, or lost data</li>
                  <li>We are NOT liable for any indirect, incidental, or consequential damages</li>
                  <li>Our total liability to you shall not exceed the amount you paid for your AppSumo license</li>
                  <li>
                    We are NOT responsible for client-side issues (browser compatibility, internet connection, etc.)
                  </li>
                </ul>
              </div>

              <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  Critical Disclaimer
                </h3>
                <p className="text-muted-foreground">
                  BoardingPass is not liable for any disruption to your client onboarding processes, missed client
                  communications, or business interruptions during the onboarding transition. You should always maintain
                  backup communication methods with your clients.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Acceptable Use Policy</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">You May Not Use BoardingPass To:</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Send spam, unsolicited emails, or phishing attempts</li>
                  <li>Upload malicious code, viruses, or malware</li>
                  <li>Attempt to gain unauthorized access to other workspaces or accounts</li>
                  <li>Reverse engineer, decompile, or disassemble the Service</li>
                  <li>Resell, redistribute, or sublicense access to the platform</li>
                  <li>Scrape data or overload our servers with automated requests</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Account Suspension & Termination</h3>
                <p className="text-muted-foreground">
                  We reserve the right to suspend or terminate your account immediately if you violate these Terms,
                  engage in abusive behavior, or use the Service in a manner that harms other users or our
                  infrastructure.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Data Ownership & Privacy</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-3">Your Data Belongs to You</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>You retain all ownership rights to the client data you upload to BoardingPass</li>
                  <li>We will never sell, share, or use your client data for marketing purposes</li>
                  <li>You can export your data at any time</li>
                  <li>Upon account closure, your data will be permanently deleted within 30 days</li>
                </ul>
              </div>

              <div>
                <p className="text-muted-foreground">
                  For details on how we collect, store, and protect your data, please review our{" "}
                  <Link href="/privacy" className="text-primary hover:underline font-medium">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Intellectual Property</h2>
            <p className="text-muted-foreground mb-4">
              BoardingPass, including its software, design, and branding, is protected by copyright, trademark, and
              other intellectual property laws. You are granted a limited license to use the Service for its intended
              purpose, but you do not acquire any ownership rights.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Modifications to Terms</h2>
            <p className="text-muted-foreground mb-4">
              We may update these Terms from time to time. Material changes will be communicated via email. Your
              continued use of BoardingPass after such changes constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Governing Law & Dispute Resolution</h2>
            <p className="text-muted-foreground mb-4">
              These Terms are governed by the laws of the State of Delaware, United States, without regard to conflict
              of law principles. Any disputes shall be resolved through binding arbitration in accordance with the rules
              of the American Arbitration Association.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-muted/50 p-6 rounded-lg border border-border">
              <p className="text-muted-foreground">
                <strong>General Inquiries:</strong>{" "}
                <a href="mailto:support@getboardingpass.app" className="text-primary hover:underline">
                  support@getboardingpass.app
                </a>
              </p>
              <p className="text-muted-foreground mt-2">
                <strong>Legal:</strong>{" "}
                <a href="mailto:legal@getboardingpass.app" className="text-primary hover:underline">
                  legal@getboardingpass.app
                </a>
              </p>
              <p className="text-muted-foreground mt-2">
                <strong>AppSumo Refunds:</strong> Contact AppSumo directly through your AppSumo dashboard
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
