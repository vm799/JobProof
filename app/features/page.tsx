import { CheckCircle2, BarChart3, Users, Zap, Lock, Clock } from "lucide-react"
import Link from "next/link"
import { ThemeLogo } from "@/components/theme-logo"
import { AlertCircle } from "lucide-react"

export const metadata = {
  title: "Features - JobProof (Internal Demo)",
  description: "Internal demonstration of JobProof features - not for external use",
  robots: "noindex, nofollow",
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
      name: "Enterprise Architecture",
      description: "Row-level security, encryption at rest, workspace isolation, and audit logs for every action",
      icon: Lock,
    },
    {
      name: "Mobile-First Design",
      description: "Responsive interface for field teams to complete jobs with automatic data sync",
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
        </div>
      </nav>

      {/* Demo Banner */}
      <div className="bg-yellow-50 border-b-2 border-yellow-300 px-4 py-3">
        <p className="text-center text-sm font-semibold text-yellow-900">
          ⚠️ INTERNAL DEMO MODE - Not for external use or data storage
        </p>
      </div>

      {/* Demo Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-3 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <div>
            <h2 className="font-semibold text-yellow-900">Internal Demo Only</h2>
            <p className="text-sm text-yellow-800">
              These features are for demonstration purposes. This is not a production environment.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold">JobProof Demo Features</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how JobProof can help field service teams capture and verify job completion
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

      <section className="bg-blue-50 border-t-2 border-blue-200 py-16 mt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl font-bold text-blue-900">Explore the Demo</h2>
          <p className="text-lg text-blue-800">
            This demo showcases JobProof capabilities in a sandbox environment. For production inquiries or feature
            questions, contact our team.
          </p>
          <p className="text-sm text-blue-700">
            Demo data may be reset at any time. Please do not store sensitive information here.
          </p>
        </div>
      </section>
    </div>
  )
}
