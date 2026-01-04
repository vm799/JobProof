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
    const padding = 24
    const modalWidth = 400
    const modalMaxHeight = 600
    const viewportHeight = window.innerHeight
    const viewportWidth = window.innerWidth

    let top = 0
    let left = 0

    switch (step.position) {
      case "top":
        top = targetRect.top - modalMaxHeight - padding * 2
        left = targetRect.left + targetRect.width / 2 - modalWidth / 2
        break
      case "bottom":
        top = targetRect.bottom + padding * 2
        left = targetRect.left + targetRect.width / 2 - modalWidth / 2
        break
      case "left":
        top = targetRect.top - padding
        left = targetRect.left - modalWidth - padding * 3
        break
      case "right":
        top = targetRect.top - padding
        left = targetRect.right + padding * 3
        break
      default:
        top = targetRect.bottom + padding * 2
        left = targetRect.left
    }

    const maxTop = viewportHeight - 400 // Reserve space for modal
    const maxLeft = viewportWidth - modalWidth - padding * 4

    top = Math.max(padding * 4, Math.min(top, maxTop))
    left = Math.max(padding * 4, Math.min(left, maxLeft))

    return { top, left }
  }

  const position = getModalPosition()

  return (
    <>
      {/* Backdrop overlay */}
      <div className="fixed inset-0 bg-black/60 z-40 animate-in fade-in duration-300" />

      {/* Spotlight on target element - smooth transitions */}
      <div
        className="fixed z-50 pointer-events-none transition-all duration-500 ease-out"
        style={{
          top: targetRect.top - 8,
          left: targetRect.left - 8,
          width: targetRect.width + 16,
          height: targetRect.height + 16,
          boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.6), 0 0 30px 6px rgba(234, 179, 8, 0.8)",
          borderRadius: "12px",
        }}
      />

      {step.action && (
        <div
          className="fixed z-[60] pointer-events-none transition-all duration-500 ease-out"
          style={{
            top: `${targetRect.top + targetRect.height / 2 - 16}px`,
            left:
              step.position === "right"
                ? `${targetRect.left - 48}px`
                : step.position === "left"
                  ? `${targetRect.right + 16}px`
                  : `${targetRect.left + targetRect.width / 2 - 16}px`,
          }}
        >
          <div className="relative">
            <MousePointerClick className="h-8 w-8 text-yellow-400 drop-shadow-[0_0_16px_rgba(250,204,21,1)]" />
          </div>
        </div>
      )}

      <div
        className="fixed z-[70] transition-all duration-500 ease-out"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          maxWidth: `calc(100vw - 96px)`,
          width: "400px",
        }}
      >
        <div className="relative bg-white dark:bg-gray-900 border-4 border-yellow-400 rounded-2xl p-6 shadow-2xl max-h-[60vh] overflow-y-auto">
          <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5">
            <Lightbulb className="h-3.5 w-3.5" />
            DEMO TOUR
          </div>

          {/* Progress indicator */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-yellow-100">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              onClick={handleSkip}
            >
              <X className="h-4 w-4 text-gray-900 dark:text-gray-100" />
            </Button>
          </div>

          {/* Progress bar */}
          <div className="mb-5 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-700 ease-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>

          <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-yellow-50">{step.title}</h3>
          <p className="text-sm text-gray-700 dark:text-gray-200 mb-5 leading-relaxed">{step.description}</p>

          {step.action && (
            <div className="mb-5 p-3.5 bg-yellow-50 dark:bg-yellow-900/30 border-2 border-yellow-400 rounded-xl">
              <p className="text-sm font-bold text-gray-900 dark:text-yellow-100 flex items-center gap-2">
                <div className="p-1 bg-yellow-400 rounded-md">
                  <MousePointerClick className="h-3.5 w-3.5 text-gray-900" />
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
              className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium"
            >
              Skip Tour
            </Button>
            <Button
              onClick={handleNext}
              size="sm"
              className="gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-gray-900 font-bold shadow-lg hover:shadow-xl transition-all"
            >
              {currentStep === steps.length - 1 ? "Finish Tour" : "Next Step"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .tour-highlight {
          position: relative;
          z-index: 45 !important;
          box-shadow: 0 0 0 4px rgba(250, 204, 21, 0.6);
          border-radius: 8px;
          transition: all 0.5s ease-out;
        }
      `}</style>
    </>
  )
}
