import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Zap, Users, TrendingUp, Clock, Shield } from "lucide-react"
import { ThemeLogo } from "@/components/theme-logo"
import { ThemeToggleSlider } from "@/components/theme-toggle-slider"
import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-24 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <ThemeLogo width={900} height={210} className="h-48 w-auto" priority />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="#templates"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Templates
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggleSlider />
            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                Log in
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="sm" className="gap-2">
                <span className="hidden sm:inline">Try Demo</span>
                <span className="sm:hidden">Demo</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo showcase */}
          <div className="mb-4 flex justify-center">
            <Image
              src="/boardingpass-logo.png"
              alt="BoardingPass"
              width={800}
              height={800}
              className="w-[50rem] h-[50rem] object-contain"
              priority
            />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
            <Sparkles className="h-4 w-4" />
            White-label client onboarding platform
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 text-balance">
            Professional client onboarding
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              {" "}
              at scale
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Replace manual client intake with structured, branded onboarding flows. Track progress, automate reminders,
            and maintain consistency across every engagement.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/demo" className="w-full sm:w-auto">
              <Button size="lg" className="gap-2 h-12 px-8 text-base w-full sm:w-auto">
                Try Interactive Demo <Sparkles className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/auth/sign-up" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base bg-transparent w-full sm:w-auto">
                Start Free Trial
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted/30 py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 rounded-lg bg-card border border-border">
              <div className="text-3xl sm:text-4xl font-bold mb-2">5 min</div>
              <div className="text-sm text-muted-foreground">To build your first flow</div>
            </div>
            <div className="text-center p-6 rounded-lg bg-card border border-border">
              <div className="text-3xl sm:text-4xl font-bold mb-2">10+</div>
              <div className="text-sm text-muted-foreground">Pre-built templates included</div>
            </div>
            <div className="text-center p-6 rounded-lg bg-card border border-border">
              <div className="text-3xl sm:text-4xl font-bold mb-2">Zero</div>
              <div className="text-sm text-muted-foreground">Code required to launch</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Built for professional services</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Complete client onboarding infrastructure for agencies and consultancies
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Zap,
              title: "Rapid Deployment",
              desc: "Configure branded onboarding workflows in minutes using the visual flow builder",
            },
            {
              icon: Users,
              title: "White-Label Platform",
              desc: "Custom branding with logo and color configuration for client-facing portals",
            },
            {
              icon: TrendingUp,
              title: "Analytics Dashboard",
              desc: "Track completion metrics, identify bottlenecks, and measure client engagement",
            },
            {
              icon: Clock,
              title: "Automated Reminders",
              desc: "Schedule and send follow-up emails automatically based on client progress",
            },
            {
              icon: Shield,
              title: "Enterprise Security",
              desc: "PostgreSQL RLS, SOC 2 infrastructure, and encrypted file storage",
            },
            {
              icon: Sparkles,
              title: "Progress Tracking",
              desc: "Real-time completion status, milestone notifications, and step validation",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 rounded-lg border border-border bg-card hover:border-primary/50 transition-all group"
            >
              <feature.icon className="h-10 w-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Templates Preview */}
      <section id="templates" className="bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">10+ Pre-built Templates</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start with battle-tested flows. Customize everything.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: "Agency Client Kickoff", steps: 8, color: "from-blue-500/20 to-cyan-500/20" },
              { name: "SaaS User Onboarding", steps: 6, color: "from-purple-500/20 to-pink-500/20" },
              { name: "HR Employee Onboarding", steps: 12, color: "from-orange-500/20 to-red-500/20" },
              { name: "Consultant Discovery", steps: 5, color: "from-green-500/20 to-emerald-500/20" },
              { name: "Real Estate Client Intake", steps: 7, color: "from-indigo-500/20 to-violet-500/20" },
              { name: "Legal Client Setup", steps: 9, color: "from-amber-500/20 to-yellow-500/20" },
            ].map((template, i) => (
              <Link href="/demo" key={i}>
                <div
                  className={`p-6 rounded-lg border border-border bg-gradient-to-br ${template.color} hover:scale-105 hover:border-primary/50 transition-all cursor-pointer`}
                >
                  <h3 className="font-semibold mb-2">{template.name}</h3>
                  <p className="text-sm text-muted-foreground">{template.steps} steps • Ready to use</p>
                  <div className="mt-3 flex items-center gap-1 text-sm text-primary font-medium">
                    Preview template <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/demo">
              <Button size="lg" variant="outline">
                Browse All Templates
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-12 border border-primary/20">
          <h2 className="text-4xl font-bold mb-4">Deploy professional onboarding infrastructure</h2>
          <p className="text-xl text-muted-foreground mb-8">Start with a 14-day trial, no credit card required</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/demo">
              <Button size="lg" className="gap-2 h-12 px-8">
                Try Demo Free <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button size="lg" variant="outline" className="h-12 px-8 bg-transparent">
                Start 14-Day Trial
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center mb-6">
                <ThemeLogo width={550} height={130} className="h-[8.125rem] w-auto" />
              </Link>
              <p className="text-sm text-muted-foreground max-w-sm">
                White-label client onboarding platform. Structured intake workflows with progress tracking, automated
                reminders, and analytics.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <Link href="#features" className="hover:text-foreground">
                  Features
                </Link>
                <Link href="#templates" className="hover:text-foreground">
                  Templates
                </Link>
                <Link href="/demo" className="hover:text-foreground">
                  Demo
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <Link href="/faq" className="hover:text-foreground">
                  FAQ
                </Link>
                <Link href="/help" className="hover:text-foreground">
                  Help Center
                </Link>
                <a href="mailto:admin@getboardingpass.app" className="hover:text-foreground">
                  Contact
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <Link href="/privacy" className="hover:text-foreground">
                  Privacy
                </Link>
                <Link href="/terms" className="hover:text-foreground">
                  Terms
                </Link>
                <Link href="/privacy#security" className="hover:text-foreground">
                  Security
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">© 2025 BoardingPass. All rights reserved.</div>
              <div className="flex items-center gap-2">
                <Image
                  src="/boardingpass-logo.png"
                  alt="BoardingPass"
                  width={80}
                  height={80}
                  className="w-20 h-20 object-contain opacity-50"
                />
                <span className="text-xs text-muted-foreground">Powered by BoardingPass</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
