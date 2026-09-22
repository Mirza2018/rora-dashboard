"use client";

import { ArrowUpRight, GitCommitHorizontal } from "lucide-react";

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
import { useGetOverviewQuery } from "@/redux/api/adminApi"; // adjust to your actual path

const STATUS_COLORS: Record<string, string> = {
  completed: "#2F80ED",
  failed: "#FF5C5C",
  cancelled: "#FFB547",
  requested: "#9B51E0",
  assigned: "#9B51E0",
  dialing_customer: "#9B51E0",
  customer_connected: "#9B51E0",
  dialing_destination: "#9B51E0",
  destination_connected: "#9B51E0",
  conferencing: "#9B51E0",
};

const statusLabel = (status: string) =>
  status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

type AttentionItem = {
  id: string;
  title: string;
  description: string;
  color: string;
};

const buildAttentionItems = (needsAttention?: {
  openDisputes: number;
  pendingPayouts: number;
  newKycSubmissions: number;
  accountsUnderReview: number;
}): AttentionItem[] => {
  if (!needsAttention) return [];
  const items: AttentionItem[] = [];

  if (needsAttention.openDisputes > 0) {
    items.push({
      id: "disputes",
      title: `${needsAttention.openDisputes} open dispute${
        needsAttention.openDisputes > 1 ? "s" : ""
      }`,
      description: "Review pending customer disputes.",
      color: "#FFB547",
    });
  }
  if (needsAttention.pendingPayouts > 0) {
    items.push({
      id: "payouts",
      title: `${needsAttention.pendingPayouts} payout${
        needsAttention.pendingPayouts > 1 ? "s" : ""
      } pending`,
      description: "Awaiting finance approval.",
      color: "#2F80ED",
    });
  }
  if (needsAttention.newKycSubmissions > 0) {
    items.push({
      id: "kyc",
      title: `${needsAttention.newKycSubmissions} new KYC submission${
        needsAttention.newKycSubmissions > 1 ? "s" : ""
      }`,
      description: "Operators awaiting verification.",
      color: "#FFB547",
    });
  }
  if (needsAttention.accountsUnderReview > 0) {
    items.push({
      id: "accounts",
      title: `${needsAttention.accountsUnderReview} account${
        needsAttention.accountsUnderReview > 1 ? "s" : ""
      } under review`,
      description: "User activity triggered compliance checks.",
      color: "#2F80ED",
    });
  }

  return items;
};

const DashboardPage = () => {
  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetOverviewQuery(undefined);

  const loading = isLoading || isFetching;
  const data = response?.data;

  const statusPieData = (data?.callsByStatusToday ?? []).map((s: any) => ({
    label: statusLabel(s.status ?? s._id ?? ""),
    value: s.count,
    color: STATUS_COLORS[s.status ?? s._id] ?? "#8884d8",
  }));

  const totalCallsToday = (data?.callsByStatusToday ?? []).reduce(
    (sum: number, s: any) => sum + (s.count ?? 0),
    0,
  );

  const attentionItems = buildAttentionItems(data?.needsAttention);




  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-title text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground ">
            Monitor your platform performance and key metrics
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Total Customers</CardDescription>
            {loading ? (
              <Skeleton className="h-8 w-20 mt-1" />
            ) : (
              <CardTitle className="text-2xl">
                {(data?.totalCustomers ?? 0).toLocaleString()}
              </CardTitle>
            )}
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Total Operators</CardDescription>
            {loading ? (
              <Skeleton className="h-8 w-20 mt-1" />
            ) : (
              <CardTitle className="text-2xl">
                {(data?.totalOperators ?? 0).toLocaleString()}
              </CardTitle>
            )}
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Total Revenue</CardDescription>
            {loading ? (
              <Skeleton className="h-8 w-28 mt-1" />
            ) : (
              <CardTitle className="text-2xl">
                AED {(data?.totalRevenue ?? 0).toLocaleString()}
              </CardTitle>
            )}
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Pending Payouts</CardDescription>
            {loading ? (
              <Skeleton className="h-8 w-28 mt-1" />
            ) : (
              <CardTitle className="text-2xl">
                AED {(data?.pendingPayouts ?? 0).toLocaleString()}
              </CardTitle>
            )}
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="flex-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue (last 7 days)</CardTitle>
            <CardDescription>
              AED revenue with daily call volume
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[320px] w-full" />
            ) : (
              <>
                <AreaRechart data={data?.revenueLast7Days ?? []} />
                <div className="text-primary mt-4 flex gap-2 justify-center items-center">
                  <GitCommitHorizontal />
                  Revenue ($)
                </div>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Calls by status (today)</CardTitle>
            <CardDescription>
              {loading ? "…" : `${totalCallsToday} calls total`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[280px] w-full" />
            ) : statusPieData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-10">
                No calls recorded today yet.
              </p>
            ) : (
              <PieChart showLabels data={statusPieData} />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <OverviewTable calls={data?.latestCalls ?? []} loading={loading} />
        <Card className="my-9">
          <CardHeader>
            <CardTitle>Needs your attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
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
                    className="rounded-md w-full p-4 flex justify-between items-center gap-2 border-2"
                    style={{
                      borderColor: item.color,
                      backgroundColor: `${item.color}1A`,
                    }}
                  >
                    <div>
                      <h1 className="text-white text-sm font-bold">
                        {item.title}
                      </h1>
                      <p className="text-muted-foreground text-xs ">
                        {item.description}
                      </p>
                    </div>
                    <ArrowUpRight className="text-white" />
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default DashboardPage;
