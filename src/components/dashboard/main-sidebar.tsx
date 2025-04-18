"use client"

import * as React from "react"
import {
  BarChart3,
  BookOpen,
  Code2,
  FileCode2,
  Flame,
  Home,
  type LucideIcon,
  MessageSquare,
  Settings,
  Trophy,
  Users2,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuGroup,
  SidebarMenuGroupContent,
  SidebarMenuGroupLabel,
} from "@/components/dashboard/ui/sidebar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SidebarItem {
  title: string
  icon: LucideIcon
  variant?: "default" | "ghost"
  isActive?: boolean
}

interface SidebarGroup {
  title: string
  items: SidebarItem[]
}

const sidebarGroups: SidebarGroup[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", icon: Home, isActive: true },
      { title: "Problems", icon: FileCode2 },
      { title: "Contests", icon: Trophy },
      { title: "Learn", icon: BookOpen },
    ],
  },
  {
    title: "Community",
    items: [
      { title: "Discuss", icon: MessageSquare },
      { title: "Interview", icon: Users2 },
      { title: "Store", icon: Flame },
    ],
  },
  {
    title: "Progress",
    items: [
      { title: "Study Plan", icon: BarChart3 },
      { title: "Solutions", icon: Code2 },
    ],
  },
]

export function MainSidebar() {
  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b px-2 py-4">
        <div className="flex items-center gap-2 px-2">
          <div className="rounded-lg bg-primary/10 p-1">
            <FileCode2 className="h-6 w-6 text-primary" />
          </div>
          <div className="font-semibold">CodeTracker</div>
        </div>
      </SidebarHeader>
      <ScrollArea className="flex-1">
        <SidebarContent>
          {sidebarGroups.map((group, index) => (
            <React.Fragment key={group.title}>
              <SidebarMenuGroup>
                <SidebarMenuGroupLabel>{group.title}</SidebarMenuGroupLabel>
                <SidebarMenuGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={item.isActive}>
                          <Button
                            variant="ghost"
                            className={cn("w-full justify-start gap-2", item.isActive && "bg-accent")}
                          >
                            <item.icon className="h-4 w-4" />
                            {item.title}
                          </Button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarMenuGroupContent>
              </SidebarMenuGroup>
              {index < sidebarGroups.length - 1 && <div className="my-4" />}
            </React.Fragment>
          ))}
        </SidebarContent>
      </ScrollArea>
      <SidebarFooter className="border-t p-4">
        <Button variant="ghost" className="w-full justify-start gap-2">
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}

