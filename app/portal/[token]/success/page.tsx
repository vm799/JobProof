"use client"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Check, Calendar, Mail } from "lucide-react"
import Image from "next/image"
import { SuccessConfetti } from "@/components/success-confetti"

export default async function SuccessPage({ params }: { params: { token: string } }) {
  const { token } = params
  const supabase = await createClient()

  // Verify the onboarding exists and is completed
  const { data: onboarding } = await supabase
    .from("client_onboardings")
    .select(
      `
      id,
      status,
      completed_at,
      clients!inner(id, name, email),
      onboarding_flows!inner(
        id,
        name,
        workspaces!inner(id, name, logo_url, brand_color)
      )
    `,
    )
    .eq("onboarding_link_token", token)
    .single()

  if (!onboarding) {
    redirect("/")
  }

  // If not completed, redirect back to portal
  if (onboarding.status !== "completed") {
    redirect(`/portal/${token}`)
  }

  const workspace = onboarding.onboarding_flows.workspaces
  const client = onboarding.clients
  const completedDate = new Date(onboarding.completed_at).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-muted/20 px-4">
      {/* Confetti effect with CSS */}
      <SuccessConfetti />

      {/* Workspace Logo */}
      <div className="mb-8">
        {workspace.logo_url ? (
          <Image
            src={workspace.logo_url || "/placeholder.svg"}
            alt={workspace.name}
            width={120}
            height={120}
            className="rounded-2xl"
          />
        ) : (
          <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-white font-bold text-3xl">{workspace.name[0]}</span>
          </div>
        )}
      </div>

      {/* Success Icon */}
      <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 mb-6 animate-bounce">
        <Check className="h-10 w-10 text-green-600 dark:text-green-400" strokeWidth={3} />
      </div>

      {/* Main Content */}
      <div className="text-center max-w-2xl space-y-4 mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-balance bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          You're All Set, {client.name.split(" ")[0]}!
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Your onboarding is complete. We've received all your details and our team is already getting to work on your
          project.
        </p>
        <p className="text-sm text-muted-foreground">Completed on {completedDate}</p>
      </div>

      {/* What Happens Next Card */}
      <div className="bg-card p-8 rounded-2xl shadow-lg border border-border w-full max-w-lg mb-8">
        <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          What happens next?
        </h3>
        <ul className="space-y-6">
          <li className="flex gap-4">
            <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-sm font-semibold">
              1
            </span>
            <div className="flex-1">
              <p className="font-medium text-foreground mb-1">Team Review</p>
              <p className="text-sm text-muted-foreground">
                Our team reviews your assets and information (typically within 24 hours)
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-semibold">
              2
            </span>
            <div className="flex-1">
              <p className="font-medium text-foreground mb-1">Dashboard Access</p>
              <p className="text-sm text-muted-foreground">
                You'll receive email access to your project dashboard with real-time updates
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center text-sm font-semibold">
              3
            </span>
            <div className="flex-1">
              <p className="font-medium text-foreground mb-1">Kickoff Call</p>
              <p className="text-sm text-muted-foreground">
                We'll schedule a kickoff call to align on timelines and deliverables
              </p>
            </div>
          </li>
        </ul>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button size="lg" className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90">
          <Mail className="h-4 w-4" />
          Contact {workspace.name}
        </Button>
        <Button size="lg" variant="outline" className="gap-2 bg-transparent">
          <Calendar className="h-4 w-4" />
          Schedule Kickoff Call
        </Button>
      </div>

      {/* Footer */}
      <p className="text-xs text-muted-foreground mt-12 text-center max-w-md">
        Questions? Reach out to <strong>{workspace.name}</strong> anytime. We're here to help make your project a
        success.
      </p>
    </div>
  )
}
