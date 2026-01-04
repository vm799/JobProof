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

    // Get all flows with steps
    const { data: flows, error } = await supabase
      .from("flows")
      .select(
        `
        id,
        name,
        description,
        created_at,
        flow_steps (
          step_order,
          title,
          description
        )
      `,
      )
      .eq("workspace_id", workspace.id)
      .order("created_at", { ascending: false })

    if (error) throw error

    // Convert to CSV
    const headers = ["Flow Name", "Description", "Total Steps", "Created Date"]
    const rows = flows.map((f: any) => [
      f.name,
      f.description || "",
      f.flow_steps?.length || 0,
      new Date(f.created_at).toLocaleDateString(),
    ])

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="boardingpass-flows-${Date.now()}.csv"`,
      },
    })
  } catch (error: any) {
    console.error("Export flows error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
