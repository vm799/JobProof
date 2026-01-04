"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"

export function ThemeToggleSlider() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Theme</span>
        <div className="w-14 h-7 bg-muted border-2 border-border rounded-full" />
      </div>
    )
  }

  const isDark = theme === "dark"

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Theme</span>
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={cn(
          "relative flex items-center gap-2 rounded-full p-1 transition-all duration-300",
          "w-14 h-7 bg-gradient-to-r border-2 shadow-md hover:shadow-lg",
          isDark ? "from-blue-600 to-purple-600 border-blue-400" : "from-amber-400 to-orange-500 border-amber-300",
        )}
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        title={`Currently ${isDark ? "dark" : "light"} mode. Click to switch.`}
      >
        <span
          className={cn(
            "absolute w-5 h-5 rounded-full bg-white shadow-lg transition-transform duration-300 ease-in-out",
            isDark ? "translate-x-7" : "translate-x-0",
          )}
        />

        <Sun
          className={cn(
            "absolute left-1.5 w-3.5 h-3.5 transition-opacity duration-300",
            isDark ? "opacity-0" : "opacity-100 text-white drop-shadow-sm",
          )}
        />
        <Moon
          className={cn(
            "absolute right-1.5 w-3.5 h-3.5 transition-opacity duration-300",
            isDark ? "opacity-100 text-white drop-shadow-sm" : "opacity-0",
          )}
        />
      </button>
    </div>
  )
}
