"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Printer, Share2, Loader2, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

interface ProofReportProps {
  jobId: string
}

export function ProofReport({ jobId }: ProofReportProps) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchReport() {
      console.log("[v0] ProofReport - Fetching job data for:", jobId)
      const supabase = createClient()

      // Fetch job details
      const { data: job, error: jobError } = await supabase
        .from("client_onboardings")
        .select(`
          *,
          clients(name, email),
          onboarding_flows(name)
        `)
        .eq("id", jobId)
        .single()

      if (jobError) {
        console.error("[v0] Error fetching job:", jobError)
        setLoading(false)
        return
      }

      // Fetch completed steps
      const { data: steps } = await supabase
        .from("client_step_progress")
        .select(`
          *,
          onboarding_steps(title, description, type)
        `)
        .eq("client_onboarding_id", jobId)
        .eq("status", "completed")
        .order("completed_at", { ascending: true })

      // Fetch photos
      const { data: photos } = await supabase.from("file_uploads").select("*").eq("client_onboarding_id", jobId)

      console.log("[v0] Report data loaded:", { job, steps: steps?.length, photos: photos?.length })
      setData({ job, steps: steps || [], photos: photos || [] })
      setLoading(false)
    }

    fetchReport()
  }, [jobId])

  function handlePrint() {
    console.log("[v0] ProofReport - Printing report")
    window.print()
  }

  function handleShare() {
    const url = `${window.location.origin}/reports/${jobId}`
    navigator.clipboard.writeText(url)
    toast.success("Report link copied to clipboard!")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">No report data available</p>
      </div>
    )
  }

  const { job, steps, photos } = data

  return (
    <div className="space-y-8">
      {/* Header */}
      <Card className="p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              <h1 className="text-3xl font-bold">Job Completion Report</h1>
            </div>
            <p className="text-muted-foreground">Complete proof of work documentation</p>
          </div>
          <div className="flex gap-2 print:hidden">
            <Button onClick={handlePrint} variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              Print PDF
            </Button>
            <Button onClick={handleShare} variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Site</p>
            <p className="font-semibold">{job.clients?.name || "Unknown"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Job Type</p>
            <p className="font-semibold">{job.onboarding_flows?.name || "Unknown"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Completed</p>
            <p className="font-semibold">
              {job.completed_at ? new Date(job.completed_at).toLocaleDateString() : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Status</p>
            <p className="font-semibold capitalize">{job.status}</p>
          </div>
        </div>
      </Card>

      {/* Steps & Evidence */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Completed Steps ({steps.length})</h2>
        {steps.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No completed steps yet</p>
          </Card>
        ) : (
          steps.map((step: any, index: number) => (
            <Card key={step.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">
                      {index + 1}
                    </span>
                    {step.onboarding_steps?.title || "Untitled Step"}
                  </h3>
                  {step.onboarding_steps?.description && (
                    <p className="text-sm text-muted-foreground mt-1 ml-8">{step.onboarding_steps.description}</p>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{new Date(step.completed_at).toLocaleString()}</span>
              </div>

              {/* Photos for this step */}
              {photos.filter((photo: any) => photo.step_id === step.step_id).length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-semibold mb-3">Evidence:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {photos
                      .filter((photo: any) => photo.step_id === step.step_id)
                      .map((photo: any) => (
                        <div key={photo.id} className="relative group">
                          <img
                            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/client-uploads/${photo.storage_path}`}
                            alt={photo.file_name}
                            className="rounded-lg border w-full h-48 object-cover hover:opacity-90 transition-opacity"
                          />
                          <p className="text-xs text-muted-foreground mt-1 truncate">{photo.file_name}</p>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Form data */}
              {step.data && Object.keys(step.data).length > 0 && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm font-semibold mb-2">Additional Data:</p>
                  <pre className="text-xs whitespace-pre-wrap font-mono">{JSON.stringify(step.data, null, 2)}</pre>
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
