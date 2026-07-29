"use client";

import { Eye, Pencil, SearchX, Trash2 } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/status-badge";

// ── Your data type ───────────────────────────────────────────
type Customer = {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: "complete" | "failed" | "pending";
  joined: string;
};

const ALL_CUSTOMERS: Customer[] = Array.from({ length: 47 }).map((_, i) => {
  const statuses: Customer["status"][] = ["complete", "failed", "pending"];
  const plans = ["Starter", "Pro", "Enterprise"];
  return {
    id: `CUS-${1000 + i}`,
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
    email: `user${i}@company.com`,
    plan: plans[i % plans.length],
    status: statuses[i % statuses.length],
    joined: `2026-0${(i % 6) + 1}-1${i % 9}`,
  };
});

const PAGE_SIZE = 8;

export default function CustomersPage() {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string | null>(null);
  const [planFilter, setPlanFilter] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);

  // Loading is a plain true/false you control however you like —
  // here it's simulated with a short timeout on every search/filter/page change,
  // exactly like you would while awaiting a real API call.
  const [loading, setLoading] = React.useState(false);

  // View / delete modal state
  const [viewRow, setViewRow] = React.useState<Customer | null>(null);
  const [deleteRow, setDeleteRow] = React.useState<Customer | null>(null);

  const filtered = React.useMemo(() => {
    return ALL_CUSTOMERS.filter((c) => {
      const matchesSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !statusFilter || c.status === statusFilter;
      const matchesPlan = !planFilter || c.plan === planFilter;
      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [search, statusFilter, planFilter]);

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Simulate a network call whenever a query-affecting value changes.
  React.useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [search, statusFilter, planFilter, page]);

  const columns: DataTableColumn<Customer>[] = [
    { key: "id", header: "ID", width: "110px" },
    {
      key: "name",
      header: "Customer",
      render: (row) => (
        <div>
          <p className="font-medium text-table-foreground">{row.name}</p>
          <p className="text-xs text-muted-foreground">{row.email}</p>
        </div>
      ),
    },
    { key: "plan", header: "Plan" },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <StatusBadge status={row.status}>{row.status}</StatusBadge>
      ),
    },
    { key: "joined", header: "Joined" },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (row) => (
        <div className="flex justify-end">
          <DropdownMenu
            items={[
              {
                label: "View details",
                icon: Eye,
                onClick: () => setViewRow(row),
              },
              {
                label: "Edit",
                icon: Pencil,
                onClick: () => console.log("edit", row.id),
              },
              {
                label: "Delete",
                icon: Trash2,
                variant: "destructive",
                onClick: () => setDeleteRow(row),
              },
            ]}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <main className="flex-1 p-6">
        <DataTable
          title="Customers"
          columns={columns}
          data={paged}
          rowKey={(row) => row.id}
          loading={loading}
          searchable
          searchPlaceholder="Search customers..."
          searchValue={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          filters={[
            {
              key: "status",
              placeholder: "Status",
              value: statusFilter,
              options: [
                { label: "Complete", value: "complete" },
                { label: "Failed", value: "failed" },
                { label: "Pending", value: "pending" },
              ],
            },
            {
              key: "plan",
              placeholder: "Plan",
              value: planFilter,
              options: [
                { label: "Starter", value: "Starter" },
                { label: "Pro", value: "Pro" },
                { label: "Enterprise", value: "Enterprise" },
              ],
            },
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
      <Modal
        open={!!viewRow}
        onClose={() => setViewRow(null)}
        title="Customer details"
        description={viewRow?.id}
      >
        {viewRow && (
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Name</dt>
              <dd className="text-foreground font-medium">{viewRow.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="text-foreground">{viewRow.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Plan</dt>
              <dd className="text-foreground">{viewRow.plan}</dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="text-muted-foreground">Status</dt>
              <dd>
                <StatusBadge status={viewRow.status}>
                  {viewRow.status}
                </StatusBadge>
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Joined</dt>
              <dd className="text-foreground">{viewRow.joined}</dd>
            </div>
          </dl>
        )}
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        open={!!deleteRow}
        onClose={() => setDeleteRow(null)}
        title="Delete customer"
        description={`Are you sure you want to delete ${deleteRow?.name}? This can't be undone.`}
        footer={
          <>
            <Button variant="cancel" onClick={() => setDeleteRow(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                // call your delete API here
                setDeleteRow(null);
              }}
            >
              Delete
            </Button>
          </>
        }
      />
    </>
  );
}
