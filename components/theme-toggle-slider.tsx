"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"

export function ThemeToggleSlider() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-12 h-6 bg-muted rounded-full" />
      </div>
    )
  }

  const isDark = theme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative flex items-center gap-2 rounded-full p-1 transition-all duration-300",
        "w-14 h-7 bg-gradient-to-r",
        isDark ? "from-blue-600 to-purple-600" : "from-amber-400 to-orange-500",
      )}
      aria-label="Toggle theme"
    >
      <span
        className={cn(
          "absolute w-5 h-5 rounded-full bg-white shadow-lg transition-transform duration-300 ease-in-out",
          isDark ? "translate-x-7" : "translate-x-0",
        )}
      />

      {/* Icons */}
      <Sun
        className={cn(
          "absolute left-1.5 w-3 h-3 transition-opacity duration-300",
          isDark ? "opacity-0" : "opacity-100 text-white",
        )}
      />
      <Moon
        className={cn(
          "absolute right-1.5 w-3 h-3 transition-opacity duration-300",
          isDark ? "opacity-100 text-white" : "opacity-0",
        )}
      />
    </button>
  )
}
