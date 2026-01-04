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
import { LoadingButton } from "@/components/ui/loading-button"
import { stepDataSchema } from "@/lib/validation/schemas"
import { sanitizeText } from "@/lib/validation/sanitize"
import { toast } from "sonner"

interface ClientPortalProps {
  onboarding: any
  token: string // Added token prop for redirect
}

export function ClientPortal({ onboarding, token }: ClientPortalProps) {
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

    if (isSaving) return
    setIsSaving(true)

    try {
      const sanitizedData: Record<string, any> = {}

      for (const [key, value] of Object.entries(formData)) {
        if (typeof value === "string") {
          sanitizedData[key] = sanitizeText(value)
        } else {
          sanitizedData[key] = value
        }
      }

      const validationResult = stepDataSchema.safeParse(sanitizedData)
      if (!validationResult.success) {
        toast.error("Invalid input: " + validationResult.error.errors[0].message)
        setIsSaving(false)
        return
      }

      const updates: any = {
        data: { ...currentProgress.data, ...sanitizedData },
      }

      if (markComplete) {
        updates.status = "completed"
        updates.completed_at = new Date().toISOString()
      }

      const { error } = await supabase.from("client_step_progress").update(updates).eq("id", currentProgress.id)

      if (error) throw error

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

        if (currentStepIndex === steps.length - 1) {
          setCelebrationType("onboarding_complete")
          setShowCelebration(true)

          await supabase
            .from("client_onboardings")
            .update({
              status: "completed",
              progress: 100,
              completed_at: new Date().toISOString(),
            })
            .eq("id", onboarding.id)

          setTimeout(() => {
            window.location.href = `/portal/${token}/success`
          }, 2000)
        } else if (newProgress >= 50 && progressPercentage < 50) {
          setCelebrationType("milestone")
          setShowCelebration(true)
        } else {
          setCelebrationType("step_complete")
          setShowCelebration(true)
        }

        if (currentStepIndex < steps.length - 1) {
          setTimeout(() => {
            setCurrentStepIndex(currentStepIndex + 1)
            setFormData({})
            setIsSaving(false)
          }, 2000)
        }
      } else {
        setIsSaving(false)
      }

      router.refresh()
    } catch (err) {
      console.error("Failed to save:", err)
      toast.error("Failed to save. Please try again.")
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

    if (currentStep.video_url) {
      return (
        <>
          <h1 className="mb-2 text-balance text-3xl font-semibold tracking-tight">{currentStep.title}</h1>
          <p className="mb-6 text-muted-foreground">{currentStep.description}</p>

          <div className="space-y-6">
            <div className="relative w-full overflow-hidden rounded-xl shadow-lg" style={{ paddingBottom: "56.25%" }}>
              <iframe
                src={currentStep.video_url}
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={currentStep.title}
              />
            </div>

            <div className="flex gap-3 pt-4">
              {currentStepIndex > 0 && (
                <Button variant="outline" onClick={() => setCurrentStepIndex(currentStepIndex - 1)}>
                  Back
                </Button>
              )}
              <LoadingButton onClick={() => handleSave(true)} loading={isSaving} loadingText="Processing...">
                Continue
              </LoadingButton>
            </div>
          </div>
        </>
      )
    }

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
                  maxLength={5000}
                  value={formData.notes || savedData.notes || ""}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  {(formData.notes || savedData.notes || "").length}/5000 characters
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStepIndex(currentStepIndex - 1)}
                  disabled={currentStepIndex === 0}
                >
                  Back
                </Button>
                <LoadingButton
                  variant="outline"
                  onClick={() => handleSave(false)}
                  loading={isSaving}
                  loadingText="Saving..."
                >
                  Save Draft
                </LoadingButton>
                <LoadingButton
                  onClick={() => handleSave(true)}
                  disabled={uploadedFiles.length === 0 || isSaving}
                  loading={isSaving}
                  loadingText="Processing..."
                >
                  Continue
                </LoadingButton>
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
                  maxLength={255}
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
                  maxLength={5000}
                  value={formData.field2 || savedData.field2 || ""}
                  onChange={(e) => setFormData({ ...formData, field2: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  {(formData.field2 || savedData.field2 || "").length}/5000 characters
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                {currentStepIndex > 0 && (
                  <Button variant="outline" onClick={() => setCurrentStepIndex(currentStepIndex - 1)}>
                    Back
                  </Button>
                )}
                <LoadingButton
                  variant="outline"
                  onClick={() => handleSave(false)}
                  loading={isSaving}
                  loadingText="Saving..."
                >
                  Save Draft
                </LoadingButton>
                <LoadingButton onClick={() => handleSave(true)} loading={isSaving} loadingText="Processing...">
                  Continue
                </LoadingButton>
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
                <LoadingButton onClick={() => handleSave(true)} loading={isSaving} loadingText="Processing...">
                  Mark Complete
                </LoadingButton>
              </div>
            </div>
          </>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <CelebrationModal open={showCelebration} onOpenChange={setShowCelebration} type={celebrationType} />

      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {workspace.logo_url ? (
                <img
                  src={workspace.logo_url || "/placeholder.svg"}
                  alt={workspace.name}
                  className="h-8 w-auto rounded-lg"
                />
              ) : (
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{workspace.name[0]}</span>
                </div>
              )}
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
                              status === "complete" ? "bg-gradient-to-b from-primary to-accent" : "bg-border",
                            )}
                          />
                        )}
                        <div className="group relative flex items-start">
                          <span className="flex h-8 items-center">
                            <span
                              className={cn(
                                "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all",
                                status === "complete"
                                  ? "border-primary bg-gradient-to-br from-primary to-accent text-white"
                                  : status === "current"
                                    ? "border-primary bg-card animate-pulse"
                                    : "border-border bg-card",
                              )}
                            >
                              {status === "complete" ? (
                                <Check className="h-4 w-4 text-white" />
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
                            <span className="text-xs text-muted-foreground mb-0.5">
                              Step {idx + 1} of {totalSteps}
                            </span>
                            <span
                              className={cn(
                                "text-sm font-medium",
                                status === "complete"
                                  ? "text-foreground"
                                  : status === "current"
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

              <div className="mt-8 pt-6 border-t border-border">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Overall Progress</span>
                  <span className="font-medium">{progressPercentage}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  {completedSteps} of {totalSteps} completed
                </p>
              </div>
            </Card>
          </div>

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
