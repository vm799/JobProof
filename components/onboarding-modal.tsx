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
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    flowId: "",
  })
  const router = useRouter()
  const supabase = createClient()

  const handleNext = async () => {
    if (step === 1) {
      setStep(2)
    } else {
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
        setStep(1)
        setFormData({ clientName: "", clientEmail: "", flowId: "" })
        router.refresh()
      } catch (err: any) {
        setError(err.message || "Failed to create onboarding")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleBack = () => {
    setStep(1)
    setError(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Onboarding</DialogTitle>
          <DialogDescription>
            {step === 1 ? "Enter client information to get started" : "Select an onboarding flow template"}
          </DialogDescription>
        </DialogHeader>

        {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

        {step === 1 ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="client-name">Client Name</Label>
              <Input
                id="client-name"
                placeholder="Acme Corporation"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-email">Client Email</Label>
              <Input
                id="client-email"
                type="email"
                placeholder="contact@acme.com"
                value={formData.clientEmail}
                onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
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
        )}

        <DialogFooter>
          {step === 2 && (
            <Button variant="outline" onClick={handleBack} disabled={isLoading}>
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={(step === 1 && (!formData.clientName || !formData.clientEmail)) || isLoading}
          >
            {isLoading ? "Creating..." : step === 1 ? "Next" : "Create Onboarding"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
