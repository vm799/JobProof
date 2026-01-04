import { TemplatesLibrary } from "@/components/templates-library"
import { createClient } from "@/lib/supabase/server"

export const metadata = {
  title: "Templates - BoardingPass",
  description: "Pre-built onboarding flow templates",
}

export default async function TemplatesPage() {
  const supabase = await createClient()

  const { data: templates } = await supabase
    .from("flow_templates")
    .select(
      `
      *,
      steps:flow_template_steps(*)
    `,
    )
    .eq("is_public", true) // Only show public templates
    .order("is_featured", { ascending: false })
    .order("name")

  return <TemplatesLibrary templates={templates || []} />
}
