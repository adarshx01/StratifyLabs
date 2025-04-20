// filepath: c:\Users\krish\OneDrive\Desktop\StratifyLabs\src\components\TopBarWrapper.tsx
'use client'

import TopBar from './TopBar'
import { usePathname } from 'next/navigation'

const TopBarWrapper = () => {
  const pathname = usePathname()

  // Render TopBar only on the main page ("/")
  if (pathname !== '/') return null

  return <TopBar />
}

export default TopBarWrapper