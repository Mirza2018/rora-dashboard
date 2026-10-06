"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardDescription, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Banknote, Phone, Building, PhoneCall, DollarSign, CalendarDays, ArrowUpRight, ArrowDownRight, User } from "lucide-react";
import { useLazyGetOperatorInformationQuery } from "@/redux/api/adminApi";
import AllImages from "@/assets/AllImages";

const rangeLabels: Record<string, string> = {
  today: "Today",
  yesterday: "Yesterday",
  last7days: "Last 7 days",
  last30days: "Last 30 days",
  thismonth: "This month",
  custom: "Custom",
};

const formatDate = (iso: string) => {
  if (!iso) return "N/A";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

const formatPayoutMonth = (iso: string) => {
  if (!iso) return "N/A";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "long" });
};

export const OperatorDetailsModal = ({ 
  operatorId, 
  onClose 
}: { 
  operatorId: string | null; 
  onClose: () => void 
}) => {
  const [range, setRange] = useState("last30days");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [getOperatorInfo, { data: response, isFetching }] = useLazyGetOperatorInformationQuery();

  useEffect(() => {
    if (!operatorId) return;

    const params: any = { range };
    if (range === "custom") {
      if (!fromDate || !toDate) return;
      const [fYear, fMonth, fDay] = fromDate.split("-");
      params.from = `${fDay}-${fMonth}-${fYear}`;
      const [tYear, tMonth, tDay] = toDate.split("-");
      params.to = `${tDay}-${tMonth}-${tYear}`;
    }

    getOperatorInfo({ id: operatorId, params });
  }, [operatorId, range, fromDate, toDate, getOperatorInfo]);

  const data = response?.data;
  const operator = data?.operator;
  const rangeScoped = data?.rangeScoped;
  const allTime = data?.allTime;
  const recentCalls = data?.recentCalls || [];
  const payoutHistory = data?.payoutHistory || [];
  const comp = rangeScoped?.comparison || {};

  const renderChange = (percent: number | null | undefined, suffix = "%", isPoints = false) => {
    if (percent === null || percent === undefined) return null;
    const isPositive = percent > 0;
    const isNegative = percent < 0;
    return (
      <div className={`text-xs mt-1 flex items-center gap-1 ${isPositive ? 'text-green-500' : isNegative ? 'text-red-500' : 'text-muted-foreground'}`}>
        {isPositive ? <ArrowUpRight className="size-3" /> : isNegative ? <ArrowDownRight className="size-3" /> : null}
        <span>{Math.abs(percent)}{suffix} {isPoints ? 'pts' : ''} from prev</span>
      </div>
    );
  };

  return (
    <Modal
      open={!!operatorId}
      onClose={onClose}
      title="Operator Details"
      description="Complete profile and performance overview"
      maxHeight="max-h-[90vh]"
      className="max-w-4xl"
      footer={
        <Button variant="cancel" onClick={onClose}>
          Close
        </Button>
      }
    >
      {!data && isFetching ? (
        <div className="space-y-4 py-8">
           <Skeleton className="h-24 w-full" />
           <Skeleton className="h-40 w-full" />
           <Skeleton className="h-40 w-full" />
        </div>
      ) : operator ? (
        <div className="space-y-6">
          {/* Header Profile Card */}
          <Card>
            <CardContent className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="size-16">
                  <AvatarImage src={operator.image || AllImages.placeholder.src} alt={operator.name} />
                  <AvatarFallback>{operator.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xl font-bold text-white flex items-center gap-2">
                    {operator.name}
                    {operator.isVerified && <span className="text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full">Verified</span>}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{operator.operatorCode} | {operator.email || "No Email"}</p>
                  <p className={`text-xs mt-1.5 py-1 px-2.5 w-fit text-white rounded-md ${
                      operator.status === "active" ? "bg-status-complete"
                        : operator.status === "suspended" ? "bg-status-failed"
                        : "bg-yellow-600"
                    }`}
                  >
                    {operator.status.replace(/_/g, " ")}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-start md:items-end gap-1 text-sm">
                 <div className="flex items-center gap-2 text-muted-foreground"><Phone className="size-4 text-primary" /> <span className="text-white font-medium">{operator.phone}</span></div>
                 <div className="flex items-center gap-2 text-muted-foreground"><Building className="size-4 text-primary" /> <span className="text-white font-medium">{operator.city || "Unknown City"}</span></div>
                 <div className="flex items-center gap-2 text-muted-foreground"><CalendarDays className="size-4 text-primary" /> <span>Joined {formatDate(operator.joinedAt)}</span></div>
              </div>
            </CardContent>
          </Card>

          {/* Date Picker Row */}
          <div className="flex flex-wrap items-center justify-end gap-3 w-full border-b border-card-border pb-4">
            {range === "custom" && (
              <div className="flex items-center gap-2">
                <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-[140px] h-9" />
                <span className="text-muted-foreground text-sm">to</span>
                <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-[140px] h-9" />
              </div>
            )}
            <div className="w-40">
              <Select
                placeholder="Select range"
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
          </div>

          {/* Range Scoped Metrics */}
          {isFetching ? <div className="text-sm text-muted-foreground animate-pulse">Updating metrics...</div> : (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Performance ({rangeLabels[range] || "Custom"})</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card><CardHeader className="p-4"><CardDescription>Calls Offered</CardDescription><CardTitle className="text-2xl">{rangeScoped?.callsOffered}</CardTitle>{renderChange(comp.callsOfferedChangePercent)}</CardHeader></Card>
                <Card><CardHeader className="p-4"><CardDescription>Calls Accepted</CardDescription><CardTitle className="text-2xl">{rangeScoped?.callsAccepted}</CardTitle>{renderChange(comp.callsAcceptedChangePercent)}</CardHeader></Card>
                <Card><CardHeader className="p-4"><CardDescription>Acceptance Rate</CardDescription><CardTitle className="text-2xl">{rangeScoped?.acceptanceRatePercent}%</CardTitle>{renderChange(comp.acceptanceRateChangePoints, "", true)}</CardHeader></Card>
                <Card><CardHeader className="p-4"><CardDescription>Successful Calls</CardDescription><CardTitle className="text-2xl">{rangeScoped?.successfulCalls}</CardTitle>{renderChange(comp.successfulCallsChangePercent)}</CardHeader></Card>

                <Card><CardHeader className="p-4"><CardDescription>Call Success Rate</CardDescription><CardTitle className="text-2xl">{rangeScoped?.callSuccessRatePercent}%</CardTitle>{renderChange(comp.callSuccessRateChangePoints, "", true)}</CardHeader></Card>
                <Card><CardHeader className="p-4"><CardDescription>Connected Mins</CardDescription><CardTitle className="text-2xl">{rangeScoped?.connectedMinutes}</CardTitle>{renderChange(comp.connectedMinutesChangePercent)}</CardHeader></Card>
                <Card><CardHeader className="p-4"><CardDescription>Online Hours</CardDescription><CardTitle className="text-2xl">{rangeScoped?.onlineHours}</CardTitle>{renderChange(comp.onlineHoursChangePercent)}</CardHeader></Card>
                <Card><CardHeader className="p-4"><CardDescription>Avg Customer Rating</CardDescription><CardTitle className="text-2xl flex items-center gap-2">{rangeScoped?.customerRating?.avg || 0} <span className="text-xs text-muted-foreground font-normal">({rangeScoped?.customerRating?.count || 0} reviews)</span></CardTitle>{renderChange(comp.customerRatingChange, "", true)}</CardHeader></Card>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Earnings & All-Time</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-primary/10 border-primary/20">
                  <CardHeader className="p-4">
                    <CardDescription className="text-primary/80">Earnings MTD</CardDescription>
                    <CardTitle className="text-2xl text-primary flex items-center gap-2">
                       <DollarSign className="size-5" /> {data?.earningsMtd?.toLocaleString()}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="p-4">
                    <CardDescription>Total Earnings (All-time)</CardDescription>
                    <CardTitle className="text-2xl">
                       AED {allTime?.totalEarnings?.toLocaleString()}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="p-4">
                    <CardDescription>Total Calls Handled (All-time)</CardDescription>
                    <CardTitle className="text-2xl flex items-center gap-2">
                       <PhoneCall className="size-5 text-muted-foreground" /> {allTime?.totalCallsHandled?.toLocaleString()}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Payout History */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-white">Monthly Payout History</h4>
                <div className="max-h-64 overflow-y-auto rounded-xl border border-card-border bg-card p-2 custom-scroll">
                  {payoutHistory?.length ? (
                    payoutHistory.map((payout: any, i: number) => (
                      <div key={i} className="flex min-h-[50px] items-center justify-between gap-4 px-3 py-2 hover:bg-white/5 rounded-md transition-colors">
                        <div className="flex items-center gap-2.5">
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-card-border text-muted-foreground">
                            <Banknote size={16} />
                          </span>
                          <p className="text-sm font-medium text-foreground">
                            {formatPayoutMonth(payout.month || payout.createdAt)}
                          </p>
                        </div>
                        <p className="shrink-0 text-sm font-bold text-status-complete">
                          AED {payout.totalPaid?.toLocaleString() || payout.amountMoney?.toLocaleString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="py-8 text-center text-sm text-muted-foreground">No payout history available.</p>
                  )}
                </div>
              </div>

              {/* Recent Calls */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-white">Recent Calls (Top 10)</h4>
                <div className="max-h-64 overflow-y-auto rounded-xl border border-card-border bg-card p-2 custom-scroll">
                  {recentCalls?.length ? (
                    recentCalls.map((call: any, i: number) => (
                      <div key={i} className="flex flex-col justify-center min-h-[50px] gap-1 px-3 py-2 border-b border-white/5 last:border-0 hover:bg-white/5 rounded-md transition-colors">
                         <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">{call.callRef || call._id?.slice(-6)}</p>
                            <p className="text-xs font-semibold capitalize text-primary">{call.displayStatus || call.status}</p>
                         </div>
                         <div className="flex items-center justify-between">
                            <p className="text-sm text-white flex items-center gap-2">
                               <User className="size-3" /> {call.customerId?.name || "Unknown"}
                            </p>
                            <p className="text-sm font-medium">{call.minutesUsed || 0} mins</p>
                         </div>
                      </div>
                    ))
                  ) : (
                    <p className="py-8 text-center text-sm text-muted-foreground">No recent calls.</p>
                  )}
                </div>
              </div>
            </div>

          </div>
          )}
        </div>
      ) : (
        <div className="py-12 text-center text-muted-foreground">
          Failed to load operator details.
        </div>
      )}
    </Modal>
  );
};

