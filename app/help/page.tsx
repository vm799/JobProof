import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Book, Video, MessageCircle, Sparkles, Search, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Help Center - BoardingPass",
  description: "Get help with BoardingPass",
}

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">How can we help you?</h1>
          <p className="text-xl text-muted-foreground mb-8">Search our help center or browse categories below</p>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Search help articles..." className="pl-12 h-14 text-base" />
          </div>
        </div>

        {/* Popular Topics */}
        <div className="max-w-5xl mx-auto mb-16">
          <h2 className="text-2xl font-bold mb-6">Popular Topics</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Sparkles,
                title: "Getting Started",
                desc: "Learn the basics of BoardingPass",
                articles: 8,
                href: "/help/getting-started",
              },
              {
                icon: Book,
                title: "Creating Flows",
                desc: "Build custom onboarding flows",
                articles: 12,
                href: "/help/flows",
              },
              {
                icon: Video,
                title: "Video Tutorials",
                desc: "Watch step-by-step guides",
                articles: 6,
                href: "/help/videos",
              },
            ].map((topic, i) => {
              const Icon = topic.icon
              return (
                <Link key={i} href={topic.href}>
                  <Card className="p-6 hover:border-primary/50 transition-all h-full group cursor-pointer">
                    <Icon className="h-10 w-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg font-semibold mb-2">{topic.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{topic.desc}</p>
                    <div className="flex items-center gap-2 text-sm text-primary">
                      {topic.articles} articles <ArrowRight className="h-4 w-4" />
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Documentation Sections */}
        <div className="max-w-5xl mx-auto space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-6">Getting Started</h2>
            <div className="space-y-4">
              {[
                { title: "Create your first onboarding flow", time: "5 min read" },
                { title: "Invite your first client", time: "3 min read" },
                { title: "Customize your workspace branding", time: "4 min read" },
                { title: "Set up email notifications", time: "2 min read" },
              ].map((article, i) => (
                <Link
                  key={i}
                  href="#"
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent transition-colors group"
                >
                  <div>
                    <h3 className="font-medium group-hover:text-primary transition-colors">{article.title}</h3>
                    <p className="text-sm text-muted-foreground">{article.time}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Advanced Features</h2>
            <div className="space-y-4">
              {[
                { title: "Using flow templates", time: "6 min read" },
                { title: "Setting up automated reminders", time: "4 min read" },
                { title: "Understanding analytics and insights", time: "8 min read" },
                { title: "Team collaboration and permissions", time: "5 min read" },
                { title: "White-label setup and custom domains", time: "7 min read" },
              ].map((article, i) => (
                <Link
                  key={i}
                  href="#"
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent transition-colors group"
                >
                  <div>
                    <h3 className="font-medium group-hover:text-primary transition-colors">{article.title}</h3>
                    <p className="text-sm text-muted-foreground">{article.time}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Contact Support */}
        <div className="max-w-3xl mx-auto mt-16">
          <Card className="p-8 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="h-6 w-6 text-primary" />
                  <h3 className="text-2xl font-bold">Still need help?</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Our support team typically responds within 2 hours during business hours
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href="mailto:support@getboardingpass.app">
                    <Button className="w-full sm:w-auto">Email Support</Button>
                  </a>
                  <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                    Schedule a Call
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
