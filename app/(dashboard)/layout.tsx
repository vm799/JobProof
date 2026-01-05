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

  // Just check if profile exists, don't pass it as prop
  try {
    const { data, error } = await supabase.from("profiles").select("id").eq("id", user.id).single()
    if (error) throw error
    if (!data) {
      redirect("/welcome")
    }
  } catch (error) {
    console.error("[v0] Profile fetch failed:", error)
    redirect("/welcome")
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardLayout>{children}</DashboardLayout>
      </Suspense>
    </ErrorBoundary>
  )
}
