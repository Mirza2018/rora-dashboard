"use client";

import { Dot, Phone, PhoneCall, Send, Wallet } from "lucide-react";
import React from "react";

import { HorizontalBarChart } from "@/components/charts/horizontal-bar-chart";
import DistributorsReportTable from "@/components/distributors_report_page/distributors_report_table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetDistributorsQuery } from "@/redux/api/adminApi"; // adjust to your actual path

const formatRelativeTime = (iso?: string) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const diffMs = Date.now() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const formatMemberSince = (iso?: string) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { year: "numeric", month: "short" });
};

const CallPage = () => {
  const [viewOpen, setViewOpen] = React.useState(false);

  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetDistributorsQuery(undefined);

  const loading = isLoading || isFetching;
  const data = response?.data;
  const topPerformer = data?.topPerformer;

  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-title text-3xl font-bold">Distributors Report</h1>
          <p className="text-muted-foreground ">
            Aggregated performance across all approved distributors
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Active distributors</CardDescription>
            {loading ? (
              <Skeleton className="h-8 w-16 mt-1" />
            ) : (
              <CardTitle className="text-2xl">
                {data?.activeDistributors ?? 0}
              </CardTitle>
            )}
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Minutes issued (period)</CardDescription>
            {loading ? (
              <Skeleton className="h-8 w-24 mt-1" />
            ) : (
              <CardTitle className="text-2xl">
                {(data?.minutesIssued ?? 0).toLocaleString()}
              </CardTitle>
            )}
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Minutes transferred</CardDescription>
            {loading ? (
              <Skeleton className="h-8 w-24 mt-1" />
            ) : (
              <CardTitle className="text-2xl">
                {(data?.minutesTransferred ?? 0).toLocaleString()}
              </CardTitle>
            )}
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="flex-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly trend</CardTitle>
            <CardDescription>
              Minutes issued vs transferred to customers
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <Skeleton className="h-[280px] w-full" />
            ) : (
              <>
                <HorizontalBarChart data={data?.weeklyTrend ?? []} />
                <div className="mt-4 flex gap-2 justify-center items-center">
                  <div className="text-primary flex justify-center items-center">
                    <Dot size={50} strokeWidth={3} />
                    Issued
                  </div>
                  <div className="text-status-complete flex justify-center items-center">
                    <Dot size={50} strokeWidth={3} />
                    Transferred to customers
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top performer</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-5">
                <Skeleton className="h-16 w-full rounded-2xl" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <Skeleton className="h-12 w-full" />
              </div>
            ) : !topPerformer ? (
              <p className="text-sm text-muted-foreground">
                No distributor activity yet.
              </p>
            ) : (
              <div className="space-y-5">
                <div className="px-2.5 py-4.5 border border-primary! bg-primary/10 rounded-2xl ">
                  <h1 className="text-sm font-bold text-white">
                    {topPerformer.name}
                  </h1>
                  <p className="text-xs">
                    {topPerformer.id.slice(-6)} · {topPerformer.country}
                  </p>
                </div>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <dt className="text-muted-foreground text-sm">
                      Total minutes transferred
                    </dt>
                    <dd className="font-medium text-white ">
                      {topPerformer.totalMinutesTransferred.toLocaleString()}
                    </dd>
                  </div>
                  <div className="flex justify-between items-center">
                    <dt className="text-muted-foreground text-sm">
                      Commission
                    </dt>
                    <dd className="font-medium text-white ">
                      AED {topPerformer.commission}
                    </dd>
                  </div>
                  <div className="flex justify-between items-center">
                    <dt className="text-muted-foreground text-sm">
                      Last activity
                    </dt>
                    <dd className="font-medium text-white ">
                      {formatRelativeTime(topPerformer.lastActivity)}
                    </dd>
                  </div>
                </dl>
                <Button
                  onClick={() => setViewOpen(true)}
                  variant="default"
                  className="w-full text-sm font-semibold py-6"
                >
                  View Profile
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Modal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Distributor Details"
        description="Complete profile and performance overview"
        footer={
          <>
            <Button variant="cancel" onClick={() => setViewOpen(false)}>
              Close
            </Button>
          </>
        }
      >
        {topPerformer && (
          <>
            <Card>
              <CardHeader>
                <CardDescription>
                  <div className="flex justify-between items-center -my-3">
                    <div className="flex items-center gap-4">
                      <Avatar className="size-16">
                        <AvatarImage
                          src={topPerformer.image}
                          alt={topPerformer.name}
                        />
                        <AvatarFallback>
                          {topPerformer.name?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xl font-bold text-white">
                          {topPerformer.name}
                        </p>
                        <p className="text-xs">{topPerformer.id.slice(-6)}</p>
                        <p className="text-xs mt-1 py-1 px-2.5 bg-status-complete w-fit text-white rounded-md">
                          active
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-xs">Last activity</p>
                      <p className="font-medium text-white">
                        {formatRelativeTime(topPerformer.lastActivity)}
                      </p>
                    </div>
                  </div>
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="flex flex-1 items-center gap-2 border rounded-md p-2.5">
              <Phone className="text-primary" />
              <div>
                <p className="text-white text-xs">Phone</p>
                <p className="text-sm font-medium">{topPerformer.phone}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardDescription>
                    <div className="flex flex-col justify-center items-center -my-3">
                      <PhoneCall className="text-primary" size={36} />
                      <p className="text-xl font-bold text-white">
                        {topPerformer.calls}
                      </p>
                      <p className="text-xs">Calls</p>
                    </div>
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardDescription>
                    <div className="flex flex-col justify-center items-center -my-3">
                      <Send className="text-white" size={36} />
                      <p className="text-xl font-bold text-white">
                        {topPerformer.totalMinutesTransferred.toLocaleString()}
                      </p>
                      <p className="text-xs">Transferred minutes</p>
                    </div>
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardDescription>
                    <div className="flex flex-col justify-center items-center -my-3">
                      <Wallet className="text-status-complete" size={36} />
                      <p className="text-xl font-bold text-white">
                        AED {topPerformer.commission}
                      </p>
                      <p className="text-xs">Commission</p>
                    </div>
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </>
        )}
      </Modal>

      <DistributorsReportTable />
    </main>
  );
};

export default CallPage;
