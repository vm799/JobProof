import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { ErrorBoundary } from "@/components/error-boundary"
import { Suspense } from "react"
import { DemoModeBanner } from "@/components/demo-mode-banner"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "JobProof - Field Service Proof of Work",
  description: "Digital proof of work for field service teams",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/jobproof-logo.png",
        type: "image/png",
        sizes: "320x320",
      },
    ],
    apple: {
      url: "/jobproof-logo.png",
      sizes: "320x320",
    },
    shortcut: "/jobproof-logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <DemoModeBanner />
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <Suspense fallback={null}>{children}</Suspense>
            <Toaster />
            <Analytics />
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
