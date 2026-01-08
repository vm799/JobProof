"use client"

import { useState } from "react"
import { JobCard } from "./job-card"
import { PhotoCaptureModal } from "./photo-capture-modal"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Job {
  id: string
  name: string
  status: string
  site: { name: string; address: string }
  proofs: any[]
}

export function FieldWorkerDashboard({ jobs, workspaceId }: { jobs: Job[]; workspaceId: string }) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [showPhotoCapture, setShowPhotoCapture] = useState(false)

  const activeJobs = jobs.filter((j) => j.status === "assigned")
  const completedJobs = jobs.filter((j) => j.status === "completed")

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold">My Jobs</h1>
        <p className="text-gray-600 mt-2">Capture photos and upload proof of completion</p>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active ({activeJobs.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedJobs.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeJobs.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-600">No active jobs assigned</p>
              </CardContent>
            </Card>
          ) : (
            activeJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onCapturePhoto={() => {
                  setSelectedJob(job)
                  setShowPhotoCapture(true)
                }}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedJobs.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-600">No completed jobs yet</p>
              </CardContent>
            </Card>
          ) : (
            completedJobs.map((job) => <JobCard key={job.id} job={job} onCapturePhoto={() => {}} />)
          )}
        </TabsContent>
      </Tabs>

      {selectedJob && showPhotoCapture && (
        <PhotoCaptureModal
          job={selectedJob}
          workspaceId={workspaceId}
          onClose={() => {
            setShowPhotoCapture(false)
            setSelectedJob(null)
          }}
          onSuccess={() => {
            setShowPhotoCapture(false)
            setSelectedJob(null)
          }}
        />
      )}
    </div>
  )
}
