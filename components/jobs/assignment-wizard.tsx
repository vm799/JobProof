"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AssignmentStep {
  selectedSite?: string
  selectedTemplate?: string
  selectedWorker?: string
  jobName?: string
  dueDate?: string
}

export function JobAssignmentWizard({
  sites,
  templates,
  fieldWorkers,
  workspaceId,
}: {
  sites: any[]
  templates: any[]
  fieldWorkers: any[]
  workspaceId: string
}) {
  const [step, setStep] = useState(1)
  const [assignment, setAssignment] = useState<AssignmentStep>({})

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    // Submit job assignment
    console.log("Assigning job:", assignment)
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Job</h1>
        <p className="text-gray-600 mt-2">Step {step} of 4</p>
      </div>

      {/* Step Indicator */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className={`flex-1 h-2 rounded-full transition ${s <= step ? "bg-blue-600" : "bg-gray-200"}`} />
        ))}
      </div>

      {/* Step 1: Select Site */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Site</CardTitle>
            <CardDescription>Choose which site this job is for</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              value={assignment.selectedSite}
              onValueChange={(val) => setAssignment({ ...assignment, selectedSite: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a site..." />
              </SelectTrigger>
              <SelectContent>
                {sites.map((site) => (
                  <SelectItem key={site.id} value={site.id}>
                    {site.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Select Template */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Job Template</CardTitle>
            <CardDescription>Choose a workflow template for this job</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              value={assignment.selectedTemplate}
              onValueChange={(val) => setAssignment({ ...assignment, selectedTemplate: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a template..." />
              </SelectTrigger>
              <SelectContent>
                {templates.map((tmpl) => (
                  <SelectItem key={tmpl.id} value={tmpl.id}>
                    {tmpl.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Select Field Worker */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Assign to Field Worker</CardTitle>
            <CardDescription>Select who should complete this job</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-2">
              {fieldWorkers.map((worker) => (
                <button
                  key={worker.id}
                  onClick={() => setAssignment({ ...assignment, selectedWorker: worker.id })}
                  className={`p-4 text-left rounded-lg border-2 transition ${
                    assignment.selectedWorker === worker.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <p className="font-medium">{worker.full_name}</p>
                  <p className="text-sm text-gray-600">{worker.email}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Review & Confirm */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Review Job Assignment</CardTitle>
            <CardDescription>Confirm the job details before creating</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              {sites.find((s) => s.id === assignment.selectedSite) && (
                <div>
                  <p className="text-sm text-gray-600">Site</p>
                  <p className="font-medium">{sites.find((s) => s.id === assignment.selectedSite)?.name}</p>
                </div>
              )}
              {templates.find((t) => t.id === assignment.selectedTemplate) && (
                <div>
                  <p className="text-sm text-gray-600">Template</p>
                  <p className="font-medium">{templates.find((t) => t.id === assignment.selectedTemplate)?.name}</p>
                </div>
              )}
              {fieldWorkers.find((w) => w.id === assignment.selectedWorker) && (
                <div>
                  <p className="text-sm text-gray-600">Assigned to</p>
                  <p className="font-medium">
                    {fieldWorkers.find((w) => w.id === assignment.selectedWorker)?.full_name}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex gap-4 mt-8 justify-between">
        <Button variant="outline" onClick={handlePrevious} disabled={step === 1}>
          Previous
        </Button>

        {step < 4 ? (
          <Button
            onClick={handleNext}
            disabled={!assignment[Object.keys(assignment)[step - 1] as keyof AssignmentStep]}
          >
            Next
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="bg-blue-600">
            Create Job
          </Button>
        )}
      </div>
    </div>
  )
}
