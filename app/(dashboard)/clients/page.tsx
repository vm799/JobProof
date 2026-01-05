import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ClientsList } from "@/components/clients-list"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export const dynamic = "force-dynamic"
//export const revalidate = 0

export default async function ClientsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  let profile
  try {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()
    if (error) throw error
    profile = data
  } catch (error) {
    console.error("[v0] Profile fetch failed:", error)
    return <ErrorState message="Unable to load profile" />
  }

  if (!profile?.current_workspace_id) {
    redirect("/onboarding")
  }

  let clients: any[] = []
  try {
    const { data, error } = await supabase
      .from("clients")
      .select(
        `
        id,
        name,
        email,
        created_at,
        client_onboardings(
          id,
          status,
          created_at
        )
      `,
      )
      .eq("workspace_id", profile.current_workspace_id)
      .order("created_at", { ascending: false })
      .limit(50)
    if (error) throw error
    clients = data || []
  } catch (error) {
    console.error("[v0] Clients fetch failed:", error)
    clients = []
  }

  return <ClientsList clients={clients} workspaceId={profile.current_workspace_id} />
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <p className="text-muted-foreground">{message}</p>
      {/* Remove the onClick reload button or replace with a link */}
      <a href="/clients" className="px-4 py-2 border rounded-md hover:bg-gray-100 flex items-center">
        <RefreshCw className="mr-2 h-4 w-4" />
        Refresh Page
      </a>
    </div>
  )
}
