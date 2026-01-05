"use client"

import type React from "react"

import { OnboardingTour } from "@/components/onboarding-tour"
import { HelpButton } from "@/components/help-button"
import { WelcomeVideoModal } from "@/components/welcome-video-modal"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface DashboardClientWrapperProps {
  children: React.ReactNode
  shouldShowWelcomeVideo?: boolean
  welcomeVideoUrl?: string
  workspaceName?: string
  userId?: string
  showError?: boolean
  errorMessage?: string
}

export function DashboardClientWrapper({
  children,
  shouldShowWelcomeVideo,
  welcomeVideoUrl,
  workspaceName,
  userId,
  showError,
  errorMessage,
}: DashboardClientWrapperProps) {
  if (showError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-muted-foreground">{errorMessage || "Something went wrong"}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Page
        </Button>
      </div>
    )
  }

  return (
    <>
      {shouldShowWelcomeVideo && welcomeVideoUrl && workspaceName && userId && (
        <WelcomeVideoModal videoUrl={welcomeVideoUrl} workspaceName={workspaceName} userId={userId} />
      )}
      <OnboardingTour />
      <HelpButton />
      {children}
    </>
  )
}
