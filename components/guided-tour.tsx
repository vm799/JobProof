"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, ArrowRight, Sparkles, MousePointerClick, Lightbulb } from "lucide-react"

interface TourStep {
  target: string
  title: string
  description: string
  position: "top" | "bottom" | "left" | "right"
  action?: string
  highlight?: boolean
}

interface GuidedTourProps {
  steps: TourStep[]
  onComplete?: () => void
  onSkip?: () => void
}

export function GuidedTour({ steps, onComplete, onSkip }: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)

  const step = steps[currentStep]

  useEffect(() => {
    if (!step || !isVisible) return

    const updatePosition = () => {
      const element = document.querySelector(step.target)
      if (element) {
        const rect = element.getBoundingClientRect()
        setTargetRect(rect)

        // Scroll element into view if needed
        element.scrollIntoView({ behavior: "smooth", block: "center" })

        // Add highlight class
        if (step.highlight !== false) {
          element.classList.add("tour-highlight")
        }
      }
    }

    updatePosition()
    window.addEventListener("resize", updatePosition)
    window.addEventListener("scroll", updatePosition)

    return () => {
      window.removeEventListener("resize", updatePosition)
      window.removeEventListener("scroll", updatePosition)
      const element = document.querySelector(step.target)
      if (element) {
        element.classList.remove("tour-highlight")
      }
    }
  }, [currentStep, step, isVisible])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleSkip = () => {
    setIsVisible(false)
    onSkip?.()
  }

  const handleComplete = () => {
    setIsVisible(false)
    onComplete?.()
  }

  if (!isVisible || !step || !targetRect) return null

  const getModalPosition = () => {
    const padding = 20
    const modalWidth = 380
    const modalMaxHeight = 500
    const viewportHeight = window.innerHeight
    const viewportWidth = window.innerWidth

    let top = 0
    let left = 0

    switch (step.position) {
      case "top":
        top = targetRect.top - padding - 240
        left = targetRect.left + targetRect.width / 2 - modalWidth / 2
        break
      case "bottom":
        top = targetRect.bottom + padding
        left = targetRect.left + targetRect.width / 2 - modalWidth / 2
        break
      case "left":
        top = targetRect.top + targetRect.height / 2 - 120
        left = targetRect.left - modalWidth - padding
        break
      case "right":
        top = targetRect.top + targetRect.height / 2 - 120
        left = targetRect.right + padding
        break
      default:
        top = targetRect.bottom + padding
        left = targetRect.left
    }

    // Constrain to viewport with padding
    top = Math.max(padding, Math.min(top, viewportHeight - modalMaxHeight - padding))
    left = Math.max(padding, Math.min(left, viewportWidth - modalWidth - padding))

    return { top, left }
  }

  const position = getModalPosition()

  const getPointerPosition = () => {
    switch (step.position) {
      case "top":
        // Pointer below modal, pointing up
        return {
          top: position.top + 260,
          left: position.left + 190 - 12,
        }
      case "bottom":
        // Pointer above modal, pointing down
        return {
          top: position.top - 40,
          left: position.left + 190 - 12,
        }
      case "left":
        // Pointer to the right of modal, pointing left
        return {
          top: position.top + 120,
          left: position.left + 380 + 20,
        }
      case "right":
        // Pointer to the left of modal, pointing right
        return {
          top: position.top + 120,
          left: position.left - 40,
        }
      default:
        return {
          top: position.top - 40,
          left: position.left + 190 - 12,
        }
    }
  }

  const pointerPosition = getPointerPosition()

  return (
    <>
      {/* Backdrop overlay */}
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 animate-in fade-in" />

      {/* Spotlight on target element */}
      <div
        className="fixed z-50 pointer-events-none"
        style={{
          top: targetRect.top - 8,
          left: targetRect.left - 8,
          width: targetRect.width + 16,
          height: targetRect.height + 16,
          boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5), 0 0 20px 4px rgba(234, 179, 8, 0.6)",
          borderRadius: "12px",
          transition: "all 0.3s ease",
        }}
      />

      {step.action && (
        <div
          className="fixed z-[60] pointer-events-none"
          style={{
            top: `${pointerPosition.top}px`,
            left: `${pointerPosition.left}px`,
            animation: "bounce 1s infinite",
          }}
        >
          <div className="relative">
            <MousePointerClick className="h-10 w-10 text-yellow-400 drop-shadow-[0_0_16px_rgba(234,179,8,1)] animate-pulse" />
            <div className="absolute inset-0 h-10 w-10 bg-yellow-400 rounded-full blur-xl opacity-60 animate-pulse" />
          </div>
        </div>
      )}

      <div
        className="fixed z-50 w-[380px] max-h-[calc(100vh-40px)] overflow-y-auto animate-in slide-in-from-bottom-5"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
      >
        {/* Glowing border effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 via-amber-500 to-orange-500 rounded-2xl blur-lg opacity-40 animate-pulse pointer-events-none" />

        <div className="relative bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-950/50 dark:to-amber-950/50 backdrop-blur-xl border-2 border-yellow-500/50 rounded-2xl p-6 shadow-2xl">
          {/* Demo badge */}
          <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5 animate-bounce">
            <Lightbulb className="h-3.5 w-3.5" />
            DEMO TOUR
          </div>

          {/* Progress indicator */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-bold text-yellow-900 dark:text-yellow-200">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-yellow-200 dark:hover:bg-yellow-900/30 rounded-full"
              onClick={handleSkip}
            >
              <X className="h-4 w-4 text-yellow-900 dark:text-yellow-200" />
            </Button>
          </div>

          {/* Progress bar */}
          <div className="mb-5 h-2 bg-yellow-200 dark:bg-yellow-900/30 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-yellow-500 to-amber-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(234,179,8,0.5)]"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>

          <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-yellow-100">{step.title}</h3>
          <p className="text-sm text-gray-800 dark:text-yellow-200 mb-5 leading-relaxed">{step.description}</p>

          {step.action && (
            <div className="mb-5 p-3 bg-gradient-to-br from-yellow-200 to-amber-200 dark:from-yellow-900/50 dark:to-amber-900/50 border-2 border-yellow-500/50 rounded-xl shadow-inner">
              <p className="text-sm font-bold text-gray-900 dark:text-yellow-100 flex items-center gap-2">
                <div className="p-1 bg-yellow-500 rounded-md">
                  <MousePointerClick className="h-3.5 w-3.5 text-white" />
                </div>
                {step.action}
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-gray-800 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/30 font-medium"
            >
              Skip Tour
            </Button>
            <Button
              onClick={handleNext}
              size="sm"
              className="gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
            >
              {currentStep === steps.length - 1 ? "Finish Tour" : "Next Step"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Global styles for highlighting */}
      <style jsx global>{`
        .tour-highlight {
          position: relative;
          z-index: 45 !important;
          animation: pulse-ring 2s infinite;
        }

        @keyframes pulse-ring {
          0% {
            box-shadow: 0 0 0 0 rgba(234, 179, 8, 0.8);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(234, 179, 8, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(234, 179, 8, 0);
          }
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </>
  )
}
