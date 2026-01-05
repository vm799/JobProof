"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

async function verifyFlowAccess(flowId: string, workspaceId: string) {
  const supabase = await createClient()
  const { data: flow } = await supabase.from("onboarding_flows").select("workspace_id").eq("id", flowId).single()

  if (!flow || flow.workspace_id !== workspaceId) {
    throw new Error("Unauthorized: Flow does not belong to your workspace")
  }
}

export async function updateFlow(
  flowId: string,
  workspaceId: string,
  data: {
    name?: string
    description?: string
    status?: string
  },
) {
  await verifyFlowAccess(flowId, workspaceId)
  const supabase = await createClient()

  const { error } = await supabase
    .from("onboarding_flows")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", flowId)
    .eq("workspace_id", workspaceId) // Double-lock workspace isolation

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/flows")
  revalidatePath(`/flows/${flowId}`)
  return { success: true }
}

export async function createStep(
  flowId: string,
  workspaceId: string,
  data: {
    type: string
    title: string
    description?: string
    stepOrder: number
  },
) {
  await verifyFlowAccess(flowId, workspaceId)
  const supabase = await createClient()

  const { data: newStep, error } = await supabase
    .from("onboarding_steps")
    .insert({
      flow_id: flowId,
      type: data.type,
      title: data.title,
      description: data.description,
      step_order: data.stepOrder,
      config: {},
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/flows/${flowId}`)
  return { success: true, step: newStep }
}

export async function updateStep(
  stepId: string,
  flowId: string,
  workspaceId: string,
  data: {
    title?: string
    description?: string
    config?: any
  },
) {
  await verifyFlowAccess(flowId, workspaceId)
  const supabase = await createClient()

  const { error } = await supabase.from("onboarding_steps").update(data).eq("id", stepId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/flows")
  return { success: true }
}

export async function deleteStep(stepId: string, flowId: string, workspaceId: string) {
  await verifyFlowAccess(flowId, workspaceId)
  const supabase = await createClient()

  const { error } = await supabase.from("onboarding_steps").delete().eq("id", stepId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/flows/${flowId}`)
  return { success: true }
}

export async function createFlowFromTemplate(templateId: string, workspaceId: string, flowName?: string) {
  const supabase = await createClient()

  // Fetch template and its steps
  const { data: template, error: templateError } = await supabase
    .from("flow_templates")
    .select(
      `
      id,
      name,
      description,
      category,
      flow_template_steps(*)
    `,
    )
    .eq("id", templateId)
    .single()

  if (templateError || !template) {
    throw new Error("Template not found")
  }

  // Create new flow from template
  const { data: newFlow, error: flowError } = await supabase
    .from("onboarding_flows")
    .insert({
      name: flowName || `${template.name} (Copy)`,
      description: template.description,
      workspace_id: workspaceId,
      status: "draft",
    })
    .select()
    .single()

  if (flowError || !newFlow) {
    throw new Error("Failed to create flow from template")
  }

  // Clone all template steps into the new flow
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
      throw new Error("Failed to create steps from template")
    }
  }

  revalidatePath("/flows")
  revalidatePath("/templates")
  return { success: true, flowId: newFlow.id }
}

export async function reorderSteps(
  flowId: string,
  workspaceId: string,
  reorderedSteps: Array<{ id: string; step_order: number }>,
) {
  await verifyFlowAccess(flowId, workspaceId)
  const supabase = await createClient()

  // Update all step orders in a transaction-like manner
  const updates = reorderedSteps.map((step) =>
    supabase.from("onboarding_steps").update({ step_order: step.step_order }).eq("id", step.id),
  )

  const results = await Promise.all(updates)
  const hasError = results.some((result) => result.error)

  if (hasError) {
    throw new Error("Failed to reorder steps")
  }

  revalidatePath(`/flows/${flowId}`)
  return { success: true }
}
