"use client";

import { Download } from "lucide-react";

import CallsTable from "@/components/calls_page/calls_table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetCallStatQuery,
  useLazyGetCallsQuery,
} from "@/redux/api/adminApi"; // adjust to your actual path

const CallPage = () => {
  const {
    data: statsResponse,
    isLoading,
    isFetching,
  } = useGetCallStatQuery(undefined);
  const [triggerGetCalls, { isFetching: isExporting }] = useLazyGetCallsQuery();

  const loading = isLoading || isFetching;
  const stats = statsResponse?.data;

  const escapeCsv = (val: string | number) => {
    const str = String(val);
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };

  const handleExport = async () => {
    try {
      const res = await triggerGetCalls({ page: 1, limit: 1000 }).unwrap();
      const calls = res?.data?.calls ?? [];

      const rows: string[] = [];
      rows.push(
        "Call Ref,Date,Customer,Operator,Destination,Number Dialed,Minutes,Charged,Status,Failure Reason",
      );
      calls.forEach((c: any) => {
        rows.push(
          [
            c.callRef,
            c.createdAt,
            escapeCsv(c.customerId?.name ?? ""),
            escapeCsv(c.operatorId?.name ?? ""),
            escapeCsv(c.destinationId?.name ?? ""),
            c.numberDialed,
            c.minutesUsed ?? 0,
            c.costMoney ?? 0,
            c.status,
            c.failureReason ?? "",
          ].join(","),
        );
      });

      const blob = new Blob([rows.join("\n")], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `calls-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export calls", err);
    }
  };

  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-title text-3xl font-bold">Calls</h1>
          <p className="text-muted-foreground ">
            Overview of your store performance
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleExport} disabled={isExporting}>
            <Download className="size-4" />
            {isExporting ? "Exporting..." : "Export"}
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Completed today</CardDescription>
            {loading ? (
              <Skeleton className="h-8 w-20 mt-1" />
            ) : (
              <CardTitle className="text-2xl">
                {(stats?.completedToday ?? 0).toLocaleString()}
              </CardTitle>
            )}
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Failed today</CardDescription>
            {loading ? (
              <Skeleton className="h-8 w-20 mt-1" />
            ) : (
              <CardTitle className="text-2xl">
                {(stats?.failedToday ?? 0).toLocaleString()}
              </CardTitle>
            )}
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Avg duration</CardDescription>
            {loading ? (
              <Skeleton className="h-8 w-20 mt-1" />
            ) : (
              <CardTitle className="text-2xl">
                {(stats?.avgDurationMinutes ?? 0).toFixed(1)} min
              </CardTitle>
            )}
          </CardHeader>
        </Card>
      </div>
      <CallsTable />
    </main>
  );
};

export default CallPage;
