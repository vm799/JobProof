import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Suspense } from "react"
import { DashboardSkeleton } from "@/components/loading-skeleton"
import { ErrorBoundary } from "@/components/error-boundary"

export default async function DashboardLayoutWrapper({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/auth/login")
  }

  let profile
  try {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()
    if (error) throw error
    profile = data
  } catch (error) {
    console.error("[v0] Profile fetch failed:", error)
    redirect("/welcome")
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardLayout user={user} profile={profile}>
          {children}
        </DashboardLayout>
      </Suspense>
    </ErrorBoundary>
  )
}
