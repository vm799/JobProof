import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getBillingStatus } from "@/lib/billing"
import { requireRole } from "@/lib/rbac"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, ExternalLink } from "lucide-react"

export const metadata = {
  title: "Billing - JobProof (Demo)",
  robots: "noindex",
}

export default async function BillingPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options)
        })
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase.from("profiles").select("current_workspace_id").eq("id", user.id).single()

  if (!profile?.current_workspace_id) redirect("/onboarding")

  await requireRole(["admin"], profile.current_workspace_id)

  const { data: workspace } = await supabase
    .from("workspaces")
    .select("*")
    .eq("id", profile.current_workspace_id)
    .single()

  const billingStatus = await getBillingStatus(profile.current_workspace_id)

  const { data: billing } = await supabase
    .from("billing_accounts")
    .select("*")
    .eq("workspace_id", profile.current_workspace_id)
    .single()

  if (!billingStatus || !billing) {
    return <div>Billing information not available</div>
  }

  const planDetails = {
    free: {
      name: "Free",
      price: "$0",
      period: "/month",
      color: "bg-gray-100",
    },
    pro: {
      name: "Pro",
      price: "$49",
      period: "/month",
      color: "bg-blue-100",
    },
    enterprise: {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      color: "bg-purple-100",
    },
  }

  const currentPlan = planDetails[billingStatus.plan]

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
        <AlertCircle className="w-5 h-5 text-yellow-600" />
        <div>
          <h2 className="font-semibold text-yellow-900">Demo Mode</h2>
          <p className="text-sm text-yellow-800">
            Payment flows are not active in this demonstration. Plan features are for reference only.
          </p>
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Billing & Plan</h1>
        <p className="text-gray-600 mt-2">View your demo plan and usage</p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>Your demo plan assignment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className={`p-6 rounded-lg ${currentPlan.color}`}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold">{currentPlan.name}</h3>
                <p className="text-lg mt-2">
                  {currentPlan.price}
                  <span className="text-sm text-gray-600">{currentPlan.period}</span>
                </p>
              </div>
              <Badge variant="outline">{billingStatus.status}</Badge>
            </div>
          </div>

          {/* Plan limits */}
          <div className="space-y-4">
            <h4 className="font-semibold">Your Demo Limits</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Sites</span>
                  <span className="text-sm text-gray-600">
                    {billingStatus.usage.sites} /{" "}
                    {billingStatus.limits.sites === Number.POSITIVE_INFINITY ? "Unlimited" : billingStatus.limits.sites}
                  </span>
                </div>
                {billingStatus.limits.sites !== Number.POSITIVE_INFINITY && (
                  <Progress value={billingStatus.percentages.sites} className="h-2" />
                )}
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Jobs This Month</span>
                  <span className="text-sm text-gray-600">
                    {billingStatus.usage.jobs} /{" "}
                    {billingStatus.limits.jobs === Number.POSITIVE_INFINITY ? "Unlimited" : billingStatus.limits.jobs}
                  </span>
                </div>
                {billingStatus.limits.jobs !== Number.POSITIVE_INFINITY && (
                  <Progress value={billingStatus.percentages.jobs} className="h-2" />
                )}
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Proofs This Month</span>
                  <span className="text-sm text-gray-600">
                    {billingStatus.usage.proofs} /{" "}
                    {billingStatus.limits.proofs === Number.POSITIVE_INFINITY
                      ? "Unlimited"
                      : billingStatus.limits.proofs}
                  </span>
                </div>
                {billingStatus.limits.proofs !== Number.POSITIVE_INFINITY && (
                  <Progress value={billingStatus.percentages.proofs} className="h-2" />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing Information */}
      <Card>
        <CardHeader>
          <CardTitle>Demo Account Information</CardTitle>
          <CardDescription>Demo account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Account Email</label>
            <p className="text-gray-700">{billing.billing_email || "Not set"}</p>
          </div>

          {billing.current_period_start && billing.current_period_end && (
            <div>
              <label className="text-sm font-medium">Demo Period</label>
              <p className="text-gray-700">
                {new Date(billing.current_period_start).toLocaleDateString()} -{" "}
                {new Date(billing.current_period_end).toLocaleDateString()}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stripe Payment Link section for test checkout */}
      <Card>
        <CardHeader>
          <CardTitle>Test Checkout</CardTitle>
          <CardDescription>Try the Stripe test payment flow</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-700">
            Click the button below to open a Stripe test checkout in a new window. This is a demonstration only—no
            actual payment will be processed, and no data will be stored in this application.
          </p>
          <div className="flex gap-3">
            <a
              href="https://buy.stripe.com/test_9B6bJ33Aj2ZoegK4hNaVa00"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Open Stripe Checkout (Test)
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Opens Stripe test checkout in a new window. No data is stored in this app.
          </p>
        </CardContent>
      </Card>

      {/* Information about demo mode */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">About This Demo</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-900 space-y-3">
          <p>This is a demonstration environment for evaluating JobProof features.</p>
          <p>
            Payment flows, upgrades, and downgrades are not functional in the demo. To explore full capabilities or
            discuss pricing, contact our team.
          </p>
          <p className="font-medium">Demo data may be reset at any time. Do not store production data here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
