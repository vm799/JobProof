"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft, X } from "lucide-react"

interface TourStep {
  title: string
  description: string
  target?: string
}

const tourSteps: TourStep[] = [
  {
    title: "Welcome to JobProof",
    description:
      "This quick tour shows how to create job templates, manage sites, and track completion. Let's walk through the platform together.",
  },
  {
    title: "Step 1: Create Job Templates",
    description:
      "Build structured job workflows using our template builder. Start from templates or create custom steps for your field operations.",
  },
  {
    title: "Step 2: Assign Jobs to Technicians",
    description:
      "Assign jobs by email. They receive a secure link where they can complete the job checklist at their own pace.",
  },
  {
    title: "Step 3: Technicians Complete Their Jobs",
    description:
      "Your technicians see a clean, mobile-friendly interface. They work through each step, upload photos, and provide proof of completion.",
  },
  {
    title: "Step 4: Track Job Completion",
    description:
      "Monitor job status in your dashboard. See which sites need follow-up and identify any bottlenecks in your workflow.",
  },
  {
    title: "Step 5: Schedule Future Jobs",
    description:
      "Plan recurring jobs or schedule follow-ups. Configure job schedules based on your site needs and technician availability.",
  },
  {
    title: "Ready to Get Started",
    description:
      "You now understand how JobProof works from both sides. Start creating your first job or explore the dashboard.",
  },
]

export function OnboardingTour() {
  const [showTour, setShowTour] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    // Check if user has seen the tour
    const hasSeenTour = localStorage.getItem("hasSeenTour")
    if (!hasSeenTour) {
      setShowTour(true)
    }
  }, [])

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    localStorage.setItem("hasSeenTour", "true")
    setShowTour(false)
  }

  const handleSkip = () => {
    localStorage.setItem("hasSeenTour", "true")
    setShowTour(false)
  }

  if (!showTour) return null

  const step = tourSteps[currentStep]

  return (
    <Dialog open={showTour} onOpenChange={setShowTour}>
      <DialogContent className="sm:max-w-md">
        <button
          onClick={handleSkip}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <div className="p-6 pt-8">
          <div className="mb-6">
            <div className="flex gap-2 mb-4">
              {tourSteps.map((_, i) => (
                <div key={i} className={`h-1 flex-1 rounded-full ${i <= currentStep ? "bg-primary" : "bg-muted"}`} />
              ))}
            </div>
            <h2 className="text-2xl font-bold mb-2">{step.title}</h2>
            <p className="text-muted-foreground">{step.description}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button variant="outline" onClick={handleBack} className="gap-2 bg-transparent">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              )}
              <Button variant="ghost" onClick={handleSkip}>
                Skip tour
              </Button>
            </div>
            <Button onClick={handleNext} className="gap-2">
              {currentStep === tourSteps.length - 1 ? "Get Started" : "Next"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Step {currentStep + 1} of {tourSteps.length}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
