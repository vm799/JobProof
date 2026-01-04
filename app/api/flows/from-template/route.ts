import { createServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { templateId } = await request.json()

    // Get user workspace
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: workspaceMember } = await supabase
      .from("workspace_members")
      .select("workspace_id")
      .eq("user_id", user.id)
      .single()

    if (!workspaceMember) {
      return NextResponse.json({ error: "No workspace found" }, { status: 404 })
    }

    // Get template with steps - ONLY public templates
    const { data: template } = await supabase
      .from("flow_templates")
      .select(
        `
        *,
        steps:flow_template_steps(*)
      `,
      )
      .eq("id", templateId)
      .eq("is_public", true) // Security: Only allow public templates
      .single()

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    // Create new flow from template
    const { data: newFlow, error: flowError } = await supabase
      .from("flows")
      .insert({
        workspace_id: workspaceMember.workspace_id,
        name: template.name,
        description: template.description,
        is_published: false,
      })
      .select()
      .single()

    if (flowError) throw flowError

    // Create steps from template
    if (template.steps && template.steps.length > 0) {
      const steps = template.steps.map((step: any) => ({
        flow_id: newFlow.id,
        title: step.title,
        description: step.description,
        step_order: step.step_order,
        field_type: step.field_type || "text",
        is_required: step.is_required,
      }))

      const { error: stepsError } = await supabase.from("flow_steps").insert(steps)

      if (stepsError) throw stepsError
    }

    return NextResponse.json({ flowId: newFlow.id })
  } catch (error) {
    console.error("Template flow creation error:", error)
    return NextResponse.json({ error: "Failed to create flow from template" }, { status: 500 })
  }
}
