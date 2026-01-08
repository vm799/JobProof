import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeLogo } from "@/components/theme-logo"
import { Check } from "lucide-react"

export const metadata = {
  title: "Pricing - JobProof",
  description: "Simple, transparent pricing for field service proof-of-work",
}

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "$99",
      period: "/month",
      description: "Perfect for small teams",
      features: ["Up to 5 team members", "50 jobs/month", "Basic analytics", "Email support"],
    },
    {
      name: "Professional",
      price: "$299",
      period: "/month",
      description: "For growing businesses",
      features: [
        "Up to 20 team members",
        "Unlimited jobs",
        "Advanced analytics",
        "Priority support",
        "Custom branding",
      ],
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "For large organizations",
      features: ["Unlimited team members", "Unlimited jobs", "API access", "Dedicated support", "Custom integrations"],
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

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your business needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-lg border p-8 flex flex-col ${
                plan.highlighted ? "bg-blue-50 border-blue-200 ring-2 ring-blue-600" : "bg-card"
              }`}
            >
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-muted-foreground mb-4">{plan.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground ml-2">{plan.period}</span>
              </div>
              <Button className={plan.highlighted ? "bg-blue-600 hover:bg-blue-700 mb-6" : "mb-6"} asChild>
                <Link href="/auth/sign-up">Get Started</Link>
              </Button>
              <ul className="space-y-3 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ CTA */}
      <section className="bg-muted py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl font-bold">Have questions about pricing?</h2>
          <Link href="/contact">
            <Button variant="outline" size="lg">
              Contact our sales team
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
