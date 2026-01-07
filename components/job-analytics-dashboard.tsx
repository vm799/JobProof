"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Clock, CheckCircle2 } from "lucide-react"

interface JobAnalyticsDashboardProps {
  jobs: any[]
  activities: any[]
}

export function JobAnalyticsDashboard({ jobs, activities }: JobAnalyticsDashboardProps) {
  const completedJobs = jobs.filter((job) => job.status === "completed").length
  const activeJobs = jobs.filter((job) => job.status === "active").length
  const averageCompletionTime = "2.5 days" // Calculate from real data

  const stats = [
    {
      title: "Total Jobs",
      value: jobs.length.toString(),
      icon: BarChart3,
      description: "All time",
    },
    {
      title: "Completed Jobs",
      value: completedJobs.toString(),
      icon: CheckCircle2,
      description: `${((completedJobs / jobs.length) * 100).toFixed(0)}% completion rate`,
    },
    {
      title: "Active Jobs",
      value: activeJobs.toString(),
      icon: TrendingUp,
      description: "In progress",
    },
    {
      title: "Avg Completion Time",
      value: averageCompletionTime,
      icon: Clock,
      description: "Per job",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Job Analytics</h1>
        <p className="text-muted-foreground mt-2">Track job performance and completion metrics</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest job updates and completions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.slice(0, 10).map((activity, idx) => (
              <div key={idx} className="flex items-center gap-4 pb-4 border-b border-border last:border-0">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.activity_type}</p>
                  <p className="text-xs text-muted-foreground">{new Date(activity.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
