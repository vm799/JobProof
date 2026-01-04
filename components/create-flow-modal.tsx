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
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface CreateFlowModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspaceId: string
}

export function CreateFlowModal({ open, onOpenChange, workspaceId }: CreateFlowModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })
  const router = useRouter()
  const supabase = createClient()

  const handleCreate = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { data: flow, error: flowError } = await supabase
        .from("onboarding_flows")
        .insert({
          name: formData.name,
          description: formData.description,
          workspace_id: workspaceId,
          status: "draft",
        })
        .select()
        .single()

      if (flowError) throw flowError

      onOpenChange(false)
      setFormData({ name: "", description: "" })
      router.push(`/flows/${flow.id}`)
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to create flow")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Onboarding Flow</DialogTitle>
          <DialogDescription>Create a new onboarding flow template for your clients</DialogDescription>
        </DialogHeader>

        {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="flow-name">Flow Name</Label>
            <Input
              id="flow-name"
              placeholder="Standard Agency Onboarding"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="flow-description">Description (Optional)</Label>
            <Textarea
              id="flow-description"
              placeholder="Describe the purpose of this onboarding flow..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!formData.name || isLoading}>
            {isLoading ? "Creating..." : "Create Flow"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
