"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Zap } from "lucide-react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const tiers = {
  tier_1: {
    name: "Tier 1",
    price: "$59",
    clients: "10 Active Clients",
    maxOnboardings: 10,
    maxFlows: 3,
    maxMembers: 3,
    features: ["10 active onboardings", "3 custom flows", "Email support", "Basic analytics", "Client portal"],
  },
  tier_2: {
    name: "Tier 2",
    price: "$119",
    clients: "25 Active Clients",
    popular: true,
    maxOnboardings: 25,
    maxFlows: 10,
    maxMembers: 5,
    features: [
      "25 active onboardings",
      "10 custom flows",
      "Priority email support",
      "Advanced analytics",
      "Client portal",
      "White-label branding",
    ],
  },
  tier_3: {
    name: "Tier 3",
    price: "$239",
    clients: "Unlimited Clients",
    maxOnboardings: 999999,
    maxFlows: 999999,
    maxMembers: 999999,
    features: [
      "Unlimited onboardings",
      "Unlimited custom flows",
      "Priority support + Slack",
      "Advanced analytics",
      "Client portal",
      "White-label branding",
      "API access",
      "Team collaboration",
    ],
  },
}

interface BillingContentProps {
  subscription: any
  usage: {
    activeOnboardings: number
    customFlows: number
    teamMembers: number
  }
  workspaceId: string
}

export function BillingContent({ subscription, usage, workspaceId }: BillingContentProps) {
  const [appSumoCode, setAppSumoCode] = useState("")
  const [isRedeeming, setIsRedeeming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const currentTier = subscription?.plan_tier || "tier_1"
  const currentTierData = tiers[currentTier as keyof typeof tiers]

  const handleRedeemCode = async () => {
    setIsRedeeming(true)
    setError(null)

    try {
      // Check if code already exists
      const { data: existingCode } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("appsumo_code", appSumoCode)
        .single()

      if (existingCode) {
        throw new Error("This code has already been redeemed")
      }

      // Determine tier from code (simplified - in production, validate against AppSumo API)
      let newTier = "tier_1"
      if (appSumoCode.includes("T2") || appSumoCode.includes("TIER2")) {
        newTier = "tier_2"
      } else if (appSumoCode.includes("T3") || appSumoCode.includes("TIER3")) {
        newTier = "tier_3"
      }

      const tierData = tiers[newTier as keyof typeof tiers]

      // Update subscription
      const { error: updateError } = await supabase
        .from("subscriptions")
        .update({
          plan_tier: newTier,
          appsumo_code: appSumoCode,
          max_active_onboardings: tierData.maxOnboardings,
          max_custom_flows: tierData.maxFlows,
          max_team_members: tierData.maxMembers,
          status: "active",
        })
        .eq("workspace_id", workspaceId)

      if (updateError) throw updateError

      router.refresh()
      setAppSumoCode("")
    } catch (err: any) {
      setError(err.message || "Failed to redeem code")
    } finally {
      setIsRedeeming(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-balance text-3xl font-semibold tracking-tight">AppSumo Licensing</h1>
        <p className="mt-1 text-muted-foreground">Manage your JobProof subscription</p>
      </div>

      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Badge className="bg-primary">Current Plan</Badge>
              <Badge variant="outline">{currentTierData.name}</Badge>
            </div>
            <h2 className="text-2xl font-bold">You're on the {currentTierData.name} Plan</h2>
            <p className="mt-1 text-muted-foreground">
              {currentTierData.clients} •{" "}
              {subscription?.appsumo_code ? `Code: ${subscription.appsumo_code}` : "Lifetime access"}
            </p>
          </div>
          <Zap className="h-12 w-12 text-primary" />
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {Object.entries(tiers).map(([key, tier]) => (
          <Card key={key} className={`p-6 ${tier.popular ? "border-primary shadow-lg" : ""}`}>
            {tier.popular && <Badge className="mb-3 bg-primary">Most Popular</Badge>}
            <h3 className="text-xl font-bold">{tier.name}</h3>
            <div className="mb-1 mt-2">
              <span className="text-3xl font-bold">{tier.price}</span>
              <span className="text-sm text-muted-foreground"> one-time</span>
            </div>
            <p className="mb-6 text-sm text-muted-foreground">{tier.clients}</p>
            <ul className="mb-6 space-y-3">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              className="w-full"
              variant={currentTier === key ? "outline" : "default"}
              disabled={currentTier === key}
            >
              {currentTier === key ? "Current Plan" : "Upgrade"}
            </Button>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold">Redeem AppSumo Code</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Have an AppSumo code? Enter it below to activate or upgrade your plan.
        </p>
        {error && <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
        <div className="flex max-w-md gap-3">
          <div className="flex-1">
            <Input
              placeholder="Enter your AppSumo code"
              value={appSumoCode}
              onChange={(e) => setAppSumoCode(e.target.value.toUpperCase())}
              disabled={isRedeeming}
            />
          </div>
          <Button onClick={handleRedeemCode} disabled={!appSumoCode || isRedeeming}>
            {isRedeeming ? "Redeeming..." : "Redeem Code"}
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold">Usage This Month</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <p className="mb-1 text-sm text-muted-foreground">Active Onboardings</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{usage.activeOnboardings}</span>
              <span className="text-muted-foreground">/ {subscription?.max_active_onboardings || 10}</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{
                  width: `${Math.min((usage.activeOnboardings / (subscription?.max_active_onboardings || 10)) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
          <div>
            <p className="mb-1 text-sm text-muted-foreground">Custom Flows</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{usage.customFlows}</span>
              <span className="text-muted-foreground">/ {subscription?.max_custom_flows || 3}</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{
                  width: `${Math.min((usage.customFlows / (subscription?.max_custom_flows || 3)) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
          <div>
            <p className="mb-1 text-sm text-muted-foreground">Team Members</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{usage.teamMembers}</span>
              <span className="text-muted-foreground">/ {subscription?.max_team_members || 3}</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{
                  width: `${Math.min((usage.teamMembers / (subscription?.max_team_members || 3)) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
