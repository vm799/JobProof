"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ArrowRight, X } from "lucide-react"

interface TourStep {
  title: string
  description: string
  target?: string
}

const tourSteps: TourStep[] = [
  {
    title: "Welcome to BoardingPass!",
    description:
      "Let's take a quick tour to show you around. You'll be creating amazing client onboarding experiences in no time.",
  },
  {
    title: "Create Your First Flow",
    description:
      "Start by creating an onboarding flow. You can build from scratch or use one of our 10+ pre-built templates.",
  },
  {
    title: "Invite Your Clients",
    description:
      "Once your flow is ready, invite clients by email. They'll get a branded portal link to complete their onboarding.",
  },
  {
    title: "Track Progress",
    description:
      "Monitor client progress in real-time with our analytics dashboard. See completion rates and identify bottlenecks.",
  },
  {
    title: "You're All Set!",
    description: "That's it! Explore the app and don't hesitate to reach out if you need help. Happy onboarding!",
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
            <Button variant="ghost" onClick={handleSkip}>
              Skip tour
            </Button>
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
