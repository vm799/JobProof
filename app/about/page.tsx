import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeLogo } from "@/components/theme-logo"

export const metadata = {
  title: "About - JobProof",
  description: "Learn about JobProof and our mission to transform field service accountability",
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

      {/* About Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">About JobProof</h1>
          <p className="text-xl text-muted-foreground">
            We're transforming how field service teams capture and verify their work
          </p>
        </div>

        <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
          <p>
            JobProof was built to solve a real problem: field service teams have no easy way to prove they completed
            their work. Customers dispute invoices. Teams waste time documenting job completion manually. Managers have
            no visibility into what's happening on job sites.
          </p>

          <p>
            We created JobProof to bring accountability and transparency to field service operations. With timestamped
            photos, automatic location tracking, and team management tools, every job is documented and verifiable.
          </p>

          <p>
            Today, hundreds of field service businesses use JobProof to reduce disputes, improve efficiency, and scale
            their operations with confidence.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 my-12">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
            <p className="text-muted-foreground">Active Teams</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">50k+</div>
            <p className="text-muted-foreground">Jobs Completed</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">99.9%</div>
            <p className="text-muted-foreground">Uptime</p>
          </div>
        </div>

        <div className="bg-card p-8 rounded-lg border space-y-4">
          <h2 className="text-2xl font-bold">Our Mission</h2>
          <p className="text-muted-foreground">
            To empower field service teams with the tools they need to operate with complete transparency, efficiency,
            and accountability. We believe that proof of work should be simple, automatic, and undisputable.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white py-16 mt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl font-bold">Join hundreds of field service teams</h2>
          <p className="text-lg opacity-90">Start your free trial today and see the JobProof difference</p>
          <Link href="/auth/sign-up">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
