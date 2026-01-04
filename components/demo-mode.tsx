"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Sparkles, CheckCircle2, Clock, AlertCircle } from "lucide-react"

export function DemoMode() {
  const [view, setView] = useState<"dashboard" | "portal">("dashboard")

  return (
    <div className="min-h-screen bg-background">
      {/* Demo Header */}
      <div className="bg-gradient-to-r from-primary/20 to-primary/10 border-b border-primary/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" /> Back to Homepage
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="font-semibold">Interactive Demo Mode</span>
                <Badge variant="secondary">Sample Data</Badge>
              </div>
            </div>
            <Link href="/auth/sign-up">
              <Button>Start Free Trial</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Demo Controls */}
      <div className="bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <Button variant={view === "dashboard" ? "default" : "ghost"} size="sm" onClick={() => setView("dashboard")}>
              Internal Dashboard
            </Button>
            <Button variant={view === "portal" ? "default" : "ghost"} size="sm" onClick={() => setView("portal")}>
              Client Portal View
            </Button>
          </div>
        </div>
      </div>

      {/* Demo Content */}
      <div className="container mx-auto px-4 py-8">
        {view === "dashboard" ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">Dashboard Overview</h2>
              <p className="text-muted-foreground">Track all your client onboardings in one place</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Active Onboardings</h3>
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div className="text-3xl font-bold mb-1">12</div>
                <p className="text-sm text-muted-foreground">+3 this month</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Completed</h3>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </div>
                <div className="text-3xl font-bold mb-1">47</div>
                <p className="text-sm text-muted-foreground">98% completion rate</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Needs Attention</h3>
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                </div>
                <div className="text-3xl font-bold mb-1">3</div>
                <p className="text-sm text-muted-foreground">Overdue steps</p>
              </Card>
            </div>

            {/* Client List */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Clients</h3>
              <div className="space-y-4">
                {[
                  { name: "Acme Corp", email: "contact@acme.com", progress: 75, status: "active" },
                  { name: "TechStart Inc", email: "hello@techstart.io", progress: 100, status: "completed" },
                  { name: "Design Studio", email: "team@design.co", progress: 45, status: "active" },
                ].map((client, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <div className="font-medium">{client.name}</div>
                      <div className="text-sm text-muted-foreground">{client.email}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">{client.progress}%</div>
                        <div className="text-xs text-muted-foreground">Complete</div>
                      </div>
                      <Badge variant={client.status === "completed" ? "default" : "secondary"}>{client.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">This is demo data. Ready to onboard real clients?</p>
              <Link href="/auth/sign-up">
                <Button size="lg" className="gap-2">
                  Start Free Trial <Sparkles className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">Client Portal Preview</h2>
              <p className="text-muted-foreground">This is what your clients see (fully white-labeled)</p>
            </div>

            <Card className="p-8">
              <div className="text-center mb-8">
                <div className="h-16 w-16 bg-gradient-to-br from-primary to-primary/60 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">A</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">Welcome to Acme Corp!</h3>
                <p className="text-muted-foreground">Let's get you set up in just a few steps</p>
              </div>

              <div className="space-y-4">
                {[
                  { title: "Company Information", desc: "Tell us about your business", completed: true },
                  { title: "Upload Brand Assets", desc: "Logo, colors, and guidelines", completed: true },
                  { title: "Connect Your Tools", desc: "Integrate your favorite apps", completed: false },
                  { title: "Schedule Kickoff Call", desc: "Pick a time that works", completed: false },
                ].map((step, i) => (
                  <div
                    key={i}
                    className={`p-4 border rounded-lg ${step.completed ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900" : "border-border"}`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 h-6 w-6 rounded-full flex items-center justify-center ${step.completed ? "bg-green-500" : "bg-muted"}`}
                      >
                        {step.completed && <CheckCircle2 className="h-4 w-4 text-white" />}
                        {!step.completed && <span className="text-xs font-medium">{i + 1}</span>}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium mb-1">{step.title}</div>
                        <div className="text-sm text-muted-foreground">{step.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">50% Complete</span>
                </div>
                <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-1/2" />
                </div>
              </div>
            </Card>

            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Your clients will see your brand, not ours</p>
              <Link href="/auth/sign-up">
                <Button size="lg" className="gap-2">
                  Create Your Own Portal <Sparkles className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
