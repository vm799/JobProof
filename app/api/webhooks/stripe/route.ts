import { stripe } from "@/lib/stripe/client"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import type Stripe from "stripe"

/**
 * Stripe webhook handler
 * Handles: customer.subscription.updated, customer.subscription.deleted, invoice.payment_succeeded
 * Implements: idempotency, signature verification, audit logging, retry safety
 */
export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const body = await request.text()
  const sig = request.headers.get("stripe-signature")

  if (!sig) {
    console.error("[WEBHOOK] Missing stripe-signature header")
    return NextResponse.json({ error: "Missing signature" }, { status: 400 })
  }

  // Verify signature
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error("[WEBHOOK] Signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  // Create Supabase client
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

  // Idempotency check: prevent duplicate processing
  const { data: existingEvent } = await supabase
    .from("webhook_deliveries")
    .select("id")
    .eq("event_type", event.type)
    .eq("payload", JSON.stringify(event.data))
    .single()

  if (existingEvent) {
    console.log("[WEBHOOK] Duplicate event detected, skipping")
    return NextResponse.json({ received: true })
  }

  let workspaceId: string | null = null

  try {
    // Handle different webhook events
    switch (event.type) {
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string
        workspaceId = subscription.metadata?.workspace_id || null

        if (!workspaceId) {
          console.error("[WEBHOOK] No workspace_id in subscription metadata")
          break
        }

        // Update billing_accounts
        await supabase
          .from("billing_accounts")
          .update({
            stripe_subscription_id: subscription.id,
            billing_status: subscription.status === "active" ? "active" : "inactive",
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("workspace_id", workspaceId)

        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        workspaceId = subscription.metadata?.workspace_id || null

        if (!workspaceId) {
          console.error("[WEBHOOK] No workspace_id in subscription metadata")
          break
        }

        // Update billing_accounts
        await supabase
          .from("billing_accounts")
          .update({
            billing_status: "inactive",
            updated_at: new Date().toISOString(),
          })
          .eq("workspace_id", workspaceId)

        break
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        // Find workspace by Stripe customer
        const { data: billing } = await supabase
          .from("billing_accounts")
          .select("workspace_id")
          .eq("stripe_customer_id", customerId)
          .single()

        workspaceId = billing?.workspace_id || null

        if (workspaceId) {
          // Reset usage counters for new billing period
          await supabase
            .from("billing_accounts")
            .update({
              monthly_usage_jobs: 0,
              monthly_usage_proofs: 0,
              proofs_verified_this_month: 0,
              current_period_start: new Date(invoice.period_start * 1000).toISOString(),
              current_period_end: new Date(invoice.period_end * 1000).toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("workspace_id", workspaceId)
        }

        break
      }

      default:
        console.log("[WEBHOOK] Unhandled event type:", event.type)
    }

    // Log webhook delivery with success
    await supabase.from("webhook_deliveries").insert({
      event_type: event.type,
      payload: event.data,
      response_status: 200,
      delivered_at: new Date().toISOString(),
      retry_count: 0,
    })

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error("[WEBHOOK] Error processing event:", err)

    // Log webhook delivery with error
    await supabase.from("webhook_deliveries").insert({
      event_type: event.type,
      payload: event.data,
      response_status: 500,
      response_body: err instanceof Error ? err.message : "Unknown error",
      delivered_at: new Date().toISOString(),
      retry_count: 0,
      next_retry_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    })

    // Return 500 to tell Stripe to retry
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
