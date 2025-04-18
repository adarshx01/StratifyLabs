import './globals.css'
import { Inter } from 'next/font/google'
// import { UserProvider } from "@auth0/nextjs-auth0/client";
import Navbar from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Auth0Provider } from '@auth0/nextjs-auth0'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'StratifyLabs',
  description:
    'StratifyLabs is a platform for Computer Vision Model Training and Deployment Platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        {/* <UserProvider> */}
        <Auth0Provider>
          <nav className="sticky top-0 z-50 bg-white shadow">
            <Navbar />
          </nav>
          <main className="flex-grow">{children}</main>
          <Footer />
          </Auth0Provider>
        {/* </UserProvider> */}
      </body>
    </html>
  )
}

