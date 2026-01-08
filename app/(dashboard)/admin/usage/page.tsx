import { createClient } from "@/lib/supabase/server"
import { requireRole } from "@/lib/rbac"
import { getBillingStatus } from "@/lib/billing"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function UsagePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return <div>Not authenticated</div>

  const { data: profile } = await supabase.from("profiles").select("current_workspace_id").eq("id", user.id).single()

  if (!profile?.current_workspace_id) return <div>No workspace</div>

  await requireRole(["admin"], profile.current_workspace_id)

  const billingStatus = await getBillingStatus(profile.current_workspace_id)

  if (!billingStatus) {
    return <div>No billing account found</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Usage & Billing</h1>
        <p className="text-gray-600">Current plan: {billingStatus.plan}</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Jobs Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Jobs This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold">
                {billingStatus.usage.jobs}/{billingStatus.limits.jobs}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${billingStatus.percentages.jobs}%` }} />
              </div>
              <p className="text-sm text-gray-600">{billingStatus.percentages.jobs}% of limit</p>
            </div>
          </CardContent>
        </Card>

        {/* Proofs Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Proofs This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold">
                {billingStatus.usage.proofs}/{billingStatus.limits.proofs}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${billingStatus.percentages.proofs}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">{billingStatus.percentages.proofs}% of limit</p>
            </div>
          </CardContent>
        </Card>

        {/* Sites Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Sites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold">
                {billingStatus.usage.sites}/
                {billingStatus.limits.sites === Number.POSITIVE_INFINITY ? "∞" : billingStatus.limits.sites}
              </div>
              {billingStatus.limits.sites !== Number.POSITIVE_INFINITY && (
                <>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${billingStatus.percentages.sites}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600">{billingStatus.percentages.sites}% of limit</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {billingStatus.plan === "free" && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle>Ready to Scale?</CardTitle>
            <CardDescription>
              You're on the Free plan. Upgrade to Pro for higher limits and advanced features.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <button className="bg-blue-600 text-white px-4 py-2 rounded">Upgrade to Pro</button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Plan Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="font-semibold">Plan Tier</p>
              <p className="text-gray-600 capitalize">{billingStatus.plan}</p>
            </div>
            <div>
              <p className="font-semibold">Billing Status</p>
              <p className="text-gray-600 capitalize">{billingStatus.status}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
