import { createClient } from "@/lib/supabase/server"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/empty-state"
import { TrendingUp } from "lucide-react"

interface ClientProgressTableProps {
  workspaceId: string
}

export async function ClientProgressTable({ workspaceId }: ClientProgressTableProps) {
  const supabase = await createClient()

  const { data: onboardings } = await supabase
    .from("client_onboardings")
    .select(
      `
      id,
      status,
      clients!inner(id, name, workspace_id),
      client_step_progress(id, status)
    `,
    )
    .eq("clients.workspace_id", workspaceId)
    .order("created_at", { ascending: false })
    .limit(5)

  const getStatusVariant = (status: string): "default" | "secondary" | "outline" => {
    switch (status) {
      case "in_progress":
        return "default"
      case "completed":
        return "secondary"
      case "not_started":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusLabel = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const calculateProgress = (steps: any[]) => {
    if (!steps || steps.length === 0) return 0
    const completed = steps.filter((s) => s.status === "completed").length
    return Math.round((completed / steps.length) * 100)
  }

  if (!onboardings || onboardings.length === 0) {
    return (
      <EmptyState
        icon={TrendingUp}
        title="No active jobs"
        description="Create your first job to track progress here."
        action={{
          label: "Create Job",
          onClick: () => {},
        }}
      />
    )
  }

  return (
    <Card className="p-6">
      <h2 className="mb-4 text-lg font-semibold">Client Progress</h2>
      <div className="space-y-4">
        {onboardings.map((onboarding: any) => {
          const progress = calculateProgress(onboarding.client_step_progress)
          return (
            <div key={onboarding.id} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-3">
                  <p className="text-sm font-medium">{onboarding.clients.name}</p>
                  <Badge variant={getStatusVariant(onboarding.status)} className="text-xs">
                    {getStatusLabel(onboarding.status)}
                  </Badge>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>
              <span className="ml-4 text-sm font-medium text-muted-foreground">{progress}%</span>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
