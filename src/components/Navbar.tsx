'use client' // Indicates that this component is a client-side component in Next.js

import { useState, useEffect } from "react" // Importing useState and useEffect for managing state and side effects
import { motion, AnimatePresence } from "framer-motion" // Importing motion and AnimatePresence for animations
import { IconMenu2, IconX } from "@tabler/icons-react" // Importing menu and close icons
import Link from "next/link" // Importing the Link component from Next.js
import { buttonVariants } from "@/components/ui/button" // Importing button styling utility
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs" // Importing Clerk components
import { ArrowRight } from "lucide-react" // Importing the ArrowRight icon from lucide-react

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false) // State to track mobile menu visibility
  const [isVisible, setIsVisible] = useState(true) // State to track navbar visibility
  const [lastScrollY, setLastScrollY] = useState(0) // State to track the last scroll position
  const [isAtTop, setIsAtTop] = useState(true) // New state to track if the user is at the top of the page

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Show/hide the navbar based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }

      // Check if the user is at the top of the page
      setIsAtTop(currentScrollY === 0)

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return (
    <>
      {/* Navbar */}
      <motion.nav
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.4, ease: "easeInOut" }} // Smooth transition
        className={`fixed left-1/2 z-40 transform -translate-x-1/2 bg-white shadow-lg rounded-lg px-6 max-w-7xl w-[95%] ${
          isAtTop ? "top-10 py-3" : "top-5 py-2" // Adjusted padding for smoother height change
        }`}
      >
        {/* Main navigation container */}
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold">
            StratifyLabs
          </Link>

          {/* Desktop navigation links */}
          <div className="hidden lg:flex items-center space-x-6">
            <SignedOut>
              <SignInButton>
                <button
                  className={`${buttonVariants({ size: "sm", variant: "ghost" })} text-lg hover:bg-blue-100 hover:text-blue-500`}
                >
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton>
                <button
                  className={`${buttonVariants({ size: "sm", variant: "ghost" })} text-lg hover:bg-blue-100 hover:text-blue-500`}
                >
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
              <Link
                href="/visionlab"
                className={`${buttonVariants({ size: "sm", variant: "ghost" })} text-lg hover:bg-blue-100 hover:text-blue-500`}
              >
                VisionLab
              </Link>
              <Link
                href="/train"
                className={`${buttonVariants({ size: "sm", variant: "ghost" })} text-lg hover:bg-blue-100 hover:text-blue-500`}
              >
                Train
              </Link>
              <Link
                href="/documentation"
                className={
                  buttonVariants({ size: "sm", variant: "ghost" }) +
                  " bg-blue-500 text-white flex items-center space-x-1 px-4 py-2 text-lg hover:bg-blue-600"
                }
              >
                <span>Read Docs</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </SignedIn>
          </div>

          {/* Mobile menu toggle button */}
          <button
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            {isMobileMenuOpen ? <IconX size={28} /> : <IconMenu2 size={28} />}
          </button>
        </div>

        {/* Mobile navigation menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden bg-white shadow-md rounded-lg mt-2"
            >
              <div className="flex flex-col items-start space-y-2 px-4 py-2">
                <SignedOut>
                  <SignInButton>
                    <button
                      className={`${buttonVariants({ size: "sm", variant: "ghost" })} text-lg hover:bg-blue-100 hover:text-blue-500`}
                    >
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton>
                    <button
                      className={`${buttonVariants({ size: "sm", variant: "ghost" })} text-lg hover:bg-blue-100 hover:text-blue-500`}
                    >
                      Sign Up
                    </button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <Link
                    href="/visionlab"
                    className={`${buttonVariants({ size: "sm", variant: "ghost" })} text-lg hover:bg-blue-100 hover:text-blue-500`}
                  >
                    VisionLab
                  </Link>
                  <Link
                    href="/train"
                    className={`${buttonVariants({ size: "sm", variant: "ghost" })} text-lg hover:bg-blue-100 hover:text-blue-500`}
                  >
                    Train
                  </Link>
                  <Link
                    href="/documentation"
                    className={
                      buttonVariants({ size: "sm", variant: "ghost" }) +
                      " bg-blue-500 text-white flex items-center space-x-1 px-4 py-2 text-lg hover:bg-blue-600"
                    }
                  >
                    <span>Read Docs</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </SignedIn>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  )
}

export default Navbar