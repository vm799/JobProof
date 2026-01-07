"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, MapPin } from "lucide-react"
import Link from "next/link"

interface ActiveJobsTableProps {
  workspaceId: string
}

export function ActiveJobsTable({ workspaceId }: ActiveJobsTableProps) {
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchJobs() {
      const supabase = createClient()

      const { data, error } = await supabase
        .from("client_onboardings")
        .select(`
          id,
          status,
          created_at,
          clients (name, email),
          onboarding_flows (name)
        `)
        .eq("workspace_id", workspaceId)
        .in("status", ["in_progress", "pending"])
        .order("created_at", { ascending: false })
        .limit(10)

      if (!error && data) {
        setJobs(data)
      }
      setLoading(false)
    }

    fetchJobs()
  }, [workspaceId])

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      in_progress: "default",
      pending: "secondary",
      completed: "outline",
    }
    return <Badge variant={variants[status] || "outline"}>{status.replace("_", " ")}</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Jobs</CardTitle>
        <CardDescription>Recent job assignments and their current status</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No active jobs. Assign jobs from the Sites page.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Site</TableHead>
                <TableHead>Job Template</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Started</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {job.clients?.name || "Unknown Site"}
                    </div>
                  </TableCell>
                  <TableCell>{job.onboarding_flows?.name || "N/A"}</TableCell>
                  <TableCell>{getStatusBadge(job.status)}</TableCell>
                  <TableCell>{new Date(job.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/flows/${job.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
