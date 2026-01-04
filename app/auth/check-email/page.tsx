import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function CheckEmailPage({
  searchParams,
}: {
  searchParams: { email?: string }
}) {
  const email = searchParams.email

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-6">
      <div className="w-full max-w-md space-y-4">
        <Card>
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
            <CardTitle className="text-2xl font-semibold">Check your email</CardTitle>
            <CardDescription>
              {email ? (
                <>
                  We've sent a confirmation link to <strong>{email}</strong>
                </>
              ) : (
                <>We've sent you a confirmation link</>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
              <p className="mb-2 font-medium text-foreground">Email not arriving?</p>
              <ul className="space-y-1 text-left">
                <li>• Check your spam/junk folder</li>
                <li>• Wait 2-3 minutes for delivery</li>
                <li>• Verify the email address is correct</li>
                <li>• Contact support if issues persist</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/auth/sign-up">Try a different email</Link>
              </Button>

              <a href="mailto:admin@getboardingpass.app?subject=Email Confirmation Issue" rel="noopener noreferrer">
                <Button variant="ghost" className="w-full">
                  Contact Support
                </Button>
              </a>
            </div>

            <Link href="/auth/login" className="block text-sm text-primary underline-offset-4 hover:underline">
              Back to login
            </Link>
          </CardContent>
        </Card>

        <Card className="border-yellow-500/50 bg-yellow-500/5">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm space-y-2">
                <p className="font-medium">Email Configuration Notice</p>
                <p className="text-muted-foreground">
                  If you're not receiving emails, the email service may need to be configured. See the{" "}
                  <Link href="/help" className="text-primary hover:underline">
                    help center
                  </Link>{" "}
                  for SMTP setup instructions or contact support.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
