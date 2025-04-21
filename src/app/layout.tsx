"use client"

import './globals.css'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { Footer } from '@/components/Footer'
import TopBarWrapper from '@/components/TopBarWrapper'
import NavBarWrapper from '@/components/NavBarWrapper'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { SidebarBody, SidebarProvider } from '@/components/dashboard/sidebar'
import DashboardNav from '@/components/dashboard/DashboardNav'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()
  const isLandingPage = pathname === '/'

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 720)
    }

    handleResize() // Check on initial render
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <ClerkProvider>
      <html lang="en" className="h-full">
        <body className={`${inter.className} flex flex-col min-h-screen`}>
          {!isMobile && <TopBarWrapper />}
          
          {isLandingPage ? (
            // Landing page layout with footer
            <>
              <nav className="sticky top-0 z-50 bg-white shadow">
                <NavBarWrapper />
              </nav>
              <main className="flex-grow">{children}</main>
              <Footer />
            </>
          ) : (
            // Non-landing page layout with sidebar, no footer
            <div className="flex flex-col md:flex-row min-h-screen w-full">
              <SidebarProvider>
                <SidebarBody>
                  <DashboardNav />
                </SidebarBody>
              </SidebarProvider>
              <div className="flex-grow">
                <main className="p-4">{children}</main>
              </div>
            </div>
          )}
        </body>
      </html>
    </ClerkProvider>
  )
}