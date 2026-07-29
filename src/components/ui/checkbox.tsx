"use client"

import * as React from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

export type CheckboxProps = {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  id?: string
  disabled?: boolean
  className?: string
}

export function Checkbox({
  checked = false,
  onCheckedChange,
  id,
  disabled,
  className,
}: CheckboxProps) {
  return (
    <button
      type="button"
      id={id}
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        "flex size-4 shrink-0 items-center justify-center rounded border transition-colors outline-none",
        "border-input-border bg-input",
        "focus-visible:ring-2 focus-visible:ring-ring/50",
        checked && "bg-primary border-primary",
        disabled && "pointer-events-none opacity-50",
        className
      )}
    >
      {checked && <Check className="size-3 text-primary-foreground" strokeWidth={3} />}
    </button>
  )
}
