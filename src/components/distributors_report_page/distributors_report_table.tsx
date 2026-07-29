"use client";

import { Eye, Pencil, SearchX, Trash2 } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/status-badge";

// ── Your data type ───────────────────────────────────────────
type Call = {
  id: string;
  name: string;
  operator: string;
  minutes: string;
  balance: string;
};

const ALL_CUSTOMERS: Call[] = Array.from({ length: 47 }).map((_, i) => {
  return {
    id: `TX-${1000 + i}`,
    joined: `2026-0${(i % 6) + 1}-1${i % 9}`,
    name: [
      "Marcus Lee",
      "Aria Chen",
      "Sofia Ruiz",
      "Devon Park",
      "Priya Patel",
      "Noah Kim",
      "Elena Petrova",
      "Liam Osei",
    ][i % 8],
    operator: [
      "Priya Patel",
      "Noah Kim",
      "Elena Petrova",
      "Liam Osei",
      "Marcus Lee",
      "Aria Chen",
      "Sofia Ruiz",
      "Devon Park",
    ][i % 8],
    minutes: `${(i % 6)+1} min ${i % 9} sec`,
    balance: `${(i % 2) + 1}${i % 5}${i % 7}`,
  };
});

const PAGE_SIZE = 8;
const DistributorsReportTable = () => {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string | null>(null);
  const [planFilter, setPlanFilter] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);

  // Loading is a plain true/false you control however you like —
  // here it's simulated with a short timeout on every search/filter/page change,
  // exactly like you would while awaiting a real API call.
  const [loading, setLoading] = React.useState(false);

  // View / delete modal state
  const [viewRow, setViewRow] = React.useState<Call | null>(null);
  const [deleteRow, setDeleteRow] = React.useState<Call | null>(null);

  const filtered = React.useMemo(() => {
    return ALL_CUSTOMERS.filter((c) => {
      const matchesSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.operator.toLowerCase().includes(search.toLowerCase());

      return matchesSearch;
    });
  }, [search]);

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Simulate a network call whenever a query-affecting value changes.
  React.useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [search, statusFilter, planFilter, page]);

  const columns: DataTableColumn<Call>[] = [
    { key: "id", header: "Transaction ID", width: "110px" },
    { key: "joined", header: "Date & time" },
    { key: "name", header: "Distributor" },
    { key: "operator", header: "Recipient" },
    { key: "minutes", header: "Minutes" },
    { key: "balance", header: "Balance after" },

    // {
    //   key: "name",
    //   header: "Customer",
    //   render: (row) => (
    //     <div>
    //       <p className="font-medium text-table-foreground">{row.name}</p>
    //       <p className="text-xs text-muted-foreground">{row.email}</p>
    //     </div>
    //   ),
    // },

    // {
    //   key: "actions",
    //   header: "",
    //   align: "right",
    //   render: (row) => (
    //     <div className="flex justify-end gap-1">
    //       <button
    //         onClick={() => setViewRow(row)}
    //         className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-white/5"
    //         aria-label="View details"
    //       >
    //         <Eye className="size-4" />
    //       </button>
    //       <button className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-white/5">
    //         <Pencil className="size-4" />
    //       </button>
    //       <button
    //         onClick={() => setDeleteRow(row)}
    //         className="p-1.5 rounded-md text-muted-foreground hover:text-status-failed hover:bg-white/5"
    //         aria-label="Delete"
    //       >
    //         <Trash2 className="size-4" />
    //       </button>
    //     </div>
    //   ),
    // },
  ];
  return (
    <>
      <main className="flex-1 ">
        <DataTable
          title="Transfer History"
          columns={columns}
          data={paged}
          rowKey={(row) => row.id}
          loading={loading}
          // searchable
          searchPlaceholder="Search call id, number ..."
          searchValue={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          filters={[
            
          ]}
          onFilterChange={(key, value) => {
            if (key === "status") setStatusFilter(value);
            if (key === "plan") setPlanFilter(value);
            setPage(1);
          }}
          pagination={{
            page,
            pageSize: PAGE_SIZE,
            totalItems: filtered.length,
          }}
          onPageChange={setPage}
          emptyState={
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
              <SearchX className="size-8 opacity-60" />
              <p className="text-sm">
                No customers match your search or filters.
              </p>
            </div>
          }
        />
      </main>

      {/* View details modal */}

    </>
  );
};

export default DistributorsReportTable;
