import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getBillingStatus } from "@/lib/billing"
import { requireRole } from "@/lib/rbac"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

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
      <div>
        <h1 className="text-3xl font-bold">Billing & Plan</h1>
        <p className="text-gray-600 mt-2">Manage your subscription and usage</p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>Your active subscription</CardDescription>
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
            <h4 className="font-semibold">Your Limits</h4>
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
          <CardTitle>Billing Information</CardTitle>
          <CardDescription>Email and subscription details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Billing Email</label>
            <p className="text-gray-700">{billing.billing_email || "Not set"}</p>
          </div>

          {billing.stripe_subscription_id && (
            <div>
              <label className="text-sm font-medium">Subscription ID</label>
              <p className="text-gray-700 font-mono text-sm break-all">{billing.stripe_subscription_id}</p>
            </div>
          )}

          {billing.current_period_start && billing.current_period_end && (
            <div>
              <label className="text-sm font-medium">Billing Period</label>
              <p className="text-gray-700">
                {new Date(billing.current_period_start).toLocaleDateString()} -{" "}
                {new Date(billing.current_period_end).toLocaleDateString()}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plan Comparison & Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Options</CardTitle>
          <CardDescription>Upgrade or change your plan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {billingStatus.plan !== "pro" && (
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Upgrade to Pro</h4>
              <p className="text-sm text-gray-600 mb-4">Get 50 sites, 500 jobs/month, and priority support</p>
              <Button className="w-full">Upgrade to Pro - $49/month</Button>
            </div>
          )}

          {billingStatus.plan !== "enterprise" && (
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Enterprise</h4>
              <p className="text-sm text-gray-600 mb-4">Unlimited sites, jobs, and dedicated support</p>
              <Button variant="outline" className="w-full bg-transparent">
                Contact Sales
              </Button>
            </div>
          )}

          {billingStatus.plan !== "free" && (
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Downgrade to Free</h4>
              <p className="text-sm text-gray-600 mb-4">5 sites, 50 jobs/month</p>
              <Button variant="outline" className="w-full text-red-600 bg-transparent">
                Downgrade
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
