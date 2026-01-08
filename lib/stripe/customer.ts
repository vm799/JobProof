import { stripe } from "./client"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

/**
 * Create Stripe customer for workspace
 * Idempotent: checks if customer already exists
 */
export async function getOrCreateStripeCustomer(workspaceId: string) {
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

  // Check if customer already exists
  const { data: billing } = await supabase
    .from("billing_accounts")
    .select("stripe_customer_id, billing_email")
    .eq("workspace_id", workspaceId)
    .single()

  if (billing?.stripe_customer_id) {
    return billing.stripe_customer_id
  }

  // Fetch workspace for email
  const { data: workspace } = await supabase.from("workspaces").select("name, owner_id").eq("id", workspaceId).single()

  if (!workspace) throw new Error("Workspace not found")

  // Fetch owner email
  const { data: profile } = await supabase.from("profiles").select("email").eq("id", workspace.owner_id).single()

  if (!profile?.email) throw new Error("Owner email not found")

  // Create Stripe customer
  const customer = await stripe.customers.create({
    email: profile.email,
    name: workspace.name,
    metadata: {
      workspace_id: workspaceId,
    },
  })

  // Store in billing_accounts
  await supabase
    .from("billing_accounts")
    .update({
      stripe_customer_id: customer.id,
      billing_email: profile.email,
      updated_at: new Date().toISOString(),
    })
    .eq("workspace_id", workspaceId)

  return customer.id
}

/**
 * Create subscription for workspace
 */
export async function createSubscription(
  workspaceId: string,
  priceId: string,
  billingCycle: "monthly" | "annual" = "monthly",
) {
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

  const customerId = await getOrCreateStripeCustomer(workspaceId)

  // Create subscription
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [
      {
        price: priceId,
      },
    ],
    payment_behavior: "default_incomplete",
    expand: ["latest_invoice.payment_intent"],
    metadata: {
      workspace_id: workspaceId,
      billing_cycle: billingCycle,
    },
  })

  // Update billing_accounts
  await supabase
    .from("billing_accounts")
    .update({
      stripe_subscription_id: subscription.id,
      billing_status: "active",
      updated_at: new Date().toISOString(),
    })
    .eq("workspace_id", workspaceId)

  // Log audit event
  await supabase.from("audit_logs").insert({
    workspace_id: workspaceId,
    entity_type: "subscription",
    action: "created",
    entity_id: workspaceId,
    details: {
      stripe_subscription_id: subscription.id,
      price_id: priceId,
    },
  })

  return subscription
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(workspaceId: string) {
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

  const { data: billing } = await supabase
    .from("billing_accounts")
    .select("stripe_subscription_id")
    .eq("workspace_id", workspaceId)
    .single()

  if (!billing?.stripe_subscription_id) {
    throw new Error("No active subscription found")
  }

  // Cancel in Stripe
  await stripe.subscriptions.update(billing.stripe_subscription_id, {
    cancel_at_period_end: true,
  })

  // Update billing_accounts
  await supabase
    .from("billing_accounts")
    .update({
      billing_status: "canceling",
      updated_at: new Date().toISOString(),
    })
    .eq("workspace_id", workspaceId)

  // Log audit event
  await supabase.from("audit_logs").insert({
    workspace_id: workspaceId,
    entity_type: "subscription",
    action: "cancelled",
    entity_id: workspaceId,
  })
}
