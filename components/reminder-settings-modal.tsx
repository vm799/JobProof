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
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { updateReminderSettings } from "@/app/actions/reminders"
import { useToast } from "@/hooks/use-toast"
import { Bell } from "lucide-react"

interface ReminderSettingsModalProps {
  onboarding: {
    id: string
    reminder_enabled?: boolean
    due_date?: string | null
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReminderSettingsModal({ onboarding, open, onOpenChange }: ReminderSettingsModalProps) {
  const [enabled, setEnabled] = useState(onboarding.reminder_enabled ?? true)
  const [dueDate, setDueDate] = useState(onboarding.due_date || "")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    setLoading(true)
    const result = await updateReminderSettings(onboarding.id, enabled, dueDate)
    setLoading(false)

    if (result.success) {
      toast({
        title: "Settings updated",
        description: "Reminder preferences have been saved",
      })
      onOpenChange(false)
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Reminder Settings
          </DialogTitle>
          <DialogDescription>Configure automated reminders for this onboarding</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Reminders</Label>
              <p className="text-sm text-muted-foreground">Send automatic follow-up emails</p>
            </div>
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </div>

          {enabled && (
            <div className="space-y-2">
              <Label htmlFor="due-date">Due Date (Optional)</Label>
              <Input
                id="due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
              <p className="text-sm text-muted-foreground">Set a deadline for completion</p>
            </div>
          )}

          <div className="rounded-lg bg-muted/50 p-4 space-y-2">
            <h4 className="text-sm font-medium">Reminder Schedule</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Day 3: Initial reminder if incomplete</li>
              <li>• Day 7: Second reminder if still incomplete</li>
              <li>• Due date: Final reminder (if set)</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Settings"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
