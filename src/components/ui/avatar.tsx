"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function Avatar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full bg-sidebar-accent",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  onError,
  ...props
}: React.ComponentProps<"img">) {
  const [errored, setErrored] = React.useState(false)
  if (errored) return null

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      data-slot="avatar-image"
      className={cn("aspect-square size-full object-cover", className)}
      onError={(e) => {
        setErrored(true)
        onError?.(e)
      }}
      {...props}
    />
  )
}

function AvatarFallback({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center text-xs font-medium text-sidebar-accent-foreground",
        className
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }
