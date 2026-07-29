"use client";

import { Check, Eye, SearchX, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardDescription, CardHeader } from "../ui/card";
import { DropdownMenu } from "../ui/dropdown-menu";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

// ── Your data type ───────────────────────────────────────────
type Call = {
  id: string;
  name: string;
  charged: string;
  method: "PayPal" | "Credit Card" | "Bank" | "Payoneer";
  joined: string;
  status: "paid" | "rejected" | "pending";
};

const ALL_CUSTOMERS: Call[] = Array.from({ length: 47 }).map((_, i) => {
  const statuses: Call["status"][] = ["paid", "rejected", "pending"];
  const methods: Call["method"][] = [
    "PayPal",
    "Credit Card",
    "Bank",
    "Payoneer",
  ];
  return {
    id: `PO-${2204 + i}`,

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
    charged: `AED ${(i % 9) + 1 + 1000}`,
    method: methods[i % methods.length],
    joined: `2026-0${(i % 6) + 1}-1${i % 9}`,
    status: statuses[i % statuses.length],
  };
});

const PAGE_SIZE = 8;
const PayoutsTable = () => {
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
  const [approveRow, setApproveRow] = React.useState<Call | null>(null);

  const filtered = React.useMemo(() => {
    return ALL_CUSTOMERS.filter((c) => {
      const matchesSearch =
        !search || c.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !statusFilter || c.status === statusFilter;
   
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Simulate a network call whenever a query-affecting value changes.
  React.useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [search, statusFilter, planFilter, page]);

  const columns: DataTableColumn<Call>[] = [
    { key: "id", header: "Payout", width: "110px" },
    { key: "name", header: "Operator" },
    {
      key: "charged",
      header: "Amount",
      render: (row) => <p>{row.charged}</p>,
    },
    { key: "method", header: "Method" },
    { key: "joined", header: "Date" },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <StatusBadge status={row.status}>{row.status}</StatusBadge>
      ),
    },

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

    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (row) => (
        <div className="flex justify-end gap-1">
          <DropdownMenu
            items={[
              {
                label: "View details",
                icon: Eye,
                onClick: () => setViewRow(row),
              },
              {
                label: "Approve",
                icon: Check,
                onClick: () => setApproveRow(row),
              },
              {
                label: "Reject",
                icon: X,
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
      <main className="flex-1 ">
        <DataTable
          title="All Payouts"
          columns={columns}
          data={paged}
          rowKey={(row) => row.id}
          loading={loading}
          searchable
          searchPlaceholder="Search Operator id, amount ..."
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
                { label: "Paid", value: "paid" },
                { label: "Rejected", value: "rejected" },
                { label: "Pending", value: "pending" },
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
        title={`Payout ${viewRow?.id}`}
        description={`Requested by ${viewRow?.name}`}
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
                setDeleteRow(null);
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
                      Amount
                    </dt>
                    <dd className="font-medium text-white">
                      {viewRow?.charged}
                    </dd>
                  </div>
                  <div className="flex justify-between items-center">
                    <dt className="text-muted-foreground text-sm flex gap-1 items-center">
                      Method
                    </dt>
                    <dd className="font-medium text-white">Bank</dd>
                  </div>
                  <div className="flex justify-between items-center">
                    <dt className="text-muted-foreground text-sm flex gap-1 items-center">
                      Bank Name
                    </dt>
                    <dd className="font-medium text-white">
                      Standard Chartered Bank
                    </dd>
                  </div>
                  <div className="flex justify-between items-center">
                    <dt className="text-muted-foreground text-sm flex gap-1 items-center">
                      Account Numbers
                    </dt>
                    <dd className="font-medium text-white">1835693763</dd>
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
              <p className="text-sm">Poor call quality, kept dropping</p>
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
        title={`Reject payout ${deleteRow?.id}`}
        description={`The operator will be notified with the reason and funds will remain available.`}
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
              Reject payout
            </Button>
          </>
        }
      >
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-xs font-medium">
            Reason (required)
          </Label>
          <Textarea rows={6} id="name" placeholder="please write the reason" />
        </div>
      </Modal>
      <Modal
        open={!!approveRow}
        onClose={() => setApproveRow(null)}
        title={`Approve payout ${approveRow?.id}`}
        description={`AED 1,840.00 will be transferred to Emirates NBD ••• 4421. Funds are typically credited within 1–3 business days.`}
        footer={
          <>
            <Button variant="cancel" onClick={() => setApproveRow(null)}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={() => {
                // call your delete API here
                setApproveRow(null);
              }}
            >
              Approve & process
            </Button>
          </>
        }
      />
    </>
  );
};

export default PayoutsTable;
