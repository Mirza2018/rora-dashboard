"use client";

import { Check, CheckCheck, Eye, SearchX, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardDescription, CardHeader } from "../ui/card";
import { DropdownMenu } from "../ui/dropdown-menu";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  useGetAllPayoutQuery,
  useApprovePayoutMutation,
  useMarkPayoutMutation,
  useRejectPayoutMutation,
} from "@/redux/api/adminApi"; // adjust to your actual path

// ── API-shaped payout type ───────────────────────────────────
type Payout = {
  _id: string;
  payoutRef: string;
  operatorId: { _id: string; name: string; phone: string };
  amountMoney: number;
  method: string;
  bankName?: string;
  accountNumber?: string;
  status: "pending" | "approved" | "paid" | "rejected";
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

const maskAccount = (acc?: string) => (acc ? `•••• ${acc.slice(-4)}` : "—");

const PayoutsTable = () => {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);

  // Modal state
  const [viewRow, setViewRow] = React.useState<Payout | null>(null);
  const [paidRow, setPaidRow] = React.useState<Payout | null>(null);
  const [deleteRow, setDeleteRow] = React.useState<Payout | null>(null); // reject
  const [approveRow, setApproveRow] = React.useState<Payout | null>(null);
  const [rejectReason, setRejectReason] = React.useState("");

  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetAllPayoutQuery({
    page,
    limit: PAGE_SIZE,
    ...(statusFilter ? { status: statusFilter } : {}),
  });

  const [approvePayout, { isLoading: isApproving }] =
    useApprovePayoutMutation();
  const [markPayout, { isLoading: isMarking }] = useMarkPayoutMutation();
  const [rejectPayout, { isLoading: isRejecting }] = useRejectPayoutMutation();

  const loading = isLoading || isFetching;
  const payouts = response?.data?.payouts ?? [];
  const meta = response?.data?.meta;

  // Client-side search on the currently loaded page — swap for a
  // server `search` param if/when the backend supports one.
  const filtered = React.useMemo(() => {
    if (!search) return payouts;
    const q = search.toLowerCase();
    return payouts.filter(
      (p:any) =>
        p.operatorId?.name?.toLowerCase().includes(q) ||
        p.payoutRef?.toLowerCase().includes(q),
    );
  }, [payouts, search]);

  const handleApprove = async () => {
    if (!approveRow) return;
    try {
      await approvePayout(approveRow._id).unwrap();
      setApproveRow(null);
    } catch (err) {
      console.error("Failed to approve payout", err);
    }
  };

  const handleMarkPaid = async () => {
    if (!paidRow) return;
    try {
      await markPayout(paidRow._id).unwrap();
      setPaidRow(null);
    } catch (err) {
      console.error("Failed to mark payout as paid", err);
    }
  };

  const handleReject = async () => {
    if (!deleteRow) return;
    try {
      await rejectPayout({
        id: deleteRow._id,
        data: { reason: rejectReason },
      }).unwrap();
      setDeleteRow(null);
      setRejectReason("");
    } catch (err) {
      console.error("Failed to reject payout", err);
    }
  };

  const columns: DataTableColumn<Payout>[] = [
    { key: "payoutRef", header: "Payout", width: "110px" },
    {
      key: "operatorId",
      header: "Operator",
      render: (row) => <p>{row.operatorId?.name}</p>,
    },
    {
      key: "amountMoney",
      header: "Amount",
      render: (row) => <p>AED {row.amountMoney.toLocaleString()}</p>,
    },
    {
      key: "method",
      header: "Method",
      render: (row) => <p className="capitalize">{row.method}</p>,
    },
    {
      key: "createdAt",
      header: "Date",
      render: (row) => <p>{formatDate(row.createdAt)}</p>,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <StatusBadge status={row.status}>{row.status}</StatusBadge>
      ),
    },
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
                disabled: row.status !== "pending",
              },
              {
                label: "Paid",
                icon: CheckCheck,
                onClick: () => setPaidRow(row),
                disabled: row.status !== "approved",
              },
              {
                label: "Reject",
                icon: X,
                variant: "destructive",
                onClick: () => setDeleteRow(row),
                disabled: row.status === "paid" || row.status === "rejected",
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
          data={filtered}
          rowKey={(row) => row._id}
          loading={loading}
          searchable
          searchPlaceholder="Search Operator id, amount ..."
          searchValue={search}
          onSearchChange={setSearch}
          filters={[
            {
              key: "status",
              placeholder: "Status",
              value: statusFilter,
              options: [
                { label: "Pending", value: "pending" },
                { label: "Paid", value: "paid" },
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
                  No payouts match your search or filters.
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
        title={`Payout ${viewRow?.payoutRef}`}
        description={`Requested by ${viewRow?.operatorId?.name}`}
        footer={[]}
      >
        {viewRow && (
          <Card>
            <CardHeader>
              <CardDescription>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <dt className="text-muted-foreground text-sm flex gap-1 items-center">
                      Amount
                    </dt>
                    <dd className="font-medium text-white">
                      AED {viewRow.amountMoney.toLocaleString()}
                    </dd>
                  </div>
                  <div className="flex justify-between items-center">
                    <dt className="text-muted-foreground text-sm flex gap-1 items-center">
                      Method
                    </dt>
                    <dd className="font-medium text-white capitalize">
                      {viewRow.method}
                    </dd>
                  </div>
                  <div className="flex justify-between items-center">
                    <dt className="text-muted-foreground text-sm flex gap-1 items-center">
                      Bank Name
                    </dt>
                    <dd className="font-medium text-white">
                      {viewRow.bankName || "—"}
                    </dd>
                  </div>
                  <div className="flex justify-between items-center">
                    <dt className="text-muted-foreground text-sm flex gap-1 items-center">
                      Account Number
                    </dt>
                    <dd className="font-medium text-white">
                      {maskAccount(viewRow.accountNumber)}
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
      </Modal>

      {/* Reject modal */}
      <Modal
        open={!!deleteRow}
        onClose={() => {
          setDeleteRow(null);
          setRejectReason("");
        }}
        title={`Reject payout ${deleteRow?.payoutRef}`}
        description="The operator will be notified with the reason and funds will remain available."
        footer={
          <>
            <Button
              variant="cancel"
              onClick={() => {
                setDeleteRow(null);
                setRejectReason("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isRejecting || !rejectReason.trim()}
            >
              {isRejecting ? "Rejecting..." : "Reject payout"}
            </Button>
          </>
        }
      >
        <div className="space-y-1.5">
          <Label htmlFor="rejectReason" className="text-xs font-medium">
            Reason (required)
          </Label>
          <Textarea
            rows={6}
            id="rejectReason"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="please write the reason"
          />
        </div>
      </Modal>

      {/* Approve modal */}
      <Modal
        open={!!approveRow}
        onClose={() => setApproveRow(null)}
        title={`Approve payout ${approveRow?.payoutRef}`}
        description={
          approveRow
            ? `AED ${approveRow.amountMoney.toLocaleString()} will be transferred to ${
                approveRow.bankName || approveRow.method
              } ${maskAccount(approveRow.accountNumber)}. Funds are typically credited within 1–3 business days.`
            : ""
        }
        footer={
          <>
            <Button
              variant="cancel"
              onClick={() => setApproveRow(null)}
              disabled={isApproving}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleApprove}
              disabled={isApproving}
            >
              {isApproving ? "Approving..." : "Approve & process"}
            </Button>
          </>
        }
      />

      {/* Mark as paid modal */}
      <Modal
        open={!!paidRow}
        onClose={() => setPaidRow(null)}
        title={`Mark payout ${paidRow?.payoutRef} as paid`}
        description={
          paidRow
            ? `Confirm AED ${paidRow.amountMoney.toLocaleString()} has been transferred to ${
                paidRow.bankName || paidRow.method
              } ${maskAccount(paidRow.accountNumber)}.`
            : ""
        }
        footer={
          <>
            <Button
              variant="cancel"
              onClick={() => setPaidRow(null)}
              disabled={isMarking}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleMarkPaid}
              disabled={isMarking}
            >
              {isMarking ? "Updating..." : "Mark as paid"}
            </Button>
          </>
        }
      />
    </>
  );
};

export default PayoutsTable;
