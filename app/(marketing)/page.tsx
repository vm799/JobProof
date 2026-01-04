import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Zap, Users, TrendingUp, Clock, Shield } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">B</span>
            </div>
            <span className="font-semibold text-xl">BoardingPass</span>
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
      <section className="container mx-auto px-4 py-16 sm:py-24 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            White-label client onboarding made delightful
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 text-balance">
            Client onboarding that feels like
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"> magic</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Transform chaotic client kickoffs into smooth, branded experiences. Build custom onboarding flows in
            minutes, track progress in real-time, and delight every client.
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

        {/* Trust Bar */}
        <div className="mt-16 pt-16 border-t border-border">
          <p className="text-center text-sm text-muted-foreground mb-8">Trusted by 2,000+ agencies and consultants</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-60">
            <div className="text-xl sm:text-2xl font-bold">Agency A</div>
            <div className="text-xl sm:text-2xl font-bold">Studio B</div>
            <div className="text-xl sm:text-2xl font-bold">Firm C</div>
            <div className="text-xl sm:text-2xl font-bold">Co. D</div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted/30 py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold mb-2">92%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Faster onboarding</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold mb-2">3.5hrs</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Time saved per client</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold mb-2">98%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Completion rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold mb-2">$50k+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Revenue per user</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Everything you need to wow clients</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Built for agencies and consultants who want to deliver premium experiences
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Zap,
              title: "Lightning Fast Setup",
              desc: "Create branded onboarding flows in 5 minutes with our drag-and-drop builder",
            },
            {
              icon: Users,
              title: "White-Label Everything",
              desc: "Your logo, colors, and domain. Clients never see our brand.",
            },
            {
              icon: TrendingUp,
              title: "Real-Time Analytics",
              desc: "Track completion rates, bottlenecks, and client engagement live",
            },
            {
              icon: Clock,
              title: "Smart Reminders",
              desc: "Automated emails keep clients moving without you lifting a finger",
            },
            {
              icon: Shield,
              title: "Enterprise Security",
              desc: "SOC 2 compliant, GDPR ready, with SSO and advanced permissions",
            },
            {
              icon: Sparkles,
              title: "Celebration Moments",
              desc: "Delight clients with progress milestones and completion confetti",
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
              <div
                key={i}
                className={`p-6 rounded-lg border border-border bg-gradient-to-br ${template.color} hover:scale-105 transition-transform cursor-pointer`}
              >
                <h3 className="font-semibold mb-2">{template.name}</h3>
                <p className="text-sm text-muted-foreground">{template.steps} steps • Ready to use</p>
              </div>
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
          <h2 className="text-4xl font-bold mb-4">Ready to transform your onboarding?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join 2,000+ agencies delivering premium client experiences
          </p>
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
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">B</span>
                </div>
                <span className="font-semibold">BoardingPass</span>
              </Link>
              <p className="text-sm text-muted-foreground">White-label client onboarding made delightful</p>
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
                <Link href="#" className="hover:text-foreground">
                  About
                </Link>
                <Link href="#" className="hover:text-foreground">
                  Blog
                </Link>
                <Link href="#" className="hover:text-foreground">
                  Support
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <Link href="#" className="hover:text-foreground">
                  Privacy
                </Link>
                <Link href="#" className="hover:text-foreground">
                  Terms
                </Link>
                <Link href="#" className="hover:text-foreground">
                  Security
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2025 BoardingPass. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
