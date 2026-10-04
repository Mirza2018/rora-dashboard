const fs = require('fs');
const file = 'src/components/calls_page/calls_table.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace STATUS_OPTIONS
content = content.replace(
  /const STATUS_OPTIONS: { label: string; value: CallStatus }\[\] = \[[\s\S]*?\];/,
  \const STATUS_OPTIONS: { label: string; value: CallStatus | "dropped" }[] = [
  { label: "Completed", value: "completed" },
  { label: "Failed", value: "failed" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Dropped", value: "dropped" },
  { label: "Requested", value: "requested" },
];\
);

// Replace DAYS_OPTIONS
content = content.replace(
  /const DAYS_OPTIONS = \[[\s\S]*?\];/,
  \const DAYS_OPTIONS = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last 7 days", value: "last7days" },
  { label: "Last 30 days", value: "last30days" },
  { label: "This month", value: "thismonth" },
  { label: "Custom Date Range", value: "custom" },
];\
);

// Add custom range states and formatting
content = content.replace(
  /const \[daysFilter, setDaysFilter\] = React\.useState<string \| null>\(null\);/,
  \const [daysFilter, setDaysFilter] = React.useState<string | null>("last30days");
  const [customFrom, setCustomFrom] = React.useState("");
  const [customTo, setCustomTo] = React.useState("");
  
  const formatDateForApi = (dateStr: string) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return \\\\-\-\\\\;
  };\
);

// Update useGetCallsQuery params
content = content.replace(
  /limit: 10,[\s\S]*?\.\.\.\(debouncedSearch \? { search: debouncedSearch } : {}\),/,
  \limit: 8,
    ...(statusFilter && statusFilter !== "all" ? { status: statusFilter } : {}),
    range: daysFilter || "last30days",
    ...(daysFilter === "custom" && customFrom && customTo 
        ? { from: formatDateForApi(customFrom), to: formatDateForApi(customTo) } 
        : {}),
    ...(debouncedSearch ? { search: debouncedSearch } : {}),\
);

// Add custom date inputs to JSX
content = content.replace(
  /<main className="flex-1 ">/,
  \<main className="flex-1 space-y-4">
        {daysFilter === "custom" && (
          <div className="flex items-center gap-2 justify-end px-1">
            <input 
              type="date" 
              value={customFrom} 
              onChange={(e) => setCustomFrom(e.target.value)} 
              className="flex h-9 w-[140px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
            <span className="text-muted-foreground">-</span>
            <input 
              type="date" 
              value={customTo} 
              onChange={(e) => setCustomTo(e.target.value)} 
              className="flex h-9 w-[140px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        )}\
);

// Also need to pass limit: 8 to pagination
content = content.replace(
  /pageSize: 10,/,
  \pageSize: 8,\
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
