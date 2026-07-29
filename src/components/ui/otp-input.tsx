"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export type OtpInputProps = {
  length?: number
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
  hasError?: boolean
}

export function OtpInput({
  length = 4,
  value,
  onChange,
  disabled,
  className,
  hasError,
}: OtpInputProps) {
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])
  const digits = React.useMemo(() => {
    const arr = value.split("").slice(0, length)
    while (arr.length < length) arr.push("")
    return arr
  }, [value, length])

  function setDigit(index: number, digit: string) {
    const next = [...digits]
    next[index] = digit
    onChange(next.join(""))
  }

  function handleChange(index: number, raw: string) {
    const digit = raw.replace(/\D/g, "").slice(-1)
    setDigit(index, digit)
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length)
    if (!pasted) return
    onChange(pasted.padEnd(length, "").slice(0, length).replace(/ /g, ""))
    const focusIndex = Math.min(pasted.length, length - 1)
    inputRefs.current[focusIndex]?.focus()
  }

  return (
    <div className={cn("flex justify-center gap-3", className)}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el
          }}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          disabled={disabled}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className={cn(
            "bg-input text-input-foreground border-input-border h-12 w-12 rounded-md border text-center text-lg font-medium shadow-xs outline-none transition-colors",
            "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:border-ring",
            "disabled:pointer-events-none disabled:opacity-50",
            hasError && "border-status-failed"
          )}
        />
      ))}
    </div>
  )
}
