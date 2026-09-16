"use client";

import { SearchX } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardDescription, CardHeader } from "../ui/card";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  useGetAllDisputesQuery,
  useResolveDisputeMutation,
  useRejectDisputeMutation,
} from "@/redux/api/adminApi"; // adjust to your actual path

// ── API-shaped dispute type ─────────────────────────────────
type Dispute = {
  _id: string;
  disputeRef: string;
  callId: { _id: string; callRef: string };
  customerId: { _id: string; name: string; phone: string };
  operatorId: { _id: string; name: string; phone: string };
  amount: number;
  reason: string;
  status: "open" | "resolved" | "reject";
  createdAt: string;
};

const PAGE_SIZE = 20;

const formatDate = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

const DisputesTable = () => {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);

  // Modal + form state
  const [viewRow, setViewRow] = React.useState<Dispute | null>(null);
  const [refundAmount, setRefundAmount] = React.useState("");
  const [adminNote, setAdminNote] = React.useState("");

  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetAllDisputesQuery({
    page,
    limit: PAGE_SIZE,
    ...(statusFilter ? { status: statusFilter } : {}),
  });

  const [resolveDispute, { isLoading: isResolving }] =
    useResolveDisputeMutation();
  const [rejectDispute, { isLoading: isRejecting }] =
    useRejectDisputeMutation();

  const loading = isLoading || isFetching;
  const disputes = response?.data?.disputes ?? [];
  const meta = response?.data?.meta;

  // Client-side search on top of the currently loaded page.
  // Note: since /disputes doesn't document a search param, this only
  // filters within the current page's results. If the backend adds a
  // `search` query param, pass it into useGetAllDisputesQuery instead.
  const filtered = React.useMemo(() => {
    if (!search) return disputes;
    const q = search.toLowerCase();
    return disputes.filter(
      (d:any) =>
        d.customerId?.name?.toLowerCase().includes(q) ||
        d.operatorId?.name?.toLowerCase().includes(q) ||
        d.callId?.callRef?.toLowerCase().includes(q) ||
        d.disputeRef?.toLowerCase().includes(q),
    );
  }, [disputes, search]);

  const resetForm = () => {
    setRefundAmount("");
    setAdminNote("");
  };

  const handleCloseModal = () => {
    setViewRow(null);
    resetForm();
  };

  const handleResolve = async () => {
    if (!viewRow) return;
    try {
      await resolveDispute({
        id: viewRow._id,
        data: {
          refundAmount: Number(refundAmount) || 0,
          adminNote,
        },
      }).unwrap();
      handleCloseModal();
    } catch (err) {
      console.error("Failed to resolve dispute", err);
    }
  };

  const handleReject = async () => {
    if (!viewRow) return;
    try {
      await rejectDispute({
        id: viewRow._id,
        data: { adminNote },
      }).unwrap();
      handleCloseModal();
    } catch (err) {
      console.error("Failed to reject dispute", err);
    }
  };

  const columns: DataTableColumn<Dispute>[] = [
    { key: "disputeRef", header: "Dispute", width: "110px" },
    {
      key: "callId",
      header: "Call",
      width: "110px",
      render: (row) => <p>{row.callId?.callRef}</p>,
    },
    {
      key: "customerId",
      header: "Customer",
      render: (row) => <p>{row.customerId?.name}</p>,
    },
    {
      key: "operatorId",
      header: "Operator",
      render: (row) => <p>{row.operatorId?.name}</p>,
    },
    {
      key: "amount",
      header: "Amount",
      render: (row) => <p>AED {row.amount}</p>,
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
    {
      key: "createdAt",
      header: "Date",
      render: (row) => <p>{formatDate(row.createdAt)}</p>,
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (row) => (
        <div className="flex justify-end gap-1">
          <Button
            variant={"outline"}
            onClick={() => setViewRow(row)}
            disabled={row.status !== "open"}
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
          data={filtered}
          rowKey={(row) => row._id}
          loading={loading}
          searchable
          searchPlaceholder="Search call id, name ..."
          searchValue={search}
          onSearchChange={setSearch}
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
                  No disputes match your search or filters.
                </p>
              </div>
            )
          }
        />
      </main>

      {/* View / resolve / reject modal */}
      <Modal
        open={!!viewRow}
        onClose={handleCloseModal}
        title={`Dispute ${viewRow?.disputeRef}`}
        description={`${viewRow?.customerId?.name} vs ${viewRow?.operatorId?.name}`}
        footer={
          <>
            <Button
              variant="outline"
              className="text-status-failed border-status-failed!"
              onClick={handleReject}
              disabled={isRejecting || isResolving}
            >
              {isRejecting ? "Rejecting..." : "Reject Claim"}
            </Button>
            <Button
              variant="default"
              onClick={handleResolve}
              disabled={isResolving || isRejecting}
            >
              {isResolving ? "Resolving..." : "Resolve with refund"}
            </Button>
          </>
        }
      >
        {viewRow && (
          <Card>
            <CardHeader>
              <CardDescription>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <dt className="text-muted-foreground text-sm flex gap-1 items-center">
                      Call
                    </dt>
                    <dd className="font-medium text-white">
                      {viewRow.callId?.callRef}
                    </dd>
                  </div>
                  <div className="flex justify-between items-center">
                    <dt className="text-muted-foreground text-sm flex gap-1 items-center">
                      Amount
                    </dt>
                    <dd className="font-medium text-white">
                      AED {viewRow.amount}
                    </dd>
                  </div>
                  <div className="flex justify-between items-center">
                    <dt className="text-muted-foreground text-sm flex gap-1 items-center">
                      Date
                    </dt>
                    <dd className="font-medium text-white">
                      {formatDate(viewRow.createdAt)}
                    </dd>
                  </div>
                  <div className="flex justify-between items-center">
                    <dt className="text-muted-foreground text-sm flex gap-1 items-center">
                      Status
                    </dt>
                    <dd className="font-medium text-white">{viewRow.status}</dd>
                  </div>
                </dl>
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardDescription>
              <p className="text-white font-semibold">Customer claim</p>
              <p className="text-sm">{viewRow?.reason}</p>
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="space-y-1.5">
          <Label htmlFor="refundAmount" className="text-xs font-medium">
            Refund amount (AED)
          </Label>
          <Input
            id="refundAmount"
            type="number"
            min={0}
            step="0.01"
            value={refundAmount}
            onChange={(e) => setRefundAmount(e.target.value)}
            placeholder="0.00"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="adminNote" className="text-xs font-medium">
            Admin note
          </Label>
          <Textarea
            rows={6}
            id="adminNote"
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            placeholder="What you found, who you contacted ..."
          />
        </div>
      </Modal>
    </>
  );
};

export default DisputesTable;
