"use client";

import { CheckCircle2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import PricingTable from "@/components/pricing_page/pricing_table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Modal } from "@/components/ui/modal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  useGetDestinationsQuery,
  useCreateDestinationMutation,
  useGetDestinationStatsQuery,
} from "@/redux/api/adminApi"; // adjust to your actual path

const PricingPage = () => {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [name, setName] = useState("");
  const [prefix, setPrefix] = useState("");
  const [customerRate, setCustomerRate] = useState("");
  const [operatorPayout, setOperatorPayout] = useState("");
  const {
    data: statsResponse,
    isLoading: statsLoading,
    isFetching: statsFetching,
  } = useGetDestinationStatsQuery(undefined);
  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetDestinationsQuery(undefined);
  const [createDestination, { isLoading: isCreating }] =
    useCreateDestinationMutation();

  const loading = isLoading || isFetching;
  const destinations = response?.data ?? [];

  const activeCount = destinations.filter(
    (d: any) => d.status === "active",
  ).length;
  const avgMargin =
    destinations.length > 0
      ? destinations.reduce(
          (sum: number, d: any) => sum + (d.marginPerMin ?? 0),
          0,
        ) / destinations.length
      : 0;
  // const lastUpdated = destinations.reduce(
  //   (latest: string | null, d: any) => {
  //     if (!latest) return d.updatedAt;
  //     return new Date(d.updatedAt) > new Date(latest) ? d.updatedAt : latest;
  //   },
  //   null as string | null,
  // );

  const lastUpdatedLabel = (lastUpdated?: Date | string | null) => {
    if (!lastUpdated) return "—";

    const d = new Date(lastUpdated);
    const now = new Date();

    const isToday = d.toDateString() === now.toDateString();

    return isToday
      ? "Today"
      : d.toLocaleDateString("en-GB", {
          year: "numeric",
          month: "short",
          day: "2-digit",
        });
  };
  const resetForm = () => {
    setName("");
    setPrefix("");
    setCustomerRate("");
    setOperatorPayout("");
  };

  const handleCreate = async () => {
    if (!name.trim() || !prefix.trim() || !customerRate || !operatorPayout) {
      toast.error("Please fill in all fields.");
      return;
    }

    const toastId = toast.loading("Creating rate...");
    try {
      await createDestination({
        name: name.trim(),
        prefix: prefix.trim(),
        customerRatePerMin: Number(customerRate),
        operatorPayoutPerMin: Number(operatorPayout),
      }).unwrap();

      toast.success("Rate created successfully.", { id: toastId });
      setIsInviteOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to create rate.", {
        id: toastId,
      });
    }
  };

  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-title text-3xl font-bold">Pricing & Rates</h1>
          <p className="text-muted-foreground ">
            Configure customer rates, operator payouts and platform margin per
            destination
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setIsInviteOpen(true)}>
            <Plus className="size-4" />
            New Rate
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Active destinations</CardDescription>
            {statsLoading ? (
              <Skeleton className="h-8 w-12 mt-1" />
            ) : (
              <CardTitle className="text-2xl">
                {statsResponse?.data?.activeDestinations}
              </CardTitle>
            )}
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Avg margin/min</CardDescription>
            {statsLoading ? (
              <Skeleton className="h-8 w-24 mt-1" />
            ) : (
              <CardTitle className="text-2xl">
                AED {statsResponse?.data?.avgMarginPerMin.toFixed(2)}
              </CardTitle>
            )}
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Last updated</CardDescription>
            {statsLoading ? (
              <Skeleton className="h-8 w-20 mt-1" />
            ) : (
              <CardTitle className="text-2xl">
                {lastUpdatedLabel(statsResponse?.data?.lastUpdatedAt)}
              </CardTitle>
            )}
          </CardHeader>
        </Card>
      </div>

      <Modal
        open={isInviteOpen}
        onClose={() => {
          setIsInviteOpen(false);
          resetForm();
        }}
        title="New rate"
        description="Customer rate and operator payout drive the platform margin per minute."
        footer={
          <>
            <Button
              variant="cancel"
              onClick={() => {
                setIsInviteOpen(false);
                resetForm();
              }}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleCreate}
              disabled={isCreating}
            >
              {isCreating ? "Creating..." : "Create Rate"}
            </Button>
          </>
        }
      >
        <div className="space-y-1.5">
          <Label htmlFor="destName" className="text-white">
            Destination name
          </Label>
          <Input
            id="destName"
            placeholder="Egypt - Eritrea"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="destPrefix" className="text-white">
            Prefix
          </Label>
          <Input
            id="destPrefix"
            placeholder="+971/7"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
          />
        </div>
        <div className="flex gap-5">
          <div className="space-y-1.5 flex-1">
            <Label htmlFor="custRate" className="text-white">
              Customer rate (AED/min)
            </Label>
            <Input
              id="custRate"
              type="number"
              step="0.01"
              min={0}
              placeholder="1.50"
              value={customerRate}
              onChange={(e) => setCustomerRate(e.target.value)}
            />
          </div>
          <div className="space-y-1.5 flex-1">
            <Label htmlFor="opPayout" className="text-white">
              Operator payout (AED/min)
            </Label>
            <Input
              id="opPayout"
              type="number"
              step="0.01"
              min={0}
              placeholder="1.00"
              value={operatorPayout}
              onChange={(e) => setOperatorPayout(e.target.value)}
            />
          </div>
        </div>
      </Modal>

      <PricingTable destinations={destinations} loading={loading} />
    </main>
  );
};

export default PricingPage;
