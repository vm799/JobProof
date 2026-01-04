"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { ArrowLeft, Sparkles, CheckCircle2, Clock, AlertCircle, Check, Upload, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { CelebrationModal } from "@/components/celebration-modal"
import { ProgressBadge } from "@/components/progress-badge"
import { GuidedTour } from "@/components/guided-tour"

const DEMO_FLOW = {
  name: "New Client Onboarding",
  workspace: {
    name: "Acme Design Agency",
    brandColor: "#6366f1",
  },
  client: {
    name: "Demo User",
    email: "demo@example.com",
  },
  steps: [
    {
      id: "step-1",
      title: "Company Information",
      description: "Tell us about your business so we can tailor our services to your needs.",
      type: "form",
      fields: [
        { id: "company", label: "Company Name", type: "text", required: true },
        { id: "industry", label: "Industry", type: "text", required: true },
        { id: "description", label: "Brief Description", type: "textarea", required: false },
      ],
    },
    {
      id: "step-2",
      title: "Upload Brand Assets",
      description: "Share your logo, brand guidelines, and any other visual assets.",
      type: "upload",
      fields: [{ id: "files", label: "Upload Files", type: "file", required: true }],
    },
    {
      id: "step-3",
      title: "Project Goals",
      description: "What are your main objectives for this project?",
      type: "form",
      fields: [
        { id: "goals", label: "Primary Goals", type: "textarea", required: true },
        { id: "timeline", label: "Desired Timeline", type: "text", required: true },
        { id: "budget", label: "Budget Range", type: "text", required: false },
      ],
    },
    {
      id: "step-4",
      title: "Schedule Kickoff Call",
      description: "Pick a time for our initial strategy session.",
      type: "calendar",
      fields: [{ id: "date", label: "Preferred Date", type: "date", required: true }],
    },
  ],
}

