"use client";

import { Plus } from "lucide-react";
import React from "react";
import { toast } from "sonner";

import OperatorsTable from "@/components/operators_page/operators_table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetOperatorstatQuery,
  useInviteOperatorMutation,
} from "@/redux/api/adminApi"; // adjust to your actual path

const CITY_OPTIONS = [
  { label: "Dubai", value: "Dubai" },
  { label: "Sharjah", value: "Sharjah" },
  { label: "Abu Dhabi", value: "Abu Dhabi" },
  { label: "Ajman", value: "Ajman" },
  { label: "Fujairah", value: "Fujairah" },
  { label: "Ras Al Khaimah", value: "Ras Al Khaimah" },
];

const OperatorsPage = () => {
  const [isInviteOpen, setIsInviteOpen] = React.useState(false);
  const [city, setCity] = React.useState<string | null>(null);
  const [fullName, setFullName] = React.useState("");
  const [countryCode, setCountryCode] = React.useState("+971");
  const [phone, setPhone] = React.useState("");

  const {
    data: statsResponse,
    isLoading,
    isFetching,
  } = useGetOperatorstatQuery(undefined);
  const [inviteOperator, { isLoading: isInviting }] =
    useInviteOperatorMutation();

  const loading = isLoading || isFetching;
  const stats = statsResponse?.data;
  const pendingCount = Math.max(
    (stats?.total ?? 0) - (stats?.active ?? 0) - (stats?.suspended ?? 0),
    0,
  );

  const resetForm = () => {
    setFullName("");
    setCountryCode("+971");
    setPhone("");
    setCity(null);
  };

  const handleInvite = async () => {
    if (!fullName.trim() || !phone.trim() || !city) {
      toast.error("Please fill in all fields.");
      return;
    }

    const toastId = toast.loading("Sending invite...");
    try {
      const res = await inviteOperator({
        name: fullName.trim(),
        countryCode,
        phone: phone.trim(),
        city,
      }).unwrap();

      toast.success(`Invitation sent to ${res.data.name}.`, { id: toastId });
      setIsInviteOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to send invite.", {
        id: toastId,
      });
    }
  };

  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-title text-3xl font-bold">Operators</h1>
          <p className="text-muted-foreground ">
            Onboard, monitor and manage all UAE operators
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setIsInviteOpen(true)}>
            <Plus className="size-4" />
            Invite Operator
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Total operators</CardDescription>
            {loading ? (
              <Skeleton className="h-8 w-16 mt-1" />
            ) : (
              <CardTitle className="text-2xl">{stats?.total ?? 0}</CardTitle>
            )}
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Active</CardDescription>
            {loading ? (
              <Skeleton className="h-8 w-16 mt-1" />
            ) : (
              <CardTitle className="text-2xl">{stats?.active ?? 0}</CardTitle>
            )}
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Awaiting KYC</CardDescription>
            {loading ? (
              <Skeleton className="h-8 w-16 mt-1" />
            ) : (
              <CardTitle className="text-2xl">{pendingCount}</CardTitle>
            )}
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Suspended</CardDescription>
            {loading ? (
              <Skeleton className="h-8 w-16 mt-1" />
            ) : (
              <CardTitle className="text-2xl">
                {stats?.suspended ?? 0}
              </CardTitle>
            )}
          </CardHeader>
        </Card>
      </div>
      <OperatorsTable />

      <Modal
        open={isInviteOpen}
        onClose={() => {
          setIsInviteOpen(false);
          resetForm();
        }}
        title="Invite operator"
        description="Send an SMS invite with a one-time link to start onboarding."
        footer={
          <>
            <Button
              variant="cancel"
              onClick={() => {
                setIsInviteOpen(false);
                resetForm();
              }}
              disabled={isInviting}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleInvite}
              disabled={isInviting}
            >
              {isInviting ? "Sending..." : "Send Invite"}
            </Button>
          </>
        }
      >
        <div className="space-y-1.5">
          <Label htmlFor="fullName" className="text-white">
            Full name
          </Label>
          <Input
            id="fullName"
            placeholder="Ahmed Saleh"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <div className="space-y-1.5 w-28">
            <Label htmlFor="countryCode" className="text-white">
              Code
            </Label>
            <Input
              id="countryCode"
              placeholder="+971"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
            />
          </div>
          <div className="space-y-1.5 flex-1">
            <Label htmlFor="phone" className="text-white">
              Phone
            </Label>
            <Input
              id="phone"
              placeholder="504829930"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="city" className="text-white">
            City
          </Label>
          <Select
            searchable
            searchPlaceholder="Search citys..."
            placeholder="Select a city"
            value={city}
            onValueChange={setCity}
            options={CITY_OPTIONS}
          />
        </div>
      </Modal>
    </main>
  );
};

export default OperatorsPage;
