import { CheckCircle2, BarChart3, Users, Zap, Lock, Clock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeLogo } from "@/components/theme-logo"

export const metadata = {
  title: "Features - JobProof",
  description: "Discover JobProof's powerful features for field service proof-of-work",
}

export default function FeaturesPage() {
  const features = [
    {
      name: "Photo Proof with Metadata",
      description: "Capture timestamped photos with GPS location, device info, and automatic backup to cloud storage",
      icon: CheckCircle2,
    },
    {
      name: "Real-time Job Tracking",
      description: "Monitor job progress from start to finish with live status updates and team collaboration",
      icon: Clock,
    },
    {
      name: "Team Management",
      description: "Assign jobs, manage field teams, set priorities, and track performance metrics",
      icon: Users,
    },
    {
      name: "Analytics Dashboard",
      description: "View job completion rates, team productivity, site performance, and custom reports",
      icon: BarChart3,
    },
    {
      name: "Enterprise Security",
      description: "Row-level security, encryption at rest, SOC2 compliance, and audit logs for every action",
      icon: Lock,
    },
    {
      name: "Mobile-First Design",
      description: "Native mobile app for field teams to complete jobs offline with automatic sync",
      icon: Zap,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
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

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold">Powerful Features Built for Field Service</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything your team needs to capture, verify, and report job completion
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.name} className="p-8 rounded-lg border bg-card hover:shadow-lg transition">
                <Icon className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2">{feature.name}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to get started?</h2>
          <Link href="/auth/sign-up">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
