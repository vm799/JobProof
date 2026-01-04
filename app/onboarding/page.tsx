"use client"

import { redirect } from "next/navigation"

export default function OnboardingPage() {
  // Onboarding is handled automatically by the database trigger
  // If users land here, redirect them to dashboard which will handle the loading state
  redirect("/dashboard")
}
