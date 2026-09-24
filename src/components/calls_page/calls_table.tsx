"use client";

import { Eye, SearchX, X } from "lucide-react";
import * as React from "react";

import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Modal } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { useCancelCallMutation, useGetCallsQuery } from "@/redux/api/adminApi"; // adjust to your actual path
import { toast } from "sonner";
import { Button } from "../ui/button";
import { DropdownMenu } from "../ui/dropdown-menu";

// ── API-shaped call type ─────────────────────────────────────
type CallStatus =
  | "requested"
  | "assigned"
  | "dialing_customer"
  | "customer_connected"
  | "destination_connected"
  | "conferencing"
  | "completed"
  | "failed"
  | "cancelled";

type Call = {
  _id: string;
  callRef: string;
  customerId: { _id: string; name: string; phone: string };
  destinationId: { _id: string; name: string; prefix: string };
  operatorId?: { _id: string; name: string; phone: string };
  numberDialed: string;
  status: CallStatus;
  requestedAt: string;
  createdAt: string;
  endedAt?: string;
  customerConnectedAt?: string;
  costMoney?: number;
  minutesUsed?: number;
  failureReason?: string;
};

const STATUS_OPTIONS: { label: string; value: CallStatus }[] = [
  { label: "Requested", value: "requested" },
  { label: "Assigned", value: "assigned" },
  { label: "Dialing customer", value: "dialing_customer" },
  { label: "Customer connected", value: "customer_connected" },
  { label: "Dialing destination", value: "dialing_destination" },
  { label: "Destination connected", value: "destination_connected" },
  { label: "Conferencing", value: "conferencing" },
  { label: "Completed", value: "completed" },
  { label: "Failed", value: "failed" },
  { label: "Cancelled", value: "cancelled" },
];

const DAYS_OPTIONS = [
  { label: "Last 7 days", value: "7" },
  { label: "Last 15 days", value: "15" },
  { label: "Last 30 days", value: "30" },
];

