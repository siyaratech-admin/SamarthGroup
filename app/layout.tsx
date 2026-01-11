import type React from "react"
import type { Metadata } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Sidebar } from "@/components/erp/sidebar"
import { ThemeProvider } from "@/components/theme-provider"

// Restoring your exact imports
const _inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Samarth Group - SIFMS",
  description: "Sales, Inventory & Finance Management System",
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground selection:bg-primary/10 selection:text-primary">
        <ThemeProvider defaultTheme="light" storageKey="erp-theme">
          <div className="flex min-h-screen w-full relative">
            <Sidebar />
            {/* Main container logic for responsiveness */}
            <main className="min-h-screen w-full flex-1 min-w-0 lg:ml-60 xl:ml-64 transition-all duration-300">
              {children}
            </main>
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}