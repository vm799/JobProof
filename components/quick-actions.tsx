"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, FileText, Users, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { OnboardingModal } from "./onboarding-modal"

interface QuickActionsProps {
  workspaceId: string
}

export function QuickActions({ workspaceId }: QuickActionsProps) {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 bg-transparent py-4"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="h-5 w-5" />
            <span className="text-sm">New Client</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 bg-transparent py-4"
            onClick={() => router.push("/flows")}
          >
            <FileText className="h-5 w-5" />
            <span className="text-sm">View Flows</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 bg-transparent py-4"
            onClick={() => router.push("/team")}
          >
            <Users className="h-5 w-5" />
            <span className="text-sm">Invite Team</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 bg-transparent py-4"
            onClick={() => router.push("/settings")}
          >
            <Mail className="h-5 w-5" />
            <span className="text-sm">Configure</span>
          </Button>
        </div>
      </Card>
      <OnboardingModal open={isModalOpen} onOpenChange={setIsModalOpen} workspaceId={workspaceId} />
    </>
  )
}
