import './globals.css'
import { Inter } from 'next/font/google'
import { type Metadata } from 'next'
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import Navbar from '@/components/Navbar'
import { Footer } from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'StratifyLabs',
  description:
    'StratifyLabs is a platform for Computer Vision Model Training and Deployment Platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full">
        <body className={`${inter.className} flex flex-col min-h-screen`}>
            <nav className="sticky top-0 z-50 bg-white shadow">
              <Navbar />
            </nav>
            <main className="flex-grow">{children}</main>
            <Footer />
        </body>
      </html>
    </ClerkProvider>
  )
}

