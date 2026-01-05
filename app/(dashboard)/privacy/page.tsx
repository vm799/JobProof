import { Card } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <h1 className="text-balance text-3xl font-semibold tracking-tight">Privacy Policy</h1>
        <p className="mt-1 text-muted-foreground">Last updated: January 2025</p>
      </div>

      <Card className="p-6 space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3">Information We Collect</h2>
          <p className="text-muted-foreground">
            We collect information you provide directly to us, including your name, email address, and workspace data.
            This information is used solely to provide and improve our services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">How We Use Your Information</h2>
          <p className="text-muted-foreground">
            We use the information we collect to operate, maintain, and improve our services, to communicate with you,
            and to protect our users and services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Data Security</h2>
          <p className="text-muted-foreground">
            We implement industry-standard security measures to protect your data. All data is encrypted in transit and
            at rest using enterprise-grade encryption.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Your Rights</h2>
          <p className="text-muted-foreground">
            You have the right to access, update, or delete your personal information at any time. Contact us at
            privacy@getboardingpass.app for any privacy-related requests.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
          <p className="text-muted-foreground">
            If you have any questions about this Privacy Policy, please contact us at privacy@getboardingpass.app
          </p>
        </section>
      </Card>
    </div>
  )
}
