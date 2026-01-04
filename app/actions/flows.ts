"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateFlow(
  flowId: string,
  data: {
    name?: string
    description?: string
    status?: string
  },
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("onboarding_flows")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", flowId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/flows")
  revalidatePath(`/flows/${flowId}`)
  return { success: true }
}

export async function deleteFlow(flowId: string) {
  const supabase = await createClient()

  // Check if flow has any active onboardings
  const { data: onboardings } = await supabase
    .from("client_onboardings")
    .select("id, status")
    .eq("flow_id", flowId)
    .in("status", ["in_progress", "not_started"])

  if (onboardings && onboardings.length > 0) {
    throw new Error("Cannot delete flow with active onboardings. Complete or cancel them first.")
  }

  const { error } = await supabase.from("onboarding_flows").delete().eq("id", flowId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/flows")
  return { success: true }
}

export async function createStep(
  flowId: string,
  data: {
    type: string
    title: string
    description?: string
    stepOrder: number
  },
) {
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
  data: {
    title?: string
    description?: string
    config?: any
  },
) {
  const supabase = await createClient()

  const { error } = await supabase.from("onboarding_steps").update(data).eq("id", stepId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/flows")
  return { success: true }
}

export async function deleteStep(stepId: string, flowId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("onboarding_steps").delete().eq("id", stepId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/flows/${flowId}`)
  return { success: true }
}
