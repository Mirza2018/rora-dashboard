"use client";

import {
  Building,
  Eye,
  Phone,
  SearchX
} from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import AllImages from "@/assets/AllImages";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Modal } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  useActiveOperatorMutation,
  useGetInviteOperatorsQuery,
  useSuspendOperatorMutation,
  useVerifyOperatorMutation
} from "@/redux/api/adminApi"; // adjust to your actual path
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardDescription, CardHeader } from "../ui/card";
import { DropdownMenu } from "../ui/dropdown-menu";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

// ── API-shaped operator type ───────────────────────────────────
type OperatorStatus = "pending" | "used";

type Operator = {
  _id: string;
  name: string;
  phone: string;
  image?: string;
  status: OperatorStatus;
  createdAt: string;
  expiresAt: string;
  city: string;
  isVerified: boolean;
  totalCalls: number;
  totalEarnings: number;
  availabilityStatus: "online" | "offline" | "busy";
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

// Map API status -> badge tokens your StatusBadge already understands.
const statusBadgeMap: Record<OperatorStatus, string> = {
  used: "used",
  pending: "pending",
};

const InviteOperatorsTable = () => {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);

  const [viewRow, setViewRow] = React.useState<Operator | null>(null);
  const [suspendRow, setSuspendRow] = React.useState<Operator | null>(null);
  const [suspendReason, setSuspendReason] = React.useState("");

  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetInviteOperatorsQuery({
    page,
    limit: 10,
    ...(statusFilter ? { status: statusFilter } : {}),
    ...(search ? { search: search } : {}),
  });

  const loading = isLoading || isFetching;
  const operators = response?.data?.invitations ?? [];
  const meta = response?.data?.meta;

  const [verifyOperator, { isLoading: isVerifying }] =
    useVerifyOperatorMutation();
  const [suspendOperator, { isLoading: isSuspending }] =
    useSuspendOperatorMutation();
  const [activeOperator, { isLoading: isActivating }] =
    useActiveOperatorMutation();

  // Client-side search + city filter on the currently loaded page.
  const filtered = React.useMemo(() => {
    return operators.filter((o: any) => {
      const matchesSearch =
        !search ||
        o.name.toLowerCase().includes(search.toLowerCase()) ||
        o.phone.toLowerCase().includes(search.toLowerCase());

      return matchesSearch;
    });
  }, [operators, search]);

  const handleVerify = async (row: Operator) => {
    const toastId = toast.loading("Verifying operator...");
    try {
      await verifyOperator(row._id).unwrap();
      toast.success(`${row.name} has been verified and activated.`, {
        id: toastId,
      });
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to verify operator.", {
        id: toastId,
      });
    }
  };

  const handleActivate = async (row: Operator) => {
    const toastId = toast.loading("Reactivating operator...");
    try {
      await activeOperator(row._id).unwrap();
      toast.success(`${row.name} has been reactivated.`, { id: toastId });
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to activate operator.", {
        id: toastId,
      });
    }
  };

  const handleSuspendConfirm = async () => {
    if (!suspendRow) return;
    const toastId = toast.loading("Suspending operator...");
    try {
      await suspendOperator({
        id: suspendRow._id,
        data: { reason: suspendReason },
      }).unwrap();
      toast.success(`${suspendRow.name} has been suspended.`, {
        id: toastId,
      });
      setSuspendRow(null);
      setSuspendReason("");
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to suspend operator.", {
        id: toastId,
      });
    }
  };

  const columns: DataTableColumn<Operator>[] = [
    {
      key: "_id",
      header: "Operator",
      width: "180px",
      render: (row) => (
        <div className="flex items-center gap-2">
          {/* <Avatar>
            <AvatarImage
              src={row.image || AllImages.placeholder.src}
              alt={row.name}
            />
            <AvatarFallback>
              {row.name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar> */}
          <div>
            <p className="text-sm font-bold">{row.name}</p>
            <p className="text-xs">{row._id.slice(-6)}</p>
          </div>
        </div>
      ),
    },
    { key: "phone", header: "Phone" },
    { key: "code", header: "Code" },
    { key: "city", header: "City" },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <StatusBadge status={statusBadgeMap[row?.status] as any}>
          {row.status.replace(/_/g, " ")}
        </StatusBadge>
      ),
    },
    // {
    //   key: "isVerified",
    //   header: "KYC",
    //   render: (row) => (
    //     <StatusBadge status={row.isVerified ? "verified" : "pending"}>
    //       {row.isVerified ? "verified" : "pending"}
    //     </StatusBadge>
    //   ),
    // },
    // { key: "totalCalls", header: "Calls" },
    // {
    //   key: "totalEarnings",
    //   header: "Earning",
    //   render: (row) => <p>AED {row.totalEarnings}</p>,
    // },
    {
      key: "createdAt",
      header: "Expires At",
      render: (row) => <p>{formatDate(row?.expiresAt)}</p>,
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

        // if (!row.isVerified || row.status === "pending_verification") {
        //   items.push({
        //     label: "Verify & Activate",
        //     icon: BadgeCheck,
        //     onClick: () => handleVerify(row),
        //   });
        // }

        // if (row.status === "active") {
        //   items.push({
        //     label: "Suspend Operator",
        //     icon: TriangleAlert,
        //     variant: "destructive",
        //     onClick: () => setSuspendRow(row),
        //   } as any);
        // } else if (row.status === "suspended") {
        //   items.push({
        //     label: "Reactivate Operator",
        //     icon: RotateCcw,
        //     onClick: () => handleActivate(row),
        //   });
        // }

        return (
          <div className="flex justify-end gap-1">
            <DropdownMenu items={items as any} />
          </div>
        );
      },
    },
  ];

  return (
    <>
      <main className="flex-1 ">
        <DataTable
          title="Operators"
          columns={columns}
          data={operators}
          rowKey={(row) => row._id}
          loading={loading}
          searchable
          searchPlaceholder="Search by name, phone, or ID..."
          searchValue={search}
          onSearchChange={setSearch}
          filters={[
            {
              key: "status",
              placeholder: "Status",
              value: statusFilter,
              options: [
                { label: "Used", value: "used" },
                { label: "Pending", value: "pending" },
              ],
            },
          ]}
          onFilterChange={(key, value) => {
            if (key === "status") {
              setStatusFilter(value);
              setPage(1);
            }
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
                  No operators match your search or filters.
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
        title="Operator Details"
        description="Complete profile and performance overview"
        footer={
          <>
            <Button variant="cancel" onClick={() => setViewRow(null)}>
              Close
            </Button>
          </>
        }
      >
        {viewRow && (
          <>
            <Card>
              <CardHeader>
                <CardDescription>
                  <div className="flex justify-between items-center -my-3">
                    <div className="flex items-center gap-4">
                      <Avatar className="size-16">
                        <AvatarImage
                          src={viewRow.image || AllImages.placeholder.src}
                          alt={viewRow.name}
                        />
                        <AvatarFallback>
                          {viewRow.name?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xl font-bold text-white">
                          {viewRow.name}
                        </p>
                        <p className="text-xs">{viewRow._id.slice(-6)}</p>

                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-xs">Member Since</p>
                      <p className="font-medium text-white">
                        {formatDate(viewRow.createdAt)}
                      </p>
                    </div>
                  </div>
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="flex gap-4 ">
              <div className="flex flex-1 items-center gap-2 border rounded-md p-2.5">
                <Phone className="text-primary" />
                <div>
                  <p className="text-white text-xs">Phone</p>
                  <p className="text-sm font-medium">{viewRow.phone}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-1 items-center gap-2 border rounded-md p-2.5">
              <Building className="text-primary" />
              <div>
                <p className="text-white text-xs">City</p>
                <p className="text-sm font-medium">{viewRow.city}</p>
              </div>
            </div>
            {/* <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardDescription>
                    <div className="flex flex-col justify-center items-center -my-3">
                      <PhoneCall className="text-primary" size={36} />
                      <p className="text-2xl font-bold text-white">
                        {viewRow.totalCalls}
                      </p>
                      <p className="text-xs">Calls</p>
                    </div>
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardDescription>
                    <div className="flex flex-col justify-center items-center -my-3">
                      <DollarSign className="text-status-complete" size={36} />
                      <p className="text-2xl font-bold text-white">
                        AED {viewRow.totalEarnings}
                      </p>
                      <p className="text-xs">Revenue</p>
                    </div>
                  </CardDescription>
                </CardHeader>
              </Card>
            </div> */}

            {/* Monthly payout history isn't exposed by /operator/admin/:id yet —
                surface a note instead of fabricating figures. Wire this up
                to a real payout-history endpoint once one exists. */}
            {/* <div className="border rounded-md p-4 text-center text-sm text-muted-foreground">
              Monthly payout history isn't available from this endpoint yet.
            </div> */}
          </>
        )}
      </Modal>

      {/* Suspend confirmation modal */}
      <Modal
        open={!!suspendRow}
        onClose={() => {
          setSuspendRow(null);
          setSuspendReason("");
        }}
        title="Suspend Operator"
        description={`Temporarily suspend ${suspendRow?.name} from the platform`}
        footer={
          <>
            <Button
              variant="cancel"
              onClick={() => {
                setSuspendRow(null);
                setSuspendReason("");
              }}
              disabled={isSuspending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleSuspendConfirm}
              disabled={isSuspending || !suspendReason.trim()}
            >
              {isSuspending ? "Suspending..." : "Suspend Operator"}
            </Button>
          </>
        }
      >
        <div className="space-y-1.5">
          <Label htmlFor="suspendReason" className="text-white">
            Reason for Suspension
          </Label>
          <Textarea
            id="suspendReason"
            value={suspendReason}
            onChange={(e) => setSuspendReason(e.target.value)}
            placeholder="Enter the reason for suspending this operator..."
          />
        </div>
      </Modal>
    </>
  );
};

export default InviteOperatorsTable;
