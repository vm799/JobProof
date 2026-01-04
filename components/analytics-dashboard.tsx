"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Clock, CheckCircle2, BarChart3, Users, Zap } from "lucide-react"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface Onboarding {
  id: string
  status: string
  progress: number
  created_at: string
  completed_at?: string
  flow?: any
  client?: any
}

interface Activity {
  id: string
  type: string
  created_at: string
  metadata?: any
}

export function AnalyticsDashboard({
  onboardings,
  activities,
}: {
  onboardings: Onboarding[]
  activities: Activity[]
}) {
  // Calculate metrics
  const totalOnboardings = onboardings.length
  const completedOnboardings = onboardings.filter((o) => o.status === "completed").length
  const activeOnboardings = onboardings.filter((o) => o.status === "active").length
  const completionRate = totalOnboardings > 0 ? Math.round((completedOnboardings / totalOnboardings) * 100) : 0

  // Calculate average time to complete
  const completedWithTime = onboardings.filter((o) => o.completed_at && o.created_at)
  const avgTimeToComplete =
    completedWithTime.length > 0
      ? completedWithTime.reduce((sum, o) => {
          const start = new Date(o.created_at).getTime()
          const end = new Date(o.completed_at!).getTime()
          return sum + (end - start)
        }, 0) /
        completedWithTime.length /
        (1000 * 60 * 60 * 24) // Convert to days
      : 0

  // Calculate average progress
  const avgProgress =
    onboardings.length > 0 ? Math.round(onboardings.reduce((sum, o) => sum + o.progress, 0) / onboardings.length) : 0

  // Prepare chart data - last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return date.toISOString().split("T")[0]
  })

  const completionsByDay = last7Days.map((date) => ({
    date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    completed: onboardings.filter((o) => o.completed_at && o.completed_at.startsWith(date) && o.status === "completed")
      .length,
    started: onboardings.filter((o) => o.created_at.startsWith(date)).length,
  }))

  // Calculate bottlenecks - steps where clients get stuck
  const stepCompletionRates = activities
    .filter((a) => a.type === "step_completed")
    .reduce(
      (acc, a) => {
        const step = a.metadata?.step_title || "Unknown Step"
        acc[step] = (acc[step] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

  const bottlenecks = Object.entries(stepCompletionRates)
    .sort(([, a], [, b]) => a - b)
    .slice(0, 5)
    .map(([step, count]) => ({
      step,
      completions: count,
    }))

  // Calculate month-over-month growth
  const thisMonth = new Date().getMonth()
  const lastMonth = thisMonth - 1
  const thisMonthOnboardings = onboardings.filter((o) => new Date(o.created_at).getMonth() === thisMonth).length
  const lastMonthOnboardings = onboardings.filter((o) => new Date(o.created_at).getMonth() === lastMonth).length
  const growth =
    lastMonthOnboardings > 0
      ? Math.round(((thisMonthOnboardings - lastMonthOnboardings) / lastMonthOnboardings) * 100)
      : 0

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Analytics</h1>
          </div>
          <p className="text-muted-foreground">Track onboarding performance and identify opportunities</p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Completion Rate</h3>
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold">{completionRate}%</div>
              {growth > 0 ? (
                <Badge variant="default" className="gap-1 bg-green-500">
                  <TrendingUp className="h-3 w-3" /> {growth}%
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1">
                  <TrendingDown className="h-3 w-3" /> {Math.abs(growth)}%
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {completedOnboardings} of {totalOnboardings} completed
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Avg. Time to Complete</h3>
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div className="text-3xl font-bold mb-1">{avgTimeToComplete.toFixed(1)} days</div>
            <p className="text-sm text-muted-foreground">Based on {completedWithTime.length} completions</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Active Onboardings</h3>
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div className="text-3xl font-bold mb-1">{activeOnboardings}</div>
            <p className="text-sm text-muted-foreground">Currently in progress</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Avg. Progress</h3>
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div className="text-3xl font-bold mb-1">{avgProgress}%</div>
            <p className="text-sm text-muted-foreground">Across all onboardings</p>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Completions Over Time */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Onboarding Activity (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={completionsByDay}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line type="monotone" dataKey="started" stroke="hsl(var(--primary))" strokeWidth={2} name="Started" />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  name="Completed"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Bottlenecks */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Step Completion Analysis</h3>
            {bottlenecks.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={bottlenecks} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis dataKey="step" type="category" width={120} className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="completions" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No step completion data yet
              </div>
            )}
          </Card>
        </div>

        {/* Insights */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
          <div className="space-y-4">
            {completionRate >= 90 && (
              <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <div className="font-medium text-green-900 dark:text-green-100">Excellent completion rate!</div>
                  <div className="text-sm text-green-700 dark:text-green-300">
                    Your {completionRate}% completion rate is well above industry average
                  </div>
                </div>
              </div>
            )}

            {avgTimeToComplete > 7 && (
              <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg">
                <Clock className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <div className="font-medium text-amber-900 dark:text-amber-100">
                    Onboarding takes longer than expected
                  </div>
                  <div className="text-sm text-amber-700 dark:text-amber-300">
                    Average completion time is {avgTimeToComplete.toFixed(1)} days. Consider simplifying your flows or
                    adding automated reminders.
                  </div>
                </div>
              </div>
            )}

            {activeOnboardings === 0 && (
              <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
                <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <div className="font-medium text-blue-900 dark:text-blue-100">No active onboardings</div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    Start new client onboardings to see engagement metrics
                  </div>
                </div>
              </div>
            )}

            {bottlenecks.length > 0 && bottlenecks[0].completions < onboardings.length * 0.5 && (
              <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900 rounded-lg">
                <TrendingDown className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <div className="font-medium text-orange-900 dark:text-orange-100">Potential bottleneck detected</div>
                  <div className="text-sm text-orange-700 dark:text-orange-300">
                    The step "{bottlenecks[0].step}" has low completion. Consider simplifying this step or adding
                    guidance.
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
