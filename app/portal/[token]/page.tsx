export const runtime = "edge"
export const dynamic = "force-dynamic"

import { createClient } from "@/lib/supabase/server"
import { ClientPortal } from "@/components/client-portal"
import { redirect } from "next/navigation"
import * as Sentry from "@sentry/nextjs"

export default async function ClientPortalPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const supabase = await createClient()

  const { data: onboarding, error: fetchError } = await supabase
    .from("client_onboardings")
    .select(
      `
      id,
      status,
      created_at,
      clients!inner(id, name, email),
      onboarding_flows!inner(
        id,
        name,
        workspace_id,
        workspaces!inner(id, name, logo_url, brand_color, owner_id)
      ),
      client_step_progress(
        id,
        step_id,
        status,
        data,
        onboarding_steps!inner(id, title, description, type, step_order, config)
      )
    `,
    )
    .eq("onboarding_link_token", token)
    .single()

  if (!onboarding || fetchError) {
    Sentry.captureMessage("Invalid portal token access attempt", {
      level: "warning",
      extra: {
        token: token.substring(0, 8) + "...", // Log partial token for debugging
        error: fetchError?.message,
        timestamp: new Date().toISOString(),
      },
    })

    redirect("/portal/expired")
  }

  const createdDate = new Date(onboarding.created_at)
  const now = new Date()
  const diffDays = Math.ceil((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays > 7) {
    Sentry.captureMessage("Expired portal token access attempt", {
      level: "info",
      extra: {
        token: token.substring(0, 8) + "...",
        daysOld: diffDays,
        workspaceName: onboarding.onboarding_flows.workspaces.name,
        clientEmail: onboarding.clients.email,
      },
    })

    redirect("/portal/expired")
  }

  if (!onboarding.onboarding_flows.workspace_id) {
    Sentry.captureException(new Error("Portal missing workspace_id isolation"), {
      extra: {
        onboardingId: onboarding.id,
        flowId: onboarding.onboarding_flows.id,
      },
    })
    redirect("/portal/expired")
  }

  if (onboarding.status === "completed") {
    redirect(`/portal/${token}/success`)
  }

  // Sort steps by order
  const sortedProgress = (onboarding.client_step_progress || []).sort(
    (a: any, b: any) => a.onboarding_steps.step_order - b.onboarding_steps.step_order,
  )

  return (
    <ClientPortal
      onboarding={{
        ...onboarding,
        client_step_progress: sortedProgress,
      }}
      token={token}
    />
  )
}
