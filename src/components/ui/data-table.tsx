"use client";

import * as React from "react";
import {
  Search as SearchIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  Inbox,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useFloatingPosition } from "@/lib/use-floating-position";
import { Portal } from "@/components/ui/portal";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────

export type DataTableColumn<T> = {
  /** Unique key for this column (used as React key + default accessor). */
  key: string;
  /** Header label. */
  header: string;
  /** Optional fixed width, e.g. "120px" or "20%". */
  width?: string;
  align?: "left" | "center" | "right";
  /** Custom cell renderer. Falls back to row[key] if omitted. */
  render?: (row: T, rowIndex: number) => React.ReactNode;
};

export type DataTableFilterOption = {
  label: string;
  value: string;
};

export type DataTableFilter = {
  /** Unique key identifying this filter, passed back in onFilterChange. */
  key: string;
  /** Label shown on the filter button when nothing is selected, e.g. "Status". */
  placeholder?: string;
  options: DataTableFilterOption[];
  /** Controlled selected value. null/undefined = reset ("All"). */
  value?: string | null;
  /** Label for the reset/"select all" option. Defaults to "All". */
  resetLabel?: string;
};

export type DataTablePagination = {
  page: number;
  pageSize: number;
  totalItems: number;
};

export type DataTableProps<T> = {
  title?: string;

  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: (row: T, index: number) => string | number;

  // Search
  searchable?: boolean;
  searchValue?: string;
  searchPlaceholder?: string;
  searchIcon?: React.ComponentType<{ className?: string }>;
  /** Where the icon sits inside the search box. Defaults to "left". */
  searchIconPosition?: "left" | "right";
  onSearchChange?: (value: string) => void;

  // Filters
  filters?: DataTableFilter[];
  onFilterChange?: (key: string, value: string | null) => void;

  // Pagination
  pagination?: DataTablePagination;
  onPageChange?: (page: number) => void;

  /** When true, renders skeleton rows instead of data. */
  loading?: boolean;
  /** Number of skeleton rows to render while loading. Defaults to pagination.pageSize or 5. */
  skeletonRows?: number;

  /** Fallback text shown when data is empty and not loading. */
  emptyMessage?: string;
  /** Full custom placeholder for the empty state (overrides emptyMessage). */
  emptyState?: React.ReactNode;
  className?: string;
};

// ────────────────────────────────────────────────────────────
// Filter dropdown (bg #0A0A0B / border #414144 / text #BFBFBF)
// ────────────────────────────────────────────────────────────

function FilterDropdown({
  filter,
  onChange,
}: {
  filter: DataTableFilter;
  onChange?: (key: string, value: string | null) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const resetLabel = filter.resetLabel ?? "All";

  const { triggerRef, panelRef, style } = useFloatingPosition(open, {
    matchWidth: false,
    align: "end",
  });

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      const insideTrigger = containerRef.current?.contains(target);
      const insidePanel = panelRef.current?.contains(target);
      if (!insideTrigger && !insidePanel) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [panelRef]);

  const selectedOption = filter.options.find((o) => o.value === filter.value);
  const label = selectedOption
    ? selectedOption.label
    : (filter.placeholder ?? "Filter");

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef as React.RefObject<HTMLButtonElement>}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-9 items-center gap-2 rounded-md border px-3 text-sm transition-colors",
          "bg-filter border-filter-border text-filter-foreground hover:border-ring/50",
        )}
      >
        <span className="whitespace-nowrap">{label}</span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 transition-transform text-filter-foreground/70",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <Portal>
          <div
            ref={panelRef as React.RefObject<HTMLDivElement>}
            style={style}
            className={cn(
              "z-[60] w-max min-w-[10rem] overflow-y-auto rounded-md border py-1 shadow-lg",
              "bg-filter border-filter-border",
            )}
          >
            <button
              type="button"
              onClick={() => {
                onChange?.(filter.key, null);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between px-3 py-1.5 text-sm text-filter-foreground hover:bg-white/5",
              )}
            >
              {resetLabel}
              {!filter.value && <Check className="size-3.5 text-primary" />}
            </button>
            {filter.options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange?.(filter.key, opt.value);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between px-3 py-1.5 text-sm text-filter-foreground hover:bg-white/5"
              >
                {opt.label}
                {filter.value === opt.value && (
                  <Check className="size-3.5 text-primary" />
                )}
              </button>
            ))}
          </div>
        </Portal>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Default empty state
