"use client"

import * as React from "react"
import { PanelLeft } from "lucide-react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_ICON = "3.5rem"
const SIDEBAR_STORAGE_KEY = "sidebar_state"

type SidebarContextType = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextType | null>(null)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

function SidebarProvider({
  defaultOpen = true,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<"div"> & { defaultOpen?: boolean }) {
  const [open, setOpenState] = React.useState(defaultOpen)

  React.useEffect(() => {
    const stored = window.localStorage.getItem(SIDEBAR_STORAGE_KEY)
    if (stored !== null) setOpenState(stored === "true")
  }, [])

  const setOpen = React.useCallback((value: boolean) => {
    setOpenState(value)
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(value))
  }, [])

  const toggleSidebar = React.useCallback(() => setOpen(!open), [open, setOpen])

  const state: SidebarContextType["state"] = open ? "expanded" : "collapsed"

  return (
    <SidebarContext.Provider value={{ state, open, setOpen, toggleSidebar }}>
      <div
        data-slot="sidebar-wrapper"
        className={cn("flex min-h-screen w-full bg-background", className)}
        style={style}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

function Sidebar({ className, children, ...props }: React.ComponentProps<"div">) {
  const { state } = useSidebar()

  return (
    <aside
      data-slot="sidebar"
      data-state={state}
      className={cn(
        "bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex h-screen flex-col shrink-0 overflow-hidden transition-[width] duration-200 ease-linear",
        className
      )}
      style={{
        width: state === "expanded" ? SIDEBAR_WIDTH : SIDEBAR_WIDTH_ICON,
      }}
      {...props}
    >
      {children}
    </aside>
  )
}

function SidebarTrigger({ className, ...props }: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      className={cn("size-8", className)}
      onClick={toggleSidebar}
      aria-label="Toggle sidebar"
      {...props}
    >
      <PanelLeft className="size-4" />
    </Button>
  )
}

function SidebarInset({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-inset"
      className={cn("flex flex-1 flex-col min-w-0", className)}
      {...props}
    />
  )
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      className={cn(
        "flex h-14 shrink-0 items-center border-b border-sidebar-border px-3",
        className
      )}
      {...props}
    />
  )
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn("flex-1 overflow-y-auto overflow-x-hidden px-2 py-3", className)}
      {...props}
    />
  )
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn("shrink-0 border-t border-sidebar-border p-2", className)}
      {...props}
    />
  )
}

function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu"
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      {...props}
    />
  )
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-item"
      className={cn("relative list-none", className)}
      {...props}
    />
  )
}

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    isActive?: boolean
    tooltip?: string
    asChild?: boolean
  }
>(({ className, isActive = false, tooltip, asChild = false, children, ...props }, ref) => {
  const { state } = useSidebar()
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      data-slot="sidebar-menu-button"
      data-active={isActive}
      title={state === "collapsed" ? tooltip : undefined}
      className={cn(
        "flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-colors overflow-hidden",
        "text-sidebar-foreground hover:bg-white/5",
        isActive && "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent",
        state === "collapsed" && "justify-center px-0",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  )
})
SidebarMenuButton.displayName = "SidebarMenuButton"

export {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarInset,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
}
