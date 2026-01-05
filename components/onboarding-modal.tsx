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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
    clientName: "",
    clientEmail: "",
    flowId: "",
  })
  const router = useRouter()
  const supabase = createClient()

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = async () => {
    if (!formData.clientName || formData.clientName.length < 2) {
      setError("Client name must be at least 2 characters")
      return
    }

    if (!formData.clientEmail || !isValidEmail(formData.clientEmail)) {
      setError("Please enter a valid email address")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { data: client, error: clientError } = await supabase
        .from("clients")
        .insert({
          name: formData.clientName,
          email: formData.clientEmail,
          workspace_id: workspaceId,
        })
        .select()
        .single()

      if (clientError) throw clientError

      const token = crypto.randomUUID()
      const { data: onboarding, error: onboardingError } = await supabase
        .from("client_onboardings")
        .insert({
          client_id: client.id,
          flow_id: formData.flowId || null,
          status: "not_started",
          onboarding_link_token: token,
        })
        .select()
        .single()

      if (onboardingError) throw onboardingError

      try {
        await fetch("/api/send-onboarding-invite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ onboardingId: onboarding.id }),
        })
      } catch (emailErr) {
        console.error("Email send failed:", emailErr)
      }

      toast({
        title: "Onboarding created",
        description: `Invitation email sent to ${formData.clientEmail}`,
      })

      onOpenChange(false)
      setFormData({ clientName: "", clientEmail: "", flowId: "" })
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to create onboarding")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center">Create New Onboarding</DialogTitle>
          <DialogDescription className="text-center">
            Add client information to begin their onboarding journey
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
            {error}
          </div>
        )}

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="client-name">Client Name *</Label>
            <Input
              id="client-name"
              placeholder="Acme Corporation"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground">Minimum 2 characters</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="client-email">Client Email *</Label>
            <Input
              id="client-email"
              type="email"
              placeholder="contact@acme.com"
              value={formData.clientEmail}
              onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">Must be a valid email address</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="flow-type">Onboarding Flow (Optional)</Label>
            <Select value={formData.flowId} onValueChange={(value) => setFormData({ ...formData, flowId: value })}>
              <SelectTrigger id="flow-type">
                <SelectValue placeholder="Select a flow or skip" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="skip">No flow - manual setup</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">You can assign a flow later from the Flows page</p>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={!formData.clientName || !formData.clientEmail || isLoading}
            className="w-full"
          >
            {isLoading ? "Creating..." : "Create Onboarding"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
