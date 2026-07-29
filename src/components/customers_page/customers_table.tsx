"use client";

import {
  Crown,
  Eye,
  Phone,
  PhoneCall,
  SearchX,
  Send,
  Trash2,
  TriangleAlert,
  Wallet,
} from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/status-badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardDescription, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { DropdownMenu } from "../ui/dropdown-menu";

// ── Your data type ───────────────────────────────────────────
type Call = {
  id: string;
  name: string;
  phone: string;
  city: string;
  status: "active" | "complete" | "blocked";
  kyc: "verified" | "Pending";
  calls: string;
  earning: string;
  joined: string;
};

const ALL_CUSTOMERS: Call[] = Array.from({ length: 47 }).map((_, i) => {
  const statuses: Call["status"][] = ["active", "complete", "blocked"];
  const kyces: Call["kyc"][] = ["verified", "Pending"];
  return {
    id: `CU-${1000 + i}`,
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
    phone: `+1 234 567 890${i % 9}`,

    city: [
      "Dubai",
      "Sharjah",
      "Abu Dhabi",
      "Ajman",
      "Fujairah",
      "Ras Al Khaimah",
    ][i % 6],
    status: statuses[i % statuses.length],
    kyc: kyces[i % kyces.length],
    calls: `${i % 5}${i % 4}${(i % 9) + 1}`,
    earning: `AED ${((i % 9) + 1) * 2}`,
    joined: `2026-0${(i % 6) + 1}-1${i % 9}`,
  };
});

