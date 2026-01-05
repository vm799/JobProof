import { Card } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <h1 className="text-balance text-3xl font-semibold tracking-tight">Terms of Service</h1>
        <p className="mt-1 text-muted-foreground">Last updated: January 2025</p>
      </div>

      <Card className="p-6 space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3">Acceptance of Terms</h2>
          <p className="text-muted-foreground">
            By accessing and using BoardingPass, you accept and agree to be bound by the terms and provisions of this
            agreement.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Use License</h2>
          <p className="text-muted-foreground">
            Permission is granted to temporarily use BoardingPass for personal or commercial client onboarding purposes.
            This is the grant of a license, not a transfer of title.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">User Responsibilities</h2>
          <p className="text-muted-foreground">
            You are responsible for maintaining the confidentiality of your account and password. You agree to accept
            responsibility for all activities that occur under your account.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Service Availability</h2>
          <p className="text-muted-foreground">
            We strive to provide 99.9% uptime but do not guarantee uninterrupted access to our services. We reserve the
            right to modify or discontinue services with reasonable notice.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Limitation of Liability</h2>
          <p className="text-muted-foreground">
            BoardingPass shall not be liable for any indirect, incidental, special, consequential, or punitive damages
            resulting from your use or inability to use the service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Contact</h2>
          <p className="text-muted-foreground">
            For questions about these Terms, please contact us at legal@getboardingpass.app
          </p>
        </section>
      </Card>
    </div>
  )
}
