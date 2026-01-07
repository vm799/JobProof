"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Check, X } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export default function SignUpPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isExistingUser, setIsExistingUser] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkExistingSession = async () => {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        // User is already logged in, redirect to dashboard
        router.push("/dashboard")
      }
    }

    checkExistingSession()
  }, [router])

  useEffect(() => {
    const checkEmailExists = async () => {
      if (email && email.includes("@")) {
        const supabase = createClient()
        const { data } = await supabase.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: false,
          },
        })

        // This is a workaround to check if email exists
        // If error is "User not found", email doesn't exist
        setIsExistingUser(false) // We'll handle this in the form submission
      }
    }

    const debounce = setTimeout(checkEmailExists, 500)
    return () => clearTimeout(debounce)
  }, [email])

  const passwordValidation = {
    minLength: password.length >= 10,
    hasNumber: /\d/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  }

  const passwordStrength = Object.values(passwordValidation).filter(Boolean).length
  const isPasswordValid = Object.values(passwordValidation).every(Boolean)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (!isPasswordValid) {
      setError("Password must be at least 10 characters with 1 number and 1 special character")
      setIsLoading(false)
      return
    }

    try {
      console.log("[v0] Attempting signup with email:", email)

      const isLocalhost =
        typeof window !== "undefined" &&
        (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
      const productionUrl =
        process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://jobproof.app"
      const redirectUrl = isLocalhost
        ? process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || "http://localhost:3000/auth/callback"
        : `${productionUrl}/auth/callback`

      console.log("[v0] Using redirect URL:", redirectUrl)

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: name,
          },
        },
      })

      if (error) {
        if (error.message.includes("already registered") || error.message.includes("already exists")) {
          setError("This email is already registered. Please sign in instead.")
          setIsExistingUser(true)
          setIsLoading(false)
          return
        }
        console.error("[v0] Signup error:", error)
        throw error
      }

      console.log("[v0] Signup successful. User ID:", data?.user?.id)
      router.push(`/auth/check-email?email=${encodeURIComponent(email)}`)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred during signup"
      console.error("[v0] Signup failed with error:", errorMessage)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  if (isExistingUser) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background p-6">
        <div className="w-full max-w-sm">
          <Card>
            <CardHeader className="text-center">
              <div className="mb-4 flex justify-center">
                <Image
                  src="/jobproof-logo.png"
                  alt="JobProof"
                  width={450}
                  height={120}
                  className="h-30 w-auto"
                  priority
                />
              </div>
              <CardTitle className="text-2xl font-semibold">Welcome back</CardTitle>
              <CardDescription>This email is already registered. Please sign in with your password.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full">
                <Link href={`/auth/login?email=${encodeURIComponent(email)}`}>Continue to Sign In</Link>
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/auth/sign-up" onClick={() => setIsExistingUser(false)}>
                  Try a different email
                </Link>
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
                src="/jobproof-logo.png"
                alt="JobProof"
                width={450}
                height={120}
                className="h-30 w-auto"
                priority
              />
            </div>
            <CardTitle className="text-2xl font-semibold">Create your account</CardTitle>
            <CardDescription>Get started with JobProof today</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
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
                  placeholder="At least 10 characters"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {/* Password strength meter */}
                {password && (
                  <div className="space-y-2 mt-2">
                    <Progress value={(passwordStrength / 3) * 100} className="h-1" />
                    <div className="space-y-1 text-xs">
                      <div
                        className={cn(
                          "flex items-center gap-1",
                          passwordValidation.minLength ? "text-green-600" : "text-muted-foreground",
                        )}
                      >
                        {passwordValidation.minLength ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        <span>At least 10 characters</span>
                      </div>
                      <div
                        className={cn(
                          "flex items-center gap-1",
                          passwordValidation.hasNumber ? "text-green-600" : "text-muted-foreground",
                        )}
                      >
                        {passwordValidation.hasNumber ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        <span>Contains a number</span>
                      </div>
                      <div
                        className={cn(
                          "flex items-center gap-1",
                          passwordValidation.hasSpecial ? "text-green-600" : "text-muted-foreground",
                        )}
                      >
                        {passwordValidation.hasSpecial ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        <span>Contains a special character (!@#$%^&*)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="repeat-password">Confirm Password</Label>
                <Input
                  id="repeat-password"
                  type="password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
              </div>
              {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
              <Button type="submit" className="w-full" disabled={isLoading || !isPasswordValid}>
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>
            <div className="mt-4 text-center text-xs text-muted-foreground">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="text-primary underline-offset-4 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary underline-offset-4 hover:underline">
                Privacy Policy
              </Link>
            </div>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary underline-offset-4 hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
