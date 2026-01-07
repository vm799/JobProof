"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createJobSession } from "@/app/actions/jobs"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface CreateJobModalProps {
  open: boolean
  onClose: () => void
  site: { id: string; name: string }
  templates: Array<{ id: string; name: string }>
}

export function CreateJobModal({ open, onClose, site, templates }: CreateJobModalProps) {
  const [loading, setLoading] = useState(false)
  const [templateId, setTemplateId] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [technicianEmail, setTechnicianEmail] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    console.log("[v0] Create Job Modal - Form submitted", { templateId, dueDate, technicianEmail })

    if (!templateId) {
      toast.error("Please select a job template")
      return
    }

    if (!dueDate) {
      toast.error("Please select a due date")
      return
    }

    if (!technicianEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(technicianEmail)) {
      toast.error("Please enter a valid technician email address")
      return
    }

    setLoading(true)

    try {
      const result = await createJobSession({
        siteId: site.id,
        templateId,
        dueDate,
        technicianEmail,
        siteName: site.name,
      })

      console.log("[v0] Job created successfully:", result)
      toast.success(`Job assigned! Email sent to ${technicianEmail}`)

      // Copy link to clipboard
      if (result.jobLink) {
        await navigator.clipboard.writeText(result.jobLink)
        toast.info("Job link copied to clipboard")
      }

      onClose()

      // Reset form
      setTemplateId("")
      setDueDate("")
      setTechnicianEmail("")
    } catch (error: any) {
      console.error("[v0] Job creation error:", error)
      toast.error(error.message || "Failed to create job. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Job for {site.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="template">Job Template *</Label>
            <Select value={templateId} onValueChange={setTemplateId}>
              <SelectTrigger id="template">
                <SelectValue placeholder="Select a job template" />
              </SelectTrigger>
              <SelectContent>
                {templates.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No templates available. Create one first.
                  </div>
                ) : (
                  templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="dueDate">Due Date *</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div>
            <Label htmlFor="techEmail">Technician Email *</Label>
            <Input
              id="techEmail"
              type="email"
              value={technicianEmail}
              onChange={(e) => setTechnicianEmail(e.target.value)}
              placeholder="technician@example.com"
            />
            <p className="text-xs text-muted-foreground mt-1">Job link will be sent to this email</p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || templates.length === 0}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Job"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
