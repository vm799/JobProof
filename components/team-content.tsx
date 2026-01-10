"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Plus, Mail, Trash2 } from "lucide-react"
import { useState } from "react"
import { InviteMemberModal } from "@/components/invite-member-modal"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { removeTeamMember } from "@/app/actions/team"

interface TeamContentProps {
  workspaceId: string
  members: any[]
  currentUserId: string
}

export function TeamContent({ workspaceId, members: initialMembers, currentUserId }: TeamContentProps) {
  const [members, setMembers] = useState(initialMembers)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    if (!confirm(`Are you sure you want to remove ${memberName} from the team?`)) return

    setIsDeleting(memberId)
    try {
      await removeTeamMember(memberId)

      setMembers(members.filter((m) => m.id !== memberId))
      toast({
        title: "Member removed",
        description: `${memberName} has been removed from the team.`,
      })
      router.refresh()
    } catch (err: any) {
      console.error("[v0] Remove member error:", err)
      toast({
        title: "Error removing member",
        description: err.message || "Failed to remove team member",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "owner":
        return <Badge>Owner</Badge>
      case "admin":
        return <Badge>Admin</Badge>
      case "member":
        return <Badge variant="secondary">Member</Badge>
      default:
        return <Badge variant="outline">Viewer</Badge>
    }
  }

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    }
    return email.substring(0, 2).toUpperCase()
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-balance text-3xl font-semibold tracking-tight">Team</h1>
            <p className="mt-1 text-muted-foreground">Manage your team members and permissions</p>
          </div>
          <Button className="gap-2" onClick={() => setInviteOpen(true)}>
            <Plus className="h-4 w-4" />
            Invite Member
          </Button>
        </div>

        {members.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <h3 className="mb-2 text-lg font-semibold">No team members yet</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Invite team members to collaborate on jobs
              </p>
              <Button onClick={() => setInviteOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Invite Your First Member
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4">
            {members.map((member) => {
              const profile = member.profiles
              const isCurrentUser = profile.id === currentUserId
              const canDelete = member.role !== "owner" && !isCurrentUser

              return (
                <Card key={member.id} className="p-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-secondary font-semibold text-foreground">
                        {getInitials(profile.name, profile.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-3">
                        <h3 className="font-semibold">{profile.name || profile.email}</h3>
                        {getRoleBadge(member.role)}
                        {isCurrentUser && <Badge variant="outline">You</Badge>}
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" />
                        {profile.email}
                      </div>
                    </div>
                    {canDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveMember(member.id, profile.name || profile.email)}
                        disabled={isDeleting === member.id}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      <InviteMemberModal open={inviteOpen} onOpenChange={setInviteOpen} workspaceId={workspaceId} />
    </>
  )
}
