import { TemplatesLibrary } from "@/components/templates-library"
import { createServerClient } from "@/lib/supabase/server"

export const metadata = {
  title: "Templates - BoardingPass",
  description: "Pre-built onboarding flow templates",
}

export default async function TemplatesPage() {
  const supabase = await createServerClient()

  const { data: templates } = await supabase
    .from("flow_templates")
    .select(
      `
      *,
      steps:flow_template_steps(*)
    `,
    )
    .order("is_featured", { ascending: false })
    .order("name")

  return <TemplatesLibrary templates={templates || []} />
}
