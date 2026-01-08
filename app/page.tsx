"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeLogo } from "@/components/theme-logo"
import { CheckCircle2, BarChart3, Users, Zap } from "lucide-react"

export default function LandingPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check", { method: "GET" })
        if (response.ok) {
          router.push("/dashboard")
        }
      } catch (error) {
        console.error("[v0] Auth check failed:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted">
        <div className="text-center">
          <div className="animate-pulse">
            <ThemeLogo width={300} height={80} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ThemeLogo width={200} height={50} />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center space-y-8 mb-20">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              Digital proof of work for field service teams
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Capture, verify, and report job completion with photos, signatures, and timestamps. JobProof delivers
              accountability and transparency for every job site.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline">
                View Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          <div className="space-y-3 p-6 rounded-lg border bg-card hover:bg-muted/50 transition">
            <CheckCircle2 className="w-8 h-8 text-blue-600" />
            <h3 className="font-semibold text-lg">Photo Proof</h3>
            <p className="text-sm text-muted-foreground">
              Capture timestamped photos with location data for complete job documentation
            </p>
          </div>
          <div className="space-y-3 p-6 rounded-lg border bg-card hover:bg-muted/50 transition">
            <Users className="w-8 h-8 text-blue-600" />
            <h3 className="font-semibold text-lg">Team Management</h3>
            <p className="text-sm text-muted-foreground">
              Assign jobs, track progress, and manage field teams from one dashboard
            </p>
          </div>
          <div className="space-y-3 p-6 rounded-lg border bg-card hover:bg-muted/50 transition">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            <h3 className="font-semibold text-lg">Real-time Analytics</h3>
            <p className="text-sm text-muted-foreground">
              Monitor job completion rates and team performance with live dashboards
            </p>
          </div>
          <div className="space-y-3 p-6 rounded-lg border bg-card hover:bg-muted/50 transition">
            <Zap className="w-8 h-8 text-blue-600" />
            <h3 className="font-semibold text-lg">Instant Reports</h3>
            <p className="text-sm text-muted-foreground">Generate professional job completion reports automatically</p>
          </div>
        </div>
      </section>

      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to streamline your field operations?</h2>
          <p className="text-lg opacity-90">Join hundreds of field service teams using JobProof to verify their work</p>
          <Link href="/auth/sign-up">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Start Your Free Trial Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/features" className="hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/demo" className="hover:text-foreground">
                    Demo
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/help" className="hover:text-foreground">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="hover:text-foreground">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-foreground">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/privacy" className="hover:text-foreground">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-foreground">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 flex justify-between items-center">
            <p className="text-sm text-muted-foreground">2026 JobProof. All rights reserved.</p>
            <ThemeLogo width={120} height={30} />
          </div>
        </div>
      </footer>
    </div>
  )
}
