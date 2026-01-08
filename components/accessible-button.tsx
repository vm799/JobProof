"use client"

import { Button, type ButtonProps } from "@/components/ui/button"
import { forwardRef } from "react"

interface AccessibleButtonProps extends ButtonProps {
  ariaLabel?: string
  ariaDescribedBy?: string
  loading?: boolean
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ ariaLabel, ariaDescribedBy, loading, children, disabled, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-busy={loading}
        disabled={disabled || loading}
        {...props}
      >
        {children}
      </Button>
    )
  },
)

AccessibleButton.displayName = "AccessibleButton"
