"use client";

import { Download, GitCommitHorizontal } from "lucide-react";

import { AreaRechart } from "@/components/charts/area-chart";
import { PieChart } from "@/components/charts/pie_chart";
import { VerticalBarChart } from "@/components/charts/vertical-bar-chart";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useGetAnalysisQuery } from "@/redux/api/adminApi"; // adjust to your actual path

const DESTINATION_COLORS = [
  "#2F80ED",
  "#FFB547",
  "#27C281",
  "#EB5757",
  "#9B51E0",
  "#00BFA6",
];

const CallPage = () => {
  const [days, setDays] = useState<string>("30");

  const {
    data: response,
    isLoading,
    isFetching,
    isError,
  } = useGetAnalysisQuery({ days });

  const data = response?.data;
  const loading = isLoading || isFetching;

  const revenue = data?.revenue ?? 0;
  const callsCount = data?.callsCount ?? 0;
  const operatorEarnings = data?.operatorEarnings ?? 0;

  const topOperators = data?.topOperators ?? [];
  const topCustomers = data?.topCustomers ?? [];
  const topDestinations = data?.topDestinations ?? [];
  const revenueTrend = data?.revenueTrend ?? [];
  const callsByStatusWeekly = data?.callsByStatusWeekly ?? [];

  const pieData = topDestinations.map((dest:any, index:number) => ({
    label: dest.name,
    value: dest.calls,
    color: DESTINATION_COLORS[index % DESTINATION_COLORS.length],
  }));

  // ---- Export handler ----
  const handleExport = () => {
    if (!data) return;

    const escapeCsv = (val: string | number) => {
      const str = String(val);
      return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
    };

    const rows: string[] = [];

    rows.push(`Analytics Export (${days} days)`);
    rows.push("");
    rows.push("Summary");
    rows.push("Metric,Value");
    rows.push(`Revenue,${revenue}`);
    rows.push(`Calls,${callsCount}`);
    rows.push(`Operator Earnings,${operatorEarnings}`);
    rows.push("");

    rows.push("Revenue Trend");
    rows.push("Date,Revenue");
    revenueTrend.forEach((r: any) => rows.push(`${r.date},${r.revenue}`));
    rows.push("");

    rows.push("Calls By Status (Weekly)");
    rows.push("Day Of Week,Count");
    callsByStatusWeekly.forEach((r: any) => rows.push(`${r.dayOfWeek},${r.count}`));
    rows.push("");

    rows.push("Top Operators");
    rows.push("Name,Calls,Earnings");
    topOperators.forEach((o: any) =>
      rows.push(`${escapeCsv(o.name)},${o.calls},${o.earnings}`),
    );
    rows.push("");

    rows.push("Top Customers");
    rows.push("Name,Spend");
    topCustomers.forEach((c:any) => rows.push(`${escapeCsv(c.name)},${c.spend}`));
    rows.push("");

    rows.push("Top Destinations");
    rows.push("Name,Calls");
    topDestinations.forEach((d:any) =>
      rows.push(`${escapeCsv(d.name)},${d.calls}`),
    );

    const csvContent = rows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `analytics-${days}days-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-title text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground ">
            Detailed analytics across revenue, calls, operators and customers
          </p>
        </div>
        <div className="flex gap-3">
          <div className="space-y-1.5">
            <Select
              placeholder="Select time period"
              value={days}
              onValueChange={setDays}
              options={[
                { label: "30 days", value: "30" },
                { label: "15 days", value: "15" },
                { label: "7 days", value: "7" },
              ]}
            />
          </div>
          <Button onClick={handleExport} disabled={!data || loading}>
            <Download className="size-4" />
            Export
          </Button>
        </div>
      </div>

      {isError && (
        <p className="text-sm text-red-500">
          Failed to load analytics. Please try again.
        </p>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Revenue ({days}d)</CardDescription>
            {loading ? (
              <Skeleton className="h-8 w-32 mt-1" />
            ) : (
              <CardTitle className="text-2xl">
                AED {revenue.toLocaleString()}
              </CardTitle>
            )}
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Calls ({days}d)</CardDescription>
            {loading ? (
              <Skeleton className="h-8 w-20 mt-1" />
            ) : (
              <CardTitle className="text-2xl">
                {callsCount.toLocaleString()}
              </CardTitle>
            )}
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Operator earnings</CardDescription>
            {loading ? (
              <Skeleton className="h-8 w-32 mt-1" />
            ) : (
              <CardTitle className="text-2xl">
                AED {operatorEarnings.toLocaleString()}
              </CardTitle>
            )}
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="flex-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue (last {days} days)</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-80 w-full" />
            ) : (
              <>
                <AreaRechart data={revenueTrend} />
                <div className="text-primary flex gap-2 justify-center items-center">
                  <GitCommitHorizontal />
                  Revenue ($)
                </div>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Calls by status (weekly)</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-80 w-full" />
            ) : (
              <VerticalBarChart data={callsByStatusWeekly} />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Top Operators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="border p-2.5 rounded-2xl flex justify-between items-center"
                  >
                    <div className="flex items-center gap-2.5">
                      <Skeleton className="size-9 rounded-full" />
                      <div className="space-y-1.5">
                        <Skeleton className="h-3.5 w-24" />
                        <Skeleton className="h-3 w-14" />
                      </div>
                    </div>
                    <Skeleton className="h-3.5 w-16" />
                  </div>
                ))
              ) : topOperators.length === 0 ? (
                <p className="text-sm text-muted-foreground">No data yet</p>
              ) : (
                topOperators.map((operator:any, index:number) => (
                  <div
                    key={operator._id}
                    className="border p-2.5 rounded-2xl flex justify-between items-center"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="font-bold text-sm px-4 py-2.5 rounded-full bg-[#192331]">
                        {index + 1}
                      </div>
                      <div>
                        <h1 className="font-bold text-sm text-white">
                          {operator.name}
                        </h1>
                        <p className="text-sx">{operator.calls} calls</p>
                      </div>
                    </div>
                    <div className="font-bold text-sm text-white">
                      AED {operator.earnings.toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="border p-2.5 rounded-2xl flex justify-between items-center"
                  >
                    <div className="flex items-center gap-2.5">
                      <Skeleton className="size-9 rounded-full" />
                      <Skeleton className="h-3.5 w-24" />
                    </div>
                    <Skeleton className="h-3.5 w-16" />
                  </div>
                ))
              ) : topCustomers.length === 0 ? (
                <p className="text-sm text-muted-foreground">No data yet</p>
              ) : (
                topCustomers.map((customer:any, index:number) => (
                  <div
                    key={customer._id}
                    className="border p-2.5 rounded-2xl flex justify-between items-center"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="font-bold text-sm px-4 py-2.5 rounded-full bg-[#182926]">
                        {index + 1}
                      </div>
                      <div>
                        <h1 className="font-bold text-sm text-white">
                          {customer.name}
                        </h1>
                      </div>
                    </div>
                    <div className="font-bold text-sm text-white">
                      AED {customer.spend.toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Destinations</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col items-center gap-3 py-6">
                <Skeleton className="size-40 rounded-full" />
                <div className="flex gap-3">
                  <Skeleton className="h-3 w-14" />
                  <Skeleton className="h-3 w-14" />
                  <Skeleton className="h-3 w-14" />
                </div>
              </div>
            ) : (
              <PieChart showLabels data={pieData} />
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default CallPage;
