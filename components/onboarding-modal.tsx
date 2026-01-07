"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

interface OnboardingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspaceId: string
}

export function OnboardingModal({ open, onOpenChange, workspaceId }: OnboardingModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    siteName: "",
    siteEmail: "",
  })
  const router = useRouter()
  const supabase = createClient()

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = async () => {
    if (!formData.siteName || formData.siteName.length < 2) {
      setError("Site name must be at least 2 characters")
      return
    }

    if (!formData.siteEmail || !isValidEmail(formData.siteEmail)) {
      setError("Please enter a valid email address")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { data: site, error: siteError } = await supabase
        .from("clients")
        .insert({
          name: formData.siteName,
          email: formData.siteEmail,
          workspace_id: workspaceId,
        })
        .select()
        .single()

      if (siteError) throw siteError

      toast({
        title: "Site created",
        description: `${formData.siteName} has been added to your workspace.`,
      })

      onOpenChange(false)
      setFormData({ siteName: "", siteEmail: "" })
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to create site")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center">Create New Site</DialogTitle>
          <DialogDescription className="text-center">Add a job site to your workspace</DialogDescription>
        </DialogHeader>

        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
            {error}
          </div>
        )}

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="site-name">Site Name *</Label>
            <Input
              id="site-name"
              placeholder="Downtown Office Building"
              value={formData.siteName}
              onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground">Minimum 2 characters</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="site-email">Site Email *</Label>
            <Input
              id="site-email"
              type="email"
              placeholder="manager@site.com"
              value={formData.siteEmail}
              onChange={(e) => setFormData({ ...formData, siteEmail: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">Must be a valid email address</p>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={!formData.siteName || !formData.siteEmail || isLoading}
            className="w-full"
          >
            {isLoading ? "Creating..." : "Create Site"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
