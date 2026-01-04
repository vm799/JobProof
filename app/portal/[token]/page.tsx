import { createClient } from "@/lib/supabase/server"
import { ClientPortal } from "@/components/client-portal"
import { redirect } from "next/navigation"

export default async function ClientPortalPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const supabase = await createClient()

  // Find onboarding by token
  const { data: onboarding } = await supabase
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
        workspaces!inner(id, name, logo_url, brand_color)
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

  if (!onboarding) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Invalid Link</h1>
          <p className="mt-2 text-muted-foreground">This onboarding link is invalid or has expired.</p>
        </div>
      </div>
    )
  }

  const createdDate = new Date(onboarding.created_at)
  const now = new Date()
  const diffDays = Math.ceil(Math.abs(now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays > 90) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="max-w-md text-center space-y-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mb-4">
            <svg
              className="h-6 w-6 text-destructive"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold">This Link Has Expired</h1>
          <p className="text-muted-foreground">
            For security reasons, onboarding links expire after 90 days. Please contact{" "}
            <strong>{onboarding.onboarding_flows.workspaces.name}</strong> to request a new link.
          </p>
          <p className="text-sm text-muted-foreground pt-4">Link created: {createdDate.toLocaleDateString()}</p>
        </div>
      </div>
    )
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
