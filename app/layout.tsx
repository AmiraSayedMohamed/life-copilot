import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import "./globals.css"
import ThemeProviderWrapper from "@/components/theme-provider-wrapper"

export const metadata: Metadata = {
  title: "Life Copilot - AI-Powered Life Management",
  description: "Your comprehensive AI companion for managing time, health, emotions, and finances",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <AuthProvider>
            <ThemeProviderWrapper>
              {children}
              <Toaster />
            </ThemeProviderWrapper>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  )
}
