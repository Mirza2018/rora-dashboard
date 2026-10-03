"use client"
import { useState } from "react";
import {
  ArrowUpRight,
  GitCommitHorizontal,
  Users,
  CheckCircle,
  Clock,
  DollarSign,
  PhoneForwarded,
  Headset,
  Share2,
  UserPlus,
  AlertTriangle,
  Zap,
  Activity,
} from "lucide-react";

import { AreaRechart } from "@/components/charts/area-chart";
import { PieChart } from "@/components/charts/pie_chart";
import OverviewTable from "@/components/overview_page/overview_table";
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
import { useGetOverviewQuery } from "@/redux/api/adminApi";

const STATUS_COLORS: Record<string, string> = {
  completed: "#22c55e",
  failed: "#ef4444",
  cancelled: "#f59e0b",
  dropped: "#8b5cf6",
};

const statusLabel = (status: string) =>
  status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

type AttentionItem = {
  id: string;
  title: string;
  description: string;
  color: string;
};

const buildAttentionItems = (needsAttention?: any): AttentionItem[] => {
  if (!needsAttention) return [];
  const items: AttentionItem[] = [];

  if (needsAttention.openDisputes > 0) {
    items.push({
      id: "disputes",
      title: `${needsAttention.openDisputes} open dispute${needsAttention.openDisputes > 1 ? "s" : ""}`,
      description: "Review pending customer disputes.",
      color: "#f59e0b",
    });
  }
  if (needsAttention.pendingPayouts > 0) {
    items.push({
      id: "payouts",
      title: `${needsAttention.pendingPayouts} payout${needsAttention.pendingPayouts > 1 ? "s" : ""} pending`,
      description: "Awaiting finance approval.",
      color: "#3b82f6",
    });
  }
  if (needsAttention.newKycSubmissions > 0) {
    items.push({
      id: "kyc",
      title: `${needsAttention.newKycSubmissions} new KYC submission${needsAttention.newKycSubmissions > 1 ? "s" : ""}`,
      description: "Operators awaiting verification.",
      color: "#f59e0b",
    });
  }
  if (needsAttention.accountsUnderReview > 0) {
    items.push({
      id: "accounts",
      title: `${needsAttention.accountsUnderReview} account${needsAttention.accountsUnderReview > 1 ? "s" : ""} under review`,
      description: "User activity triggered compliance checks.",
      color: "#3b82f6",
    });
  }

  if (needsAttention.highFailureDestinations?.length > 0) {
    needsAttention.highFailureDestinations.forEach((d: any) => {
      items.push({
        id: `hfd-${d.destinationId}`,
        title: `High Failed-Call Rate on ${d.name} (${d.prefix})`,
        description: `Fail rate spiked to ${d.failureRatePercent}% over past 45m.`,
        color: "#ef4444",
      });
    });
  }

  if (needsAttention.operatorShortageCities?.length > 0) {
    needsAttention.operatorShortageCities.forEach((c: any) => {
      items.push({
        id: `osc-${c.city}`,
        title: `Operator Shortage in ${c.city}`,
        description: `Only ${c.online} out of ${c.total} operators currently online.`,
        color: "#f59e0b",
      });
    });
  }

  if (needsAttention.inactiveDistributors?.length > 0) {
    needsAttention.inactiveDistributors.forEach((d: any) => {
      items.push({
        id: `id-${d.id}`,
        title: `Inactive Distributor Alert`,
        description: `${d.name} has had zero transfers for 72h.`,
        color: "#3b82f6",
      });
    });
  }

  return items;
};

