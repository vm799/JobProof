import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

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
                <Mail className="h-6 w-6" />
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
                <li>
                  • Check{" "}
                  <Link href="/help" className="text-primary hover:underline">
                    help center
                  </Link>{" "}
                  for SMTP configuration
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/auth/sign-up">Try a different email</Link>
              </Button>

              <Button asChild variant="ghost" className="w-full">
                <a
                  href="mailto:admin@getboardingpass.app?subject=Email Confirmation Issue"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contact Support
                </a>
              </Button>
            </div>

            <Link href="/auth/login" className="block text-sm text-primary underline-offset-4 hover:underline">
              Back to login
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
