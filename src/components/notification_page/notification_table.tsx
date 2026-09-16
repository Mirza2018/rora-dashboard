"use client";

import { SearchX } from "lucide-react";
import * as React from "react";

import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { useGetNotificationsQuery } from "@/redux/api/adminApi"; // adjust to your actual path

// ── API-shaped notification type ─────────────────────────────
type Notification = {
  _id: string;
  title: string;
  message: string;
  audience: "all" | "operators" | "customers";
  status: "delivered" | "pending" | "failed";
  recipientCount: number;
  deliveredCount: number;
  createdAt: string;
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

const audienceLabel: Record<Notification["audience"], string> = {
  all: "All Users",
  operators: "Operators",
  customers: "Customers",
};

const NotificationTable = () => {
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);

  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetNotificationsQuery({ page, limit: PAGE_SIZE });

  const loading = isLoading || isFetching;
  const notifications = response?.data?.notifications ?? [];
  const meta = response?.data?.meta;

  // Client-side search on the currently loaded page — swap for a
  // server `search` param if/when the backend supports one.
  const filtered = React.useMemo(() => {
    if (!search) return notifications;
    const q = search.toLowerCase();
    return notifications.filter((n:any) => n.title.toLowerCase().includes(q));
  }, [notifications, search]);

  const columns: DataTableColumn<Notification>[] = [
    { key: "title", header: "Title", width: "160px" },
    {
      key: "audience",
      header: "Audience",
      render: (row) => <p>{audienceLabel[row.audience] ?? row.audience}</p>,
    },
    {
      key: "createdAt",
      header: "Date",
      render: (row) => <p>{formatDate(row.createdAt)}</p>,
    },
    {
      key: "deliveredCount",
      header: "Delivered",
      render: (row) => (
        <p>
          {row.deliveredCount}/{row.recipientCount}
        </p>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <StatusBadge status={row.status}>{row.status}</StatusBadge>
      ),
    },
  ];

  return (
    <main className="flex-1 ">
      <DataTable
        title="Recent Notifications"
        columns={columns}
        data={filtered}
        rowKey={(row) => row._id}
        loading={loading}
        searchable
        searchPlaceholder="Search by title ..."
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
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
              <p className="text-sm">No notifications sent yet.</p>
            </div>
          )
        }
      />
    </main>
  );
};

export default NotificationTable;
