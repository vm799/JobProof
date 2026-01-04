"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Gift, Sparkles, ArrowRight } from "lucide-react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

const tiers = {
  tier_1: { name: "Tier 1", clients: 10, flows: 3, members: 3 },
  tier_2: { name: "Tier 2", clients: 25, flows: 10, members: 5 },
  tier_3: { name: "Tier 3", clients: 999999, flows: 999999, members: 999999 },
}

interface RedeemContentProps {
  workspace: any
  subscription: any
  licenses: any[]
}

export function RedeemContent({ workspace, subscription, licenses }: RedeemContentProps) {
  const [code, setCode] = useState("")
  const [isRedeeming, setIsRedeeming] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const currentTier = workspace.plan_tier || "tier_1"
  const redeemedCount = licenses.length

  const handleRedeem = async () => {
    setIsRedeeming(true)

    try {
      const { data: existingLicense } = await supabase
        .from("appsumo_licenses")
        .select("*")
        .eq("license_code", code)
        .single()

      if (existingLicense) {
        if (existingLicense.workspace_id) {
          throw new Error("This code has already been redeemed")
        }
      }

      if (code.length < 8) {
        throw new Error("Invalid code format")
      }

      let newTierLevel = 1
      if (code.includes("T2") || code.includes("TIER2")) {
        newTierLevel = 2
      } else if (code.includes("T3") || code.includes("TIER3")) {
        newTierLevel = 3
      }

      const currentTierLevel = Number.parseInt(currentTier.split("_")[1])
      let finalTier = currentTierLevel

      if (redeemedCount === 0) {
        // First code - set to code's tier
        finalTier = newTierLevel
      } else {
        // Stacking: add one tier level per additional code
        finalTier = Math.min(currentTierLevel + 1, 3)
      }

      const finalTierKey = `tier_${finalTier}` as keyof typeof tiers
      const tierData = tiers[finalTierKey]

      if (!existingLicense) {
        const { error: insertError } = await supabase.from("appsumo_licenses").insert({
          license_code: code,
          workspace_id: workspace.id,
          plan_tier: finalTierKey,
          redeemed_at: new Date().toISOString(),
        })

        if (insertError) throw insertError
      } else {
        const { error: updateError } = await supabase
          .from("appsumo_licenses")
          .update({
            workspace_id: workspace.id,
            plan_tier: finalTierKey,
            redeemed_at: new Date().toISOString(),
          })
          .eq("license_code", code)

        if (updateError) throw updateError
      }

      const { error: workspaceError } = await supabase
        .from("workspaces")
        .update({
          plan_tier: finalTierKey,
        })
        .eq("id", workspace.id)

      if (workspaceError) throw workspaceError

      const { error: subError } = await supabase
        .from("subscriptions")
        .update({
          plan_tier: finalTierKey,
          max_active_onboardings: tierData.clients,
          max_custom_flows: tierData.flows,
          max_team_members: tierData.members,
          status: "active",
        })
        .eq("workspace_id", workspace.id)

      if (subError) throw subError

      toast({
        title: "Code redeemed successfully!",
        description:
          redeemedCount === 0
            ? `Your plan has been upgraded to ${tierData.name}`
            : `Your plan has been upgraded to ${tierData.name} through code stacking`,
      })

      setCode("")
      router.refresh()
    } catch (err: any) {
      console.error("[v0] Redeem error:", err)
      toast({
        title: "Failed to redeem code",
        description: err.message || "Please check your code and try again",
        variant: "destructive",
      })
    } finally {
      setIsRedeeming(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col gap-6 p-6 md:p-10">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-8">
          <h1 className="text-balance text-4xl font-bold tracking-tight">Redeem Your AppSumo Code</h1>
          <p className="mt-2 text-lg text-muted-foreground">Unlock powerful features with your license code</p>
        </div>

        <Card className="mb-6 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Gift className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="mb-2 text-xl font-semibold">
                Current Plan: {tiers[currentTier as keyof typeof tiers].name}
              </h2>
              <p className="text-muted-foreground">
                {redeemedCount === 0
                  ? "You haven't redeemed any codes yet"
                  : `${redeemedCount} ${redeemedCount === 1 ? "code" : "codes"} redeemed`}
              </p>
            </div>
            <Badge variant="outline" className="text-lg">
              {tiers[currentTier as keyof typeof tiers].clients === 999999
                ? "Unlimited"
                : `${tiers[currentTier as keyof typeof tiers].clients} Clients`}
            </Badge>
          </div>
        </Card>

        {redeemedCount > 0 && (
          <Card className="mb-6 border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-amber-500/10 p-6">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <div>
                <h3 className="font-semibold">Code Stacking Enabled</h3>
                <p className="text-sm text-muted-foreground">
                  Redeem additional codes to upgrade to the next tier automatically
                </p>
              </div>
            </div>
          </Card>
        )}

        <Card className="p-8">
          <h2 className="mb-4 text-2xl font-semibold">Enter Your Code</h2>
          <p className="mb-6 text-muted-foreground">
            Enter your AppSumo license code below. If you have multiple codes, you can stack them to upgrade your tier.
          </p>

          <div className="flex gap-3">
            <Input
              placeholder="APPSUMO-XXXX-XXXX-XXXX"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="flex-1 text-lg"
              disabled={isRedeeming}
            />
            <Button size="lg" onClick={handleRedeem} disabled={!code || isRedeeming} className="gap-2">
              {isRedeeming ? "Redeeming..." : "Redeem Code"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        {licenses.length > 0 && (
          <Card className="mt-6 p-6">
            <h3 className="mb-4 text-lg font-semibold">Redeemed Codes</h3>
            <div className="space-y-3">
              {licenses.map((license, index) => (
                <div key={license.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <Badge>Code {index + 1}</Badge>
                    <span className="font-mono text-sm">{license.license_code}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{tiers[license.plan_tier as keyof typeof tiers].name}</Badge>
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card className="mt-6 p-6">
          <h3 className="mb-4 text-lg font-semibold">How Code Stacking Works</h3>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                1
              </div>
              <div>
                <p className="font-medium">First Code</p>
                <p className="text-sm text-muted-foreground">Sets your initial tier based on the code's tier level</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                2
              </div>
              <div>
                <p className="font-medium">Additional Codes</p>
                <p className="text-sm text-muted-foreground">
                  Each additional code upgrades you to the next tier level
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                3
              </div>
              <div>
                <p className="font-medium">Maximum Tier</p>
                <p className="text-sm text-muted-foreground">Stack up to Tier 3 for unlimited access to all features</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