// In-flight/live statuses map to a "pending"-style badge; completed/failed/
// cancelled map to their matching badge tokens. Adjust to match whatever
// variants StatusBadge actually supports.
const statusBadgeMap: Record<CallStatus, string> = {
  requested: "pending",
  assigned: "pending",
  dialing_customer: "pending",
  customer_connected: "pending",
  dialing_destination: "pending",
  destination_connected: "pending",
  conferencing: "pending",
  completed: "complete",
  failed: "failed",
  cancelled: "cancelled",
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

const formatDateTime = (iso?: string) => {
  if (!iso) return "—";
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

const formatDuration = (call: Call) => {
  if (call.minutesUsed != null) return `${call.minutesUsed} min`;
  if (call.customerConnectedAt && call.endedAt) {
    const ms =
      new Date(call.endedAt).getTime() -
      new Date(call.customerConnectedAt).getTime();
    if (ms > 0) {
      const totalSec = Math.round(ms / 1000);
      return `${Math.floor(totalSec / 60)} min ${totalSec % 60} sec`;
    }
  }
  return "—";
};

// Debounce a fast-changing value.
function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
}

const CallsTable = () => {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string | null>(null);
  const [daysFilter, setDaysFilter] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);

  const [viewRow, setViewRow] = React.useState<Call | null>(null);
  const [cancelCall, setCancelCall] = React.useState<Call | null>(null);
  const [cancelCallLoading, setCancelCallLoading] =
    React.useState<boolean>(false);
  const [cancelTheCall] = useCancelCallMutation();
  const debouncedSearch = useDebouncedValue(search, 400);

  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetCallsQuery({
    page,
    limit: 10,
    ...(statusFilter ? { status: statusFilter } : {}),
    ...(daysFilter ? { days: daysFilter } : {}),
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
  });

  const loading = isLoading || isFetching;
  const calls = response?.data?.calls ?? [];
  const meta = response?.data?.meta;

  const columns: DataTableColumn<Call>[] = [
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
      key: "duration",
      header: "Duration",
      render: (row) => <p>{formatDuration(row)}</p>,
    },
    {
      key: "costMoney",
      header: "Charged",
      render: (row) => <p>AED {row.costMoney ?? 0}</p>,
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
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (row) => {
        const items = [
          {
            label: "View details",
            icon: Eye,
            onClick: () => setViewRow(row),
          },
        ];

        if (
          row?.status == "requested" ||
          row?.status == "dialing_customer" ||
          row?.status == "assigned" ||
          row?.status == "customer_connected" ||
          row?.status == "destination_connected" ||
          row?.status == "conferencing"
        ) {
          items.push({
            label: "Call cancel",
            icon: X,
            variant: "destructive",
            onClick: () => setCancelCall(row),
          });
        }

        return (
          <div className="flex justify-end gap-1">
            <DropdownMenu items={items as any} />
          </div>
        );
      },
    },
  ];

  // <>
  //   <button
  //     onClick={() => setViewRow(row)}
  //     className="text-xs font-medium text-primary hover:underline"
  //   >
  //     View
  //   </button>
  //   <button
  //     onClick={() => setCancelCall(row)}
  //     className="text-xs font-medium text-destructive hover:underline"
  //   >
  //     Cancel
  //   </button>
  // </>;

  const handleCancelCall = async () => {
    if (!cancelCall) return;
    setCancelCallLoading(true);
    const toastId = toast.loading("Call cancel request processing...");
    try {
      const res = await cancelTheCall(cancelCall?._id);
      toast.success(
        res?.message ||
          res?.error?.message ||
          res?.error?.data?.message ||
          "Successfully call is canceled",
        {
          id: toastId,
          duration: 2000,
        },
      );
    } catch (error) {
      toast.error(
        error?.message ||
          error?.error?.message ||
          "There is an error to cancel the call, Please try latter",
        {
          id: toastId,
          duration: 2000,
        },
      );
    } finally {
      setCancelCallLoading(false);
      setCancelCall(null);
    }
  };

  return (
    <>
      <main className="flex-1 ">
        <DataTable
          title="Calls"
          columns={columns}
          data={calls}
          rowKey={(row) => row._id}
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
              options: STATUS_OPTIONS,
            },
            {
              key: "days",
              placeholder: "Date range",
              value: daysFilter,
              options: DAYS_OPTIONS,
            },
          ]}
          onFilterChange={(key, value) => {
            if (key === "status") setStatusFilter(value);
            if (key === "days") setDaysFilter(value);
            setPage(1);
          }}
          pagination={{
            page,
            pageSize: 10,
            totalItems: meta?.total ?? 0,
          }}
          onPageChange={setPage}
          emptyState={
            loading ? (
              <div className="space-y-2 py-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
                <SearchX className="size-8 opacity-60" />
                <p className="text-sm">
                  No calls match your search or filters.
                </p>
              </div>
            )
          }
        />
      </main>

      {/* View details modal */}
      <Modal
        open={!!viewRow}
        onClose={() => setViewRow(null)}
        title={`Call ${viewRow?.callRef}`}
        description={viewRow?.numberDialed}
      >
        {viewRow && (
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Customer</dt>
              <dd className="text-foreground font-medium">
                {viewRow.customerId?.name}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Customer phone</dt>
              <dd className="text-foreground">{viewRow.customerId?.phone}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Operator</dt>
              <dd className="text-foreground">
                {viewRow.operatorId?.name ?? "—"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Destination</dt>
              <dd className="text-foreground">
                {viewRow.destinationId?.name} ({viewRow.destinationId?.prefix})
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Requested</dt>
              <dd className="text-foreground">
                {formatDateTime(viewRow.requestedAt)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Ended</dt>
              <dd className="text-foreground">
                {formatDateTime(viewRow.endedAt)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Duration</dt>
              <dd className="text-foreground">{formatDuration(viewRow)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Charged</dt>
              <dd className="text-foreground">AED {viewRow.costMoney ?? 0}</dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="text-muted-foreground">Status</dt>
              <dd>
                <StatusBadge status={statusBadgeMap[viewRow.status] as any}>
                  {viewRow.status.replace(/_/g, " ")}
                </StatusBadge>
              </dd>
            </div>
            {viewRow.failureReason && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Failure reason</dt>
                <dd className="text-foreground capitalize">
                  {viewRow.failureReason.replace(/_/g, " ")}
                </dd>
              </div>
            )}
          </dl>
        )}
      </Modal>

      <Modal
        open={!!cancelCall}
        onClose={() => {
          setCancelCall(null);
        }}
        // title="Suspend Operator"
        title={`Cancel Call ${cancelCall?.callRef}`}
        description={`Are you sure you want to cancel the call?`}
      >
        <div className="flex justify-end gap-2">
          <Button
            variant="cancel"
            onClick={() => {
              setCancelCall(null);
            }}
            className="cursor-pointer"
            // disabled={isSuspending}
          >
            Close
          </Button>
          <Button
            variant="destructive"
            className="cursor-pointer"
            onClick={handleCancelCall}
            disabled={cancelCallLoading}
          >
            {cancelCallLoading ? "Request is processing" : " Cancel call"}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default CallsTable;
