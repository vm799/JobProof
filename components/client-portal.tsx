"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { FileUpload } from "@/components/file-upload"
import { CelebrationModal } from "@/components/celebration-modal"
import { ProgressBadge } from "@/components/progress-badge"

interface ClientPortalProps {
  onboarding: any
}

export function ClientPortal({ onboarding }: ClientPortalProps) {
  const steps = onboarding.client_step_progress || []
  const workspace = onboarding.onboarding_flows.workspaces
  const client = onboarding.clients

  const [currentStepIndex, setCurrentStepIndex] = useState(() => {
    const firstIncomplete = steps.findIndex((s: any) => s.status !== "completed")
    return firstIncomplete === -1 ? 0 : firstIncomplete
  })

  const [formData, setFormData] = useState<Record<string, any>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationType, setCelebrationType] = useState<"step_complete" | "milestone" | "onboarding_complete">(
    "step_complete",
  )
  const supabase = createClient()
  const router = useRouter()

  const currentProgress = steps[currentStepIndex]
  const currentStep = currentProgress?.onboarding_steps

  const completedSteps = steps.filter((s: any) => s.status === "completed").length
  const totalSteps = steps.length
  const progressPercentage = Math.round((completedSteps / totalSteps) * 100)

  const handleSave = async (markComplete = false) => {
    if (!currentProgress) return

    setIsSaving(true)
    try {
      const updates: any = {
        data: { ...currentProgress.data, ...formData },
      }

      if (markComplete) {
        updates.status = "completed"
        updates.completed_at = new Date().toISOString()
      }

      const { error } = await supabase.from("client_step_progress").update(updates).eq("id", currentProgress.id)

      if (error) throw error

      // Log activity
      await supabase.from("activity_logs").insert({
        workspace_id: workspace.id,
        client_onboarding_id: onboarding.id,
        actor_type: "client",
        action: markComplete ? "completed_step" : "saved_draft",
        metadata: {
          step_title: currentStep.title,
          client_name: client.name,
        },
      })

      if (markComplete) {
        const newCompletedSteps = completedSteps + 1
        const newProgress = Math.round((newCompletedSteps / totalSteps) * 100)

        // All steps completed
        if (currentStepIndex === steps.length - 1) {
          setCelebrationType("onboarding_complete")
          setShowCelebration(true)

          // Update onboarding status to completed
          await supabase
            .from("client_onboardings")
            .update({
              status: "completed",
              progress: 100,
              completed_at: new Date().toISOString(),
            })
            .eq("id", onboarding.id)
        }
        // Milestone: 50% complete
        else if (newProgress >= 50 && progressPercentage < 50) {
          setCelebrationType("milestone")
          setShowCelebration(true)
        }
        // Regular step completion
        else {
          setCelebrationType("step_complete")
          setShowCelebration(true)
        }

        if (currentStepIndex < steps.length - 1) {
          setTimeout(() => {
            setCurrentStepIndex(currentStepIndex + 1)
            setFormData({})
          }, 2000)
        }
      }

      router.refresh()
    } catch (err) {
      console.error("Failed to save:", err)
    } finally {
      setIsSaving(false)
    }
  }

  const renderStepContent = () => {
    if (!currentStep) {
      return (
        <div className="text-center py-12">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Check className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mb-2 text-balance text-3xl font-semibold tracking-tight">All Done!</h1>
          <p className="text-muted-foreground mb-6">You've completed all onboarding steps. We'll be in touch soon!</p>
          <ProgressBadge progress={100} />
        </div>
      )
    }

    const savedData = currentProgress.data || {}

    switch (currentStep.type) {
      case "upload":
        return (
          <>
            <h1 className="mb-2 text-balance text-3xl font-semibold tracking-tight">{currentStep.title}</h1>
            <p className="mb-8 text-muted-foreground">{currentStep.description}</p>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="file-upload">Upload Document *</Label>
                <FileUpload
                  onboardingId={onboarding.id}
                  stepProgressId={currentProgress.id}
                  workspaceId={workspace.id}
                  existingFiles={uploadedFiles}
                  onUploadComplete={(file) => {
                    setUploadedFiles([...uploadedFiles, file])
                    setFormData({ ...formData, files: [...uploadedFiles, file] })
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes..."
                  rows={4}
                  value={formData.notes || savedData.notes || ""}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => handleSave(false)} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Draft"}
                </Button>
                <Button onClick={() => handleSave(true)} disabled={uploadedFiles.length === 0 || isSaving}>
                  {isSaving ? "Saving..." : "Continue"}
                </Button>
              </div>
            </div>
          </>
        )

      case "form":
        return (
          <>
            <h1 className="mb-2 text-balance text-3xl font-semibold tracking-tight">{currentStep.title}</h1>
            <p className="mb-8 text-muted-foreground">{currentStep.description}</p>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="field1">Field 1</Label>
                <Input
                  id="field1"
                  placeholder="Enter information..."
                  value={formData.field1 || savedData.field1 || ""}
                  onChange={(e) => setFormData({ ...formData, field1: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="field2">Field 2</Label>
                <Textarea
                  id="field2"
                  placeholder="Provide details..."
                  rows={4}
                  value={formData.field2 || savedData.field2 || ""}
                  onChange={(e) => setFormData({ ...formData, field2: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-4">
                {currentStepIndex > 0 && (
                  <Button variant="outline" onClick={() => setCurrentStepIndex(currentStepIndex - 1)}>
                    Back
                  </Button>
                )}
                <Button variant="outline" onClick={() => handleSave(false)} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Draft"}
                </Button>
                <Button onClick={() => handleSave(true)} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Continue"}
                </Button>
              </div>
            </div>
          </>
        )

      default:
        return (
          <>
            <h1 className="mb-2 text-balance text-3xl font-semibold tracking-tight">{currentStep.title}</h1>
            <p className="mb-8 text-muted-foreground">{currentStep.description}</p>

            <div className="space-y-6">
              <p className="text-sm text-muted-foreground">
                This step type ({currentStep.type}) needs custom implementation.
              </p>

              <div className="flex gap-3 pt-4">
                {currentStepIndex > 0 && (
                  <Button variant="outline" onClick={() => setCurrentStepIndex(currentStepIndex - 1)}>
                    Back
                  </Button>
                )}
                <Button onClick={() => handleSave(true)} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Mark Complete"}
                </Button>
              </div>
            </div>
          </>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <CelebrationModal open={showCelebration} onOpenChange={setShowCelebration} type={celebrationType} />

      {/* Header with workspace branding */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg" style={{ backgroundColor: workspace.brand_color || "#000" }} />
              <span className="text-sm font-medium">{workspace.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <ProgressBadge progress={progressPercentage} showTrending />
              <div className="text-sm text-muted-foreground">Welcome, {client.name}</div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          {/* Progress Tracker */}
          <div className="lg:sticky lg:top-12 lg:h-fit">
            <Card className="p-6">
              <h2 className="mb-6 font-semibold">Your Progress</h2>
              <nav aria-label="Progress">
                <ol className="space-y-6">
                  {steps.map((progress: any, idx: number) => {
                    const step = progress.onboarding_steps
                    const status =
                      progress.status === "completed" ? "complete" : idx === currentStepIndex ? "current" : "upcoming"

                    return (
                      <li key={step.id} className="relative">
                        {idx !== steps.length - 1 && (
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
                                    ? "border-primary bg-card animate-pulse"
                                    : "border-border bg-card",
                              )}
                            >
                              {status === "complete" ? (
                                <Check className="h-4 w-4 text-primary-foreground" />
                              ) : (
                                <span
                                  className={cn(
                                    "h-2 w-2 rounded-full",
                                    status === "current" ? "bg-primary" : "bg-muted",
                                  )}
                                />
                              )}
                            </span>
                          </span>
                          <span className="ml-4 flex min-w-0 flex-col">
                            <span
                              className={cn(
                                "text-sm font-medium",
                                status === "current" ? "text-foreground" : "text-muted-foreground",
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

              <div className="mt-8 pt-6 border-t border-border">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Overall Progress</span>
                  <span className="font-medium">{progressPercentage}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Active Task */}
          <div>
            <Card className="p-8">
              <div className="max-w-2xl">{renderStepContent()}</div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
