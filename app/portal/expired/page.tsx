import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Link Expired | JobProof",
  description: "This job link has expired for security reasons.",
}

export default function PortalExpiredPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="max-w-lg text-center space-y-6">
        <div className="inline-flex flex-col items-center gap-4 mb-8">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">JobProof</h1>
        </div>

        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 mb-4">
          <svg className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-semibold">This Link Has Expired</h2>

        <div className="space-y-3 text-muted-foreground">
          <p>
            For your security, job portal links automatically expire after <strong>7 days</strong>.
          </p>
          <p>This ensures that your sensitive information remains protected and prevents unauthorized access.</p>
        </div>

        <div className="bg-muted/50 rounded-lg p-6 mt-6">
          <h3 className="font-semibold mb-2">What to do next:</h3>
          <p className="text-sm text-muted-foreground">
            Please contact the company that sent you this link to request a new job link. They can generate
            a fresh link for you in seconds.
          </p>
        </div>

        <div className="pt-4">
          <Button asChild variant="outline">
            <Link href="/">Return Home</Link>
          </Button>
        </div>

        <div className="pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground">🔒 Protected by Row Level Security (RLS) • 256-bit Encryption</p>
        </div>
      </div>
    </div>
  )
}
