'use client'

import NavBar from './Navbar'
import { usePathname } from 'next/navigation'

const NavBarWrapper = () => {
  const pathname = usePathname()

  // Render NavBar only on the main page ("/")
  if (pathname !== '/') return null

  return <NavBar />
}

export default NavBarWrapper