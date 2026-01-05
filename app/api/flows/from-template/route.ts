import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { templateId, flowName } = await request.json()

    // Get user workspace
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("profiles").select("current_workspace_id").eq("id", user.id).single()

    if (!profile?.current_workspace_id) {
      return NextResponse.json({ error: "No workspace found" }, { status: 404 })
    }

    const { data: template } = await supabase
      .from("flow_templates")
      .select(
        `
        *,
        flow_template_steps(*)
      `,
      )
      .eq("id", templateId)
      .eq("is_public", true) // Security: Only allow public templates
      .single()

    if (!template) {
      return NextResponse.json({ error: "Template not found or not accessible" }, { status: 404 })
    }

    const { data: newFlow, error: flowError } = await supabase
      .from("onboarding_flows")
      .insert({
        workspace_id: profile.current_workspace_id,
        name: flowName || `${template.name} (Copy)`,
        description: template.description,
        status: "draft",
      })
      .select()
      .single()

    if (flowError) {
      console.error("[v0] Template flow creation error:", flowError)
      throw flowError
    }

    if (template.flow_template_steps && template.flow_template_steps.length > 0) {
      const steps = template.flow_template_steps.map((step: any) => ({
        flow_id: newFlow.id,
        type: step.type,
        title: step.title,
        description: step.description,
        step_order: step.step_order,
        config: step.config || {},
      }))

      const { error: stepsError } = await supabase.from("onboarding_steps").insert(steps)

      if (stepsError) {
        // Rollback: delete the flow if steps fail
        await supabase.from("onboarding_flows").delete().eq("id", newFlow.id)
        console.error("[v0] Template steps creation error:", stepsError)
        throw stepsError
      }
    }

    console.log("[v0] Template flow created successfully:", newFlow.id)
    return NextResponse.json({ flowId: newFlow.id })
  } catch (error) {
    console.error("[v0] Template flow creation error:", error)
    return NextResponse.json({ error: "Failed to create flow from template" }, { status: 500 })
  }
}
