"use client";

import { Download } from "lucide-react";

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
  useGetCustomerstatQuery,
  useLazyGetCustomersQuery,
} from "@/redux/api/adminApi"; // adjust to your actual path

const CustomersPage = () => {
  const {
    data: statsResponse,
    isLoading,
    isFetching,
  } = useGetCustomerstatQuery(undefined);
  const [triggerGetCustomers, { isFetching: isExporting }] =
    useLazyGetCustomersQuery();

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

  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-title text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground ">All RORA app users worldwide</p>
        </div>
        <div className="flex gap-3">
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
    </main>
  );
};

export default CustomersPage;
