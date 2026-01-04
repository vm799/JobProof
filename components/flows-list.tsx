"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, FileText, Users, Calendar, Workflow, Trash2, MoreVertical } from "lucide-react"
import Link from "next/link"
import { useState, useTransition } from "react"
import { CreateFlowModal } from "./create-flow-modal"
import { EmptyState } from "./empty-state"
import { deleteFlow } from "@/app/actions/flows"
import { toast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Flow {
  id: string
  name: string
  description: string | null
  status: string
  created_at: string
  onboarding_steps: Array<{ id: string }>
  client_onboardings: Array<{ id: string; status: string }>
}

interface FlowsListProps {
  flows: Flow[]
  workspaceId: string
}

export function FlowsList({ flows, workspaceId }: FlowsListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [flowToDelete, setFlowToDelete] = useState<Flow | null>(null)
  const [isPending, startTransition] = useTransition()

  const getActiveClients = (onboardings: Flow["client_onboardings"]) => {
    return onboardings.filter((o) => o.status === "in_progress" || o.status === "not_started").length
  }

  const handleDelete = async () => {
    if (!flowToDelete) return

    startTransition(async () => {
      try {
        await deleteFlow(flowToDelete.id)
        toast({
          title: "Flow deleted",
          description: "The flow has been successfully deleted.",
        })
        setDeleteDialogOpen(false)
        setFlowToDelete(null)
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        })
      }
    })
  }

  if (flows.length === 0) {
    return (
      <>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-balance text-3xl font-semibold tracking-tight">Onboarding Flows</h1>
              <p className="mt-1 text-muted-foreground">Create and manage your onboarding templates</p>
            </div>
          </div>
          <EmptyState
            icon={Workflow}
            title="No flows yet"
            description="Create your first onboarding flow template to streamline client onboarding."
            action={{
              label: "Create Flow",
              onClick: () => setIsModalOpen(true),
            }}
          />
        </div>
        <CreateFlowModal open={isModalOpen} onOpenChange={setIsModalOpen} workspaceId={workspaceId} />
      </>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-balance text-3xl font-semibold tracking-tight">Onboarding Flows</h1>
            <p className="mt-1 text-muted-foreground">Create and manage your onboarding templates</p>
          </div>
          <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Create Flow
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {flows.map((flow) => {
            const stepCount = flow.onboarding_steps.length
            const activeClients = getActiveClients(flow.client_onboardings)

            return (
              <Card key={flow.id} className="group relative p-6 transition-colors hover:border-primary/50">
                <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={(e) => {
                          e.preventDefault()
                          setFlowToDelete(flow)
                          setDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete flow
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <Link href={`/flows/${flow.id}`} className="block">
                  <div className="mb-3 flex items-start justify-between pr-8">
                    <div>
                      <h3 className="mb-1 font-semibold">{flow.name}</h3>
                      <p className="text-sm text-muted-foreground">{flow.description || "No description"}</p>
                    </div>
                    <Badge variant={flow.status === "active" ? "default" : "outline"}>
                      {flow.status === "active" ? "Active" : "Draft"}
                    </Badge>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-4 border-t border-border pt-6">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <FileText className="h-3.5 w-3.5" />
                        <span className="text-xs">Steps</span>
                      </div>
                      <span className="text-lg font-semibold">{stepCount}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        <span className="text-xs">Active</span>
                      </div>
                      <span className="text-lg font-semibold">{activeClients}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span className="text-xs">Clients</span>
                      </div>
                      <span className="text-lg font-semibold">{flow.client_onboardings.length}</span>
                    </div>
                  </div>
                </Link>
              </Card>
            )
          })}
        </div>
      </div>

      <CreateFlowModal open={isModalOpen} onOpenChange={setIsModalOpen} workspaceId={workspaceId} />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete flow?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{flowToDelete?.name}". This action cannot be undone.
              {flowToDelete && getActiveClients(flowToDelete.client_onboardings) > 0 && (
                <span className="mt-2 block text-destructive font-medium">
                  Warning: This flow has {getActiveClients(flowToDelete.client_onboardings)} active client(s). Complete
                  or cancel them first.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
