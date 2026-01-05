import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's workspace
    const { data: profile } = await supabase.from("profiles").select("current_workspace_id").eq("id", user.id).single()

    if (!profile?.current_workspace_id) {
      return NextResponse.json({ error: "No workspace found" }, { status: 400 })
    }

    // Verify client belongs to user's workspace
    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("id", id)
      .eq("workspace_id", profile.current_workspace_id)
      .single()

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    // Delete client (cascade will handle related records)
    const { error } = await supabase.from("clients").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Delete client error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
