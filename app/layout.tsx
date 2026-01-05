import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { ErrorBoundary } from "@/components/error-boundary"
import { UserStateProvider } from "@/components/user-state-provider"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BoardingPass - Client Onboarding Made Simple",
  description: "Streamline your client onboarding process with BoardingPass",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/boardingpass-logo.png",
        type: "image/png",
        sizes: "320x320",
      },
    ],
    apple: {
      url: "/boardingpass-logo.png",
      sizes: "320x320",
    },
    shortcut: "/boardingpass-logo.png",
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
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <UserStateProvider>{children}</UserStateProvider>
            <Toaster />
            <Analytics />
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
