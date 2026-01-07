import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Briefcase, MapPin, Mail } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function SiteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch site with all related jobs and workflows
  const { data: site, error: siteError } = await supabase
    .from("clients")
    .select(`
      id,
      name,
      email,
      created_at,
      metadata,
      client_onboardings(
        id,
        status,
        created_at,
        onboarding_flows(id, name)
      )
    `)
    .eq("id", id)
    .single()

  if (siteError || !site) {
    notFound()
  }

  // Count jobs by status
  const activeJobs = site.client_onboardings?.filter((j: any) => j.status === "in_progress").length || 0
  const completedJobs = site.client_onboardings?.filter((j: any) => j.status === "completed").length || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/sites">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{site.name}</h1>
          <p className="text-muted-foreground">Job site details and activities</p>
        </div>
      </div>

      {/* Site Info */}
      <Card>
        <CardHeader>
          <CardTitle>Site Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Site Name</p>
                <p className="font-medium">{site.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Contact Email</p>
                <p className="font-medium">{site.email}</p>
              </div>
            </div>
          </div>
          {site.metadata?.address && (
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium">{site.metadata.address}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Job Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Active Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{activeJobs}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Completed Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{completedJobs}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Jobs */}
      {site.client_onboardings && site.client_onboardings.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Recent Jobs</CardTitle>
            <CardDescription>All jobs assigned to this site</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {site.client_onboardings.map((job: any) => (
                <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{job.onboarding_flows?.name || "Unnamed Job"}</p>
                    <p className="text-sm text-muted-foreground">{new Date(job.created_at).toLocaleDateString()}</p>
                  </div>
                  <Badge variant={job.status === "completed" ? "default" : "secondary"}>
                    {job.status === "completed" ? "Completed" : "In Progress"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No jobs assigned to this site yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
