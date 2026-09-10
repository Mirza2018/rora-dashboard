"use client";

import { SearchX } from "lucide-react";
import * as React from "react";

import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";

// ── API-shaped latest call type ─────────────────────────────
type LatestCall = {
  _id: string;
  callRef: string;
  customerId: { _id: string; name: string };
  destinationId: { _id: string; name: string };
  operatorId?: { _id: string; name: string };
  numberDialed: string;
  status:
    | "requested"
    | "assigned"
    | "dialing_customer"
    | "customer_connected"
    | "dialing_destination"
    | "destination_connected"
    | "conferencing"
    | "completed"
    | "failed"
    | "cancelled";
  createdAt: string;
  minutesUsed?: number;
};

const PAGE_SIZE = 8;

const formatDate = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

const statusBadgeMap: Record<LatestCall["status"], string> = {
  requested: "pending",
  assigned: "pending",
  dialing_customer: "pending",
  customer_connected: "pending",
  dialing_destination: "pending",
  destination_connected: "pending",
  conferencing: "pending",
  completed: "complete",
  failed: "failed",
  cancelled: "pending",
};

type OverviewTableProps = {
  calls?: LatestCall[]; // ← make optional
  loading?: boolean;
};

const OverviewTable = ({ calls = [], loading = false }: OverviewTableProps) => {
  const [page, setPage] = React.useState(1);

  const paged = calls.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const columns: DataTableColumn<LatestCall>[] = [
    { key: "callRef", header: "Call", width: "130px" },
    {
      key: "createdAt",
      header: "Date",
      render: (row) => <p>{formatDate(row.createdAt)}</p>,
    },
    {
      key: "customerId",
      header: "Customer",
      render: (row) => <p>{row.customerId?.name}</p>,
    },
    {
      key: "operatorId",
      header: "Operator",
      render: (row) => <p>{row.operatorId?.name ?? "—"}</p>,
    },
    {
      key: "destinationId",
      header: "Destination",
      render: (row) => <p>{row.destinationId?.name}</p>,
    },
    {
      key: "minutesUsed",
      header: "Min",
      render: (row) => <p>{row.minutesUsed ?? 0}</p>,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <StatusBadge status={statusBadgeMap[row.status] as any}>
          {row.status.replace(/_/g, " ")}
        </StatusBadge>
      ),
    },
  ];

  return (
    <main className="flex-1 lg:col-span-2">
      <DataTable
        title="Latest Calls"
        columns={columns}
        data={paged}
        rowKey={(row) => row._id}
        loading={loading}
        filters={[]}
        pagination={{
          page,
          pageSize: PAGE_SIZE,
          totalItems: calls.length,
        }}
        onPageChange={setPage}
        emptyState={
          loading ? (
            <div className="space-y-2 py-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
              <SearchX className="size-8 opacity-60" />
              <p className="text-sm">No recent calls to show.</p>
            </div>
          )
        }
      />
    </main>
  );
};

export default OverviewTable;
