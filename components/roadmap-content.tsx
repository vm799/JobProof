"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Check,
  Clock,
  Sparkles,
  Send,
  Shield,
  Video,
  Globe,
  Mail,
  Users,
  Lightbulb,
  Lock,
  Link2,
  Palette,
  Upload,
  Smartphone,
  Workflow,
  Bell,
  PenTool,
  MessageSquare,
  Zap,
  Eye,
} from "lucide-react"
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
    {
      title: "Hardened Row-Level Security (RLS)",
      icon: Shield,
      description: "Military-grade database isolation ensuring client data never leaks between workspaces",
    },
    {
      title: "7-Day Secure Tokens",
      icon: Lock,
      description: "Time-limited magic links to ensure onboarding portals aren't left open to the public forever",
    },
    {
      title: "Custom Brand Identity",
      icon: Palette,
      description: "Upload agency logos and set brand colors for a seamless client experience",
    },
    {
      title: "Professional SMTP Integration",
      icon: Mail,
      description: "Verified email delivery via Resend to ensure Magic Links never hit the spam folder",
    },
    {
      title: "Secure File Vault",
      icon: Upload,
      description: "Encrypted storage for client assets (Logos, IDs, Brand Guidelines) with owner-only access",
    },
    {
      title: "Mobile-Responsive Portal",
      icon: Smartphone,
      description: "A boarding pass experience that works perfectly on Safari and Chrome for mobile",
    },
  ],
  inProgress: [
    {
      title: "Loom & Video Embeds",
      icon: Video,
      description: "Add personalized Welcome videos to any onboarding step",
    },
    {
      title: "Team Collaboration",
      icon: Users,
      description: "Invite staff members to manage client onboarding without sharing your admin password",
    },
    {
      title: "Custom Domain Mapping",
      icon: Globe,
      description: "Run your portals on your own subdomains (e.g., portal.youragency.com) instead of our URL",
    },
    {
      title: "Step Templates",
      icon: Workflow,
      description: "Create Master Blueprints for different service tiers (SEO Onboarding vs. Web Design Onboarding)",
    },
    {
      title: "Real-time Notifications",
      icon: Bell,
      description: "Get an email or Slack alert the second a client completes a step",
    },
  ],
  comingSoon: [
    {
      title: "Native E-Signatures",
      icon: PenTool,
      description: "Legally binding contract signing built directly into the onboarding flow",
    },
    {
      title: "White-Label Support",
      icon: Eye,
      description: "Total removal of 'Powered by BoardingPass' for a 100% Ghost agency experience",
    },
    {
      title: "Automated Chasing",
      icon: Zap,
      description: "AI-powered email reminders that gently nudge clients who haven't finished their tasks",
    },
    {
      title: "API & Zapier Integration",
      icon: Link2,
      description: "Connect BoardingPass to 5,000+ apps like GoHighLevel, ClickUp, and Monday.com",
    },
    {
      title: "Client Messaging",
      icon: MessageSquare,
      description: "A secure, internal chat thread for each onboarding portal to kill Email Fatigue",
    },
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

    try {
      const response = await fetch("/api/feature-suggestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: feedbackTitle,
          description: feedbackDescription,
        }),
      })

      if (!response.ok) throw new Error("Failed to submit")

      toast.success("Thanks for your suggestion! We'll review it soon.")
      setShowFeedbackModal(false)
      setFeedbackTitle("")
      setFeedbackDescription("")
    } catch (error) {
      toast.error("Failed to submit suggestion. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Product Roadmap</h1>
        <p className="text-muted-foreground">See what we're building next. Your feedback shapes our direction.</p>
      </div>

      {/* Launched - The Foundation */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
            <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-xl font-semibold">Launched (The Foundation)</h2>
          <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20">
            Live
          </Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {roadmapData.launched.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} className="p-6 relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <Badge className="bg-green-500 text-white border-0 shadow-sm">Live</Badge>
                </div>
                <div className="mb-4">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-3">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-1 text-balance">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* In Progress - The "Soon" List */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
            <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold">In Progress (The "Soon" List)</h2>
          <Badge variant="secondary" className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20">
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse mr-2" />
            Working
          </Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {roadmapData.inProgress.map((feature) => {
            const Icon = feature.icon
            return (
              <Card
                key={feature.title}
                className="p-6 relative overflow-hidden border-2 border-blue-500/20 bg-blue-500/5"
              >
                <div className="absolute top-4 right-4">
                  <Badge className="bg-blue-500 text-white border-0 shadow-sm">
                    <div className="h-2 w-2 rounded-full bg-white animate-pulse mr-2" />
                    Working
                  </Badge>
                </div>
                <div className="mb-4">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-3">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-1 text-balance">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Coming Soon - The Vision */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-xl font-semibold">Coming Soon (The Vision)</h2>
          <Badge
            variant="secondary"
            className="bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20"
          >
            Planned
          </Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {roadmapData.comingSoon.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} className="p-6 relative overflow-hidden border-dashed border-2">
                <div className="absolute top-4 right-4">
                  <Badge
                    variant="secondary"
                    className="bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20"
                  >
                    Planned
                  </Badge>
                </div>
                <div className="mb-4">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-3 opacity-80">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-1 text-balance">{feature.title}</h3>
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
