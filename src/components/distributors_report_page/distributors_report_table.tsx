"use client";

import { SearchX } from "lucide-react";
import * as React from "react";

import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetDistributorsTransferQuery } from "@/redux/api/adminApi"; // adjust to your actual path

// ── API-shaped transfer type ─────────────────────────────────
type Transfer = {
  _id: string;
  fromUserId: { _id: string; name: string };
  toUserId: { _id: string; name: string };
  minutes: number;
  kind: "PEER" | "ADMIN_RESERVE_GRANT" | string;
  createdAt: string;
  balanceAfter: number;
};

const PAGE_SIZE = 20;

const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const kindLabel: Record<string, string> = {
  PEER: "Peer transfer",
  ADMIN_RESERVE_GRANT: "Admin grant",
};

const DistributorsReportTable = () => {
  const [page, setPage] = React.useState(1);

  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetDistributorsTransferQuery({ page, limit: PAGE_SIZE });

  const loading = isLoading || isFetching;
  const transfers = response?.data?.transfers ?? [];
  const meta = response?.data?.meta;

  const columns: DataTableColumn<Transfer>[] = [
    {
      key: "fromUserId",
      header: "From",
      render: (row) => <p>{row.fromUserId?.name ?? "—"}</p>,
    },
    {
      key: "toUserId",
      header: "To",
      render: (row) => <p>{row.toUserId?.name ?? "—"}</p>,
    },
    {
      key: "minutes",
      header: "Minutes",
      render: (row) => <p>{row.minutes.toLocaleString()}</p>,
    },
    {
      key: "kind",
      header: "Type",
      render: (row) => <p>{kindLabel[row.kind] ?? row.kind}</p>,
    },
    {
      key: "balanceAfter",
      header: "Balance after",
      render: (row) => <p>{row.balanceAfter.toLocaleString()}</p>,
    },
    {
      key: "createdAt",
      header: "Date",
      render: (row) => <p>{formatDateTime(row.createdAt)}</p>,
    },
  ];

  return (
    <main className="flex-1 ">
      <DataTable
        title="Transfer history"
        columns={columns}
        data={transfers}
        rowKey={(row) => row._id}
        loading={loading}
        filters={[]}
        pagination={{
          page,
          pageSize: PAGE_SIZE,
          totalItems: meta?.total ?? 0,
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
              <p className="text-sm">No transfers recorded yet.</p>
            </div>
          )
        }
      />
    </main>
  );
};

export default DistributorsReportTable;
