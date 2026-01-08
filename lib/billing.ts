"use server"

import { createClient } from "@/lib/supabase/server"

export type PlanTier = "free" | "pro" | "enterprise"

interface PlanLimits {
  max_sites: number
  max_monthly_jobs: number
  max_monthly_proofs: number
}

const PLAN_LIMITS: Record<PlanTier, PlanLimits> = {
  free: {
    max_sites: 5,
    max_monthly_jobs: 50,
    max_monthly_proofs: 100,
  },
  pro: {
    max_sites: 50,
    max_monthly_jobs: 500,
    max_monthly_proofs: 1000,
  },
  enterprise: {
    max_sites: Number.POSITIVE_INFINITY,
    max_monthly_jobs: Number.POSITIVE_INFINITY,
    max_monthly_proofs: Number.POSITIVE_INFINITY,
  },
}

export async function checkBillingLimit(
  workspaceId: string,
  limitType: "sites" | "jobs" | "proofs",
): Promise<{ allowed: boolean; current: number; limit: number; plan: PlanTier }> {
  const supabase = await createClient()

  const { data: billing, error } = await supabase
    .from("billing_accounts")
    .select("plan_tier, monthly_usage_jobs, monthly_usage_proofs, sites_count")
    .eq("workspace_id", workspaceId)
    .single()

  if (error || !billing) {
    return { allowed: true, current: 0, limit: 0, plan: "free" }
  }

  const plan = (billing.plan_tier as PlanTier) || "free"
  const limits = PLAN_LIMITS[plan]

  let current = 0
  let limit = 0

  if (limitType === "sites") {
    current = billing.sites_count || 0
    limit = limits.max_sites
  } else if (limitType === "jobs") {
    current = billing.monthly_usage_jobs || 0
    limit = limits.max_monthly_jobs
  } else if (limitType === "proofs") {
    current = billing.monthly_usage_proofs || 0
    limit = limits.max_monthly_proofs
  }

  return {
    allowed: current < limit,
    current,
    limit,
    plan,
  }
}

export async function enforceLimit(workspaceId: string, limitType: "sites" | "jobs" | "proofs"): Promise<void> {
  const { allowed, current, limit, plan } = await checkBillingLimit(workspaceId, limitType)

  if (!allowed) {
    const message =
      limitType === "sites"
        ? `Site limit reached (${current}/${limit}). Upgrade to ${plan === "free" ? "Pro" : "Enterprise"} for more.`
        : `Monthly ${limitType} limit reached (${current}/${limit}). Upgrade your plan to continue.`

    const error = new Error(message)
    ;(error as any).code = "BILLING_LIMIT_EXCEEDED"
    ;(error as any).plan = plan
    ;(error as any).limit_type = limitType
    ;(error as any).current = current
    ;(error as any).max = limit
    throw error
  }
}

export async function incrementUsageCounter(workspaceId: string, counterType: "jobs" | "proofs"): Promise<void> {
  const supabase = await createClient()

  await enforceLimit(workspaceId, counterType === "jobs" ? "jobs" : "proofs")

  const field = counterType === "jobs" ? "monthly_usage_jobs" : "monthly_usage_proofs"

  await supabase
    .from("billing_accounts")
    .update({ [field]: `${field}+1`, updated_at: new Date().toISOString() })
    .eq("workspace_id", workspaceId)
}

export async function getBillingStatus(workspaceId: string) {
  const supabase = await createClient()

  const { data: billing } = await supabase
    .from("billing_accounts")
    .select(
      "plan_tier, billing_status, monthly_usage_jobs, monthly_usage_proofs, sites_count, max_monthly_jobs, max_monthly_proofs",
    )
    .eq("workspace_id", workspaceId)
    .single()

  if (!billing) return null

  const plan = (billing.plan_tier as PlanTier) || "free"
  const limits = PLAN_LIMITS[plan]

  return {
    plan,
    status: billing.billing_status,
    usage: {
      jobs: billing.monthly_usage_jobs || 0,
      proofs: billing.monthly_usage_proofs || 0,
      sites: billing.sites_count || 0,
    },
    limits: {
      jobs: limits.max_monthly_jobs,
      proofs: limits.max_monthly_proofs,
      sites: limits.max_sites,
    },
    percentages: {
      jobs: Math.round(((billing.monthly_usage_jobs || 0) / limits.max_monthly_jobs) * 100) || 0,
      proofs: Math.round(((billing.monthly_usage_proofs || 0) / limits.max_monthly_proofs) * 100) || 0,
      sites: Math.round(((billing.sites_count || 0) / limits.max_sites) * 100) || 0,
    },
  }
}
