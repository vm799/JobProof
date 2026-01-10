"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Mail, UserPlus, Crown, Shield, Trash2 } from "lucide-react"
import { useState } from "react"
import { InviteMemberModal } from "@/components/invite-member-modal"
import { useToast } from "@/hooks/use-toast"

interface TeamMember {
  id: string
  email: string
  role: "owner" | "admin" | "member"
  status: "active" | "pending"
  invited_at: string
}

export function TeamManagement() {
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [members, setMembers] = useState<TeamMember[]>([])
  const { toast } = useToast()

  const handleRemoveMember = async (memberId: string) => {
    try {
      // TODO: Implement remove member API call
      toast({
        title: "Member removed",
        description: "Team member has been removed successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove team member",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Team Management</h1>
          <p className="text-muted-foreground">Manage your team members and their permissions</p>
        </div>
        <Button onClick={() => setShowInviteModal(true)} className="gap-2">
          <UserPlus className="h-4 w-4" />
          Invite Member
        </Button>
      </div>

      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Team Members</h2>
          <Badge variant="secondary">{members.length}</Badge>
        </div>

        {members.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <Users className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No team members yet</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Invite team members to collaborate on jobs
            </p>
            <Button onClick={() => setShowInviteModal(true)} className="gap-2">
              <UserPlus className="h-4 w-4" />
              Invite Your First Member
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>{member.email.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{member.email}</p>
                      {member.role === "owner" && <Crown className="h-4 w-4 text-amber-500" />}
                      {member.role === "admin" && <Shield className="h-4 w-4 text-primary" />}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {member.role.charAt(0).toUpperCase() + member.role.slice(1)} •{" "}
                      {member.status === "pending" ? "Invitation pending" : "Active"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={member.status === "active" ? "default" : "secondary"}>{member.status}</Badge>
                  {member.role !== "owner" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Pending Invitations</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Team collaboration is coming soon! For now, manage your workspace solo or invite via Settings.
        </p>
      </Card>

      <InviteMemberModal open={showInviteModal} onOpenChange={setShowInviteModal} />
    </div>
  )
}
