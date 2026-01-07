import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ClientsList } from "@/components/clients-list"
import { RefreshCw } from "lucide-react"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ClientsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("current_workspace_id")
    .eq("id", user.id)
    .single()

  if (profileError || !profile?.current_workspace_id) {
    console.error("[Build Error] Profile check:", profileError)
    return <ErrorState message="Workspace access required." />
  }

  const { data: sites, error: sitesError } = await supabase
    .from("clients")
    .select(`
      id, name, email, created_at,
      client_onboardings(id, status, created_at)
    `)
    .eq("workspace_id", profile.current_workspace_id)
    .order("created_at", { ascending: false })
    .limit(50)

  if (sitesError) {
    return <ClientsList sites={[]} workspaceId={profile.current_workspace_id} />
  }

  return <ClientsList sites={sites || []} workspaceId={profile.current_workspace_id} />
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <p className="text-muted-foreground">{message}</p>
      <a href="/sites" className="inline-flex items-center px-4 py-2 border rounded-md hover:bg-accent">
        <RefreshCw className="mr-2 h-4 w-4" />
        Refresh Page
      </a>
    </div>
  )
}
