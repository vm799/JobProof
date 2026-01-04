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
    title: "Welcome to BoardingPass",
    description:
      "This quick tour shows how to create flows, manage clients, and track progress. Let's walk through the platform together.",
  },
  {
    title: "Step 1: Create Onboarding Flows",
    description:
      "Build structured intake workflows using our flow builder. Start from templates or create custom steps for your process.",
  },
  {
    title: "Step 2: Send Client Invitations",
    description:
      "Invite clients by email. They receive a branded portal link where they can complete onboarding at their own pace.",
  },
  {
    title: "Step 3: Clients Complete Their Onboarding",
    description:
      "Your clients see a clean, branded portal. They work through each step, upload documents, and provide information you need.",
  },
  {
    title: "Step 4: Track Real-Time Progress",
    description:
      "Monitor completion status in your dashboard. See which clients need follow-up and identify any bottlenecks in your flow.",
  },
  {
    title: "Step 5: Automate Follow-Ups",
    description:
      "Set up automated reminder emails to keep clients moving. Configure reminder schedules based on your workflow needs.",
  },
  {
    title: "Ready to Build",
    description:
      "You now understand how BoardingPass works from both sides. Start creating your first flow or explore the dashboard.",
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