export function DemoMode() {
  const [view, setView] = useState<"dashboard" | "portal">("dashboard")
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationType, setCelebrationType] = useState<"step_complete" | "milestone" | "onboarding_complete">(
    "step_complete",
  )
  const [showTour, setShowTour] = useState(true)
  const [tourCompleted, setTourCompleted] = useState(false)

  const dashboardTourSteps = [
    {
      target: '[data-tour="stats"]',
      title: "Real-Time Analytics",
      description:
        "Monitor all your onboardings at a glance. See active clients, completion rates, and overdue steps instantly.",
      position: "bottom" as const,
      action: "These numbers update automatically as clients progress",
    },
    {
      target: '[data-tour="client-list"]',
      title: "Client Management",
      description:
        "Track every client's progress in real-time. Click any client to see detailed information and send reminders.",
      position: "top" as const,
      action: "Click a client to view their detailed progress",
    },
    {
      target: '[data-tour="portal-button"]',
      title: "Try the Client Experience",
      description:
        "Switch to the Interactive Client Portal to see exactly what your clients experience during onboarding.",
      position: "top" as const,
      action: "Click to experience the client portal",
    },
  ]

  const portalTourSteps = [
    {
      target: '[data-tour="progress-badge"]',
      title: "Progress Tracking",
      description:
        "Your clients always know where they stand. This badge shows completion percentage and updates in real-time.",
      position: "bottom" as const,
    },
    {
      target: '[data-tour="progress-sidebar"]',
      title: "Visual Progress Tracker",
      description: "A clear roadmap of all steps. Clients see what's done, what's current, and what's coming next.",
      position: "right" as const,
    },
    {
      target: '[data-tour="form-section"]',
      title: "Smart Forms",
      description: "Forms are intuitive and auto-save as clients type. No data loss, no frustration.",
      position: "top" as const,
      action: "Fill out the form and click Continue",
    },
  ]

  const currentStep = DEMO_FLOW.steps[currentStepIndex]
  const progressPercentage = Math.round((completedSteps.length / DEMO_FLOW.steps.length) * 100)

  const handleCompleteStep = () => {
    const newCompleted = [...completedSteps, currentStep.id]
    setCompletedSteps(newCompleted)

    const newProgress = Math.round((newCompleted.length / DEMO_FLOW.steps.length) * 100)

    if (currentStepIndex === DEMO_FLOW.steps.length - 1) {
      setCelebrationType("onboarding_complete")
      setShowCelebration(true)
    } else if (newProgress >= 50 && progressPercentage < 50) {
      setCelebrationType("milestone")
      setShowCelebration(true)
    } else {
      setCelebrationType("step_complete")
      setShowCelebration(true)
    }

    if (currentStepIndex < DEMO_FLOW.steps.length - 1) {
      setTimeout(() => {
        setCurrentStepIndex(currentStepIndex + 1)
        setFormData({})
      }, 1500)
    }
  }

  const renderStepContent = () => {
    if (completedSteps.length === DEMO_FLOW.steps.length) {
      return (
        <div className="text-center py-12">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Check className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mb-2 text-balance text-3xl font-semibold tracking-tight">All Done!</h1>
          <p className="text-muted-foreground mb-6">
            You've completed the demo onboarding. This is how smooth it is for your clients!
          </p>
          <ProgressBadge progress={100} />
          <div className="mt-8">
            <Button
              onClick={() => {
                setCurrentStepIndex(0)
                setCompletedSteps([])
                setFormData({})
                setUploadedFiles([])
              }}
              variant="outline"
              className="mr-2"
            >
              Start Over
            </Button>
            <Link href="/auth/sign-up">
              <Button className="gap-2">
                Create Your Own <Sparkles className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      )
    }

    switch (currentStep.type) {
      case "form":
        return (
          <>
            <h1 className="mb-2 text-balance text-3xl font-semibold tracking-tight">{currentStep.title}</h1>
            <p className="mb-8 text-muted-foreground">{currentStep.description}</p>

            <div className="space-y-6">
              {currentStep.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.id}>
                    {field.label} {field.required && <span className="text-destructive">*</span>}
                  </Label>
                  {field.type === "textarea" ? (
                    <Textarea
                      id={field.id}
                      placeholder={`Enter ${field.label.toLowerCase()}...`}
                      rows={4}
                      value={formData[field.id] || ""}
                      onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                    />
                  ) : (
                    <Input
                      id={field.id}
                      type={field.type}
                      placeholder={`Enter ${field.label.toLowerCase()}...`}
                      value={formData[field.id] || ""}
                      onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                    />
                  )}
                </div>
              ))}

              <div className="flex gap-3 pt-4">
                {currentStepIndex > 0 && (
                  <Button variant="outline" onClick={() => setCurrentStepIndex(currentStepIndex - 1)}>
                    Back
                  </Button>
                )}
                <Button onClick={handleCompleteStep}>Continue</Button>
              </div>
            </div>
          </>
        )

      case "upload":
        return (
          <>
            <h1 className="mb-2 text-balance text-3xl font-semibold tracking-tight">{currentStep.title}</h1>
            <p className="mb-8 text-muted-foreground">{currentStep.description}</p>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Upload Files</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, PDF up to 10MB</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 bg-transparent"
                    onClick={() => {
                      setUploadedFiles(["demo-logo.png", "brand-guidelines.pdf"])
                    }}
                  >
                    Simulate Upload
                  </Button>
                </div>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <Label>Uploaded Files</Label>
                  {uploadedFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 border border-border rounded-lg">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{file}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                {currentStepIndex > 0 && (
                  <Button variant="outline" onClick={() => setCurrentStepIndex(currentStepIndex - 1)}>
                    Back
                  </Button>
                )}
                <Button onClick={handleCompleteStep} disabled={uploadedFiles.length === 0}>
                  Continue
                </Button>
              </div>
            </div>
          </>
        )

      case "calendar":
        return (
          <>
            <h1 className="mb-2 text-balance text-3xl font-semibold tracking-tight">{currentStep.title}</h1>
            <p className="mb-8 text-muted-foreground">{currentStep.description}</p>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Select Date & Time</Label>
                <div className="grid gap-3">
                  {["Monday, Jan 20 at 10:00 AM", "Tuesday, Jan 21 at 2:00 PM", "Wednesday, Jan 22 at 11:00 AM"].map(
                    (slot, idx) => (
                      <Card
                        key={idx}
                        className={cn(
                          "p-4 cursor-pointer transition-all hover:border-primary",
                          formData.selectedSlot === slot && "border-primary bg-primary/5",
                        )}
                        onClick={() => setFormData({ selectedSlot: slot })}
                      >
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">{slot}</span>
                        </div>
                      </Card>
                    ),
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                {currentStepIndex > 0 && (
                  <Button variant="outline" onClick={() => setCurrentStepIndex(currentStepIndex - 1)}>
                    Back
                  </Button>
                )}
                <Button onClick={handleCompleteStep} disabled={!formData.selectedSlot}>
                  Schedule Call
                </Button>
              </div>
            </div>
          </>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {showTour && !tourCompleted && (
        <GuidedTour
          steps={view === "dashboard" ? dashboardTourSteps : portalTourSteps}
          onComplete={() => {
            setTourCompleted(true)
            setShowTour(false)
          }}
          onSkip={() => setShowTour(false)}
        />
      )}

      <CelebrationModal open={showCelebration} onOpenChange={setShowCelebration} type={celebrationType} />

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
                <Badge variant="secondary">Click Through Experience</Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {tourCompleted && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowTour(true)
                    setTourCompleted(false)
                  }}
                  className="gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Restart Tour
                </Button>
              )}
              <Link href="/auth/sign-up">
                <Button>Start Free Trial</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <Button
              variant={view === "dashboard" ? "default" : "ghost"}
              size="sm"
              onClick={() => {
                setView("dashboard")
                if (!tourCompleted) {
                  setShowTour(true)
                }
              }}
            >
              Internal Dashboard
            </Button>
            <Button
              variant={view === "portal" ? "default" : "ghost"}
              size="sm"
              data-tour="portal-button"
              onClick={() => {
                setView("portal")
                setCurrentStepIndex(0)
                setCompletedSteps([])
                setFormData({})
                setUploadedFiles([])
                if (!tourCompleted) {
                  setShowTour(true)
                }
              }}
            >
              Interactive Client Portal
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {view === "dashboard" ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">Dashboard Overview</h2>
              <p className="text-muted-foreground">Track all your client onboardings in one place</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3" data-tour="stats">
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

            <Card className="p-6" data-tour="client-list">
              <h3 className="text-lg font-semibold mb-4">Recent Clients</h3>
              <div className="space-y-4">
                {[
                  { name: "Acme Corp", email: "contact@acme.com", progress: 75, status: "active" },
                  { name: "TechStart Inc", email: "hello@techstart.io", progress: 100, status: "completed" },
                  { name: "Design Studio", email: "team@design.co", progress: 45, status: "active" },
                ].map((client, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="font-medium text-foreground">{client.name}</div>
                      <div className="text-sm text-muted-foreground">{client.email}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium text-foreground">{client.progress}%</div>
                        <div className="text-xs text-muted-foreground">Complete</div>
                      </div>
                      <Badge variant={client.status === "completed" ? "default" : "secondary"}>{client.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                This is demo data. Switch to "Interactive Client Portal" to experience the flow!
              </p>
              <Button size="lg" className="gap-2 mr-2" onClick={() => setView("portal")} data-tour="portal-button">
                Try Interactive Demo
              </Button>
              <Link href="/auth/sign-up">
                <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                  Start Free Trial <Sparkles className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="min-h-screen bg-background">
            <header className="border-b border-border bg-card mb-8">
              <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg" style={{ backgroundColor: DEMO_FLOW.workspace.brandColor }} />
                    <span className="text-sm font-medium text-foreground">{DEMO_FLOW.workspace.name}</span>
                  </div>
                  <div className="flex items-center gap-3" data-tour="progress-badge">
                    <ProgressBadge progress={progressPercentage} showTrending />
                    <div className="text-sm text-muted-foreground">Welcome, {DEMO_FLOW.client.name}</div>
                  </div>
                </div>
              </div>
            </header>

            <div className="container mx-auto px-6 pb-12">
              <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
                <div className="lg:sticky lg:top-12 lg:h-fit" data-tour="progress-sidebar">
                  <Card className="p-6">
                    <h2 className="mb-6 font-semibold text-foreground">Your Progress</h2>
                    <nav aria-label="Progress">
                      <ol className="space-y-6">
                        {DEMO_FLOW.steps.map((step, idx) => {
                          const isCompleted = completedSteps.includes(step.id)
                          const isCurrent = idx === currentStepIndex
                          const status = isCompleted ? "complete" : isCurrent ? "current" : "upcoming"

                          return (
                            <li key={step.id} className="relative">
                              {idx !== DEMO_FLOW.steps.length - 1 && (
                                <div
                                  className={cn(
                                    "absolute left-4 top-10 -ml-px h-full w-0.5",
                                    status === "complete" ? "bg-primary" : "bg-border",
                                  )}
                                />
                              )}
                              <div className="group relative flex items-start">
                                <span className="flex h-8 items-center">
                                  <span
                                    className={cn(
                                      "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all",
                                      status === "complete"
                                        ? "border-primary bg-primary"
                                        : status === "current"
                                          ? "border-primary bg-card"
                                          : "border-border bg-card",
                                    )}
                                  >
                                    {status === "complete" ? (
                                      <Check className="h-4 w-4 text-primary-foreground" />
                                    ) : (
                                      <span
                                        className={cn(
                                          "text-xs font-medium",
                                          status === "current" ? "text-primary" : "text-muted-foreground",
                                        )}
                                      >
                                        {idx + 1}
                                      </span>
                                    )}
                                  </span>
                                </span>
                                <span className="ml-4 flex min-w-0 flex-col">
                                  <span
                                    className={cn(
                                      "text-sm font-medium",
                                      status === "complete" || status === "current"
                                        ? "text-foreground"
                                        : "text-muted-foreground",
                                    )}
                                  >
                                    {step.title}
                                  </span>
                                </span>
                              </div>
                            </li>
                          )
                        })}
                      </ol>
                    </nav>
                  </Card>
                </div>

                <Card className="p-8" data-tour="form-section">
                  {renderStepContent()}
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
