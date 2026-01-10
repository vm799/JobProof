"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { HelpCircle, Search, Book, Video, MessageCircle, ExternalLink } from "lucide-react"
import { Card } from "@/components/ui/card"
import Link from "next/link"

const helpTopics = [
  {
    title: "Getting Started",
    icon: Book,
    items: [
      { title: "Create your first onboarding flow", href: "/help/getting-started#first-flow" },
      { title: "Invite a client", href: "/help/getting-started#invite-client" },
      { title: "Customize your workspace", href: "/help/getting-started#customize" },
    ],
  },
  {
    title: "Features",
    icon: Video,
    items: [
      { title: "Using templates", href: "/help/features#templates" },
      { title: "Setting up reminders", href: "/help/features#reminders" },
      { title: "Understanding analytics", href: "/help/features#analytics" },
      { title: "White-label settings", href: "/help/features#white-label" },
    ],
  },
  {
    title: "Support",
    icon: MessageCircle,
    items: [
      { title: "Feature requests", href: "/help/support#feature-requests" },
      { title: "Report a bug", href: "/help/support#bug-report" },
    ],
  },
]

export function HelpButton() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const filteredTopics = helpTopics.map((topic) => ({
    ...topic,
    items: topic.items.filter((item) => item.title.toLowerCase().includes(search.toLowerCase())),
  }))

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 z-40"
      >
        <HelpCircle className="h-6 w-6" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              How can we help?
            </DialogTitle>
            <DialogDescription>Search our help center or browse topics below</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search help articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {filteredTopics.map((topic) => {
              const Icon = topic.icon
              if (topic.items.length === 0) return null

              return (
                <div key={topic.title}>
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">{topic.title}</h3>
                  </div>
                  <div className="space-y-2">
                    {topic.items.map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent transition-colors group"
                      >
                        <span className="text-sm">{item.title}</span>
                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}

            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="flex items-start gap-3">
                <MessageCircle className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">Still need help?</h4>
                  <p className="text-sm text-muted-foreground mb-3">Our support team is here to help you succeed</p>
                  <a href="mailto:admin@jobproof.app" rel="noopener noreferrer">
                    <Button size="sm">Contact Support</Button>
                  </a>
                </div>
              </div>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
