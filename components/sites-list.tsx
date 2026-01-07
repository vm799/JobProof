"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, MapPin, Briefcase } from "lucide-react"
import Link from "next/link"
import { AddSiteDialog } from "@/components/add-site-dialog"

interface SitesListProps {
  sites: any[]
  workspaceId: string
}

export function SitesList({ sites: initialSites, workspaceId }: SitesListProps) {
  const [sites, setSites] = useState(initialSites)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)

  const filteredSites = sites.filter(
    (site) =>
      site.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getActiveJobsCount = (site: any) => {
    return site.client_onboardings?.filter((job: any) => job.status === "in_progress").length || 0
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Job Sites</h1>
          <p className="text-muted-foreground">Manage your field service locations</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Site
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Sites</CardTitle>
          <CardDescription>View and manage all job sites in your workspace</CardDescription>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredSites.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No sites found. Add your first site to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Site Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Active Jobs</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSites.map((site) => {
                  const activeJobs = getActiveJobsCount(site)
                  return (
                    <TableRow key={site.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {site.name}
                        </div>
                      </TableCell>
                      <TableCell>{site.email}</TableCell>
                      <TableCell>
                        {activeJobs > 0 ? (
                          <Badge variant="default">
                            <Briefcase className="h-3 w-3 mr-1" />
                            {activeJobs} active
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">None</span>
                        )}
                      </TableCell>
                      <TableCell>{new Date(site.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/clients/${site.id}`}>View Details</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AddSiteDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        workspaceId={workspaceId}
        onSuccess={(newSite) => {
          setSites([newSite, ...sites])
          setShowAddDialog(false)
        }}
      />
    </div>
  )
}
