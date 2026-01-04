import { DemoMode } from "@/components/demo-mode"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Sparkles, MousePointer, Eye, Zap } from "lucide-react"

export const metadata = {
  title: "Try Demo - BoardingPass",
  description: "Experience BoardingPass with interactive demo data",
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
          <p className="text-xl text-muted-foreground mb-8">
            Experience BoardingPass from your client's perspective. Complete a full onboarding flow to see how smooth
            the process is.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="p-4 bg-background/50">
              <MousePointer className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Fully Interactive</h3>
              <p className="text-sm text-muted-foreground">Fill forms, upload files, and complete steps</p>
            </Card>
            <Card className="p-4 bg-background/50">
              <Eye className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Client View</h3>
              <p className="text-sm text-muted-foreground">See exactly what your clients experience</p>
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
