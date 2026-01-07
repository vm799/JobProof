"use client"

import type React from "react"
import { toast } from "react-toastify"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
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
import { MapPin } from "lucide-react"

interface AddSiteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspaceId: string
  onSuccess: (site: any) => void
}

export function AddSiteDialog({ open, onOpenChange, workspaceId, onSuccess }: AddSiteDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!formData.name || formData.name.trim().length < 2) {
      toast.error("Site name must be at least 2 characters")
      setLoading(false)
      return
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address")
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("clients")
        .insert({
          workspace_id: workspaceId,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          metadata: { address: formData.address },
        })
        .select()
        .single()

      if (error) throw error

      toast.success(`Site "${formData.name}" created successfully!`)
      onSuccess(data)
      setFormData({ name: "", email: "", phone: "", address: "" })
    } catch (error: any) {
      console.error("[v0] Error adding site:", error)
      toast.error(error.message || "Failed to add site. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Add New Job Site
          </DialogTitle>
          <DialogDescription>Enter the details for the new job site location.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Site Name *</Label>
            <Input
              id="name"
              placeholder="ABC Construction Site"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Contact Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="contact@site.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              placeholder="123 Main St, City, State, ZIP"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Site"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
