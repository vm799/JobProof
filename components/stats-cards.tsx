import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface StatsCardsProps {
  stats: {
    activeOnboardings: number
    totalClients: number
    completedThisMonth: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  const statsData = [
    {
      title: "Active Onboardings",
      value: stats.activeOnboardings.toString(),
      change: "+12%",
      trend: "up" as const,
      description: "vs last month",
    },
    {
      title: "Total Clients",
      value: stats.totalClients.toString(),
      change: "+8%",
      trend: "up" as const,
      description: "vs last month",
    },
    {
      title: "Completed This Month",
      value: stats.completedThisMonth.toString(),
      change: "+15%",
      trend: "up" as const,
      description: "vs last month",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {statsData.map((stat) => (
        <Card key={stat.title} className="p-6">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-semibold tracking-tight">{stat.value}</h3>
              <div className="flex items-center gap-1 text-sm">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-4 w-4 text-chart-3" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-chart-3" />
                )}
                <span className="font-medium text-chart-3">{stat.change}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
