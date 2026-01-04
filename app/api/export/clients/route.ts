import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get workspace
    const { data: workspace } = await supabase.from("workspaces").select("id").eq("owner_id", user.id).single()

    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 })
    }

    // Get all onboardings with client info
    const { data: onboardings, error } = await supabase
      .from("onboardings")
      .select(
        `
        id,
        client_name,
        client_email,
        status,
        created_at,
        completed_at,
        flows (name, description)
      `,
      )
      .eq("workspace_id", workspace.id)
      .order("created_at", { ascending: false })

    if (error) throw error

    // Convert to CSV
    const headers = ["Client Name", "Client Email", "Flow", "Status", "Started", "Completed"]
    const rows = onboardings.map((o: any) => [
      o.client_name,
      o.client_email,
      o.flows?.name || "N/A",
      o.status,
      new Date(o.created_at).toLocaleDateString(),
      o.completed_at ? new Date(o.completed_at).toLocaleDateString() : "In Progress",
    ])

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="boardingpass-clients-${Date.now()}.csv"`,
      },
    })
  } catch (error: any) {
    console.error("Export clients error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
