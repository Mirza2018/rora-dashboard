"use client";

import { Download, Plus } from "lucide-react";

import CustomersTable from "@/components/customers_page/customers_table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCustomerCreateMutation,
  useGetCustomerstatQuery,
  useLazyGetCustomersQuery,
} from "@/redux/api/adminApi"; // adjust to your actual path
import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CustomersPage = () => {
  const {
    data: statsResponse,
    isLoading,
    isFetching,
  } = useGetCustomerstatQuery(undefined);
  const [triggerGetCustomers, { isFetching: isExporting }] =
    useLazyGetCustomersQuery();
    
  const [createOperator, { isLoading: isCreating }] =
    useCustomerCreateMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    countryCode: "",
    countryName: "",
    phone: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  const loading = isLoading || isFetching;
  const stats = statsResponse?.data;

  const escapeCsv = (val: string | number) => {
    const str = String(val);
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };

  const handleExport = async () => {
    try {
      const res = await triggerGetCustomers({ page: 1, limit: 1000 }).unwrap();
      const customers = res?.data?.customers ?? [];

      const rows: string[] = [];
      rows.push(
        "Name,Phone,Country,Status,Balance Minutes,Distributor,Calls,Spend MTD,Joined",
      );
      customers.forEach((c: any) => {
        rows.push(
          [
            escapeCsv(c.name),
            c.phone,
            escapeCsv(c.country),
            c.status,
            c.balanceMinutes,
            c.isDistributor,
            c.calls,
            c.spendMtd,
            c.createdAt,
          ].join(","),
        );
      });

      const blob = new Blob([rows.join("\n")], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `customers-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export customers", err);
    }
  };

  const handleCreateCustomer = async () => {
    setErrorMsg("");
    try {
      const res = await createOperator(formData).unwrap();
      if (res.success || res.statusCode === 200) {
        setIsModalOpen(false);
        setFormData({
          name: "",
          countryCode: "",
          countryName: "",
          phone: "",
          password: "",
        });
      } else {
        setErrorMsg(res.message || "Failed to create customer");
      }
    } catch (err: any) {
      setErrorMsg(err.data?.message || err.message || "An error occurred");
    }
  };

  return (
    <main className="p-6 space-y-6">
      <div className="flex sm:flex-row flex-col items-center justify-between">
        <div>
          <h1 className="text-title text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground ">All RORA app users worldwide</p>
        </div>

        <div className="flex justify-end gap-3  w-full">
          <Button variant="outline" onClick={() => setIsModalOpen(true)}>
            <Plus className="size-4" />
            Add Customer
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            <Download className="size-4" />
            {isExporting ? "Exporting..." : "Export"}
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Total customers</CardDescription>
            {loading ? (
              <Skeleton className="h-8 w-16 mt-1" />
            ) : (
              <CardTitle className="text-2xl">
                {(stats?.total ?? 0).toLocaleString()}
              </CardTitle>
            )}
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Active 30d</CardDescription>
            {loading ? (
              <Skeleton className="h-8 w-16 mt-1" />
            ) : (
              <CardTitle className="text-2xl">
                {(stats?.active30d ?? 0).toLocaleString()}
              </CardTitle>
            )}
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>New this week</CardDescription>
            {loading ? (
              <Skeleton className="h-8 w-16 mt-1" />
            ) : (
              <CardTitle className="text-2xl">
                {(stats?.newThisWeek ?? 0).toLocaleString()}
              </CardTitle>
            )}
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Blocked</CardDescription>
            {loading ? (
              <Skeleton className="h-8 w-16 mt-1" />
            ) : (
              <CardTitle className="text-2xl">
                {(stats?.blocked ?? 0).toLocaleString()}
              </CardTitle>
            )}
          </CardHeader>
        </Card>
      </div>
      <CustomersTable />

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Customer"
        description="Manually add a new customer directly to the system."
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateCustomer} disabled={isCreating}>
              {isCreating ? "Saving..." : "Save"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-md">
              {errorMsg}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="e.g. Manual Customer1"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="countryCode">Country Code</Label>
              <Input
                id="countryCode"
                placeholder="e.g. +971"
                value={formData.countryCode}
                onChange={(e) =>
                  setFormData({ ...formData, countryCode: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="countryName">Country Name</Label>
              <Input
                id="countryName"
                placeholder="e.g. United Arab Emirates"
                value={formData.countryName}
                onChange={(e) =>
                  setFormData({ ...formData, countryName: e.target.value })
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              placeholder="e.g. 501234590"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="e.g. ManualPass123!"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
        </div>
      </Modal>
    </main>
  );
};

export default CustomersPage;
