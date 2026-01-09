import Link from "next/link"
import { ThemeLogo } from "@/components/theme-logo"
import { AlertCircle } from "lucide-react"

export const metadata = {
  title: "About - JobProof (Internal Demo)",
  description: "Internal demonstration environment - not for external use",
  robots: "noindex, nofollow",
}

export default function AboutPage() {
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

      {/* About Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
        <div className="flex items-center gap-3 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <div>
            <h2 className="font-semibold text-yellow-900">Internal Demo Only</h2>
            <p className="text-sm text-yellow-800">
              This is a demonstration environment. Statistics and claims shown are for evaluation purposes only.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">About JobProof</h1>
          <p className="text-xl text-muted-foreground">
            Demonstration of how field service teams can capture and verify their work
          </p>
        </div>

        <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
          <p>
            JobProof is designed to address field service challenges: teams need a way to prove they completed their
            work, reduce customer disputes, and provide visibility into job site activities.
          </p>

          <p>
            This demonstration showcases how JobProof features like timestamped photos, location tracking, and team
            management tools can help document and verify job completion.
          </p>

          <p>
            This is an internal demo environment for evaluation purposes only. For production use, contact our team.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 my-12 p-4 bg-blue-50 rounded-lg">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">Demo</div>
            <p className="text-muted-foreground">Evaluation Environment</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">Features</div>
            <p className="text-muted-foreground">For Demonstration</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">Feedback</div>
            <p className="text-muted-foreground">Contact Support</p>
          </div>
        </div>

        <div className="bg-card p-8 rounded-lg border space-y-4">
          <h2 className="text-2xl font-bold">Our Demo Goal</h2>
          <p className="text-muted-foreground">
            To showcase how JobProof features can help field service teams with transparent job documentation and team
            accountability. This is not a production environment.
          </p>
        </div>
      </section>
    </div>
  )
}
