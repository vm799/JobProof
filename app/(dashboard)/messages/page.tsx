import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { MessagingInterface } from "@/components/messaging/interface"

export const dynamic = "force-dynamic"

export default async function MessagesPage() {
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

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase.from("profiles").select("current_workspace_id").eq("id", user.id).single()

  if (!profile?.current_workspace_id) redirect("/onboarding")

  // Fetch conversations
  const { data: conversations } = await supabase
    .from("messages")
    .select("*, participants:profiles(id, full_name, avatar_url)")
    .eq("workspace_id", profile.current_workspace_id)
    .order("updated_at", { ascending: false })

  // Fetch team members for new message
  const { data: teamMembers } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .eq("workspace_id", profile.current_workspace_id)
    .neq("id", user.id)

  return (
    <MessagingInterface conversations={conversations || []} teamMembers={teamMembers || []} currentUserId={user.id} />
  )
}
