"use client";

import {
  Crown,
  Eye,
  Phone,
  PhoneCall,
  RotateCcw,
  SearchX,
  Send,
  TriangleAlert,
  Wallet,
} from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Modal } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardDescription, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { DropdownMenu } from "../ui/dropdown-menu";
import {
  useGetCustomersQuery,
  useGetCustomerDetailsQuery,
  useTransferMinuteMutation,
  useMarkDistributorMutation,
  useSuspendCustomerMutation,
  useActiveCustomerMutation,
} from "@/redux/api/adminApi"; // adjust to your actual path

// ── API-shaped customer type (list row) ───────────────────────
type Customer = {
  _id: string;
  name: string;
  phone: string;
  status: "active" | "suspended";
  createdAt: string;
  balanceMinutes: number;
  isDistributor: boolean;
  calls: number;
  spendMtd: number;
  country: string;
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

const CustomersTable = () => {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string | null>(null);
  const [countryFilter, setCountryFilter] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);

  // Modal state
  const [viewRow, setViewRow] = React.useState<Customer | null>(null);
  const [suspendRow, setSuspendRow] = React.useState<Customer | null>(null);
  const [distributorRow, setDistributorRow] = React.useState<Customer | null>(
    null,
  );
  const [creditRow, setCreditRow] = React.useState<Customer | null>(null);

  // Form fields
  const [suspendReason, setSuspendReason] = React.useState("");
  const [issuanceLimit, setIssuanceLimit] = React.useState("");
  const [commissionRate, setCommissionRate] = React.useState("");
  const [transferMinutes, setTransferMinutes] = React.useState("");

  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetCustomersQuery({
    page,
    limit: PAGE_SIZE,
    ...(statusFilter ? { status: statusFilter } : {}),
  });

  const loading = isLoading || isFetching;
  const customers = response?.data?.customers ?? [];
  const meta = response?.data?.meta;

  const [transferMinute, { isLoading: isTransferring }] =
    useTransferMinuteMutation();
  const [markDistributor, { isLoading: isPromoting }] =
    useMarkDistributorMutation();
  const [suspendCustomer, { isLoading: isSuspending }] =
    useSuspendCustomerMutation();
  const [activeCustomer, { isLoading: isActivating }] =
    useActiveCustomerMutation();

  // Fetch full details only when the view modal is open.
  const { data: detailsResponse, isFetching: isDetailsLoading } =
    useGetCustomerDetailsQuery(viewRow?._id, { skip: !viewRow });
  const details = detailsResponse?.data;

  const countries = React.useMemo(
    () => Array.from(new Set(customers.map((c) => c.country))).sort(),
    [customers],
  );

  // Client-side search + country filter on the currently loaded page.
  const filtered = React.useMemo(() => {
    return customers.filter((c) => {
      const matchesSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.toLowerCase().includes(search.toLowerCase());
      const matchesCountry = !countryFilter || c.country === countryFilter;
      return matchesSearch && matchesCountry;
    });
  }, [customers, search, countryFilter]);

  const resetSuspendForm = () => setSuspendReason("");
  const resetDistributorForm = () => {
    setIssuanceLimit("");
    setCommissionRate("");
  };
  const resetCreditForm = () => setTransferMinutes("");

  const handleToggleStatus = async (row: Customer) => {
    if (row.status === "active") {
      setSuspendRow(row);
    } else {
      try {
        await activeCustomer(row._id).unwrap();
      } catch (err) {
        console.error("Failed to activate customer", err);
      }
    }
  };

  const handleSuspendConfirm = async () => {
    if (!suspendRow) return;
    try {
      await suspendCustomer({
        id: suspendRow._id,
        data: { reason: suspendReason },
      }).unwrap();
      setSuspendRow(null);
      resetSuspendForm();
    } catch (err) {
      console.error("Failed to suspend customer", err);
    }
  };

  const handlePromoteConfirm = async () => {
    if (!distributorRow) return;
    try {
      await markDistributor({
        id: distributorRow._id,
        data: {
          commissionRatePercent: Number(commissionRate) || 0,
          monthlyIssuanceLimit: Number(issuanceLimit) || 0,
        },
      }).unwrap();
      setDistributorRow(null);
      resetDistributorForm();
    } catch (err) {
      console.error("Failed to mark distributor", err);
    }
  };

  const handleTransferConfirm = async () => {
    if (!creditRow) return;
    try {
      await transferMinute({
        id: creditRow._id,
        data: { minutes: Number(transferMinutes) || 0 },
      }).unwrap();
      setCreditRow(null);
      resetCreditForm();
    } catch (err) {
      console.error("Failed to transfer minutes", err);
    }
  };

  const columns: DataTableColumn<Customer>[] = [
    {
      key: "_id",
      header: "Customer",
      width: "180px",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={row?.image} alt={row.name} />
            <AvatarFallback>
              {row.name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-bold">{row.name}</p>
            <p className="text-xs">{row._id.slice(-6)}</p>
          </div>
        </div>
      ),
    },
    { key: "phone", header: "Phone" },
    { key: "country", header: "Country" },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <StatusBadge status={row.status}>{row.status}</StatusBadge>
      ),
    },
    {
      key: "balanceMinutes",
      header: "Wallet",
      render: (row) => <p>{row.balanceMinutes} min</p>,
    },
    {
      key: "spendMtd",
      header: "Spend MTD",
      render: (row) => <p>AED {row.spendMtd}</p>,
    },
    { key: "calls", header: "Calls" },
    {
      key: "createdAt",
      header: "Joined",
      render: (row) => <p>{formatDate(row.createdAt)}</p>,
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
                label: "Mark as Distributor",
                icon: Crown,
                onClick: () => setDistributorRow(row),
                disabled: row.isDistributor,
              },
              {
                label: "Transfer Minutes",
                icon: Send,
                onClick: () => setCreditRow(row),
              },
              row.status === "active"
                ? {
                    label: "Suspend Customer",
                    icon: TriangleAlert,
                    variant: "destructive",
                    onClick: () => handleToggleStatus(row),
                  }
                : {
                    label: "Reactivate Customer",
                    icon: RotateCcw,
                    onClick: () => handleToggleStatus(row),
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
          title="All Customers"
          columns={columns}
          data={filtered}
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
                { label: "Active", value: "active" },
                { label: "Suspended", value: "suspended" },
              ],
            },
          ]}
          onFilterChange={(key, value) => {
            if (key === "status") {
              setStatusFilter(value);
              setPage(1);
            }
            if (key === "country") setCountryFilter(value);
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
                  No customers match your search or filters.
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
        title="Customer Details"
        description="Complete profile and performance overview"
        footer={
          <>
            <Button variant="cancel" onClick={() => setViewRow(null)}>
              Close
            </Button>
          </>
        }
      >
        {isDetailsLoading || !details ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-full" />
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardDescription>
                  <div className="flex justify-between items-center -my-3">
                    <div className="flex items-center gap-4">
                      <Avatar className="size-16">
                        <AvatarImage src={details.image} alt={details.name} />
                        <AvatarFallback>
                          {details.name?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xl font-bold text-white">
                          {details.name}
                        </p>
                        <p className="text-xs">{details._id.slice(-6)}</p>
                        <p
                          className={`text-xs mt-1 py-1 px-2.5 w-fit text-white rounded-md ${
                            details.status === "active"
                              ? "bg-status-complete"
                              : "bg-status-failed"
                          }`}
                        >
                          {details.status}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-xs">Member Since</p>
                      <p className="font-medium text-white">
                        {formatDate(details.createdAt)}
                      </p>
                    </div>
                  </div>
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="flex flex-1 items-center gap-2 border rounded-md p-2.5">
              <Phone className="text-primary" />
              <div>
                <p className="text-white text-xs">Phone</p>
                <p className="text-sm font-medium">{details.phone}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardDescription>
                    <div className="flex flex-col justify-center items-center -my-3">
                      <PhoneCall className="text-primary" size={36} />
                      <p className="text-xl font-bold text-white">
                        {details.callCount}
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
                      <Wallet className="text-status-complete" size={36} />
                      <p className="text-xl font-bold text-white">
                        {details.wallet?.balanceMinutes ?? 0} min
                      </p>
                      <p className="text-xs">Wallet balance</p>
                    </div>
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardDescription>
                    <div className="flex flex-col justify-center items-center -my-3">
                      <Send className="text-white" size={36} />
                      <p className="text-xl font-bold text-white">
                        {details.wallet?.isDistributor ? "Yes" : "No"}
                      </p>
                      <p className="text-xs">Distributor</p>
                    </div>
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </>
        )}
      </Modal>

      {/* Suspend modal */}
      <Modal
        open={!!suspendRow}
        onClose={() => {
          setSuspendRow(null);
          resetSuspendForm();
        }}
        title="Suspend Customer"
        description={`Temporarily suspend ${suspendRow?.name} from the platform`}
        footer={
          <>
            <Button
              variant="cancel"
              onClick={() => {
                setSuspendRow(null);
                resetSuspendForm();
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
              {isSuspending ? "Suspending..." : "Suspend Customer"}
            </Button>
          </>
        }
      >
        <div className="space-y-1.5">
          <Label htmlFor="suspendReason" className="text-white">
            Reason for Suspension
          </Label>
          <Textarea
            rows={6}
            id="suspendReason"
            value={suspendReason}
            onChange={(e) => setSuspendReason(e.target.value)}
            placeholder="Enter the reason for suspending this customer..."
          />
        </div>
      </Modal>

      {/* Mark as Distributor modal */}
      <Modal
        open={!!distributorRow}
        onClose={() => {
          setDistributorRow(null);
          resetDistributorForm();
        }}
        title={`Promote to distributor — ${distributorRow?.name}`}
        description="Distributors can receive credit from the admin reserve and re-issue minutes to end customers."
        footer={
          <>
            <Button
              variant="cancel"
              onClick={() => {
                setDistributorRow(null);
                resetDistributorForm();
              }}
              disabled={isPromoting}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handlePromoteConfirm}
              disabled={isPromoting || !issuanceLimit || !commissionRate}
            >
              {isPromoting ? "Promoting..." : "Promote"}
            </Button>
          </>
        }
      >
        <div className="space-y-1.5">
          <Label htmlFor="issuanceLimit" className="text-white">
            Monthly issuance limit (minutes)
          </Label>
          <Input
            id="issuanceLimit"
            type="number"
            min={0}
            value={issuanceLimit}
            onChange={(e) => setIssuanceLimit(e.target.value)}
            placeholder="5000"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="commissionRate" className="text-white">
            Commission rate (%)
          </Label>
          <Input
            id="commissionRate"
            type="number"
            min={0}
            max={100}
            value={commissionRate}
            onChange={(e) => setCommissionRate(e.target.value)}
            placeholder="2"
          />
        </div>
      </Modal>

      {/* Transfer minutes modal */}
      <Modal
        open={!!creditRow}
        onClose={() => {
          setCreditRow(null);
          resetCreditForm();
        }}
        title={`Transfer minutes → ${creditRow?.name}`}
        description={`${creditRow?._id.slice(-6)} · Current balance ${
          creditRow?.balanceMinutes ?? 0
        } min. Ledger-backed transfer from admin reserve.`}
        footer={
          <>
            <Button
              variant="cancel"
              onClick={() => {
                setCreditRow(null);
                resetCreditForm();
              }}
              disabled={isTransferring}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleTransferConfirm}
              disabled={isTransferring || !transferMinutes}
            >
              {isTransferring ? "Transferring..." : "Confirm Transfer"}
            </Button>
          </>
        }
      >
        <div className="space-y-1.5">
          <Label htmlFor="transferMinutes" className="text-white">
            Minutes to transfer
          </Label>
          <Input
            id="transferMinutes"
            type="number"
            min={0}
            value={transferMinutes}
            onChange={(e) => setTransferMinutes(e.target.value)}
            placeholder="100"
          />
        </div>
        {creditRow && transferMinutes && (
          <p className="text-xs text-muted-foreground">
            Balance after transfer: {creditRow.balanceMinutes} →{" "}
            {creditRow.balanceMinutes + (Number(transferMinutes) || 0)}
          </p>
        )}
      </Modal>
    </>
  );
};

export default CustomersTable;
