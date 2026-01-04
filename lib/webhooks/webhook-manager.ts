"use server"

import { createClient } from "@/lib/supabase/server"
import { createHmac, randomBytes } from "crypto"

export type WebhookEvent =
  | "client.created"
  | "client.updated"
  | "onboarding.started"
  | "onboarding.completed"
  | "step.completed"
  | "file.uploaded"

interface WebhookPayload {
  event: WebhookEvent
  data: any
  timestamp: string
  workspace_id: string
}

export async function createWebhook(workspaceId: string, url: string, events: WebhookEvent[]): Promise<string | null> {
  const supabase = await createClient()

  // Generate webhook secret for signature verification
  const secret = randomBytes(32).toString("hex")

  const { data, error } = await supabase
    .from("webhooks")
    .insert({
      workspace_id: workspaceId,
      url,
      events,
      secret,
    })
    .select("id")
    .single()

  if (error) {
    console.error("[v0] Webhook creation error:", error)
    return null
  }

  return data.id
}

export async function triggerWebhook(workspaceId: string, event: WebhookEvent, data: any): Promise<void> {
  const supabase = await createClient()

  // Find all active webhooks subscribed to this event
  const { data: webhooks } = await supabase
    .from("webhooks")
    .select("id, url, secret")
    .eq("workspace_id", workspaceId)
    .eq("is_active", true)
    .contains("events", [event])

  if (!webhooks || webhooks.length === 0) return

  const payload: WebhookPayload = {
    event,
    data,
    timestamp: new Date().toISOString(),
    workspace_id: workspaceId,
  }

  // Queue webhook deliveries
  for (const webhook of webhooks) {
    await supabase.from("webhook_deliveries").insert({
      webhook_id: webhook.id,
      event_type: event,
      payload,
    })

    // Trigger delivery in background (don't await)
    deliverWebhook(webhook.id, webhook.url, webhook.secret, payload).catch((err) =>
      console.error("[v0] Webhook delivery error:", err),
    )
  }
}

async function deliverWebhook(webhookId: string, url: string, secret: string, payload: WebhookPayload): Promise<void> {
  const supabase = await createClient()

  const payloadString = JSON.stringify(payload)
  const signature = createHmac("sha256", secret).update(payloadString).digest("hex")

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-BoardingPass-Signature": signature,
        "X-BoardingPass-Event": payload.event,
        "X-BoardingPass-Timestamp": payload.timestamp,
      },
      body: payloadString,
    })

    const responseBody = await response.text()

    // Log delivery
    await supabase
      .from("webhook_deliveries")
      .update({
        response_status: response.status,
        response_body: responseBody.substring(0, 1000), // Limit size
        delivered_at: new Date().toISOString(),
      })
      .eq("webhook_id", webhookId)
      .eq("event_type", payload.event)
      .is("delivered_at", null)
      .order("created_at", { ascending: false })
      .limit(1)

    if (!response.ok) {
      // Schedule retry
      await scheduleWebhookRetry(webhookId, payload)
    }
  } catch (error) {
    console.error("[v0] Webhook delivery exception:", error)
    await scheduleWebhookRetry(webhookId, payload)
  }
}

async function scheduleWebhookRetry(webhookId: string, payload: WebhookPayload): Promise<void> {
  const supabase = await createClient()

  // Exponential backoff: 1min, 5min, 30min, 2hr, 12hr
  const retryDelays = [60, 300, 1800, 7200, 43200]

  const { data: delivery } = await supabase
    .from("webhook_deliveries")
    .select("retry_count")
    .eq("webhook_id", webhookId)
    .eq("event_type", payload.event)
    .is("delivered_at", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (!delivery) return

  const retryCount = delivery.retry_count + 1
  if (retryCount >= retryDelays.length) {
    // Max retries reached, mark as failed
    return
  }

  const nextRetryDelay = retryDelays[retryCount]
  const nextRetryAt = new Date(Date.now() + nextRetryDelay * 1000)

  await supabase
    .from("webhook_deliveries")
    .update({
      retry_count: retryCount,
      next_retry_at: nextRetryAt.toISOString(),
    })
    .eq("webhook_id", webhookId)
    .eq("event_type", payload.event)
    .is("delivered_at", null)
    .order("created_at", { ascending: false })
    .limit(1)
}
