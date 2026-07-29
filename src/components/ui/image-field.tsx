"use client"

import * as React from "react"
import { ImageIcon, X } from "lucide-react"

import { Button } from "@/components/ui/button"

export type ImageFieldProps = {
  value?: File | null
  onChange: (file: File | null) => void
  accept?: string
  disabled?: boolean
}

export function ImageField({
  value,
  onChange,
  accept = "image/*",
  disabled,
}: ImageFieldProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [preview, setPreview] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value)
      setPreview(url)
      return () => URL.revokeObjectURL(url)
    }
    setPreview(null)
  }, [value])

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
        className="border-input-border bg-input flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-md border"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Preview" className="size-full object-cover" />
        ) : (
          <ImageIcon className="text-muted-foreground size-5" />
        )}
      </button>

      <div className="flex flex-col gap-1.5">
        <Button
          type="button"
          variant="cancel"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
        >
          {value ? "Change image" : "Upload image"}
        </Button>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-status-failed flex items-center gap-1 text-xs"
          >
            <X className="size-3" /> Remove
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        disabled={disabled}
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
    </div>
  )
}
