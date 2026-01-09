import { Card } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export const metadata = {
  title: "Pricing - JobProof (Internal Demo)",
  description: "Internal demonstration only - not for external use",
  robots: "noindex, nofollow",
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <div>
            <h2 className="font-semibold text-yellow-900">Internal Demo Only</h2>
            <p className="text-sm text-yellow-800">
              This is an internal demonstration of JobProof. Pricing information is for reference only and not available
              for external purchase.
            </p>
          </div>
        </div>

        <Card className="p-6">
          <h1 className="text-3xl font-bold mb-4">JobProof Pricing (Reference)</h1>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Free Plan</h3>
              <p className="text-muted-foreground">5 sites • 50 jobs/month • Basic features</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Pro Plan</h3>
              <p className="text-muted-foreground">50 sites • 500 jobs/month • Advanced analytics</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Enterprise Plan</h3>
              <p className="text-muted-foreground">Unlimited sites • Unlimited jobs • Custom integrations</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-blue-50 border-blue-200">
          <p className="text-sm text-blue-900">
            To explore features in the live demo environment, visit the{" "}
            <a href="/dashboard" className="font-semibold underline">
              dashboard
            </a>
            . Payment flows are not active in this demonstration.
          </p>
        </Card>
      </div>
    </div>
  )
}
