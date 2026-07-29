"use client";

import { Banknote, Eye, Pencil, SearchX, Trash2 } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardDescription, CardHeader } from "../ui/card";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

// ── Your data type ───────────────────────────────────────────
type Call = {
  id: string;
  dispute_id: string;
  name: string;
  operator: string;
  charged: string;
  reason: string;
  status: "open" | "resolved" | "rejected";
  joined: string;
};
 
const ALL_CUSTOMERS: Call[] = Array.from({ length: 47 }).map((_, i) => {
  const statuses: Call["status"][] = ["open", "resolved", "rejected"];
  return {
    id: `C-${1000 + i}`,
    dispute_id: `DP-${1000 + i}`,

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
    charged: `AED ${(i % 9) + 1}`,
    reason: [
      "Operator didn't connect to Eritrea",
      "Connection timeout in Somalia",
      "No response from the operator",
      "No response from the operator",
      "Operator failed to connect to Nigeria",
      "Connection issues in Ghana",
    ][i % 6],
    status: statuses[i % statuses.length],
    joined: `2026-0${(i % 6) + 1}-1${i % 9}`,
  };
});

const PAGE_SIZE = 8;
const DisputesTable = () => {
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
      const matchesStatus = !statusFilter || c.status === statusFilter;
      // const matchesPlan = !planFilter || c.plan === planFilter;
      return matchesSearch && matchesStatus
    });
  }, [search, statusFilter]);
setViewRow;
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Simulate a network call whenever a query-affecting value changes.
  React.useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [search, statusFilter, planFilter, page]);

  const columns: DataTableColumn<Call>[] = [
    { key: "dispute_id", header: "Dispute", width: "110px" },
    { key: "id", header: "Call", width: "110px" },
    { key: "name", header: "Customer" },
    { key: "operator", header: "Operator" },
    {
      key: "charged",
      header: "Amount",
      render: (row) => <p>{row.charged}</p>,
    },
    {
      key: "reason",
      header: "Reason",
      render: (row) => <p>{row.reason}</p>,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <StatusBadge status={row.status}>{row.status}</StatusBadge>
      ),
    },
    { key: "joined", header: "Date" },

    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (row) => (
        <div className="flex justify-end gap-1">
          <Button
            variant={"outline"}
            onClick={() => setViewRow(row)}
            className=""
            aria-label="Review"
          >
            Review
          </Button>
        </div>
      ),
    },
  ];
  return (
    <>
      <main className="flex-1 ">
        <DataTable
          title="All Disputes"
          columns={columns}
          data={paged}
          rowKey={(row) => row.id}
          loading={loading}
          searchable
          searchPlaceholder="Search call id, number ..."
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
                { label: "Open", value: "open" },
                { label: "Resolved", value: "resolved" },
                { label: "Rejected", value: "rejected" },
              ],
            },
          ]}
          onFilterChange={(key, value) => {
            if (key === "status") setStatusFilter(value);
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
        title={`Dispute ${viewRow?.dispute_id}`}
        description={`${viewRow?.name}. vs ${viewRow?.operator}`}
        footer={
          <>
            <Button
              variant="outline"
              className="text-status-failed border-status-failed!"
              onClick={() => setViewRow(null)}
            >
              Reject Claim
            </Button>
            <Button
              variant="default"
              onClick={() => {
                // call your delete API here
                setViewRow(null);
              }}
            >
              Resolve with refund
            </Button>
          </>
        }
      >
        {viewRow && (
          <Card>
            <CardHeader>
              {/* <CardTitle className="text-2xl">0</CardTitle> */}
              <CardDescription>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <dt className="text-muted-foreground text-sm flex gap-1 items-center">
                      Call
                    </dt>
                    <dd className="font-medium text-white">{viewRow?.id}</dd>
                  </div>
                  <div className="flex justify-between items-center">
                    <dt className="text-muted-foreground text-sm flex gap-1 items-center">
                      Amount
                    </dt>
                    <dd className="font-medium text-white">
                      {viewRow?.charged}
                    </dd>
                  </div>
                  <div className="flex justify-between items-center">
                    <dt className="text-muted-foreground text-sm flex gap-1 items-center">
                      Date
                    </dt>
                    <dd className="font-medium text-white">
                      {viewRow?.joined}
                    </dd>
                  </div>
                  <div className="flex justify-between items-center">
                    <dt className="text-muted-foreground text-sm flex gap-1 items-center">
                      Status
                    </dt>
                    <dd className="font-medium text-white">
                      {viewRow?.status}
                    </dd>
                  </div>
                </dl>
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        <Card>
          <CardHeader>
            {/* <CardTitle className="text-2xl">0</CardTitle> */}
            <CardDescription>
              <p className="text-white font-semibold">Customer claim</p>
              <p className="text-sm">{viewRow?.reason}</p>
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-xs font-medium">
            Email when ready
          </Label>
          <Textarea
            rows={6}
            id="name"
            placeholder="What you found, who you contacted ..."
          />
        </div>
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
};

export default DisputesTable;
