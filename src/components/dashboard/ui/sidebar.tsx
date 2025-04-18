"use client"

import * as React from "react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(({ className, ...props }, ref) => (
  <div className={`hidden border-r bg-popover text-popover-foreground lg:block ${className}`} ref={ref} {...props} />
))
Sidebar.displayName = "Sidebar"

interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarContent = React.forwardRef<HTMLDivElement, SidebarContentProps>(({ className, ...props }, ref) => (
  <div className={`flex flex-col space-y-1 p-6 ${className}`} ref={ref} {...props} />
))
SidebarContent.displayName = "SidebarContent"

interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarHeader = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(({ className, ...props }, ref) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} ref={ref} {...props} />
))
SidebarHeader.displayName = "SidebarHeader"

interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarFooter = React.forwardRef<HTMLDivElement, SidebarFooterProps>(({ className, ...props }, ref) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} ref={ref} {...props} />
))
SidebarFooter.displayName = "SidebarFooter"

interface SidebarMenuProps extends React.HTMLAttributes<HTMLUListElement> {}

const SidebarMenu = React.forwardRef<HTMLUListElement, SidebarMenuProps>(({ className, ...props }, ref) => (
  <ul className={`grid gap-1 ${className}`} ref={ref} {...props} />
))
SidebarMenu.displayName = "SidebarMenu"

interface SidebarMenuItemProps extends React.HTMLAttributes<HTMLLIElement> {}

const SidebarMenuItem = React.forwardRef<HTMLLIElement, SidebarMenuItemProps>(({ className, ...props }, ref) => (
  <li className={`${className}`} ref={ref} {...props} />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

interface SidebarMenuButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  isActive?: boolean
}

const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className, isActive, ...props }, ref) => <button className={`${className}`} ref={ref} {...props} />,
)
SidebarMenuButton.displayName = "SidebarMenuButton"

interface SidebarMenuGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarMenuGroup = React.forwardRef<HTMLDivElement, SidebarMenuGroupProps>(({ className, ...props }, ref) => (
  <div className={`grid gap-2 ${className}`} ref={ref} {...props} />
))
SidebarMenuGroup.displayName = "SidebarMenuGroup"

interface SidebarMenuGroupContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarMenuGroupContent = React.forwardRef<HTMLDivElement, SidebarMenuGroupContentProps>(
  ({ className, ...props }, ref) => <div className={`${className}`} ref={ref} {...props} />,
)
SidebarMenuGroupContent.displayName = "SidebarMenuGroupContent"

interface SidebarMenuGroupLabelProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarMenuGroupLabel = React.forwardRef<HTMLDivElement, SidebarMenuGroupLabelProps>(
  ({ className, ...props }, ref) => <div className={`px-2 text-sm font-medium ${className}`} ref={ref} {...props} />,
)
SidebarMenuGroupLabel.displayName = "SidebarMenuGroupLabel"

interface SidebarProviderProps {
  children: React.ReactNode
}

const SidebarContext = React.createContext({})

const SidebarProvider = ({ children }: SidebarProviderProps) => {
  return <SidebarContext.Provider value={{}}>{children}</SidebarContext.Provider>
}

interface SidebarTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {}

const SidebarTrigger = React.forwardRef<HTMLButtonElement, SidebarTriggerProps>(({ className, ...props }, ref) => (
  <button
    className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 ${className}`}
    ref={ref}
    {...props}
  >
    Menu
  </button>
))
SidebarTrigger.displayName = "SidebarTrigger"

export {
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
  SidebarProvider,
  SidebarTrigger,
}

