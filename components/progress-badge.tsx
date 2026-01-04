"use client"

import { Badge } from "@/components/ui/badge"
import { Sparkles, TrendingUp } from "lucide-react"

interface ProgressBadgeProps {
  progress: number
  showTrending?: boolean
}

export function ProgressBadge({ progress, showTrending }: ProgressBadgeProps) {
  let variant: "default" | "secondary" | "outline" = "secondary"
  let icon = null
  let label = `${progress}% Complete`

  if (progress === 100) {
    variant = "default"
    icon = <Sparkles className="h-3 w-3" />
    label = "Completed!"
  } else if (progress >= 50) {
    variant = "default"
    icon = <TrendingUp className="h-3 w-3" />
  }

  return (
    <Badge variant={variant} className="gap-1">
      {icon}
      {label}
    </Badge>
  )
}
