"use client";

import { useState } from "react";
import { 
  Download, 
  Phone, 
  PhoneForwarded, 
  PhoneOff, 
  XCircle, 
  CheckCircle, 
  Clock, 
  Timer, 
  Hourglass, 
  Users, 
  AlertCircle 
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  Legend
} from "recharts";

import CallsTable from "@/components/calls_page/calls_table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  useGetCallStatQuery,
  useGetTrendCallsQuery,
  useGetFailurReasonsQuery,
  useLazyGetCallsQuery,
} from "@/redux/api/adminApi"; 

const formatDateForApi = (dateStr: string) => {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${d}-${m}-${y}`;
};

const formatBucketLabel = (dateStr: string) => {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const TrendBadge = ({ value, label, invertColor = false, suffix = "%" }: { value?: number | null, label: string, invertColor?: boolean, suffix?: string }) => {
  if (value === undefined || value === null) return <div className="mt-2 text-xs text-muted-foreground min-h-[16px]">&nbsp;</div>;
  const isPositive = value > 0;
  const isNegative = value < 0;
  let isGood = isPositive;
  if (invertColor) isGood = isNegative;
  
  const colorClass = value === 0 ? "text-muted-foreground" : isGood ? "text-green-500" : "text-red-500";
  const sign = isPositive ? "+" : "";
  return (
    <div className="flex items-center justify-between mt-2 text-xs">
      <span className={colorClass}>{sign}{value}{suffix}</span>
      <span className="text-muted-foreground truncate ml-2 text-right" title={label}>{label}</span>
    </div>
  );
};

export default function CallPage() {
  const [range, setRange] = useState("last30days");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [granularity, setGranularity] = useState("daily");

  const queryParams = {
    range,
    ...(range === "custom" && fromDate && toDate 
        ? { from: formatDateForApi(fromDate), to: formatDateForApi(toDate) } 
        : {})
  };

  const trendQueryParams = {
    ...queryParams,
    granularity,
  };

  const {
    data: statsResponse,
    isLoading: isLoadingStats,
    isFetching: isFetchingStats,
  } = useGetCallStatQuery(queryParams);

  const {
    data: trendResponse,
    isLoading: isLoadingTrend,
    isFetching: isFetchingTrend,
  } = useGetTrendCallsQuery(trendQueryParams);

  const {
    data: failureResponse,
    isLoading: isLoadingFailures,
    isFetching: isFetchingFailures,
  } = useGetFailurReasonsQuery(queryParams);

  const [triggerGetCalls, { isFetching: isExporting }] = useLazyGetCallsQuery();

  const loadingStats = isLoadingStats || isFetchingStats;
  const loadingTrend = isLoadingTrend || isFetchingTrend;
  const loadingFailures = isLoadingFailures || isFetchingFailures;
  
  const stats = statsResponse?.data;
  const trends = trendResponse?.data?.buckets ?? [];
  const failureStats = failureResponse?.data;

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

  const trendData = trends.map((item: any) => ({
    label: formatBucketLabel(item.bucket),
    requests: item.callRequests,
    successful: item.successfulCalls,
    minutes: item.connectedMinutes,
  }));

  const rangeOptions = [
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "Last 7 Days", value: "last7days" },
    { label: "Last 30 Days", value: "last30days" },
    { label: "This Month", value: "thismonth" },
    { label: "Custom Date Range", value: "custom" },
  ];

  return (
    <main className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-title text-3xl font-bold">Calls Dashboard</h1>
            <p className="text-muted-foreground ">
              Detailed call event sequence and usage metrics
            </p>
          </div>

          <div className="flex items-center gap-3 bg-card p-2 rounded-lg border border-card-border shadow-sm">
            <Select
              options={rangeOptions}
              value={range}
              onValueChange={setRange}
              className="w-40"
            />
            {range === "custom" && (
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-[140px]"
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-[140px]"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleExport} disabled={isExporting}>
            <Download className="size-4 mr-2" />
            {isExporting ? "Exporting..." : "Export CSV"}
          </Button>
        </div>
      </div>

      {/* Row 1 Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardDescription>Total Call Requests</CardDescription>
            <Phone className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingStats ? (
              <Skeleton className="h-8 w-20 mt-1" />
            ) : (
              <>
                <CardTitle className="text-2xl font-bold">
                  {(stats?.totalCallRequests ?? 0).toLocaleString()}
                </CardTitle>
                <TrendBadge
                  value={stats?.comparison?.totalCallRequestsChangePercent}
                  label="All incoming SIP requests"
                />
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardDescription>Successful Calls</CardDescription>
            <CheckCircle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingStats ? (
              <Skeleton className="h-8 w-20 mt-1" />
            ) : (
              <>
                <CardTitle className="text-2xl font-bold">
                  {(stats?.successfulCalls ?? 0).toLocaleString()}
                </CardTitle>
                <TrendBadge
                  value={stats?.comparison?.successfulCallsChangePercent}
                  label="Completed conversations"
                />
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardDescription>Failed Calls</CardDescription>
            <XCircle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingStats ? (
              <Skeleton className="h-8 w-20 mt-1" />
            ) : (
              <>
                <CardTitle className="text-2xl font-bold">
                  {(stats?.failedCalls ?? 0).toLocaleString()}
                </CardTitle>
                <TrendBadge
                  value={stats?.comparison?.failedCallsChangePercent}
                  label="Trunk / operator timeouts"
                  invertColor
                />
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardDescription>Cancelled Calls</CardDescription>
            <PhoneOff className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingStats ? (
              <Skeleton className="h-8 w-20 mt-1" />
            ) : (
              <>
                <CardTitle className="text-2xl font-bold">
                  {(stats?.cancelledCalls ?? 0).toLocaleString()}
                </CardTitle>
                <TrendBadge
                  value={stats?.comparison?.cancelledCallsChangePercent}
                  label="Abandoned before pickup"
                  invertColor
                />
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardDescription>Call Success Rate</CardDescription>
            <div className="text-muted-foreground font-bold text-xs">%</div>
          </CardHeader>
          <CardContent>
            {loadingStats ? (
              <Skeleton className="h-8 w-20 mt-1" />
            ) : (
              <>
                <CardTitle className="text-2xl font-bold">
                  {stats?.callSuccessRatePercent ?? 0}%
                </CardTitle>
                <TrendBadge
                  value={stats?.comparison?.callSuccessRateChangePoints}
                  label="Successful / Total Volume"
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 2 Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardDescription>Connected Minutes</CardDescription>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingStats ? (
              <Skeleton className="h-8 w-20 mt-1" />
            ) : (
              <>
                <CardTitle className="text-2xl font-bold">
                  {(stats?.connectedMinutes ?? 0).toLocaleString()}{" "}
                  <span className="text-base font-normal">m</span>
                </CardTitle>
                <TrendBadge
                  value={stats?.comparison?.connectedMinutesChangePercent}
                  label="Billable voice traffic"
                />
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardDescription>Avg Call Duration</CardDescription>
            <Timer className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingStats ? (
              <Skeleton className="h-8 w-20 mt-1" />
            ) : (
              <>
                <CardTitle className="text-2xl font-bold">
                  {stats?.avgCallDurationMinutes ?? 0}{" "}
                  <span className="text-base font-normal">min</span>
                </CardTitle>
                <TrendBadge
                  value={stats?.comparison?.avgCallDurationChangeMinutes}
                  label="Connected calls only"
                  suffix="m"
                />
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardDescription>Avg Connection Time</CardDescription>
            <Hourglass className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingStats ? (
              <Skeleton className="h-8 w-20 mt-1" />
            ) : (
              <>
                <CardTitle className="text-2xl font-bold">
                  {stats?.avgConnectionTimeSeconds ?? 0}{" "}
                  <span className="text-base font-normal">s</span>
                </CardTitle>
                <TrendBadge
                  value={stats?.comparison?.avgConnectionTimeChangeSeconds}
                  label="Dial-to-voice connection"
                  suffix="s"
                  invertColor
                />
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardDescription>Unique Callers</CardDescription>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingStats ? (
              <Skeleton className="h-8 w-20 mt-1" />
            ) : (
              <>
                <CardTitle className="text-2xl font-bold">
                  {(stats?.uniqueCallers ?? 0).toLocaleString()}
                </CardTitle>
                <TrendBadge
                  value={stats?.comparison?.uniqueCallersChangePercent}
                  label="Distinct customer accounts"
                />
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardDescription>Dropped Calls / Rate</CardDescription>
            <AlertCircle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingStats ? (
              <Skeleton className="h-8 w-20 mt-1" />
            ) : (
              <>
                <CardTitle className="text-2xl font-bold">
                  {stats?.droppedCalls ?? 0}{" "}
                  <span className="text-base font-normal text-muted-foreground">
                    ({stats?.droppedRatePercent ?? 0}%)
                  </span>
                </CardTitle>
                <TrendBadge
                  value={stats?.comparison?.droppedCallsChangePercent}
                  label="Cellular disconnects"
                  invertColor
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 3 Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="flex-1 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Calls & Minutes Trend</CardTitle>
              <CardDescription>
                Call requests vs. successfully bridged voice minutes
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {["daily", "weekly", "monthly"].map((gran) => (
                <Button
                  key={gran}
                  variant={granularity === gran ? "default" : "outline"}
                  size="sm"
                  className="h-7 text-xs px-3 rounded-full"
                  onClick={() => setGranularity(gran)}
                >
                  {gran.charAt(0).toUpperCase() + gran.slice(1)}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            {loadingTrend ? (
              <Skeleton className="h-[320px] w-full" />
            ) : trendData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-20">
                No trend data available.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart
                  data={trendData}
                  margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
                  barGap={4}
                >
                  <CartesianGrid
                    stroke="#414144"
                    strokeDasharray="4"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tick={{ fill: "#BFBFBF", fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    yAxisId="left"
                    stroke="white"
                    fontSize={10}
                    tick={{ fill: "#BFBFBF", fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="white"
                    fontSize={10}
                    tick={{ fill: "#BFBFBF", fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <RechartsTooltip
                    cursor={{
                      fill: "rgba(255, 255, 255, 0.03)",
                    }}
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--card-border)",
                      borderRadius: 8,
                      color: "var(--foreground)",
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: "20px" }} />
                  <Bar
                    yAxisId="left"
                    dataKey="requests"
                    name="Call Requests"
                    fill="#3b82f6"
                    radius={[2, 2, 0, 0]}
                    barSize={14}
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="successful"
                    name="Successful Calls"
                    fill="#22c55e"
                    radius={[2, 2, 0, 0]}
                    barSize={14}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="minutes"
                    name="Connected Minutes"
                    fill="#8b5cf6"
                    radius={[2, 2, 0, 0]}
                    barSize={14}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-6">
            <CardTitle>Call Status Breakdown</CardTitle>
            <div className="text-sm text-muted-foreground">
              Total: {stats?.callsByStatus?.total?.toLocaleString() ?? 0}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {loadingStats ? (
                <Skeleton className="h-60 w-full" />
              ) : (
                <>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                        <span className="text-muted-foreground">
                          Completed Calls
                        </span>
                      </div>
                      <div className="font-medium">
                        {(
                          stats?.callsByStatus?.completed ?? 0
                        ).toLocaleString()}{" "}
                        <span className="text-green-500 font-semibold ml-1">
                          (
                          {stats?.callsByStatus?.completedPercent?.toFixed(1) ??
                            0}
                          %)
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-green-500"
                        style={{
                          width: `${stats?.callsByStatus?.completedPercent ?? 0}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        <span className="text-muted-foreground">
                          Failed Calls
                        </span>
                      </div>
                      <div className="font-medium">
                        {(stats?.callsByStatus?.failed ?? 0).toLocaleString()}{" "}
                        <span className="text-red-500 font-semibold ml-1">
                          (
                          {stats?.callsByStatus?.failedPercent?.toFixed(1) ?? 0}
                          %)
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-red-500"
                        style={{
                          width: `${stats?.callsByStatus?.failedPercent ?? 0}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                        <span className="text-muted-foreground">
                          Cancelled Calls
                        </span>
                      </div>
                      <div className="font-medium">
                        {(
                          stats?.callsByStatus?.cancelled ?? 0
                        ).toLocaleString()}{" "}
                        <span className="text-orange-500 font-semibold ml-1">
                          (
                          {stats?.callsByStatus?.cancelledPercent?.toFixed(1) ??
                            0}
                          %)
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-orange-500"
                        style={{
                          width: `${stats?.callsByStatus?.cancelledPercent ?? 0}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                        <span className="text-muted-foreground">
                          Dropped Calls
                        </span>
                      </div>
                      <div className="font-medium">
                        {(stats?.callsByStatus?.dropped ?? 0).toLocaleString()}{" "}
                        <span className="text-purple-500 font-semibold ml-1">
                          (
                          {stats?.callsByStatus?.droppedPercent?.toFixed(1) ??
                            0}
                          %)
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-purple-500"
                        style={{
                          width: `${stats?.callsByStatus?.droppedPercent ?? 0}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="pt-6 mt-4 border-t border-card-border flex justify-between items-center text-xs">
                    <div className="text-muted-foreground">
                      SLA Target: 90.0%
                    </div>
                    <div
                      className={
                        (stats?.callSuccessRatePercent ?? 0) >= 90
                          ? "text-green-500 font-semibold"
                          : "text-red-500 font-semibold"
                      }
                    >
                      {((stats?.callSuccessRatePercent ?? 0) - 90).toFixed(1)}%{" "}
                      {(stats?.callSuccessRatePercent ?? 0) >= 90
                        ? "Above"
                        : "Below"}{" "}
                      Target
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground text-right mt-1">
                    Platform reliability threshold evaluated for current billing
                    cycle.
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 4 Failure Reasons */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Failure Reason Root-Cause Analysis</CardTitle>
            <CardDescription>
              Ranked analysis of {failureStats?.totalFailures ?? 0} failed call
              events across all telecom gateways
            </CardDescription>
          </div>
          <div className="px-3 py-1 bg-red-500/10 text-red-500 font-semibold rounded text-sm border border-red-500/20">
            {failureStats?.totalFailures ?? 0} Total Failures
          </div>
        </CardHeader>
        <CardContent>
          {loadingFailures ? (
            <Skeleton className="h-60 w-full" />
          ) : failureStats?.reasons?.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-10">
              No failure data available.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {failureStats?.reasons?.map((r: any, i: number) => (
                <div
                  key={r.reason}
                  className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-white/20 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm font-semibold text-title flex gap-2">
                      <span className="text-muted-foreground text-xs font-normal">
                        #{i + 1}
                      </span>
                      <span className="line-clamp-1" title={r.label}>
                        {r.label}
                      </span>
                    </div>
                    <div className="text-red-500 font-bold text-sm whitespace-nowrap">
                      {r.count} calls
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground mb-4 min-h-[30px] line-clamp-2">
                    {/* Hardcoding brief descriptions based on reason to match mockup feel, or fallback to label */}
                    {r.reason === "cancelled_by_caller"
                      ? "Caller hung up before bridge connection was completed"
                      : r.reason === "invalid_number"
                        ? "Destination number formatted incorrectly or unassigned"
                        : r.reason === "customer_no_answer"
                          ? "Customer app rang timeout (45s) without pick-up"
                          : r.reason === "network_issue"
                            ? "Carrier SIM hardware disconnect / signal loss"
                            : r.reason === "destination_unreachable"
                              ? "Carrier circuit busy or trunk disconnect in destination country"
                              : r.reason === "operator_timeout"
                                ? "No available online operator accepted within 30s SLA"
                                : "SIP code 503 service unavailable / gateway reset"}
                  </p>
                  <div className="flex justify-between items-center text-xs w-full gap-4">
                    <div className="flex-1 bg-white/10 rounded-full h-1">
                      <div
                        className="bg-red-500 h-1 rounded-full"
                        style={{ width: `${Math.min(r.percent, 100)}%` }}
                      />
                    </div>
                    <div className="flex gap-3 min-w-[100px] justify-end">
                      <span className="font-semibold">
                        {r.percent?.toFixed(1) ?? 0}%
                      </span>
                      <span
                        className={
                          r.changePercent > 0
                            ? "text-green-500"
                            : r.changePercent < 0
                              ? "text-red-500"
                              : "text-muted-foreground"
                        }
                      >
                        {r.changePercent
                          ? `${r.changePercent > 0 ? "+" : ""}${r.changePercent}% vs 7d`
                          : "0.0% vs 7d"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Full History Table */}
      <div className="mt-8">
        <h2 className="text-title text-xl font-bold mb-4">
          Full Call History Ledger
        </h2>
        <CallsTable
          dateRange={range}
          customFrom={fromDate ? formatDateForApi(fromDate) : ""}
          customTo={toDate ? formatDateForApi(toDate) : ""}
        />
      </div>
    </main>
  );
}
