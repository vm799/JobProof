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
      title: title || "You did it!",
      message:
        message ||
        `That wasn't easy, but you powered through. We're genuinely impressed${clientName ? `, ${clientName}` : ""}. Keep this momentum going!`,
      emoji: "🎉",
    },
    milestone: {
      icon: Star,
      color: "text-amber-500",
      title: title || "Wow, you're halfway there!",
      message:
        message ||
        `${clientName ? clientName + ", you" : "You"}'re absolutely crushing this. Take a moment to appreciate how far you've come. The finish line is in sight!`,
      emoji: "⭐",
    },
    onboarding_complete: {
      icon: Heart,
      color: "text-rose-500",
      title: title || "This is the start of something special!",
      message:
        message ||
        `${clientName ? clientName + ", we" : "We"}'re genuinely excited to work with you. Thank you for trusting us with your project. Our team is already preparing to make this partnership amazing. Welcome aboard!`,
      emoji: "❤️",
    },
  }

  const celebration = celebrations[type]
  const Icon = celebration.icon

  return (
    <>
      <Confetti active={open && type === "onboarding_complete"} />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center text-center p-6">
            <div className="text-6xl mb-4 animate-bounce">{celebration.emoji}</div>
            <div className="mb-4 rounded-full bg-primary/10 p-6">
              <Icon className={`h-12 w-12 ${celebration.color}`} />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-balance">{celebration.title}</h2>
            <p className="text-muted-foreground mb-6 text-pretty leading-relaxed">{celebration.message}</p>
            {type === "onboarding_complete" && (
              <p className="text-sm text-muted-foreground mb-6 italic">
                "Every great partnership starts with a leap of faith. Thank you for taking that leap with us."
              </p>
            )}
            <Button onClick={() => onOpenChange(false)} size="lg" className="w-full gap-2">
              {type === "onboarding_complete" ? "Let's Get Started!" : "Keep Going!"}
              <Sparkles className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
