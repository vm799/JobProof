"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, FileText, Upload, FileSignature, Video, Trash2, Settings, ArrowLeft, Save } from "lucide-react"
import { useState, useTransition } from "react"
import Link from "next/link"
import { updateFlow, createStep, updateStep, deleteStep } from "@/app/actions/flows"
import { toast } from "@/hooks/use-toast"

type StepType = "form" | "upload" | "contract" | "video"

interface Step {
  id: string
  type: StepType
  title: string
  description: string | null
  step_order: number
  config: any
}

interface Flow {
  id: string
  name: string
  description: string | null
  status: string
  onboarding_steps: Step[]
}

const stepTypeConfig = {
  form: { icon: FileText, label: "Form", color: "bg-blue-100 text-blue-700" },
  upload: { icon: Upload, label: "File Upload", color: "bg-green-100 text-green-700" },
  contract: { icon: FileSignature, label: "Contract", color: "bg-purple-100 text-purple-700" },
  video: { icon: Video, label: "Video", color: "bg-orange-100 text-orange-700" },
}

export function FlowBuilder({ flow: initialFlow }: { flow: Flow }) {
  const [flow, setFlow] = useState(initialFlow)
  const [steps, setSteps] = useState<Step[]>(initialFlow.onboarding_steps)
  const [editingStep, setEditingStep] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const addStep = async (type: StepType) => {
    startTransition(async () => {
      try {
        const result = await createStep(flow.id, {
          type,
          title: `New ${stepTypeConfig[type].label}`,
          description: "Click settings to edit",
          stepOrder: steps.length,
        })
        if (result.success && result.step) {
          setSteps([...steps, result.step])
          toast({ title: "Step added", description: "Your new step has been created." })
        }
      } catch (err: any) {
        toast({ title: "Error", description: err.message, variant: "destructive" })
      }
    })
  }

  const handleDeleteStep = async (id: string) => {
    startTransition(async () => {
      try {
        await deleteStep(id, flow.id)
        setSteps(steps.filter((step) => step.id !== id))
        toast({ title: "Step deleted", description: "The step has been removed." })
      } catch (err: any) {
        toast({ title: "Error", description: err.message, variant: "destructive" })
      }
    })
  }

  const handleUpdateStep = async (id: string, updates: Partial<Step>) => {
    startTransition(async () => {
      try {
        await updateStep(id, updates)
        setSteps(steps.map((step) => (step.id === id ? { ...step, ...updates } : step)))
      } catch (err: any) {
        toast({ title: "Error", description: err.message, variant: "destructive" })
      }
    })
  }

  const handleUpdateFlow = async (updates: Partial<Flow>) => {
    startTransition(async () => {
      try {
        await updateFlow(flow.id, updates)
        setFlow({ ...flow, ...updates })
        toast({ title: "Flow saved", description: "Your changes have been saved." })
      } catch (err: any) {
        toast({ title: "Error", description: err.message, variant: "destructive" })
      }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/flows">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <Input
              value={flow.name}
              onChange={(e) => setFlow({ ...flow, name: e.target.value })}
              onBlur={() => handleUpdateFlow({ name: flow.name })}
              className="h-auto border-0 px-0 text-3xl font-semibold focus-visible:ring-0"
            />
            <p className="mt-1 text-muted-foreground">Design your onboarding flow</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleUpdateFlow({ status: flow.status === "active" ? "draft" : "active" })}
            disabled={isPending}
          >
            {flow.status === "active" ? "Set Draft" : "Publish Flow"}
          </Button>
          <Button disabled={isPending}>
            <Save className="mr-2 h-4 w-4" />
            {isPending ? "Saving..." : "Saved"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Flow Builder */}
        <div className="space-y-4">
          <Card className="p-6">
            <h2 className="mb-4 font-semibold">Flow Steps</h2>
            <div className="space-y-3">
              {steps.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    No steps added yet. Add your first step from the palette on the right.
                  </p>
                </div>
              ) : (
                steps.map((step, index) => {
                  const StepIcon = stepTypeConfig[step.type].icon
                  const isEditing = editingStep === step.id

                  return (
                    <Card key={step.id} className="p-4 transition-colors hover:border-primary/50">
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${stepTypeConfig[step.type].color}`}
                        >
                          <StepIcon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          {isEditing ? (
                            <div className="space-y-2">
                              <Input
                                value={step.title}
                                onChange={(e) => handleUpdateStep(step.id, { title: e.target.value })}
                                placeholder="Step title"
                              />
                              <Textarea
                                value={step.description || ""}
                                onChange={(e) => handleUpdateStep(step.id, { description: e.target.value })}
                                placeholder="Step description"
                                rows={2}
                              />
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-muted-foreground">STEP {index + 1}</span>
                                <Badge variant="outline" className="text-xs">
                                  {stepTypeConfig[step.type].label}
                                </Badge>
                              </div>
                              <h3 className="mt-1 font-semibold">{step.title}</h3>
                              <p className="text-sm text-muted-foreground">{step.description || "No description"}</p>
                            </>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingStep(isEditing ? null : step.id)}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteStep(step.id)}
                            disabled={isPending}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )
                })
              )}
            </div>
          </Card>
        </div>

        {/* Add Step Palette */}
        <div className="space-y-4">
          <Card className="p-6">
            <h2 className="mb-4 font-semibold">Add Step</h2>
            <div className="space-y-2">
              {(Object.entries(stepTypeConfig) as [StepType, (typeof stepTypeConfig)["form"]][]).map(
                ([type, config]) => {
                  const Icon = config.icon
                  return (
                    <Button
                      key={type}
                      variant="outline"
                      className="w-full justify-start gap-3 bg-transparent"
                      onClick={() => addStep(type)}
                      disabled={isPending}
                    >
                      <div className={`flex h-8 w-8 items-center justify-center rounded-md ${config.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span>{config.label}</span>
                      <Plus className="ml-auto h-4 w-4" />
                    </Button>
                  )
                },
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 font-semibold">Flow Settings</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="flow-description">Description</Label>
                <Textarea
                  id="flow-description"
                  value={flow.description || ""}
                  onChange={(e) => setFlow({ ...flow, description: e.target.value })}
                  onBlur={() => handleUpdateFlow({ description: flow.description })}
                  placeholder="Describe this flow..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="flow-status">Status</Label>
                <Select
                  value={flow.status}
                  onValueChange={(value) => handleUpdateFlow({ status: value })}
                  disabled={isPending}
                >
                  <SelectTrigger id="flow-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
