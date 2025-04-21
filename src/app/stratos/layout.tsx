
"use client"

import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/stratos/theme-provider"
import { SidebarBody, SidebarProvider } from '@/components/dashboard/sidebar'
import DashboardNav from '@/components/dashboard/DashboardNav'
import { useEffect, useState } from 'react'

const inter = Inter({ subsets: ["latin"] })

export default function StratosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 720)
    }

    handleResize() // Check on initial render
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="flex flex-col md:flex-row min-h-screen">
            <SidebarProvider>
              <SidebarBody>
                <DashboardNav />
              </SidebarBody>
            </SidebarProvider>
            {/* Fixed content positioning - removed hover effect that was causing shift */}
            <div className="flex-grow md:ml-[60px] transition-all duration-200">
              <div className="p-4">
                {children}
              </div>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
