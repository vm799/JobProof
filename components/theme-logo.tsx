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

export function ThemeLogo({ width = 500, height = 120, className = "", priority = false }: ThemeLogoProps) {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Image
        src="/jobproof-logo.png"
        alt="JobProof"
        width={width}
        height={height}
        className={className}
        priority={priority}
      />
    )
  }

  return (
    <Image
      src="/jobproof-logo.png"
      alt="JobProof"
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  )
}
