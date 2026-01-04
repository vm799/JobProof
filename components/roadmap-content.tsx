"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Clock, Sparkles, Send, Shield, FileText, Video, Globe, Mail, Users, Lightbulb } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

const roadmapData = {
  launched: [
    { title: "Hardened Security (RLS)", icon: Shield, description: "Row-level security for all database tables" },
    { title: "Secure File Uploads", icon: FileText, description: "Client file uploads with validation and storage" },
    { title: "Magic Link Auth", icon: Mail, description: "Passwordless email authentication" },
  ],
  inProgress: [
    { title: "Custom Domain Mapping (CNAME)", icon: Globe, description: "White-label your client portals" },
    { title: "Loom Video Embeds", icon: Video, description: "Embed welcome and tutorial videos" },
    { title: "Team Collaboration", icon: Users, description: "Multi-user workspace support" },
  ],
  comingSoon: [
    { title: "E-Signatures Integration", icon: FileText, description: "DocuSign/PandaDoc for contracts" },
    { title: "Automated Email Reminders", icon: Mail, description: "Smart client follow-ups" },
    { title: "White-Label Client Dashboards", icon: Sparkles, description: "Fully branded client experience" },
  ],
}

export function RoadmapContent() {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [feedbackTitle, setFeedbackTitle] = useState("")
  const [feedbackDescription, setFeedbackDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitFeedback = async () => {
    if (!feedbackTitle.trim()) {
      toast.error("Please provide a feature title")
      return
    }

    setIsSubmitting(true)

    // Simulate submission - in production, save to database
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast.success("Thanks for your suggestion! We'll review it soon.")
    setShowFeedbackModal(false)
    setFeedbackTitle("")
    setFeedbackDescription("")
    setIsSubmitting(false)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Product Roadmap</h1>
        <p className="text-muted-foreground">See what we're building next. Your feedback shapes our direction.</p>
      </div>

      {/* Launched */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
            <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-xl font-semibold">Launched</h2>
          <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-300">
            Live Now
          </Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {roadmapData.launched.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} className="p-6 relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="mb-4">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-3">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* In Progress */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
            <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold">In Progress</h2>
          <Badge variant="secondary" className="bg-blue-500/10 text-blue-700 dark:text-blue-300">
            Building Now
          </Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {roadmapData.inProgress.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} className="p-6 relative overflow-hidden border-2 border-blue-500/20">
                <div className="absolute top-4 right-4">
                  <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                </div>
                <div className="mb-4">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-3">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Coming Soon */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-xl font-semibold">Coming Soon</h2>
          <Badge variant="secondary" className="bg-purple-500/10 text-purple-700 dark:text-purple-300">
            Planned
          </Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {roadmapData.comingSoon.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} className="p-6 relative overflow-hidden border-dashed">
                <div className="mb-4">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-3 opacity-70">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Suggest Feature CTA */}
      <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-dashed">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
              <Lightbulb className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Have a Feature Request?</h3>
              <p className="text-sm text-muted-foreground">
                We'd love to hear your ideas. Your feedback directly influences our roadmap.
              </p>
            </div>
          </div>
          <Button size="lg" onClick={() => setShowFeedbackModal(true)} className="flex-shrink-0">
            <Send className="h-4 w-4 mr-2" />
            Suggest a Feature
          </Button>
        </div>
      </Card>

      {/* Feedback Modal */}
      <Dialog open={showFeedbackModal} onOpenChange={setShowFeedbackModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suggest a Feature</DialogTitle>
            <DialogDescription>
              Tell us what you'd like to see in BoardingPass. We review every suggestion.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="feature-title">Feature Title *</Label>
              <Input
                id="feature-title"
                placeholder="e.g., Calendar Integration"
                value={feedbackTitle}
                onChange={(e) => setFeedbackTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feature-description">Description (Optional)</Label>
              <Textarea
                id="feature-description"
                placeholder="Describe how this feature would help you..."
                rows={4}
                value={feedbackDescription}
                onChange={(e) => setFeedbackDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFeedbackModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitFeedback} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Suggestion"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
