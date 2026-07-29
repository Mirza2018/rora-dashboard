"use client"

import * as React from "react"
import { MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { useFloatingPosition } from "@/lib/use-floating-position"
import { Portal } from "@/components/ui/portal"

export type DropdownMenuItem = {
  label: string
  icon?: React.ComponentType<{ className?: string }>
  onClick?: () => void
  /** "destructive" styles the item red (e.g. Delete). */
  variant?: "default" | "destructive"
  disabled?: boolean
}

export type DropdownMenuProps = {
  items: DropdownMenuItem[]
  /** Which edge of the trigger the panel aligns to. Defaults to "end" (right-aligned), typical for row actions. */
  align?: "start" | "end"
  /** Custom trigger content. Defaults to a three-dot (MoreHorizontal) icon button. */
  trigger?: React.ReactNode
  triggerClassName?: string
  disabled?: boolean
}

export function DropdownMenu({
  items,
  align = "end",
  trigger,
  triggerClassName,
  disabled,
}: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false)
  const { triggerRef, panelRef, style } = useFloatingPosition(open, {
    matchWidth: false,
    align,
    gap: 4,
  })

  React.useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node
      const insideTrigger = triggerRef.current?.contains(target)
      const insidePanel = panelRef.current?.contains(target)
      if (!insideTrigger && !insidePanel) setOpen(false)
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [open, triggerRef, panelRef])

  return (
    <>
      <button
        ref={triggerRef as React.RefObject<HTMLButtonElement>}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        aria-label="Open actions menu"
        className={cn(
          "flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors",
          "hover:bg-white/5 hover:text-foreground",
          "disabled:pointer-events-none disabled:opacity-50",
          open && "bg-white/5 text-foreground",
          triggerClassName
        )}
      >
        {trigger ?? <MoreHorizontal className="size-4" />}
      </button>

      {open && (
        <Portal>
          <div
            ref={panelRef as React.RefObject<HTMLDivElement>}
            style={style}
            className="bg-popover border-input-border z-[60] w-max min-w-[9rem] overflow-hidden rounded-md border py-1 shadow-lg"
          >
            {items.map((item, index) => {
              const Icon = item.icon
              return (
                <button
                  key={index}
                  type="button"
                  disabled={item.disabled}
                  onClick={() => {
                    item.onClick?.()
                    setOpen(false)
                  }}
                  className={cn(
                    "flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-sm transition-colors",
                    "text-popover-foreground hover:bg-white/5",
                    item.variant === "destructive" && "text-status-failed hover:bg-status-failed/10",
                    "disabled:pointer-events-none disabled:opacity-50"
                  )}
                >
                  {Icon && <Icon className="size-4 shrink-0" />}
                  <span className="truncate ">{item.label}</span>
                </button>
              )
            })}
          </div>
        </Portal>
      )}
    </>
  )
}
