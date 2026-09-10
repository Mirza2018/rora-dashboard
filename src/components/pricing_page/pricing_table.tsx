"use client";

import { SearchX, SquarePen, Trash2 } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Modal } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu } from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import {
  useEditDestinationMutation,
  useUpdateDestinationSatusMutation,
  useDeleteDestinationMutation,
} from "@/redux/api/adminApi"; // adjust to your actual path

// ── API-shaped destination type ────────────────────────────────
type Destination = {
  _id: string;
  name: string;
  prefix: string;
  customerRatePerMin: number;
  operatorPayoutPerMin: number;
  marginPerMin: number;
  status: "active" | "disabled";
  createdAt: string;
  updatedAt: string;
};

const PAGE_SIZE = 8;

type PricingTableProps = {
  destinations: Destination[];
  loading: boolean;
};

const PricingTable = ({ destinations, loading }: PricingTableProps) => {
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);

  // Modal state
  const [editRow, setEditRow] = React.useState<Destination | null>(null);
  const [deleteRow, setDeleteRow] = React.useState<Destination | null>(null);

  // Edit form fields
  const [editName, setEditName] = React.useState("");
  const [editPrefix, setEditPrefix] = React.useState("");
  const [editCustomerRate, setEditCustomerRate] = React.useState("");
  const [editOperatorPayout, setEditOperatorPayout] = React.useState("");
  const [editStatus, setEditStatus] = React.useState(true); // true = active

  const [editDestination, { isLoading: isEditing }] =
    useEditDestinationMutation();
  const [updateStatus] = useUpdateDestinationSatusMutation();
  const [deleteDestination, { isLoading: isDeleting }] =
    useDeleteDestinationMutation();

  const filtered = React.useMemo(() => {
    if (!search) return destinations;
    const q = search.toLowerCase();
    return destinations.filter(
      (d) =>
        d.name.toLowerCase().includes(q) || d.prefix.toLowerCase().includes(q),
    );
  }, [destinations, search]);

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openEdit = (row: Destination) => {
    setEditRow(row);
    setEditName(row.name);
    setEditPrefix(row.prefix);
    setEditCustomerRate(String(row.customerRatePerMin));
    setEditOperatorPayout(String(row.operatorPayoutPerMin));
    setEditStatus(row.status === "active");
  };

  const closeEdit = () => {
    setEditRow(null);
    setEditName("");
    setEditPrefix("");
    setEditCustomerRate("");
    setEditOperatorPayout("");
  };

  const handleEditSave = async () => {
    if (!editRow) return;

    const toastId = toast.loading("Updating rate...");
    try {
      await editDestination({
        id: editRow._id,
        data: {
          name: editName.trim(),
          prefix: editPrefix.trim(),
          customerRatePerMin: Number(editCustomerRate),
          operatorPayoutPerMin: Number(editOperatorPayout),
        },
      }).unwrap();

      // Status is a separate endpoint — only call it if it actually changed.
      const newStatus = editStatus ? "active" : "disabled";
      if (newStatus !== editRow.status) {
        await updateStatus({
          id: editRow._id,
          data: { status: newStatus },
        }).unwrap();
      }

      toast.success("Rate updated successfully.", { id: toastId });
      closeEdit();
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to update rate.", {
        id: toastId,
      });
    }
  };

  const handleStatusToggle = async (row: Destination, checked: boolean) => {
    const newStatus = checked ? "active" : "disabled";
    const toastId = toast.loading(
      checked ? "Activating destination..." : "Disabling destination...",
    );
    try {
      await updateStatus({
        id: row._id,
        data: { status: newStatus },
      }).unwrap();
      toast.success(
        checked ? "Destination activated." : "Destination disabled.",
        { id: toastId },
      );
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to update status.", {
        id: toastId,
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteRow) return;

    const toastId = toast.loading("Deleting rate...");
    try {
      await deleteDestination(deleteRow._id).unwrap();
      toast.success("Rate deleted successfully.", { id: toastId });
      setDeleteRow(null);
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to delete rate.", {
        id: toastId,
      });
    }
  };

  const columns: DataTableColumn<Destination>[] = [
    { key: "name", header: "Destination" },
    { key: "prefix", header: "Prefix", width: "120px" },
    {
      key: "customerRatePerMin",
      header: "Customer rate",
      render: (row) => <p>AED {row.customerRatePerMin.toFixed(2)}/min</p>,
    },
    {
      key: "operatorPayoutPerMin",
      header: "Operator payout",
      render: (row) => <p>AED {row.operatorPayoutPerMin.toFixed(2)}/min</p>,
    },
    {
      key: "marginPerMin",
      header: "Margin",
      render: (row) => <p>AED {row.marginPerMin.toFixed(2)}</p>,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <div className="flex items-center space-x-2">
          <Switch
            size="default"
            checked={row.status === "active"}
            onCheckedChange={(checked) => handleStatusToggle(row, checked)}
            id={`status-${row._id}`}
          />
        </div>
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
                label: "Edit details",
                icon: SquarePen,
                onClick: () => openEdit(row),
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
          rowKey={(row) => row._id}
          loading={loading}
          searchable
          searchPlaceholder="Search destination, prefix ..."
          searchValue={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          filters={[]}
          onFilterChange={() => setPage(1)}
          pagination={{
            page,
            pageSize: PAGE_SIZE,
            totalItems: filtered.length,
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
                <p className="text-sm">No destinations match your search.</p>
              </div>
            )
          }
        />
      </main>

      {/* Edit rate modal */}
      <Modal
        open={!!editRow}
        onClose={closeEdit}
        title="Edit rate"
        description="Edit rate and operator payout drive the platform margin per minute."
        footer={
          <>
            <Button variant="cancel" onClick={closeEdit} disabled={isEditing}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleEditSave}
              disabled={isEditing}
            >
              {isEditing ? "Saving..." : "Edit Rate"}
            </Button>
          </>
        }
      >
        <div className="space-y-1.5">
          <Label htmlFor="editName" className="text-xs font-medium">
            Destination name
          </Label>
          <Input
            id="editName"
            placeholder="Egypt - Eritrea"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="editPrefix" className="text-xs font-medium">
            Prefix
          </Label>
          <Input
            id="editPrefix"
            placeholder="+291 / 7"
            value={editPrefix}
            onChange={(e) => setEditPrefix(e.target.value)}
          />
        </div>
        <div className="space-y-1.5 flex gap-5">
          <div className="flex-1">
            <Label htmlFor="editCustRate" className="text-xs font-medium">
              Customer rate (AED/min)
            </Label>
            <Input
              id="editCustRate"
              type="number"
              step="0.01"
              min={0}
              placeholder="1.50"
              value={editCustomerRate}
              onChange={(e) => setEditCustomerRate(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="editOpPayout" className="text-xs font-medium">
              Operator payout (AED/min)
            </Label>
            <Input
              id="editOpPayout"
              type="number"
              step="0.01"
              min={0}
              placeholder="1.00"
              value={editOperatorPayout}
              onChange={(e) => setEditOperatorPayout(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-between items-center space-y-1.5">
          <p className="text-sm text-white">Status</p>
          <Switch
            size="default"
            checked={editStatus}
            onCheckedChange={setEditStatus}
            id="edit-status"
          />
        </div>
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        open={!!deleteRow}
        onClose={() => setDeleteRow(null)}
        title={`Delete rate ${deleteRow?.name ?? ""}?`}
        description="In-progress calls keep the current rate; new calls will be rejected until a replacement exists."
        footer={
          <>
            <Button
              variant="cancel"
              onClick={() => setDeleteRow(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Rate"}
            </Button>
          </>
        }
      />
    </>
  );
};

export default PricingTable;
