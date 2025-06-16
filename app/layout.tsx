import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import MobileNavigation from "@/components/mobile-navigation"
import FloatingActionButtons from "@/components/floating-action-buttons"
import Sidebar from "@/components/sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LawnPro - Lawn Care Management",
  description: "Professional lawn care management application",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <div className="flex min-h-screen bg-background">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <main className="flex-1 overflow-auto">{children}</main>
              <MobileNavigation />
              <FloatingActionButtons />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