// ────────────────────────────────────────────────────────────

function DefaultEmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
      <Inbox className="size-8 opacity-60" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// DataTable
// ────────────────────────────────────────────────────────────

export function DataTable<T>({
  title,
  columns,
  data,
  rowKey,
  searchable = false,
  searchValue,
  searchPlaceholder = "Search...",
  searchIcon: SearchIconComp = SearchIcon,
  searchIconPosition = "left",
  onSearchChange,
  filters = [],
  onFilterChange,
  pagination,
  onPageChange,
  loading = false,
  skeletonRows,
  emptyMessage = "No results.",
  emptyState,
  className,
}: DataTableProps<T>) {
  const [internalSearch, setInternalSearch] = React.useState(searchValue ?? "");
  const search = searchValue ?? internalSearch;

  function handleSearchChange(value: string) {
    if (searchValue === undefined) setInternalSearch(value);
    onSearchChange?.(value);
  }

  const totalPages = pagination
    ? Math.max(1, Math.ceil(pagination.totalItems / pagination.pageSize))
    : 1;

  const rangeStart = pagination
    ? (pagination.page - 1) * pagination.pageSize + 1
    : 0;
  const rangeEnd = pagination
    ? Math.min(pagination.page * pagination.pageSize, pagination.totalItems)
    : 0;

  const resolvedSkeletonRows = skeletonRows ?? pagination?.pageSize ?? 5;

  const hasHeaderRow = Boolean(title) || searchable || filters.length > 0;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {hasHeaderRow && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          {title ? (
            <h2 className="text-[16px] font-bold text-title">{title}</h2>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            {searchable && (
              <div className="relative">
                {searchIconPosition === "left" && (
                  <SearchIconComp className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                )}
                <Input
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder={searchPlaceholder}
                  className={cn(
                    "w-56",
                    searchIconPosition === "left" && "pl-8",
                    searchIconPosition === "right" && "pr-8",
                  )}
                />
                {searchIconPosition === "right" && (
                  <SearchIconComp className="absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                )}
              </div>
            )}

            {filters.map((filter) => (
              <FilterDropdown
                key={filter.key}
                filter={filter}
                onChange={onFilterChange}
              />
            ))}
          </div>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={col.key}
                style={col.width ? { width: col.width } : undefined}
                className={cn(
                  col.align === "center" && "text-center",
                  col.align === "right" && "text-right",
                )}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: resolvedSkeletonRows }).map((_, rowIndex) => (
              <TableRow key={`skeleton-${rowIndex}`}>
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    <div className="h-4 w-full max-w-[10rem] animate-pulse rounded bg-white/10" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="p-0">
                {emptyState ?? <DefaultEmptyState message={emptyMessage} />}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, rowIndex) => (
              <TableRow key={rowKey(row, rowIndex)}>
                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    className={cn(
                      col.align === "center" && "text-center",
                      col.align === "right" && "text-right",
                    )}
                  >
                    {col.render
                      ? col.render(row, rowIndex)
                      : (row as Record<string, React.ReactNode>)[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {pagination && !loading && (
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
          <span>
            Showing {pagination.totalItems === 0 ? 0 : rangeStart}–{rangeEnd} of{" "}
            {pagination.totalItems}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => onPageChange?.(pagination.page - 1)}
              className={cn(
                "flex size-8 items-center justify-center rounded-md border border-filter-border text-filter-foreground transition-colors",
                "hover:bg-white/5 disabled:opacity-40 disabled:pointer-events-none",
              )}
              aria-label="Previous page"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="px-1 tabular-nums">
              Page {pagination.page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={pagination.page >= totalPages}
              onClick={() => onPageChange?.(pagination.page + 1)}
              className={cn(
                "flex size-8 items-center justify-center rounded-md border border-filter-border text-filter-foreground transition-colors",
                "hover:bg-white/5 disabled:opacity-40 disabled:pointer-events-none",
              )}
              aria-label="Next page"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
