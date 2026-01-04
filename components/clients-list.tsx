"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreVertical, Mail, Calendar, Users } from "lucide-react"
import { OnboardingModal } from "@/components/onboarding-modal"
import { EmptyState } from "@/components/empty-state"
import { formatDistanceToNow } from "date-fns"

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

  if (clients.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-balance text-3xl font-semibold tracking-tight">Clients</h1>
            <p className="mt-1 text-muted-foreground">Manage all your client onboardings</p>
          </div>
        </div>
        <EmptyState
          icon={Users}
          title="No clients yet"
          description="Add your first client to start tracking their onboarding progress."
          action={{
            label: "Add Client",
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
            <h1 className="text-balance text-3xl font-semibold tracking-tight">Clients</h1>
            <p className="mt-1 text-muted-foreground">Manage all your client onboardings</p>
          </div>
          <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Client
          </Button>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
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
              <DropdownMenuItem onClick={() => setStatusFilter("not_started")}>Not Started</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid gap-4">
          {filteredClients.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">
                {searchQuery || statusFilter
                  ? "No clients match your filters. Try adjusting your search or filter."
                  : "No clients found. Add your first client to get started."}
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
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
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
    </>
  )
}