const formatDateForApi = (dateStr: string) => {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${d}-${m}-${y}`;
};

export default function DashboardPage() {
  const [range, setRange] = useState("today");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const queryParams = {
    range,
    ...(range === "custom" && fromDate && toDate
      ? { from: formatDateForApi(fromDate), to: formatDateForApi(toDate) }
      : {}),
  };

  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetOverviewQuery(queryParams);

  const loading = isLoading || isFetching;
  const data = response?.data;

  const statusPieData = (data?.callsByStatus ?? []).map((s: any) => ({
    label: statusLabel(s.status ?? s._id ?? ""),
    value: s.count,
    color: STATUS_COLORS[s.status ?? s._id] ?? "#8884d8",
  }));

  const totalCalls = (data?.callsByStatus ?? []).reduce(
    (sum: number, s: any) => sum + (s.count ?? 0),
    0,
  );

  const attentionItems = buildAttentionItems(data?.needsAttention);

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
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-title text-3xl font-bold">
              Dashboard Overview
            </h1>
            <p className="text-muted-foreground">
              Monitor your platform performance and key metrics
            </p>
          </div>

          {/* Date Filter placed on the left side of title text (or right next to it) */}
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
      </div>

      {/* Top Stat cards - Row 1 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Active Callers */}
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardDescription>Active Callers</CardDescription>
            <div className="p-2 bg-white/5 rounded-full text-gray-400">
              <Users className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20 mt-1" />
            ) : (
              <>
                <CardTitle className="text-2xl font-bold">
                  {(data?.activeCallers?.count ?? 0).toLocaleString()}
                </CardTitle>
                <div className="text-xs text-muted-foreground mt-2 flex items-center justify-between">
                  <span
                    className={
                      data?.comparison?.activeCallersChangePercent &&
                      data.comparison.activeCallersChangePercent > 0
                        ? "text-green-500"
                        : "text-muted-foreground"
                    }
                  >
                    {data?.comparison?.activeCallersChangePercent
                      ? `${data.comparison.activeCallersChangePercent}%`
                      : ""}
                  </span>
                  <span>
                    {data?.activeCallers?.repeat ?? 0} repeat •{" "}
                    {data?.activeCallers?.new ?? 0} new
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Successful Calls */}
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardDescription>Successful Calls</CardDescription>
            <div className="p-2 bg-white/5 rounded-full text-gray-400">
              <CheckCircle className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20 mt-1" />
            ) : (
              <>
                <CardTitle className="text-2xl font-bold">
                  {(data?.successfulCalls?.count ?? 0).toLocaleString()}
                </CardTitle>
                <div className="text-xs text-muted-foreground mt-2 flex items-center justify-between">
                  <span
                    className={
                      data?.comparison?.successfulCallsChangePercent &&
                      data.comparison.successfulCallsChangePercent > 0
                        ? "text-green-500"
                        : "text-muted-foreground"
                    }
                  >
                    {data?.comparison?.successfulCallsChangePercent
                      ? `${data.comparison.successfulCallsChangePercent}%`
                      : ""}
                  </span>
                  <span>
                    {data?.successfulCalls?.deliveryRatePercent ?? 0}% delivery
                    rate
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Connected Minutes */}
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardDescription>Connected Minutes</CardDescription>
            <div className="p-2 bg-white/5 rounded-full text-gray-400">
              <Clock className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20 mt-1" />
            ) : (
              <>
                <CardTitle className="text-2xl font-bold">
                  {(data?.connectedMinutes?.total ?? 0).toLocaleString()}{" "}
                  <span className="text-base font-normal">m</span>
                </CardTitle>
                <div className="text-xs text-muted-foreground mt-2 flex items-center justify-between">
                  <span
                    className={
                      data?.comparison?.connectedMinutesChangePercent &&
                      data.comparison.connectedMinutesChangePercent > 0
                        ? "text-green-500"
                        : "text-muted-foreground"
                    }
                  >
                    {data?.comparison?.connectedMinutesChangePercent
                      ? `${data.comparison.connectedMinutesChangePercent}%`
                      : ""}
                  </span>
                  <span>
                    Avg {data?.connectedMinutes?.avgPerCall ?? 0}m per call
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Revenue */}
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardDescription>Revenue</CardDescription>
            <div className="p-2 bg-white/5 rounded-full text-gray-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20 mt-1" />
            ) : (
              <>
                <CardTitle className="text-2xl font-bold">
                  AED {(data?.revenue?.total ?? 0).toLocaleString()}
                </CardTitle>
                <div className="text-xs text-muted-foreground mt-2 flex items-center justify-between">
                  <span
                    className={
                      data?.comparison?.revenueChangePercent &&
                      data.comparison.revenueChangePercent > 0
                        ? "text-green-500"
                        : "text-muted-foreground"
                    }
                  >
                    {data?.comparison?.revenueChangePercent
                      ? `${data.comparison.revenueChangePercent}%`
                      : ""}
                  </span>
                  <span>Margin: AED {data?.revenue?.marginPerMin ?? 0}/m</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Call Success Rate */}
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardDescription>Call Success Rate</CardDescription>
            <div className="p-2 bg-white/5 rounded-full text-gray-400">
              <PhoneForwarded className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20 mt-1" />
            ) : (
              <>
                <CardTitle className="text-2xl font-bold">
                  {data?.callSuccessRatePercent ?? 0}%
                </CardTitle>
                <div className="text-xs text-muted-foreground mt-2 flex items-center justify-between">
                  <span
                    className={
                      data?.comparison?.callSuccessRateChangePoints &&
                      data.comparison.callSuccessRateChangePoints > 0
                        ? "text-green-500"
                        : "text-muted-foreground"
                    }
                  >
                    {data?.comparison?.callSuccessRateChangePoints
                      ? `+${data.comparison.callSuccessRateChangePoints}%`
                      : ""}
                  </span>
                  <span>Target: &gt;90.0%</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Operators Online */}
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardDescription>Operators Online</CardDescription>
            <div className="p-2 bg-white/5 rounded-full text-gray-400">
              <Headset className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20 mt-1" />
            ) : (
              <>
                <CardTitle className="text-2xl font-bold">
                  {data?.operatorsOnline?.online ?? 0} /{" "}
                  {data?.operatorsOnline?.total ?? 0}
                </CardTitle>
                <div className="text-xs text-muted-foreground mt-2 flex items-center justify-between">
                  <span className="text-green-500">
                    {/* Assuming no trend for this */}
                  </span>
                  <span></span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Active Distributors */}
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardDescription>Active Distributors</CardDescription>
            <div className="p-2 bg-white/5 rounded-full text-gray-400">
              <Share2 className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20 mt-1" />
            ) : (
              <>
                <CardTitle className="text-2xl font-bold">
                  {data?.activeDistributors?.count ?? 0}
                </CardTitle>
                <div className="text-xs text-muted-foreground mt-2 flex items-center justify-between">
                  <span className="text-green-500"></span>
                  <span>
                    {(
                      data?.activeDistributors?.minutesCirculated ?? 0
                    ).toLocaleString()}{" "}
                    min circulated
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* New Customers Today */}
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardDescription>New Customers</CardDescription>
            <div className="p-2 bg-white/5 rounded-full text-gray-400">
              <UserPlus className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20 mt-1" />
            ) : (
              <>
                <CardTitle className="text-2xl font-bold">
                  {(data?.newCustomers?.count ?? 0).toLocaleString()}
                </CardTitle>
                <div className="text-xs text-muted-foreground mt-2 flex items-center justify-between">
                  <span
                    className={
                      data?.comparison?.newCustomersChangePercent &&
                      data.comparison.newCustomersChangePercent > 0
                        ? "text-green-500"
                        : "text-muted-foreground"
                    }
                  >
                    {data?.comparison?.newCustomersChangePercent
                      ? `${data.comparison.newCustomersChangePercent}%`
                      : ""}
                  </span>
                  <span></span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="flex-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance & Revenue Dynamics</CardTitle>
            <CardDescription>
              Call requests, talk duration minutes, and platform gross revenue
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[320px] w-full" />
            ) : (
              <>
                <AreaRechart data={data?.revenueLast7Days ?? []} />
                <div className="text-primary mt-4 flex gap-4 justify-center items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    Revenue (AED)
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calls by Status</CardTitle>
            <CardDescription>
              {loading ? "..." : `${totalCalls} total call requests`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[280px] w-full" />
            ) : statusPieData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-10">
                No calls recorded yet.
              </p>
            ) : (
              <PieChart showLabels data={statusPieData} />
            )}
            {!loading && statusPieData.length > 0 && (
              <div className="mt-6 space-y-2">
                {statusPieData.map((s: any) => (
                  <div
                    key={s.label}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: s.color }}
                      />
                      <span className="text-muted-foreground">{s.label}</span>
                    </div>
                    <span className="font-medium">
                      {s.value}{" "}
                      <span className="text-muted-foreground ml-1">
                        ({((s.value / totalCalls) * 100).toFixed(1)}%)
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Latest Calls & Needs Attention */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <OverviewTable calls={data?.latestCalls ?? []} loading={loading} />
        </div>
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Needs Your Attention</CardTitle>
            <div className="bg-red-500/10 text-red-500 text-xs px-2 py-0.5 rounded-full font-medium">
              {attentionItems.length} Alerts
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mt-4">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-md" />
                ))
              ) : attentionItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nothing needs your attention right now.
                </p>
              ) : (
                attentionItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-md w-full p-3 flex flex-col gap-1 border-l-2 bg-white/5"
                    style={{ borderColor: item.color }}
                  >
                    <div className="flex items-center justify-between">
                      <h1 className="text-title text-sm font-semibold">
                        {item.title}
                      </h1>
                    </div>
                    <p className="text-muted-foreground text-xs ">
                      {item.description}
                    </p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Operators</CardTitle>
            <CardDescription>By connected voice minutes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <Skeleton className="h-40 w-full" />
              ) : (
                data?.topOperators?.slice(0, 5).map((op: any, i: number) => (
                  <div
                    key={op.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 text-center text-sm font-semibold text-muted-foreground">
                        #{i + 1}
                      </div>
                      <div>
                        <div className="font-medium text-sm text-title">
                          {op.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {op.calls} calls • {op.successRatePercent}% SR
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-sm text-blue-400">
                        {op.minutes?.toLocaleString()} m
                      </div>
                      <div className="text-xs text-green-500">
                        AED {op.earnings}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Distributors</CardTitle>
            <CardDescription>Minutes issued & transferred</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <Skeleton className="h-40 w-full" />
              ) : (
                data?.topDistributors
                  ?.slice(0, 5)
                  .map((dist: any, i: number) => (
                    <div
                      key={dist.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-white/5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 text-center text-sm font-semibold text-muted-foreground">
                          #{i + 1}
                        </div>
                        <div>
                          <div className="font-medium text-sm text-title">
                            {dist.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Comm: AED {dist.commission}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-sm text-green-400">
                          {dist.totalMinutes?.toLocaleString()} m
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">New Customers</CardTitle>
            <CardDescription>Newly onboarded users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <Skeleton className="h-40 w-full" />
              ) : (
                data?.newCustomers?.list?.slice(0, 5).map((cust: any) => (
                  <div
                    key={cust._id}
                    className="flex items-center justify-between p-2 rounded-lg bg-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                        {cust.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-sm text-title">
                          {cust.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {cust.countryName} • {cust.phone}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-green-500/20 text-green-400 uppercase">
                        {cust.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
