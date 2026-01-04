"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Book, MessageCircle, Sparkles, Search, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const allArticles = [
    { title: "Create your first onboarding flow", category: "Getting Started", href: "/faq#create-flow" },
    { title: "Invite your first client", category: "Getting Started", href: "/faq#invite-client" },
    { title: "Customize your workspace branding", category: "Getting Started", href: "/faq#branding" },
    {
      title: "Set up email notifications",
      category: "Getting Started",
      href: "/faq#email-notifications",
      keywords: "email notification smtp setup configure",
    },
    { title: "Using flow templates", category: "Advanced", href: "/faq#templates" },
    { title: "Setting up automated reminders", category: "Advanced", href: "/faq#reminders" },
    { title: "Understanding analytics and insights", category: "Advanced", href: "/analytics" },
    { title: "Team collaboration and permissions", category: "Advanced", href: "/team" },
    {
      title: "Email configuration and SMTP setup",
      category: "Configuration",
      href: "/faq#email-setup",
      keywords: "email smtp resend configuration delivery not working",
    },
    {
      title: "Troubleshooting signup emails",
      category: "Troubleshooting",
      href: "/faq#email-troubleshooting",
      keywords: "email not received spam confirmation signup",
    },
  ]

  const filteredArticles = searchQuery
    ? allArticles.filter(
        (article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (article.keywords && article.keywords.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    : allArticles

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">How can we help you?</h1>
          <p className="text-xl text-muted-foreground mb-8">Search our help center or browse categories below</p>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search help articles..."
              className="pl-12 h-14 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {searchQuery && (
            <p className="text-sm text-muted-foreground mt-2">
              Found {filteredArticles.length} article{filteredArticles.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {!searchQuery && (
          <div className="max-w-5xl mx-auto mb-16">
            <h2 className="text-2xl font-bold mb-6">Popular Topics</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Sparkles,
                  title: "Getting Started",
                  desc: "Learn the basics of BoardingPass",
                  articles: 4,
                  href: "/faq",
                },
                {
                  icon: Book,
                  title: "FAQ",
                  desc: "Frequently asked questions",
                  articles: 6,
                  href: "/faq",
                },
                {
                  icon: MessageCircle,
                  title: "Contact Support",
                  desc: "Get help from our team",
                  articles: null,
                  href: "mailto:admin@getboardingpass.app?subject=Support Request",
                },
              ].map((topic, i) => {
                const Icon = topic.icon
                return (
                  <a
                    key={i}
                    href={topic.href}
                    rel={topic.href.startsWith("mailto:") ? "noopener noreferrer" : undefined}
                  >
                    <Card className="p-6 hover:border-primary/50 transition-all h-full group cursor-pointer">
                      <Icon className="h-10 w-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
                      <h3 className="text-lg font-semibold mb-2">{topic.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{topic.desc}</p>
                      {topic.articles !== null && (
                        <div className="flex items-center gap-2 text-sm text-primary">
                          {topic.articles} articles <ArrowRight className="h-4 w-4" />
                        </div>
                      )}
                      {topic.articles === null && (
                        <div className="flex items-center gap-2 text-sm text-primary">
                          Email us <ArrowRight className="h-4 w-4" />
                        </div>
                      )}
                    </Card>
                  </a>
                )
              })}
            </div>
          </div>
        )}

        <div className="max-w-5xl mx-auto space-y-12">
          {searchQuery ? (
            <section>
              <h2 className="text-2xl font-bold mb-6">Search Results</h2>
              <div className="space-y-4">
                {filteredArticles.length > 0 ? (
                  filteredArticles.map((article, i) => (
                    <Link
                      key={i}
                      href={article.href}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent transition-colors group"
                    >
                      <div>
                        <h3 className="font-medium group-hover:text-primary transition-colors">{article.title}</h3>
                        <p className="text-sm text-muted-foreground">{article.category}</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No articles found. Try different keywords.</p>
                    <a href="mailto:admin@getboardingpass.app?subject=Help Request" rel="noopener noreferrer">
                      <Button>Contact Support</Button>
                    </a>
                  </div>
                )}
              </div>
            </section>
          ) : (
            <>
              <section>
                <h2 className="text-2xl font-bold mb-6">Getting Started</h2>
                <div className="space-y-4">
                  {allArticles
                    .filter((a) => a.category === "Getting Started")
                    .map((article, i) => (
                      <Link
                        key={i}
                        href={article.href}
                        className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent transition-colors group"
                      >
                        <div>
                          <h3 className="font-medium group-hover:text-primary transition-colors">{article.title}</h3>
                          <p className="text-sm text-muted-foreground">Quick guide</p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </Link>
                    ))}
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-6">Advanced Features</h2>
                <div className="space-y-4">
                  {allArticles
                    .filter((a) => a.category === "Advanced")
                    .map((article, i) => (
                      <Link
                        key={i}
                        href={article.href}
                        className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent transition-colors group"
                      >
                        <div>
                          <h3 className="font-medium group-hover:text-primary transition-colors">{article.title}</h3>
                          <p className="text-sm text-muted-foreground">Detailed guide</p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </Link>
                    ))}
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-6">Configuration</h2>
                <div className="space-y-4">
                  {allArticles
                    .filter((a) => a.category === "Configuration")
                    .map((article, i) => (
                      <Link
                        key={i}
                        href={article.href}
                        className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent transition-colors group"
                      >
                        <div>
                          <h3 className="font-medium group-hover:text-primary transition-colors">{article.title}</h3>
                          <p className="text-sm text-muted-foreground">Configuration guide</p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </Link>
                    ))}
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-6">Troubleshooting</h2>
                <div className="space-y-4">
                  {allArticles
                    .filter((a) => a.category === "Troubleshooting")
                    .map((article, i) => (
                      <Link
                        key={i}
                        href={article.href}
                        className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent transition-colors group"
                      >
                        <div>
                          <h3 className="font-medium group-hover:text-primary transition-colors">{article.title}</h3>
                          <p className="text-sm text-muted-foreground">Troubleshooting guide</p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </Link>
                    ))}
                </div>
              </section>
            </>
          )}
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
                  <a href="mailto:admin@getboardingpass.app?subject=Support Request" rel="noopener noreferrer">
                    <Button className="w-full sm:w-auto">Email Support</Button>
                  </a>
                  <Link href="/faq">
                    <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                      View FAQ
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
