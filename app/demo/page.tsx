import { DemoMode } from "@/components/demo-mode"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Sparkles, MousePointer, Eye, Zap, CheckCircle2 } from "lucide-react"

export const metadata = {
  /* Updated from "BoardingPass" to "JobProof" */
  title: "Try Demo - JobProof",
  description: "Experience JobProof with interactive demo data",
}

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Interactive Demo</h1>
          </div>

          <div className="mb-8">
            <p className="text-xl text-muted-foreground mb-4">
              JobProof automates field service job management with proof of work tracking, photo verification, and
              real-time progress monitoring.
            </p>
            <p className="text-lg text-muted-foreground">
              This demo lets you experience both sides: the internal dashboard where you manage jobs, and the field
              worker view they use to complete jobs. No login required.
            </p>
          </div>

          <div className="bg-muted/50 rounded-xl p-6 mb-8 border border-border">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <MousePointer className="h-5 w-5 text-primary" />
              What This Demo Shows:
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Dashboard view:</strong> See real-time analytics and job progress tracking
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Field worker view:</strong> Complete a job with forms, photo uploads, and checklist
                  verification
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Guided tour:</strong> Interactive walkthrough explains each feature as you explore
                </span>
              </li>
            </ul>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="p-4 bg-background/50">
              <MousePointer className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Fully Interactive</h3>
              <p className="text-sm text-muted-foreground">Fill forms, upload photos, and complete job steps</p>
            </Card>
            <Card className="p-4 bg-background/50">
              <Eye className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Field Worker View</h3>
              <p className="text-sm text-muted-foreground">See exactly what your team experiences</p>
            </Card>
            <Card className="p-4 bg-background/50">
              <Zap className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold mb-1">No Login Required</h3>
              <p className="text-sm text-muted-foreground">Try it instantly without creating an account</p>
            </Card>
          </div>

          <div className="flex gap-3">
            <Link href="#demo-start">
              <Button size="lg">Start Demo Below</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button size="lg" variant="outline">
                Skip to Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div id="demo-start">
        <DemoMode />
      </div>
    </div>
  )
}
