"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Mail, CheckCircle } from "lucide-react"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState(searchParams.get("email") || "")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false)
  const [showMagicLink, setShowMagicLink] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const emailParam = searchParams.get("email")
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [searchParams])

  const handleMagicLink = async () => {
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      console.log("[v0] Sending magic link to:", email)

      const isLocalhost =
        typeof window !== "undefined" &&
        (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")

      const productionUrl =
        process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://getboardingpass.app"
      const redirectUrl = isLocalhost
        ? process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || "http://localhost:3000/auth/callback"
        : `${productionUrl}/auth/callback`

      console.log("[v0] Magic link redirect URL:", redirectUrl)

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl,
        },
      })

      if (error) {
        console.error("[v0] Magic link error:", error.message)
        setError(error.message)
        return
      }

      console.log("[v0] Magic link sent successfully")
      setMagicLinkSent(true)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send magic link"
      console.error("[v0] Magic link failed:", errorMessage)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)
    setNeedsEmailConfirmation(false)

    try {
      console.log("[v0] Attempting login with email:", email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("[v0] Login error:", error.message)

        if (error.message.includes("Invalid login credentials")) {
          const { data: users } = await supabase.from("profiles").select("email").eq("email", email).single()

          if (users) {
            setNeedsEmailConfirmation(true)
            setError("Please check your email and confirm your account before signing in.")
          } else {
            setError("Invalid email or password. Please try again.")
          }
        } else {
          setError(error.message)
        }
        return
      }

      console.log("[v0] Login successful. User ID:", data.user?.id)
      console.log("[v0] Session exists:", !!data.session)

      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log("[v0] Redirecting to dashboard with window.location...")
      window.location.href = "/dashboard"
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred"
      console.error("[v0] Login failed:", errorMessage)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  if (magicLinkSent) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background p-6">
        <div className="w-full max-w-sm">
          <Card>
            <CardHeader className="text-center">
              <div className="mb-4 flex justify-center">
                <Image
                  src="/boardingpass-logo.png"
                  alt="BoardingPass"
                  width={450}
                  height={120}
                  className="h-30 w-auto"
                  priority
                />
              </div>
              <CardTitle className="text-2xl font-semibold">Check your email</CardTitle>
              <CardDescription>We've sent you a secure sign-in link</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-sm text-green-900">
                  A secure sign-in link has been sent to <strong>{email}</strong>
                </AlertDescription>
              </Alert>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Click the link in your email to sign in. The link will:</p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>Work on any device</li>
                  <li>Expire after 1 hour for security</li>
                  <li>Sign you in automatically</li>
                </ul>
              </div>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/auth/login">Back to login</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
              <Image
                src="/boardingpass-logo.png"
                alt="BoardingPass"
                width={450}
                height={120}
                className="h-30 w-auto"
                priority
              />
            </div>
            <CardTitle className="text-2xl font-semibold">Welcome back</CardTitle>
            <CardDescription>Sign in to your BoardingPass account</CardDescription>
          </CardHeader>
          <CardContent>
            {!showMagicLink ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {needsEmailConfirmation && (
                  <Alert className="border-blue-200 bg-blue-50">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-sm text-blue-900">
                      Your account exists but may need email confirmation. Check your inbox for the verification link.
                    </AlertDescription>
                  </Alert>
                )}

                {error && !needsEmailConfirmation && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => setShowMagicLink(true)}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Sign in with email link
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">{error}</AlertDescription>
                  </Alert>
                )}

                <Button onClick={handleMagicLink} className="w-full" disabled={isLoading || !email}>
                  {isLoading ? "Sending link..." : "Send sign-in link"}
                </Button>

                <Button type="button" variant="ghost" className="w-full" onClick={() => setShowMagicLink(false)}>
                  Back to password sign in
                </Button>
              </div>
            )}

            <div className="mt-4 text-center text-xs text-muted-foreground">
              By signing in, you agree to our{" "}
              <Link href="/terms" className="text-primary underline-offset-4 hover:underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary underline-offset-4 hover:underline">
                Privacy Policy
              </Link>
            </div>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/auth/sign-up" className="text-primary underline-offset-4 hover:underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
