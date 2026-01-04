import { createClient } from "@/lib/supabase/server"
import { ClientPortal } from "@/components/client-portal"

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
    />
  )
}