const PAGE_SIZE = 8;
const CustomersTable = () => {
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
  const [distributorRow, setDistributorRow] = React.useState<Call | null>(null);
  const [creditRow, setCreditRow] = React.useState<Call | null>(null);

  const filtered = React.useMemo(() => {
    return ALL_CUSTOMERS.filter((c) => {
      const matchesSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !statusFilter || c.status === statusFilter;
      const matchesPlan = !planFilter || c.city === planFilter;
      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [search, statusFilter, planFilter]);

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Simulate a network call whenever a query-affecting value changes.
  React.useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [search, statusFilter, planFilter, page]);

  const columns: DataTableColumn<Call>[] = [
    {
      key: "id",
      header: "Customer",
      width: "110px",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div>
            <Avatar>
              <AvatarImage
                src="https://i.pravatar.cc/64?img=12"
                alt="Profile picture"
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <p className="text-sm font-bold">{row.name}</p>
            <p className="text-xs">{row.id}</p>
          </div>
        </div>
      ),
    },
    { key: "phone", header: "Phone" },
    { key: "city", header: "Countey" },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <StatusBadge status={row.status}>{row.status}</StatusBadge>
      ),
    },
    {
      key: "earning",
      header: "Wallet",
      render: (row) => <p>{row.earning}</p>,
    },
    {
      key: "earning",
      header: "Spend MTD",
      render: (row) => <p>{row.earning}</p>,
    },
    { key: "calls", header: "Calls" },

    {
      key: "joined",
      header: "Joined",
      render: (row) => <p>{row.joined}</p>,
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
              },
              {
                label: "Transfer Minutes",
                icon: Send,
                onClick: () => setCreditRow(row),
              },
              {
                label: "Suspend Customer",
                icon: TriangleAlert,
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
          title="All Customers"
          columns={columns}
          data={paged}
          rowKey={(row) => row.id}
          loading={loading}
          searchable
          searchPlaceholder="Search by name, phone, or ID..."
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
                { label: "Complete", value: "complete" },
                { label: "Blocked", value: "suspended" },
                { label: "Active", value: "pending" },
              ],
            },
            {
              key: "citys",
              placeholder: "Countery",
              value: planFilter,
              options: [
                { label: "Dubai", value: "dubai" },
                { label: "Sharjah", value: "Sharjah" },
                { label: "Abu Dhabi", value: "Abu Dhabi" },
                { label: "Ajman", value: "Ajman" },
                { label: "Fujairah", value: "Fujairah" },
                { label: "Ras Al Khaimah", value: "Ras Al Khaimah" },
              ],
            },
          ]}
          //        "Dubai",
          // "Sharjah",
          // "Abu Dhabi",
          // "Ajman",
          // "Fujairah",
          // "Ras Al Khaimah",
          onFilterChange={(key, value) => {
            if (key === "status") setStatusFilter(value);
            if (key === "plan") setPlanFilter(value);
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
        <Card>
          <CardHeader>
            {/* <CardTitle className="text-2xl">0</CardTitle> */}
            <CardDescription>
              <div className="flex justify-between items-center -my-3">
                <div className="flex items-center  gap-4">
                  <Avatar className="size-16">
                    <AvatarImage
                      src="https://i.pravatar.cc/64?img=12"
                      alt="Profile picture"
                    />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xl font-bold text-white">
                      {viewRow?.name}
                    </p>
                    <p className="text-xs">{viewRow?.id}</p>
                    <p className="text-xs mt-1 py-1 px-2.5 bg-status-complete w-fit text-white rounded-md">
                      active
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-xs">Member Since</p>
                  <p className=" font-medium text-white">Sep 2026</p>
                </div>
              </div>
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="flex  flex-1 items-center gap-2 border rounded-md p-2.5">
          <Phone className="text-primary" />
          <div>
            <p className="text-white text-xs">Phone</p>
            <p className="text-sm font-medium">+971 50 482 9930</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              {/* <CardTitle className="text-2xl">0</CardTitle> */}
              <CardDescription>
                <div className="flex flex-col justify-center items-center -my-3">
                  <PhoneCall className="text-primary" size={36} />
                  <p className="text-xl font-bold text-white">1234</p>
                  <p className="text-xs">Calls</p>
                </div>
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              {/* <CardTitle className="text-2xl">0</CardTitle> */}
              <CardDescription>
                <div className="flex flex-col justify-center items-center -my-3">
                  <Send className="text-white" size={36} />
                  <p className="text-xl font-bold text-white">12,000</p>
                  <p className="text-xs">Transferred minutes</p>
                </div>
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              {/* <CardTitle className="text-2xl">0</CardTitle> */}
              <CardDescription>
                <div className="flex flex-col justify-center items-center -my-3">
                  <Wallet className="text-status-complete" size={36} />
                  <p className="text-xl font-bold text-white">AED 12,415</p>
                  <p className="text-xs">Spend MTD</p>
                </div>
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        open={!!deleteRow}
        onClose={() => setDeleteRow(null)}
        title="Suspend Customer"
        description={`Temporarily suspend ${deleteRow?.name} from the platform`}
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
              Suspend Operator
            </Button>
          </>
        }
      >
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-white">
            Reason for Suspension
          </Label>
          <Textarea
            rows={6}
            id="name"
            placeholder="Enter the reason for suspending this customer..."
          />
        </div>
      </Modal>
      {/* Mark as Distributor  modal */}
      <Modal
        open={!!distributorRow}
        onClose={() => setDistributorRow(null)}
        title={`Promote to distributor — ${distributorRow?.name}`}
        description={`Distributors can receive credit from the admin reserve and re-issue minutes to end customers.`}
        footer={
          <>
            <Button variant="cancel" onClick={() => setDistributorRow(null)}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={() => {
                // call your delete API here
                setDistributorRow(null);
              }}
            >
              Promote
            </Button>
          </>
        }
      >
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-white">
            Monthly issuance limit (minutes)
          </Label>
          <Input id="name" placeholder="5000" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-white">
            Commission rate (%)
          </Label>
          <Input id="name" placeholder="2" />
        </div>
      </Modal>
      {/* Mark as Credit modal */}
      <Modal
        open={!!creditRow}
        onClose={() => setCreditRow(null)}
        title={`Transfer credit → ${distributorRow?.name}`}
        description={`${distributorRow?.id} . Current balance 58 min. Ledger-backed transfer from admin reserve.`}
        footer={
          <>
            <Button variant="cancel" onClick={() => setCreditRow(null)}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={() => {
                // call your delete API here
                setCreditRow(null);
              }}
            >
              Confirm Transfer
            </Button>
          </>
        }
      >
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-white">
            Minutes to transfer
          </Label>
          <Input id="name" placeholder="100" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-white">
            Balances after transfer
          </Label>
          <Input id="name" placeholder="58 → 158" />
        </div>
      </Modal>
    </>
  );
};

export default CustomersTable;
