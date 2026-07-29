"use client";

import * as React from "react";
import { Check, ChevronDown, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { useFloatingPosition } from "@/lib/use-floating-position";

export type SelectOption = {
  label: React.ReactNode;
  value: string;
  disabled?: boolean;
};

export type SelectProps = {
  options: SelectOption[];
  value?: string | null;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Shows a search box inside the dropdown for long option lists. */
  searchable?: boolean;
  searchPlaceholder?: string;
  className?: string;
  triggerClassName?: string;
};

export function Select({
  options,
  value,
  onValueChange,
  placeholder = "Select...",
  disabled = false,
  searchable = false,
  searchPlaceholder = "Search...",
  className,
  triggerClassName,
}: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [highlighted, setHighlighted] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const searchRef = React.useRef<HTMLInputElement>(null);

  const { triggerRef, panelRef, style } = useFloatingPosition(open);

  const filtered = React.useMemo(() => {
    if (!searchable || !query) return options;

    return options.filter((o) => {
      if (typeof o.label !== "string") return false;

      return o.label.toLowerCase().includes(query.toLowerCase());
    });
  }, [options, query, searchable]);

  const selected = options.find((o) => o.value === value);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    if (open && searchable) {
      searchRef.current?.focus();
    }
    if (open) setHighlighted(0);
  }, [open, searchable]);

  function selectOption(option: SelectOption) {
    if (option.disabled) return;
    onValueChange?.(option.value);
    setOpen(false);
    setQuery("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const opt = filtered[highlighted];
      if (opt) selectOption(opt);
    }
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      onKeyDown={handleKeyDown}
    >
      <button
        ref={triggerRef as React.RefObject<HTMLButtonElement>}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "bg-input text-input-foreground border-input-border flex h-9 w-full items-center justify-between gap-2 rounded-md border px-3 text-sm shadow-xs transition-colors outline-none",
          "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:border-ring",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          triggerClassName,
        )}
      >
        <span className={cn("truncate", !selected && "text-muted-foreground")}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          ref={panelRef as React.RefObject<HTMLDivElement>}
          style={style}
          className="bg-popover border-input-border z-[60] flex flex-col overflow-hidden rounded-md border shadow-lg"
        >
          {searchable && (
            <div className="border-input-border relative shrink-0 border-b p-1.5">
              <Search className="absolute left-4 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="bg-transparent text-popover-foreground placeholder:text-muted-foreground w-full rounded-sm py-1 pl-6 pr-2 text-sm outline-none"
              />
            </div>
          )}

          <div className="overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <p className="text-muted-foreground px-2.5 py-2 text-sm">
                No options found.
              </p>
            ) : (
              filtered.map((option, index) => (
                <button
                  key={option.value}
                  type="button"
                  disabled={option.disabled}
                  onClick={() => selectOption(option)}
                  onMouseEnter={() => setHighlighted(index)}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 rounded-sm px-2.5 py-1.5 text-left text-sm text-popover-foreground transition-colors",
                    "disabled:pointer-events-none disabled:opacity-50",
                    highlighted === index && "bg-white/5",
                    option.value === value && "text-title",
                  )}
                >
                  <span className="truncate">{option.label}</span>
                  {option.value === value && (
                    <Check className="size-3.5 shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
