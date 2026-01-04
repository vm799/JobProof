import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function OnboardingPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user has a profile with workspace
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (profile?.current_workspace_id) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <CardTitle className="text-2xl font-semibold">Setting up your workspace</CardTitle>
          <CardDescription>We're creating your BoardingPass workspace. This will only take a moment.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
          <p className="text-sm text-muted-foreground">
            If this takes longer than expected, try refreshing the page or contact support.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
