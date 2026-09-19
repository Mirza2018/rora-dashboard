"use client";

import { Download } from "lucide-react";
import { useState } from "react";

import PayoutsTable from "@/components/payouts_page/payouts_table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetPayoutStarQuery,
  useLazyGetAllPayoutQuery,
} from "@/redux/api/adminApi"; // adjust to your actual path

const PayoutsPage = () => {
  const {
    data: statsResponse,
    isLoading,
    isFetching,
  } = useGetPayoutStarQuery(undefined);
  const [triggerGetAllPayout, { isFetching: isExporting }] =
    useLazyGetAllPayoutQuery();

  const loading = isLoading || isFetching;
  const stats = statsResponse?.data;

  const escapeCsv = (val: string | number) => {
    const str = String(val);
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };

  const handleExport = async () => {
    try {
      // Pull a large page to cover the full payout list for export.
      const res = await triggerGetAllPayout({ page: 1, limit: 1000 }).unwrap();
      const payouts = res?.data?.payouts ?? [];

      const rows: string[] = [];
      rows.push("Payout Ref,Operator,Amount,Method,Bank,Account,Status,Date");
      payouts.forEach((p: any) => {
        rows.push(
          [
            p.payoutRef,
            escapeCsv(p.operatorId?.name ?? ""),
            p.amountMoney,
            p.method,
            escapeCsv(p.bankName ?? ""),
            p.accountNumber ?? "",
            p.status,
            p.createdAt,
          ].join(","),
        );
      });

      const blob = new Blob([rows.join("\n")], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `payouts-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export payouts", err);
    }
  };

  return (
    <main className="p-6 space-y-6">
      <div className="flex sm:flex-row flex-col items-center justify-between">
        <div>
          <h1 className="text-title text-3xl font-bold">Payouts</h1>
          <p className="text-muted-foreground ">
            Review, approve and track operator payouts
          </p>
        </div>

        <div className="flex justify-end gap-3  w-full">
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
            <CardDescription>Pending</CardDescription>
            {loading ? (
              <Skeleton className="h-8 w-32 mt-1" />
            ) : (
              <CardTitle className="text-2xl">
                AED {(stats?.pending?.amount ?? 0).toLocaleString()}
                <span className="text-sm text-muted-foreground font-normal ml-1">
                  ({stats?.pending?.count ?? 0})
                </span>
              </CardTitle>
            )}
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Paid MTD</CardDescription>
            {loading ? (
              <Skeleton className="h-8 w-32 mt-1" />
            ) : (
              <CardTitle className="text-2xl">
                AED {(stats?.paidMtd ?? 0).toLocaleString()}
              </CardTitle>
            )}
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Rejected</CardDescription>
            {loading ? (
              <Skeleton className="h-8 w-32 mt-1" />
            ) : (
              <CardTitle className="text-2xl">
                AED {(stats?.rejected ?? 0).toLocaleString()}
              </CardTitle>
            )}
          </CardHeader>
        </Card>
      </div>
      <PayoutsTable />
    </main>
  );
};

export default PayoutsPage;
