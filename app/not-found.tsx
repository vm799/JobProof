import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileQuestion } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <FileQuestion className="h-6 w-6 text-muted-foreground" />
          </div>
          <h1 className="mb-2 text-2xl font-semibold">Page Not Found</h1>
          <p className="mb-6 text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
