"use client"

import { useTheme } from "next-themes"
import Image from "next/image"
import { useEffect, useState } from "react"

interface ThemeLogoProps {
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

export function ThemeLogo({ width = 200, height = 48, className = "", priority = false }: ThemeLogoProps) {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Image
        src="/boardingpass-logo.png"
        alt="BoardingPass"
        width={width}
        height={height}
        className={className}
        priority={priority}
      />
    )
  }

  const currentTheme = theme === "system" ? resolvedTheme : theme
  const logoSrc = currentTheme === "dark" ? "/boardingpass-logo-dark.png" : "/boardingpass-logo.png"

  return (
    <Image
      src={logoSrc || "/placeholder.svg"}
      alt="BoardingPass"
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  )
}
