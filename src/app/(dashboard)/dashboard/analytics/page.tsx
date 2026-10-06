"use client";

import { Download, GitCommitHorizontal, ArrowUpRight, ArrowDownRight } from "lucide-react";

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
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { useGetAnalysisQuery } from "@/redux/api/adminApi";

const DESTINATION_COLORS = [
  "#2F80ED",
  "#FFB547",
  "#27C281",
  "#EB5757",
  "#9B51E0",
  "#00BFA6",
];

const rangeLabels: Record<string, string> = {
  today: "Today",
  yesterday: "Yesterday",
  last7days: "Last 7 days",
  last30days: "Last 30 days",
  thismonth: "This month",
  custom: "Custom",
};

const CallPage = () => {
  const [range, setRange] = useState<string>("last30days");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const queryParams = useMemo(() => {
    const params: any = { range };
    if (range === "custom") {
      if (fromDate && toDate) {
        // convert from YYYY-MM-DD to DD-MM-YYYY
        const [fYear, fMonth, fDay] = fromDate.split("-");
        params.from = `${fDay}-${fMonth}-${fYear}`;
        const [tYear, tMonth, tDay] = toDate.split("-");
        params.to = `${tDay}-${tMonth}-${tYear}`;
      }
    }
    return params;
  }, [range, fromDate, toDate]);

  const {
    data: response,
    isLoading,
    isFetching,
    isError,
  } = useGetAnalysisQuery(queryParams, {
    skip: range === "custom" && (!fromDate || !toDate),
  });

  const data = response?.data;
  const loading = isLoading || isFetching;

  const revenue = data?.revenue ?? 0;
  const callsCount = data?.callsCount ?? 0;
  const operatorEarnings = data?.operatorEarnings ?? 0;
  const connectedCallRatePercent = data?.connectedCallRatePercent ?? 0;
  const comparison = data?.comparison ?? {};

  const topOperators = data?.topOperators ?? [];
  const topCustomers = data?.topCustomers ?? [];
  const topDestinations = data?.topDestinations ?? [];
  const topDistributors = data?.topDistributors ?? [];
  
  const revenueTrend = data?.revenueTrend ?? [];
  const callRequestsTrend = data?.callRequestsTrend ?? [];
  const connectedMinutesTrend = data?.connectedMinutesTrend ?? [];
  const callsByStatusWeekly = data?.callsByStatusWeekly ?? [];

  const pieData = topDestinations.map((dest: any, index: number) => ({
    label: dest.name,
    value: dest.calls,
    color: DESTINATION_COLORS[index % DESTINATION_COLORS.length],
  }));

  // ---- Export handler ----
  const handleExport = () => {
    if (!data) return;

    const escapeCsv = (val: string | number | undefined | null) => {
      if (val === null || val === undefined) return "";
      const str = String(val);
      return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
    };

    const rows: string[] = [];

    rows.push(`Analytics Export (${rangeLabels[range] || range})`);
    if (range === "custom") {
      rows.push(`Period: ${fromDate} to ${toDate}`);
    }
    rows.push("");
    rows.push("Summary");
    rows.push("Metric,Value");
    rows.push(`Revenue,${revenue}`);
    rows.push(`Calls,${callsCount}`);
    rows.push(`Operator Earnings,${operatorEarnings}`);
    rows.push(`Connected Call Rate (%),${connectedCallRatePercent}`);
    rows.push("");

    rows.push("Revenue Trend");
    rows.push("Date,Revenue");
    revenueTrend.forEach((r: any) => rows.push(`${r.date},${r.revenue}`));
    rows.push("");

    rows.push("Call Requests Trend");
    rows.push("Date,Count");
    callRequestsTrend.forEach((r: any) => rows.push(`${r.date},${r.count}`));
    rows.push("");

    rows.push("Connected Minutes Trend");
    rows.push("Date,Minutes");
    connectedMinutesTrend.forEach((r: any) => rows.push(`${r.date},${r.minutes}`));
    rows.push("");

    rows.push("Calls By Status (Weekly)");
    rows.push("Day Of Week,Day Name,Count,Percent");
    callsByStatusWeekly.forEach((r: any) =>
      rows.push(`${r.dayOfWeek},${r.dayName},${r.count},${r.percent}`),
    );
    rows.push("");

    rows.push("Top Operators");
    rows.push("Name,Calls,Earnings,Minutes,Success Rate(%)");
    topOperators.forEach((o: any) =>
      rows.push(`${escapeCsv(o.name)},${o.calls},${o.earnings},${o.minutes},${o.successRatePercent}`),
    );
    rows.push("");

    rows.push("Top Customers");
    rows.push("Name,Spend");
    topCustomers.forEach((c: any) =>
      rows.push(`${escapeCsv(c.name)},${c.spend}`),
    );
    rows.push("");

    rows.push("Top Distributors");
    rows.push("Name,Phone,Total Minutes,Commission");
    topDistributors.forEach((d: any) =>
      rows.push(`${escapeCsv(d.name)},${escapeCsv(d.phone)},${d.totalMinutes},${d.commission}`),
    );
    rows.push("");

    rows.push("Top Destinations");
    rows.push("Name,Calls,Percent");
    topDestinations.forEach((d: any) =>
      rows.push(`${escapeCsv(d.name)},${d.calls},${d.percent}`),
    );

    const csvContent = rows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `analytics-${range}-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderChange = (percent: number | null | undefined, suffix = "%", isPoints = false) => {
    if (percent === null || percent === undefined) return null;
    const isPositive = percent > 0;
    const isNegative = percent < 0;
    return (
      <div className={`text-sm mt-2 flex items-center gap-1 ${isPositive ? 'text-green-500' : isNegative ? 'text-red-500' : 'text-muted-foreground'}`}>
        {isPositive ? <ArrowUpRight className="size-4" /> : isNegative ? <ArrowDownRight className="size-4" /> : null}
        <span>{Math.abs(percent)}{suffix} {isPoints ? 'points' : ''} from previous period</span>
      </div>
    );
  };

  return (
    <main className="p-6 space-y-6">
      <div className="flex sm:flex-row flex-col items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-title text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground ">
            Detailed analytics across revenue, calls, operators, customers and
            distributors
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 w-full sm:w-auto">
          {range === "custom" && (
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-[140px]"
              />
              <span className="text-muted-foreground">to</span>
              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-[140px]"
              />
            </div>
          )}
          <div className="w-40">
            <Select
              placeholder="Select time period"
              value={range}
              onValueChange={setRange}
              options={[
                { label: "Today", value: "today" },
                { label: "Yesterday", value: "yesterday" },
                { label: "Last 7 days", value: "last7days" },
                { label: "Last 30 days", value: "last30days" },
                { label: "This month", value: "thismonth" },
                { label: "Custom", value: "custom" },
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
        <p className="text-sm text-status-failed bg-status-failed/10 p-3 rounded-md border border-status-failed/20">
          Failed to load analytics. Please try again.
        </p>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Revenue</CardDescription>
            {loading ? (
              <Skeleton className="h-8 w-32 mt-1" />
            ) : (
              <div>
                <CardTitle className="text-2xl">
                  AED {revenue.toLocaleString()}
                </CardTitle>
                {renderChange(comparison.revenueChangePercent)}
              </div>
            )}
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Calls</CardDescription>
            {loading ? (
              <Skeleton className="h-8 w-20 mt-1" />
            ) : (
              <div>
                <CardTitle className="text-2xl">
                  {callsCount.toLocaleString()}
                </CardTitle>
                {renderChange(comparison.callsChangePercent)}
              </div>
            )}
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Operator earnings</CardDescription>
            {loading ? (
              <Skeleton className="h-8 w-32 mt-1" />
            ) : (
              <div>
                <CardTitle className="text-2xl">
                  AED {operatorEarnings.toLocaleString()}
                </CardTitle>
                {renderChange(comparison.operatorEarningsChangePercent)}
              </div>
            )}
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Connected Call Rate</CardDescription>
            {loading ? (
              <Skeleton className="h-8 w-24 mt-1" />
            ) : (
              <div>
                <CardTitle className="text-2xl">
                  {connectedCallRatePercent}%
                </CardTitle>
                {renderChange(
                  comparison.connectedCallRateChangePoints,
                  "",
                  true,
                )}
              </div>
            )}
          </CardHeader>
        </Card>
      </div>

      {/* Primary Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="flex-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-80 w-full" />
            ) : (
              <>
                <AreaRechart
                  data={revenueTrend}
                  xKey="date"
                  yKey="revenue"
                  color="var(--chart-bar-1)"
                />
                <div className="text-primary flex gap-2 justify-center items-center mt-2">
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

      {/* Secondary Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Call Requests Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-80 w-full" />
            ) : (
              <>
                <AreaRechart
                  data={callRequestsTrend}
                  xKey="date"
                  yKey="count"
                  color="#2F80ED"
                />
                <div className="text-[#2F80ED] flex gap-2 justify-center items-center mt-2">
                  <GitCommitHorizontal />
                  Requests Count
                </div>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Connected Minutes Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-80 w-full" />
            ) : (
              <>
                <AreaRechart
                  data={connectedMinutesTrend}
                  xKey="date"
                  yKey="minutes"
                  color="#27C281"
                />
                <div className="text-[#27C281] flex gap-2 justify-center items-center mt-2">
                  <GitCommitHorizontal />
                  Minutes
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Lists */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
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
                topOperators.map((operator: any, index: number) => (
                  <div
                    key={operator.id || operator._id}
                    className="border p-2.5 rounded-2xl flex justify-between items-center"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="font-bold text-sm px-4 py-2.5 rounded-full bg-[#192331]">
                        {index + 1}
                      </div>
                      <div className="overflow-hidden">
                        <h1 className="font-bold text-sm text-white truncate pr-2">
                          {operator.name}
                        </h1>
                        <p className="text-xs text-muted-foreground">
                          {operator.calls} calls
                        </p>
                      </div>
                    </div>
                    <div className="font-bold text-sm text-white shrink-0">
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
                topCustomers.map((customer: any, index: number) => (
                  <div
                    key={customer._id || customer.id}
                    className="border p-2.5 rounded-2xl flex justify-between items-center"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="font-bold text-sm px-4 py-2.5 rounded-full bg-[#182926]">
                        {index + 1}
                      </div>
                      <div className="overflow-hidden">
                        <h1 className="font-bold text-sm text-white truncate pr-2">
                          {customer.name}
                        </h1>
                      </div>
                    </div>
                    <div className="font-bold text-sm text-white shrink-0">
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
            <CardTitle>Top Distributors</CardTitle>
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
              ) : topDistributors.length === 0 ? (
                <p className="text-sm text-muted-foreground">No data yet</p>
              ) : (
                topDistributors.map((distributor: any, index: number) => (
                  <div
                    key={distributor.id || distributor._id}
                    className="border p-2.5 rounded-2xl flex justify-between items-center"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="font-bold text-sm px-4 py-2.5 rounded-full bg-[#2a1b38]">
                        {index + 1}
                      </div>
                      <div className="overflow-hidden">
                        <h1 className="font-bold text-sm text-white truncate pr-2">
                          {distributor.name}
                        </h1>
                        <p className="text-xs text-muted-foreground">
                          {distributor.totalMinutes} mins
                        </p>
                      </div>
                    </div>
                    <div className="font-bold text-sm text-white shrink-0">
                      AED {distributor.commission.toLocaleString()}
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
            ) : topDestinations.length === 0 ? (
              <p className="text-sm text-muted-foreground">No data yet</p>
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
