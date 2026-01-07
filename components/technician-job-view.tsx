"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MapPin, CheckCircle2, Camera } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface TechnicianJobViewProps {
  job: any
}

export function TechnicianJobView({ job }: TechnicianJobViewProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(
    new Set(job.progress.filter((p: any) => p.completed).map((p: any) => p.step_id)),
  )
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleStepToggle = async (stepId: string) => {
    const newCompleted = new Set(completedSteps)
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId)
    } else {
      newCompleted.add(stepId)
    }
    setCompletedSteps(newCompleted)

    // Update progress in database
    await supabase.from("client_step_progress").upsert({
      onboarding_id: job.id,
      step_id: stepId,
      completed: newCompleted.has(stepId),
      notes: notes[stepId] || null,
    })
  }

  const handlePhotoUpload = async (stepId: string, file: File) => {
    // Upload to Supabase Storage
    const fileName = `${job.id}/${stepId}/${Date.now()}-${file.name}`
    const { data, error } = await supabase.storage.from("job-proofs").upload(fileName, file)

    if (!error && data) {
      // Update step progress with photo URL
      const { data: publicUrl } = supabase.storage.from("job-proofs").getPublicUrl(fileName)

      await supabase.from("client_step_progress").upsert({
        onboarding_id: job.id,
        step_id: stepId,
        photo_url: publicUrl.publicUrl,
      })

      router.refresh()
    }
  }

  const handleCompleteJob = async () => {
    setIsSubmitting(true)

    try {
      // Update job status
      await supabase
        .from("client_onboardings")
        .update({ status: "completed", completed_at: new Date().toISOString() })
        .eq("id", job.id)

      // Trigger completion email
      await fetch("/api/jobs/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: job.id }),
      })

      router.refresh()
    } catch (error) {
      console.error("Failed to complete job:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalSteps = job.flow.steps.length
  const completedCount = completedSteps.size
  const completionRate = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{job.flow.name}</CardTitle>
                <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {job.client.name}
                </div>
              </div>
              <Badge variant={job.status === "completed" ? "default" : "secondary"}>{job.status}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{completionRate}%</span>
              </div>
              <div className="h-2 rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {completedCount} of {totalSteps} steps completed
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {job.flow.steps.map((step: any, index: number) => (
            <Card key={step.id}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Checkbox
                      id={step.id}
                      checked={completedSteps.has(step.id)}
                      onCheckedChange={() => handleStepToggle(step.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-2">
                      <Label htmlFor={step.id} className="text-base font-medium cursor-pointer">
                        {index + 1}. {step.title}
                      </Label>
                      {step.description && <p className="text-sm text-muted-foreground">{step.description}</p>}

                      <div className="space-y-2">
                        <Label htmlFor={`notes-${step.id}`} className="text-sm">
                          Notes (Optional)
                        </Label>
                        <Textarea
                          id={`notes-${step.id}`}
                          placeholder="Add any notes about this step..."
                          value={notes[step.id] || ""}
                          onChange={(e) => setNotes({ ...notes, [step.id]: e.target.value })}
                          className="min-h-[80px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">Proof of Work</Label>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const input = document.createElement("input")
                              input.type = "file"
                              input.accept = "image/*"
                              input.onchange = (e: any) => {
                                const file = e.target.files[0]
                                if (file) handlePhotoUpload(step.id, file)
                              }
                              input.click()
                            }}
                          >
                            <Camera className="mr-2 h-4 w-4" />
                            Upload Photo
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="p-6">
            <Button
              onClick={handleCompleteJob}
              disabled={isSubmitting || completedCount < totalSteps}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Complete Job
                </>
              )}
            </Button>
            {completedCount < totalSteps && (
              <p className="mt-2 text-center text-sm text-muted-foreground">Complete all steps to finish this job</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
