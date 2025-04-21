'use client'

import { SidebarLink } from '@/components/dashboard/sidebar'
import { IconHome, IconBrain, IconTrack, IconBook } from '@tabler/icons-react'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { useSidebar } from './sidebar'
import { motion } from 'framer-motion'

export default function DashboardNav() {
  const { open, animate } = useSidebar()
  
  const links = [
    {
      label: 'Home',
      href: '/',
      icon: <IconHome className="w-5 h-5 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: 'Statros',
      href: '/stratos',
      icon: <IconTrack className="w-5 h-5 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: 'Annotations',
      href: '/annotations',
      icon: <IconTrack className="w-5 h-5 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: 'Train',
      href: '/train',
      icon: <IconTrack className="w-5 h-5 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: 'Inference',
      href: '/inference',
      icon: <IconBrain className="w-5 h-5 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: 'Documentation',
      href: '/documentation',
      icon: <IconBook className="w-5 h-5 text-neutral-700 dark:text-neutral-200" />,
    },
  ]

  return (
    <>
      <div className="flex items-center mb-8 justify-between">
        <Link href="/" className="flex items-center">
          <motion.span
            animate={{
              display: animate ? (open ? "inline-block" : "none") : "inline-block",
              opacity: animate ? (open ? 1 : 0) : 1,
              width: animate ? (open ? "auto" : 0) : "auto",
              overflow: "hidden"
            }}
            className="text-2xl font-bold text-white whitespace-nowrap"
          >
            StratifyLabs
          </motion.span>
        </Link>
        <div className="md:hidden">
          <UserButton />
        </div>
      </div>
      
      <div className="hidden md:block mb-8">
        <UserButton />
      </div>

      <div className="flex flex-col gap-2">
        {links.map((link) => (
          <SidebarLink key={link.href} link={link} />
        ))}
      </div>
    </>
  )
}