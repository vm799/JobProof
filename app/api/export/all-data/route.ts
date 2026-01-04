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

    // Get workspace with all related data
    const { data: workspace } = await supabase
      .from("workspaces")
      .select(
        `
        id,
        name,
        logo_url,
        brand_color,
        white_label_enabled,
        created_at,
        flows (
          id,
          name,
          description,
          flow_steps (
            step_order,
            title,
            description
          )
        ),
        onboardings (
          id,
          client_name,
          client_email,
          status,
          created_at,
          completed_at
        ),
        team_members (
          email,
          role,
          joined_at
        )
      `,
      )
      .eq("owner_id", user.id)
      .single()

    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 })
    }

    // Return as JSON for complete data export
    return NextResponse.json(
      {
        exported_at: new Date().toISOString(),
        workspace: workspace,
        user: {
          email: user.email,
          id: user.id,
        },
      },
      {
        headers: {
          "Content-Disposition": `attachment; filename="boardingpass-complete-export-${Date.now()}.json"`,
        },
      },
    )
  } catch (error: any) {
    console.error("Export all data error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
