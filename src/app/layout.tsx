import './globals.css'
import { Inter } from 'next/font/google'
import { type Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import Navbar from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import TopBarWrapper from '@/components/TopBarWrapper'
import NavBarWrapper from '@/components/NavBarWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'StratifyLabs',
  description:
    'StratifyLabs is a platform for Computer Vision Model Training and Deployment Platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full">
        <body className={`${inter.className} flex flex-col min-h-screen`}>
          <TopBarWrapper /> {/* Use the wrapper component */}
          <nav className="sticky top-0 z-50 bg-white shadow">
            <NavBarWrapper>
            </NavBarWrapper>
          </nav>
          <main className="flex-grow">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  )
}