import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import MobileNavigation from "@/components/mobile-navigation"
import FloatingActionButtons from "@/components/floating-action-buttons"
import Sidebar from "@/components/sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "LawnPro - Mobile Lawn Care App",
  description: "Manage your lawn care business on the go",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <div className="flex min-h-screen bg-background">
            <Sidebar />
            <div className="flex-1 flex flex-col min-h-screen relative">
              <div className="flex-1 pb-16 md:pb-0">{children}</div>
              <FloatingActionButtons />
              <MobileNavigation />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
