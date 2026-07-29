"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type RadioOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

export type RadioGroupProps = {
  options: RadioOption[];
  value?: string | null;
  onValueChange?: (value: string) => void;
  orientation?: "vertical" | "horizontal";
  disabled?: boolean;
  className?: string;
  itemClassName?: string;
  selectedItemClassName?: string;
};

export function RadioGroup({
  options,
  value,
  onValueChange,
  orientation = "vertical",
  disabled,
  className,
  itemClassName,
  selectedItemClassName,
}: RadioGroupProps) {
  return (
    <div
      role="radiogroup"
      className={cn(
        "flex gap-x-5 gap-y-2",
        orientation === "vertical" ? "flex-col" : "flex-row flex-wrap",
        className,
      )}
    >
      {options.map((option) => {
        const checked = value === option.value;
        const isDisabled = disabled || option.disabled;
        return (
          <label
            key={option.value}
            className={cn(
              "flex items-center gap-2 text-sm",
              isDisabled ? "pointer-events-none opacity-50" : "cursor-pointer",
              itemClassName,
              checked && selectedItemClassName,
            )}
          >
            <span
              role="radio"
              aria-checked={checked}
              onClick={() => !isDisabled && onValueChange?.(option.value)}
              className={cn(
                "flex size-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                "border-input-border bg-input",
                checked && "border-0 bg-primary!",
              )}
            >
              {checked && <span className="size-1.5 rounded-full  bg-white" />}
            </span>
            {option.label}
          </label>
        );
      })}
    </div>
  );
}
