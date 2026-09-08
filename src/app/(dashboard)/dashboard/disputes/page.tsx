"use client";

import DisputesTable from "@/components/disputes_page/disputes_table";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetDisputesStarQuery } from "@/redux/api/adminApi"; // adjust to your actual path

const DisputesPage = () => {
  const {
    data: statsResponse,
    isLoading,
    isFetching,
  } = useGetDisputesStarQuery({});

  const loading = isLoading || isFetching;
  const stats = statsResponse?.data;

  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-title text-3xl font-bold">Disputes</h1>
          <p className="text-muted-foreground ">
            Investigate and resolve customer disputes
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Total Disputes</CardDescription>
            {loading ? (
              <Skeleton className="h-8 w-16 mt-1" />
            ) : (
              <CardTitle className="text-2xl">
                {stats?.totalDisputes ?? 0}
              </CardTitle>
            )}
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Resolved MTD</CardDescription>
            {loading ? (
              <Skeleton className="h-8 w-16 mt-1" />
            ) : (
              <CardTitle className="text-2xl">
                {stats?.resolvedMtd ?? 0}
              </CardTitle>
            )}
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Refund total</CardDescription>
            {loading ? (
              <Skeleton className="h-8 w-28 mt-1" />
            ) : (
              <CardTitle className="text-2xl">
                AED {(stats?.refundTotal ?? 0).toLocaleString()}
              </CardTitle>
            )}
          </CardHeader>
        </Card>
      </div>

      <DisputesTable />
    </main>
  );
};

export default DisputesPage;
