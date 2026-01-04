"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Briefcase,
  Rocket,
  Users,
  SearchIcon,
  Home,
  Scale,
  Megaphone,
  Palette,
  Monitor,
  DollarSign,
  Sparkles,
  ArrowRight,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

const iconMap: Record<string, any> = {
  briefcase: Briefcase,
  rocket: Rocket,
  users: Users,
  search: SearchIcon,
  home: Home,
  scale: Scale,
  megaphone: Megaphone,
  palette: Palette,
  monitor: Monitor,
  "dollar-sign": DollarSign,
}

const colorMap: Record<string, string> = {
  blue: "from-blue-500/20 to-cyan-500/20 border-blue-200 dark:border-blue-900",
  purple: "from-purple-500/20 to-pink-500/20 border-purple-200 dark:border-purple-900",
  orange: "from-orange-500/20 to-red-500/20 border-orange-200 dark:border-orange-900",
  green: "from-green-500/20 to-emerald-500/20 border-green-200 dark:border-green-900",
  indigo: "from-indigo-500/20 to-violet-500/20 border-indigo-200 dark:border-indigo-900",
  amber: "from-amber-500/20 to-yellow-500/20 border-amber-200 dark:border-amber-900",
  pink: "from-pink-500/20 to-rose-500/20 border-pink-200 dark:border-pink-900",
  violet: "from-violet-500/20 to-purple-500/20 border-violet-200 dark:border-violet-900",
  cyan: "from-cyan-500/20 to-blue-500/20 border-cyan-200 dark:border-cyan-900",
  emerald: "from-emerald-500/20 to-green-500/20 border-emerald-200 dark:border-emerald-900",
}

interface Template {
  id: string
  name: string
  description: string
  category: string
  icon: string
  color: string
  step_count: number
  is_featured: boolean
  steps?: any[]
}

export function TemplatesLibrary({ templates }: { templates: Template[] }) {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const categories = Array.from(new Set(templates.map((t) => t.category)))

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(search.toLowerCase()) ||
      template.description.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !selectedCategory || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleUseTemplate = async (template: Template) => {
    toast({
      title: "Creating flow from template...",
      description: `Setting up "${template.name}"`,
    })

    try {
      const response = await fetch("/api/flows/from-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId: template.id }),
      })

      if (response.status === 401) {
        toast({
          title: "Authentication required",
          description: "Please log in to use templates",
          variant: "destructive",
        })
        router.push("/auth/login")
        return
      }

      if (response.ok) {
        const { flowId } = await response.json()
        toast({
          title: "Template applied",
          description: "Your new flow is ready to customize",
        })
        router.push(`/flows/${flowId}`)
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to create flow from template",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Template Library</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Start with battle-tested onboarding flows. Customize everything to match your brand.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All Templates
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Templates */}
        {!search && !selectedCategory && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              Featured Templates
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {templates
                .filter((t) => t.is_featured)
                .map((template) => {
                  const Icon = iconMap[template.icon] || Briefcase
                  return (
                    <Card
                      key={template.id}
                      className={`p-6 bg-gradient-to-br ${colorMap[template.color] || colorMap.blue} hover:scale-[1.02] transition-all cursor-pointer border-2`}
                      onClick={() => handleUseTemplate(template)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-lg bg-background/50">
                          <Icon className="h-6 w-6" />
                        </div>
                        <Badge variant="secondary">{template.step_count} steps</Badge>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
                      <p className="text-muted-foreground mb-4 line-clamp-2">{template.description}</p>
                      <Button className="w-full gap-2" size="sm">
                        Use This Template <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Card>
                  )
                })}
            </div>
          </div>
        )}

        {/* All Templates Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-6">
            {selectedCategory ? `${selectedCategory} Templates` : "All Templates"}
          </h2>
          {filteredTemplates.length === 0 ? (
            <Card className="p-12 text-center">
              <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No templates found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => {
                const Icon = iconMap[template.icon] || Briefcase
                return (
                  <Card
                    key={template.id}
                    className="p-6 hover:border-primary/50 transition-all cursor-pointer"
                    onClick={() => handleUseTemplate(template)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <Badge variant="outline">{template.category}</Badge>
                    </div>
                    <h3 className="font-semibold mb-2">{template.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{template.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{template.step_count} steps</span>
                      <Button variant="ghost" size="sm" className="gap-1">
                        Preview <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
