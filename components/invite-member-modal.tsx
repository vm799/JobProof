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

interface InviteMemberModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspaceId: string
}

export function InviteMemberModal({ open, onOpenChange, workspaceId }: InviteMemberModalProps) {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("member")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const handleInvite = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Check if user exists
      const { data: existingProfile } = await supabase.from("profiles").select("id").eq("email", email).single()

      if (!existingProfile) {
        throw new Error("User not found. They must sign up first before being added to a workspace.")
      }

      // Check if already a member
      const { data: existingMember } = await supabase
        .from("workspace_members")
        .select("id")
        .eq("workspace_id", workspaceId)
        .eq("user_id", existingProfile.id)
        .single()

      if (existingMember) {
        throw new Error("This user is already a member of your workspace.")
      }

      // Add to workspace
      const { error: insertError } = await supabase.from("workspace_members").insert({
        workspace_id: workspaceId,
        user_id: existingProfile.id,
        role: role,
      })

      if (insertError) throw insertError

      toast({
        title: "Member added",
        description: `${email} has been added to your team.`,
      })

      setEmail("")
      setRole("member")
      onOpenChange(false)
      router.refresh()
    } catch (err: any) {
      console.error("[v0] Invite error:", err)
      setError(err.message || "Failed to invite member")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>Add a team member to collaborate on client onboardings</DialogDescription>
        </DialogHeader>

        {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="member-email">Email Address</Label>
            <Input
              id="member-email"
              type="email"
              placeholder="colleague@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="member-role">Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="member-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin - Full access</SelectItem>
                <SelectItem value="member">Member - Can manage clients</SelectItem>
                <SelectItem value="viewer">Viewer - Read-only access</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleInvite} disabled={!email || isLoading}>
            {isLoading ? "Adding..." : "Add Member"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
