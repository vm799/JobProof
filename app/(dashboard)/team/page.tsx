import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { FieldTeamManagement } from "@/components/field-team-management"

export const dynamic = "force-dynamic"

export default async function TeamPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Field Team</h1>
      <FieldTeamManagement />
    </div>
  )
}
