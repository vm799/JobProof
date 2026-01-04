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
