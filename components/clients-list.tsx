"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreVertical, Mail, Calendar, Users, Copy, Trash2, Briefcase } from "lucide-react"
import { OnboardingModal } from "@/components/onboarding-modal"
import { CreateJobModal } from "@/components/create-job-modal"
import { EmptyState } from "@/components/empty-state"
import { formatDistanceToNow } from "date-fns"
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
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

interface Client {
  id: string
  name: string
  email: string
  created_at: string
  client_onboardings: Array<{
    id: string
    status: string
    created_at: string
  }>
}

interface ClientsListProps {
  clients: Client[]
  workspaceId: string
}

export function ClientsList({ clients, workspaceId }: ClientsListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [clientToDelete, setClientToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showJobModal, setShowJobModal] = useState(false)
  const [selectedSite, setSelectedSite] = useState<{ id: string; name: string } | null>(null)
  const [templates, setTemplates] = useState<Array<{ id: string; name: string }>>([])
  const router = useRouter()

  useEffect(() => {
    async function fetchTemplates() {
      const supabase = createClient()
      const { data } = await supabase
        .from("onboarding_flows")
        .select("id, name")
        .eq("workspace_id", workspaceId)
        .eq("status", "active")

      setTemplates(data || [])
      console.log("[v0] Loaded job templates:", data?.length || 0)
    }
    fetchTemplates()
  }, [workspaceId])

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())

    const latestOnboarding = client.client_onboardings[0]
    const matchesStatus = !statusFilter || latestOnboarding?.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusVariant = (status: string): "default" | "secondary" | "outline" => {
    switch (status) {
      case "completed":
        return "default"
      case "in_progress":
        return "secondary"
      case "not_started":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusLabel = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const calculateProgress = (steps: any[]) => {
    return 0 // Will be loaded on-demand when client is clicked
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleDeleteClient = async (clientId: string) => {
    setClientToDelete(null)
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete client")

      toast({
        title: "Client deleted",
        description: "The client and their onboarding data have been removed.",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete client. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSharePortal = (client: Client) => {
    const portalUrl = `${window.location.origin}/portal/${client.id}`
    const subject = `Your Onboarding Portal - ${client.name}`
    const body = `Hi ${client.name.split(" ")[0]},\n\nYour personalized onboarding portal is ready! Click the link below to get started:\n\n${portalUrl}\n\nLet me know if you have any questions.\n\nBest regards`

    window.location.href = `mailto:${client.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

    toast({
      title: "Email client opened",
      description: "Ready to send the portal link to your client.",
    })
  }

  const handleCopyLink = async (clientId: string, clientName: string) => {
    const portalUrl = `${window.location.origin}/portal/${clientId}`

    try {
      await navigator.clipboard.writeText(portalUrl)
      toast({
        title: "Link copied!",
        description: `Portal link for ${clientName} copied to clipboard.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCreateJob = (siteId: string, siteName: string) => {
    console.log("[v0] Creating job for site:", siteName)
    setSelectedSite({ id: siteId, name: siteName })
    setShowJobModal(true)
  }

  if (clients.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-balance text-3xl font-semibold tracking-tight">Sites</h1>
            <p className="mt-1 text-muted-foreground">Manage your job sites and assignments</p>
          </div>
        </div>
        <EmptyState
          icon={Users}
          title="No sites yet"
          description="Add your first site to start creating job assignments."
          action={{
            label: "Add Site",
            onClick: () => setIsModalOpen(true),
          }}
        />
        <OnboardingModal open={isModalOpen} onOpenChange={setIsModalOpen} workspaceId={workspaceId} />
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-balance text-3xl font-semibold tracking-tight">Sites</h1>
            <p className="mt-1 text-muted-foreground">Manage your job sites and assignments</p>
          </div>
          <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Site
          </Button>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search sites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">{statusFilter ? getStatusLabel(statusFilter) : "All Statuses"}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setStatusFilter(null)}>All Statuses</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("in_progress")}>In Progress</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("completed")}>Completed</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Pending</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid gap-4">
          {filteredClients.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">
                {searchQuery || statusFilter
                  ? "No sites match your filters. Try adjusting your search or filter."
                  : "No sites found. Add your first site to get started."}
              </p>
            </Card>
          ) : (
            filteredClients.map((client) => {
              const latestOnboarding = client.client_onboardings[0]
              const progress =
                latestOnboarding?.status === "completed" ? 100 : latestOnboarding?.status === "in_progress" ? 50 : 0
              const status = latestOnboarding?.status || "not_started"

              return (
                <Card key={client.id} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-sm font-semibold">
                      {getInitials(client.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold">{client.name}</h3>
                          <div className="mt-1 flex items-center gap-4">
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <Mail className="h-3.5 w-3.5" />
                              {client.email}
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <Calendar className="h-3.5 w-3.5" />
                              Added {formatDistanceToNow(new Date(client.created_at), { addSuffix: true })}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusVariant(status)}>{getStatusLabel(status)}</Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCreateJob(client.id, client.name)}
                            className="gap-1.5"
                          >
                            <Briefcase className="h-3.5 w-3.5" />
                            Create Job
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleSharePortal(client)}>
                                <Mail className="mr-2 h-4 w-4" />
                                Email Portal Link
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleCopyLink(client.id, client.name)}>
                                <Copy className="mr-2 h-4 w-4" />
                                Copy Portal Link
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/clients/${client.id}`)}>
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setClientToDelete(client.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                          <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                        </div>
                        <span className="min-w-[3ch] text-right text-sm font-medium text-muted-foreground">
                          {progress}%
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })
          )}
        </div>
      </div>

      <OnboardingModal open={isModalOpen} onOpenChange={setIsModalOpen} workspaceId={workspaceId} />

      {showJobModal && selectedSite && (
        <CreateJobModal
          open={showJobModal}
          onClose={() => setShowJobModal(false)}
          site={selectedSite}
          templates={templates}
        />
      )}

      <AlertDialog open={clientToDelete !== null} onOpenChange={() => setClientToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Site?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this site and all associated job data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => clientToDelete && handleDeleteClient(clientToDelete)}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete Site"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
