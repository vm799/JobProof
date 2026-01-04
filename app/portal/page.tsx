"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Check, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

const steps = [
  { id: 1, name: "Welcome", status: "complete" },
  { id: 2, name: "Contract", status: "complete" },
  { id: 3, name: "Document Upload", status: "current" },
  { id: 4, name: "Discovery Form", status: "upcoming" },
  { id: 5, name: "Review", status: "upcoming" },
]

export default function ClientPortalPage() {
  const [currentStep, setCurrentStep] = useState(3)
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({})

  const handleFileChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFiles((prev) => ({ ...prev, [id]: e.target.files![0].name }))
    }
  }

  const handleContinue = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleSaveDraft = () => {
    console.log("[v0] Saving draft with uploaded files:", uploadedFiles)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 3:
        return (
          <>
            <h1 className="text-3xl font-semibold tracking-tight mb-2 text-balance">Document Upload</h1>
            <p className="text-muted-foreground mb-8">
              Please upload the required documents to continue with your onboarding process.
            </p>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="business-license">Business License *</Label>
                <div className="relative">
                  <Input
                    id="business-license"
                    type="file"
                    className="cursor-pointer"
                    onChange={(e) => handleFileChange("business-license", e)}
                  />
                  {uploadedFiles["business-license"] && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      {uploadedFiles["business-license"]}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tax-id">Tax ID Document *</Label>
                <div className="relative">
                  <Input
                    id="tax-id"
                    type="file"
                    className="cursor-pointer"
                    onChange={(e) => handleFileChange("tax-id", e)}
                  />
                  {uploadedFiles["tax-id"] && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      {uploadedFiles["tax-id"]}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="proof-of-address">Proof of Address *</Label>
                <div className="relative">
                  <Input
                    id="proof-of-address"
                    type="file"
                    className="cursor-pointer"
                    onChange={(e) => handleFileChange("proof-of-address", e)}
                  />
                  {uploadedFiles["proof-of-address"] && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      {uploadedFiles["proof-of-address"]}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additional-notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="additional-notes"
                  placeholder="Add any additional information or notes here..."
                  rows={4}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={handleSaveDraft}>
                  Save Draft
                </Button>
                <Button
                  onClick={handleContinue}
                  disabled={
                    !uploadedFiles["business-license"] || !uploadedFiles["tax-id"] || !uploadedFiles["proof-of-address"]
                  }
                >
                  Continue to Next Step
                </Button>
              </div>
            </div>
          </>
        )

      case 4:
        return (
          <>
            <h1 className="text-3xl font-semibold tracking-tight mb-2 text-balance">Discovery Form</h1>
            <p className="text-muted-foreground mb-8">
              Help us understand your business better to provide the best service.
            </p>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="company-size">Company Size</Label>
                <Input id="company-size" placeholder="e.g., 10-50 employees" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input id="industry" placeholder="e.g., SaaS, E-commerce, Consulting" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goals">What are your primary goals?</Label>
                <Textarea id="goals" placeholder="Tell us about your objectives..." rows={4} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="challenges">Current Challenges</Label>
                <Textarea id="challenges" placeholder="What challenges are you facing?" rows={4} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeline">Expected Timeline</Label>
                <Input id="timeline" placeholder="e.g., 3-6 months" />
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setCurrentStep(3)}>
                  Back
                </Button>
                <Button onClick={handleContinue}>Continue to Review</Button>
              </div>
            </div>
          </>
        )

      case 5:
        return (
          <>
            <h1 className="text-3xl font-semibold tracking-tight mb-2 text-balance">Review & Submit</h1>
            <p className="text-muted-foreground mb-8">
              Please review all information before submitting your onboarding.
            </p>

            <div className="space-y-6">
              <Card className="p-6 bg-muted/50">
                <h3 className="font-semibold mb-4">Uploaded Documents</h3>
                <div className="space-y-3">
                  {Object.entries(uploadedFiles).map(([key, fileName]) => (
                    <div key={key} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-chart-3" />
                      <span className="text-sm">{fileName}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 bg-muted/50">
                <h3 className="font-semibold mb-4">Discovery Information</h3>
                <p className="text-sm text-muted-foreground">All discovery form fields have been completed.</p>
              </Card>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setCurrentStep(4)}>
                  Back
                </Button>
                <Button>Submit Onboarding</Button>
              </div>
            </div>
          </>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary" />
              <span className="text-sm text-muted-foreground">Your Agency Logo</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          {/* Progress Tracker */}
          <div className="lg:sticky lg:top-12 lg:h-fit">
            <Card className="p-6">
              <h2 className="font-semibold mb-6">Your Progress</h2>
              <nav aria-label="Progress">
                <ol className="space-y-6">
                  {steps.map((step, idx) => {
                    const status = step.id < currentStep ? "complete" : step.id === currentStep ? "current" : "upcoming"

                    return (
                      <li key={step.name} className="relative">
                        {idx !== steps.length - 1 && (
                          <div
                            className={cn(
                              "absolute left-4 top-10 -ml-px h-full w-0.5",
                              status === "complete" ? "bg-primary" : "bg-border",
                            )}
                          />
                        )}
                        <div className="group relative flex items-start">
                          <span className="flex h-8 items-center">
                            <span
                              className={cn(
                                "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2",
                                status === "complete"
                                  ? "border-primary bg-primary"
                                  : status === "current"
                                    ? "border-primary bg-card"
                                    : "border-border bg-card",
                              )}
                            >
                              {status === "complete" ? (
                                <Check className="h-4 w-4 text-primary-foreground" />
                              ) : (
                                <span
                                  className={cn(
                                    "h-2 w-2 rounded-full",
                                    status === "current" ? "bg-primary" : "bg-muted",
                                  )}
                                />
                              )}
                            </span>
                          </span>
                          <span className="ml-4 flex min-w-0 flex-col">
                            <span
                              className={cn(
                                "text-sm font-medium",
                                status === "current" ? "text-foreground" : "text-muted-foreground",
                              )}
                            >
                              {step.name}
                            </span>
                          </span>
                        </div>
                      </li>
                    )
                  })}
                </ol>
              </nav>
            </Card>
          </div>

          {/* Active Task */}
          <div>
            <Card className="p-8">
              <div className="max-w-2xl">{renderStepContent()}</div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
