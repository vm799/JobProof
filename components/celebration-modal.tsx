"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Sparkles, Star, Heart } from "lucide-react"
import { Confetti } from "@/components/confetti"

interface CelebrationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: "step_complete" | "milestone" | "onboarding_complete"
  title?: string
  message?: string
  clientName?: string
}

export function CelebrationModal({ open, onOpenChange, type, title, message, clientName }: CelebrationModalProps) {
  const celebrations = {
    step_complete: {
      icon: Sparkles,
      color: "text-primary",
      title: title || "Step Complete",
      message:
        message ||
        `${clientName ? `${clientName}, you` : "You"}'re making progress. Each completed step brings you closer to launch.`,
    },
    milestone: {
      icon: Star,
      color: "text-amber-500",
      title: title || "Halfway There",
      message:
        message ||
        `${clientName ? clientName + ", you've" : "You've"} completed half the steps. Keep the momentum going.`,
    },
    onboarding_complete: {
      icon: Heart,
      color: "text-rose-500",
      title: title || "Onboarding Complete",
      message:
        message ||
        `${clientName ? clientName + ", your" : "Your"} onboarding is complete. Our team will review your information and reach out within 24 hours to schedule next steps.`,
    },
  }

  const celebration = celebrations[type]
  const Icon = celebration.icon

  return (
    <>
      <Confetti active={open && type === "onboarding_complete"} />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md border-border">
          <div className="flex flex-col items-center text-center p-6">
            <div className="mb-4 rounded-full bg-primary/10 p-8">
              <Icon className={`h-16 w-16 ${celebration.color}`} />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-balance text-foreground">{celebration.title}</h2>
            <p className="text-foreground/80 mb-6 text-pretty leading-relaxed">{celebration.message}</p>
            {type === "onboarding_complete" && (
              <p className="text-sm text-foreground/70 mb-6">We'll be in touch soon to discuss your project details.</p>
            )}
            <Button onClick={() => onOpenChange(false)} size="lg" className="w-full gap-2">
              {type === "onboarding_complete" ? "Done" : "Continue"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
