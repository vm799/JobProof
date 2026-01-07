"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, User, Plus, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Job {
  id: string
  client_id: string
  status: string
  scheduled_date?: string
  client?: { name: string; email: string }
  assigned_to?: { full_name: string; email: string }
}

interface Site {
  id: string
  name: string
  email: string
}

interface Technician {
  id: string
  full_name: string
  email: string
}

interface Template {
  id: string
  name: string
  description: string
}

interface JobsSchedulerProps {
  jobs: Job[]
  sites: Site[]
  technicians: Technician[]
  templates: Template[]
}

export function JobsScheduler({ jobs, sites, technicians, templates }: JobsSchedulerProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [selectedSite, setSelectedSite] = useState("")
  const [selectedTechnician, setSelectedTechnician] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [scheduledDate, setScheduledDate] = useState("")
  const router = useRouter()

  const handleCreateJob = async () => {
    if (!selectedSite || !selectedTechnician || !selectedTemplate) return

    setIsCreating(true)
    const supabase = createClient()

    try {
      // Create job assignment
      const { data: job, error } = await supabase
        .from("client_onboardings")
        .insert({
          client_id: selectedSite,
          flow_id: selectedTemplate,
          status: "scheduled",
          scheduled_date: scheduledDate || null,
        })
        .select()
        .single()

      if (error) throw error

      // Trigger email notification via API route
      await fetch("/api/jobs/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job.id,
          technicianId: selectedTechnician,
          siteId: selectedSite,
        }),
      })

      router.refresh()
      setSelectedSite("")
      setSelectedTechnician("")
      setSelectedTemplate("")
      setScheduledDate("")
    } catch (error) {
      console.error("Failed to create job:", error)
    } finally {
      setIsCreating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "scheduled":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />
      case "in_progress":
        return <Clock className="h-4 w-4" />
      case "scheduled":
        return <Calendar className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Job Scheduler</h1>
          <p className="text-muted-foreground">Dispatch jobs to field technicians</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Schedule Job
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Schedule New Job</DialogTitle>
              <DialogDescription>Assign a job to a field technician</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="site">Job Site</Label>
                <Select value={selectedSite} onValueChange={setSelectedSite}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a site" />
                  </SelectTrigger>
                  <SelectContent>
                    {sites.map((site) => (
                      <SelectItem key={site.id} value={site.id}>
                        {site.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="technician">Assign To</Label>
                <Select value={selectedTechnician} onValueChange={setSelectedTechnician}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a technician" />
                  </SelectTrigger>
                  <SelectContent>
                    {technicians.map((tech) => (
                      <SelectItem key={tech.id} value={tech.id}>
                        {tech.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="template">Job Template</Label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Scheduled Date (Optional)</Label>
                <Input
                  id="date"
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleCreateJob}
                disabled={isCreating || !selectedSite || !selectedTechnician || !selectedTemplate}
              >
                {isCreating ? "Scheduling..." : "Schedule Job"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {jobs.map((job) => (
          <Card key={job.id}>
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{job.client?.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-3 w-3" />
                    {job.assigned_to?.full_name || "Unassigned"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {job.scheduled_date && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(job.scheduled_date).toLocaleDateString()}
                  </div>
                )}
                <Badge className={getStatusColor(job.status)}>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(job.status)}
                    {job.status}
                  </span>
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
