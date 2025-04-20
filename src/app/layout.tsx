"use client"

import './globals.css'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import Navbar from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import TopBarWrapper from '@/components/TopBarWrapper'
import NavBarWrapper from '@/components/NavBarWrapper'
import { useEffect, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
    <ClerkProvider>
      <html lang="en" className="h-full">
        <body className={`${inter.className} flex flex-col min-h-screen`}>
          {!isMobile && <TopBarWrapper />}
          <nav className="sticky top-0 z-50 bg-white shadow">
            <NavBarWrapper />
          </nav>
          <main className="flex-grow">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  )
}