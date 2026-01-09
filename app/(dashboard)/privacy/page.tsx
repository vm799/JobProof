import { Card } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export const metadata = {
  title: "Privacy - JobProof (Internal Demo)",
  description: "Internal demonstration - not actual privacy policy",
  robots: "noindex, nofollow",
}

export default function PrivacyPage() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex items-center gap-3 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
        <AlertCircle className="w-5 h-5 text-yellow-600" />
        <div>
          <h2 className="font-semibold text-yellow-900">Internal Demo - Not Official Privacy Policy</h2>
          <p className="text-sm text-yellow-800">
            This is a demonstration environment. Data handling described here applies only to this demo. For production
            privacy terms, contact support.
          </p>
        </div>
      </div>

      <div>
        <h1 className="text-balance text-3xl font-semibold tracking-tight">Demo Privacy Notice</h1>
        <p className="mt-1 text-muted-foreground">Last updated: January 2025</p>
      </div>

      <Card className="p-6 space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3">Information Collected</h2>
          <p className="text-muted-foreground">
            This demo environment collects account information (name, email) and demonstration data for evaluation
            purposes only.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Data Usage</h2>
          <p className="text-muted-foreground">
            Demo data is used solely for demonstrating product functionality. It may be reset or deleted at any time.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Data Retention</h2>
          <p className="text-muted-foreground">
            This is a demo environment. There is no guarantee of data retention. Do not store production or sensitive
            data here.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Your Rights</h2>
          <p className="text-muted-foreground">For requests related to this demo, contact support@jobproof.com</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Contact</h2>
          <p className="text-muted-foreground">
            If you have questions about this demo environment, contact support@jobproof.com
          </p>
        </section>
      </Card>
    </div>
  )
}
