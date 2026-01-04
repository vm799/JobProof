"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Smile, Meh, Frown, Heart, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface SentimentFeedbackProps {
  onboardingId: string
  stepProgressId?: string
}

const sentiments = [
  { value: "excited", label: "Excited!", icon: Heart, color: "text-pink-500" },
  { value: "satisfied", label: "Going well", icon: Smile, color: "text-green-500" },
  { value: "confused", label: "A bit confused", icon: AlertCircle, color: "text-yellow-500" },
  { value: "overwhelmed", label: "Feeling overwhelmed", icon: Meh, color: "text-orange-500" },
  { value: "frustrated", label: "Struggling", icon: Frown, color: "text-red-500" },
]

export function SentimentFeedback({ onboardingId, stepProgressId }: SentimentFeedbackProps) {
  const [selectedSentiment, setSelectedSentiment] = useState<string | null>(null)
  const [feedbackText, setFeedbackText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const handleSubmit = async () => {
    if (!selectedSentiment) return

    setIsSubmitting(true)
    try {
      const { error } = await supabase.from("client_sentiment").insert({
        client_onboarding_id: onboardingId,
        step_progress_id: stepProgressId,
        sentiment: selectedSentiment,
        feedback_text: feedbackText || null,
      })

      if (error) throw error

      setHasSubmitted(true)
      toast({
        title: "Thank you for sharing!",
        description: "Your feedback helps us create a better experience for you.",
      })
    } catch (err) {
      console.error("Failed to submit sentiment:", err)
      toast({
        title: "Couldn't save feedback",
        description: "Please try again or let us know directly.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (hasSubmitted) {
    return (
      <Card className="p-6 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
        <div className="text-center">
          <Heart className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-3" />
          <p className="text-sm text-green-700 dark:text-green-300 font-medium">
            Thank you for letting us know how you're feeling!
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">We're here if you need anything.</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-900">
      <div className="mb-4">
        <h4 className="font-semibold mb-1">How are you feeling about this process?</h4>
        <p className="text-sm text-muted-foreground">
          Your honest feedback helps us support you better. No judgment, just care.
        </p>
      </div>

      <div className="grid grid-cols-5 gap-2 mb-4">
        {sentiments.map((sentiment) => {
          const Icon = sentiment.icon
          const isSelected = selectedSentiment === sentiment.value
          return (
            <button
              key={sentiment.value}
              onClick={() => setSelectedSentiment(sentiment.value)}
              className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                isSelected ? "border-primary bg-primary/10 shadow-md" : "border-border bg-card hover:border-primary/50"
              }`}
            >
              <Icon className={`h-8 w-8 ${isSelected ? "text-primary" : sentiment.color}`} />
              <span className="text-xs text-center font-medium">{sentiment.label}</span>
            </button>
          )
        })}
      </div>

      {selectedSentiment && (
        <div className="space-y-3">
          <Textarea
            placeholder="Want to tell us more? (Optional but appreciated!)"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            rows={3}
            className="resize-none"
          />
          <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Sharing..." : "Share My Feedback"}
          </Button>
        </div>
      )}
    </Card>
  )
}
