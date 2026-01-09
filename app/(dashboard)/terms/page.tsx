import { Card } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export const metadata = {
  title: "Terms - JobProof (Internal Demo)",
  description: "Internal demonstration - not legal terms",
  robots: "noindex, nofollow",
}

export default function TermsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex items-center gap-3 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
        <AlertCircle className="w-5 h-5 text-yellow-600" />
        <div>
          <h2 className="font-semibold text-yellow-900">Internal Demo - Not Legal Terms</h2>
          <p className="text-sm text-yellow-800">
            This is a demonstration environment. These are not binding legal terms. For actual terms of service, contact
            support.
          </p>
        </div>
      </div>

      <div>
        <h1 className="text-balance text-3xl font-semibold tracking-tight">Demo Terms of Service</h1>
        <p className="mt-1 text-muted-foreground">Last updated: January 2025</p>
      </div>

      <Card className="p-6 space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3">Purpose</h2>
          <p className="text-muted-foreground">
            This is an internal demonstration environment for JobProof. It is not intended for production use or
            external users.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Acceptance of Terms</h2>
          <p className="text-muted-foreground">
            By accessing and using this demo, you accept that this is for evaluation purposes only.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">User Responsibilities</h2>
          <p className="text-muted-foreground">
            You are responsible for maintaining the confidentiality of your demo account. Do not share credentials or
            use production data.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Demo Environment</h2>
          <p className="text-muted-foreground">
            This is a demonstration environment. Data may be reset, modified, or deleted at any time without notice.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Contact</h2>
          <p className="text-muted-foreground">
            For questions about this demo environment, contact support@jobproof.com
          </p>
        </section>
      </Card>
    </div>
  )
}
