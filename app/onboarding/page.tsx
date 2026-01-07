"use client"

// Users redirected to /dashboard instead
import { redirect } from "next/navigation"

export default function OnboardingPage() {
  redirect("/dashboard")
}
