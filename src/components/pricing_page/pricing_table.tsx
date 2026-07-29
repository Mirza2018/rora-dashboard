"use client";

import { Ban, Delete, Eye, Pencil, SearchX, Trash2 } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/status-badge";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { DropdownMenu } from "../ui/dropdown-menu";

// ── Your data type ───────────────────────────────────────────
type Call = {
  id: string;
  destination: string;
  prefix: string;
  customer_rate: string;
  operator_payout: string;
  margin: string;
};

const ALL_CUSTOMERS: Call[] = Array.from({ length: 47 }).map((_, i) => {
  return {
    id: `C-${1000 + i}`,
    destination: ["Egypt - Eritrea", "Egypt - Sudan"][i % 2],
    prefix: `+2${(i % 9) + 1}${i % 7}/7`,
    customer_rate: `AED ${(i % 9) + 1}.${i % 3}0/min`,
    operator_payout: `AED ${(i % 2) + 1}.${i % 8}0/min`,
    margin: `AED 0.${i % 8}0`,
  };
});

const PAGE_SIZE = 8;
const PricingTable = () => {
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
  const [disableRow, setDisableRow] = React.useState<Call | null>(null);

  const filtered = React.useMemo(() => {
    return ALL_CUSTOMERS.filter((c) => {
      const matchesSearch =
        !search || c.id.toLowerCase().includes(search.toLowerCase());

      return matchesSearch;
    });
  }, [search]);

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Simulate a network call whenever a query-affecting value changes.
  React.useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [search, statusFilter, planFilter, page]);

  const columns: DataTableColumn<Call>[] = [
    { key: "id", header: "Call", width: "110px" },
    { key: "destination", header: "Destination" },
    { key: "prefix", header: "Prefix" },
    { key: "customer_rate", header: "Customer rate" },
    { key: "operator_payout", header: "Operator payout" },
    { key: "margin", header: "Margin" },
    {
      key: "margin",
      header: "Status",
      render: () => (
        <div className="flex items-center space-x-2">
          <Switch size="default" defaultChecked id="airplane-mode" />
        </div>
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
                label: "Disable",
                icon: Ban,
                onClick: () => setDisableRow(row),
              },
              {
                label: "Delete",
                icon: Trash2,
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
          title="Per-minute rates"
          columns={columns}
          data={paged}
          rowKey={(row) => row.id}
          loading={loading}
          // searchable
          searchPlaceholder="Search call id, number ..."
          searchValue={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          filters={[]}
          onFilterChange={(key, value) => {
            // if (key === "status") setStatusFilter(value);
            // if (key === "plan") setPlanFilter(value);
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
        title="Edit rate"
        description={`Edit rate and operator payout drive the platform margin per minute.`}
        footer={
          <>
            <Button variant="cancel" onClick={() => setViewRow(null)}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={() => {
                // call your delete API here
                setViewRow(null);
              }}
            >
              Create Rate
            </Button>
          </>
        }
      >
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-xs font-medium">
            Destination name
          </Label>
          <Input id="name" placeholder="Egypt - Eritrea" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-xs font-medium">
            Prefix
          </Label>
          <Input id="name" placeholder="+291 / 7" />
        </div>
        <div className="space-y-1.5 flex gap-5">
          <div className="flex-1">
            <Label htmlFor="name" className="text-xs font-medium">
              Customer rate (AED/min)
            </Label>
            <Input id="name" placeholder="1.50" />
          </div>
          <div className="flex-1">
            <Label htmlFor="name" className="text-xs font-medium">
              Operator payout (AED/min)
            </Label>
            <Input id="name" placeholder="1.00" />
          </div>
        </div>
        <div className="flex justify-between space-y-1.5">
          <p className="text-sm text-white">Status</p>
          <Switch size="default" defaultChecked id="airplane-mode" />
        </div>
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        open={!!deleteRow}
        onClose={() => setDeleteRow(null)}
        title={`Delete rate Eritrea ?`}
        description={`In-progress calls keep the current rate; new calls will be rejected until a replacement exists.`}
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
              Delete Rate
            </Button>
          </>
        }
      />
      <Modal
        open={!!disableRow}
        onClose={() => setDisableRow(null)}
        title={`Disable Eritrea — Asmara Mobile?`}
        description={`Customers will no longer be able to call this destination.`}
        footer={
          <>
            <Button variant="cancel" onClick={() => setDisableRow(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                // call your delete API here
                setDisableRow(null);
              }}
            >
              Disable
            </Button>
          </>
        }
      />
    </>
  );
};

export default PricingTable;
