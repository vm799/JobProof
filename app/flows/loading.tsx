import { DashboardLayout } from "@/components/dashboard-layout"
import { FlowsListSkeleton } from "@/components/loading-skeleton"

export default function Loading() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <div className="h-9 w-32 animate-pulse rounded-md bg-muted" />
          <div className="mt-1 h-5 w-64 animate-pulse rounded-md bg-muted" />
        </div>
        <FlowsListSkeleton />
      </div>
    </DashboardLayout>
  )
}
