"use client";

import { Plus } from "lucide-react";
import React, { useState } from "react";
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
  useOperatorCreateMutation,
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
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Invite states
  const [city, setCity] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [countryCode, setCountryCode] = useState("+971");
  const [phone, setPhone] = useState("");

  // Add Operator states
  const [addName, setAddName] = useState("");
  const [addCountryCode, setAddCountryCode] = useState("+971");
  const [addPhone, setAddPhone] = useState("");
  const [addPassword, setAddPassword] = useState("");
  const [addCity, setAddCity] = useState<string | null>(null);
  const [addPhoneNumbers, setAddPhoneNumbers] = useState("");

  const {
    data: statsResponse,
    isLoading,
    isFetching,
  } = useGetOperatorstatQuery(undefined);
  const [inviteOperator, { isLoading: isInviting }] = useInviteOperatorMutation();
  const [createOperator, { isLoading: isCreating }] = useOperatorCreateMutation();

  const loading = isLoading || isFetching;
  const stats = statsResponse?.data;
  const pendingCount = Math.max(
    (stats?.total ?? 0) - (stats?.active ?? 0) - (stats?.suspended ?? 0),
    0,
  );

  const resetInviteForm = () => {
    setFullName("");
    setCountryCode("+971");
    setPhone("");
    setCity(null);
  };

  const resetAddForm = () => {
    setAddName("");
    setAddCountryCode("+971");
    setAddPhone("");
    setAddPassword("");
    setAddCity(null);
    setAddPhoneNumbers("");
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
      resetInviteForm();
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to send invite.", {
        id: toastId,
      });
    }
  };

  const handleAddOperator = async () => {
    if (!addName.trim() || !addPhone.trim() || !addPassword.trim() || !addCity) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const toastId = toast.loading("Creating operator...");
    try {
      const phoneList = addPhoneNumbers
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

      const payload = {
        name: addName.trim(),
        countryCode: addCountryCode,
        phone: addPhone.trim(),
        password: addPassword,
        city: addCity,
        phoneNumbers: phoneList,
      };

      const res = await createOperator(payload).unwrap();
      
      if (res.success || res.statusCode === 200) {
        toast.success(res.message || "Operator account created successfully.", { id: toastId });
        setIsAddOpen(false);
        resetAddForm();
      } else {
        toast.error(res.message || "Failed to create operator.", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err?.data?.message ?? err?.message ?? "Failed to create operator.", {
        id: toastId,
      });
    }
  };

  return (
    <main className="p-6 space-y-6">
      <div className="flex sm:flex-row flex-col items-center justify-between">
        <div>
          <h1 className="text-title text-3xl font-bold">Operators</h1>
          <p className="text-muted-foreground ">
            Onboard, monitor and manage all UAE operators
          </p>
        </div>

        <div className="flex justify-end gap-3 w-full sm:w-auto mt-4 sm:mt-0">
          {/* <Button variant="outline" onClick={() => setIsInviteOpen(true)}>
            <Plus className="size-4" />
            Invite Operator
          </Button> */}
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="size-4" />
            Add Operator
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

      {/* Invite Modal */}
      <Modal
        open={isInviteOpen}
        onClose={() => {
          setIsInviteOpen(false);
          resetInviteForm();
        }}
        title="Invite operator"
        description="Send an SMS invite with a one-time link to start onboarding."
        footer={
          <>
            <Button
              variant="cancel"
              onClick={() => {
                setIsInviteOpen(false);
                resetInviteForm();
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
            searchPlaceholder="Search cities..."
            placeholder="Select a city"
            value={city}
            onValueChange={setCity}
            options={CITY_OPTIONS}
          />
        </div>
      </Modal>

      {/* Add New Operator Modal */}
      <Modal
        open={isAddOpen}
        onClose={() => {
          setIsAddOpen(false);
          resetAddForm();
        }}
        title="Add New Operator"
        description="Manually add a new operator directly to the system."
        footer={
          <>
            <Button
              variant="cancel"
              onClick={() => {
                setIsAddOpen(false);
                resetAddForm();
              }}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleAddOperator}
              disabled={isCreating}
            >
              {isCreating ? "Saving..." : "Save"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="addName" className="text-white">
              Full Name
            </Label>
            <Input
              id="addName"
              placeholder="e.g. Manual Operator"
              value={addName}
              onChange={(e) => setAddName(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3">
            <div className="space-y-1.5 w-28">
              <Label htmlFor="addCountryCode" className="text-white">
                Code
              </Label>
              <Input
                id="addCountryCode"
                placeholder="+971"
                value={addCountryCode}
                onChange={(e) => setAddCountryCode(e.target.value)}
              />
            </div>
            <div className="space-y-1.5 flex-1">
              <Label htmlFor="addPhone" className="text-white">
                Phone
              </Label>
              <Input
                id="addPhone"
                placeholder="502345699"
                value={addPhone}
                onChange={(e) => setAddPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="addPassword" className="text-white">
              Password
            </Label>
            <Input
              id="addPassword"
              type="password"
              placeholder="e.g. OpManualPass123!"
              value={addPassword}
              onChange={(e) => setAddPassword(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="addCity" className="text-white">
              City
            </Label>
            <Select
              searchable
              searchPlaceholder="Search cities..."
              placeholder="Select a city"
              value={addCity || undefined}
              onValueChange={setAddCity}
              options={CITY_OPTIONS}
            />
          </div>
{/* 
          <div className="space-y-1.5">
            <Label htmlFor="addPhoneNumbers" className="text-white">
              Additional Phone Numbers (comma separated)
            </Label>
            <Input
              id="addPhoneNumbers"
              placeholder="e.g. +971509990001, +971509990002"
              value={addPhoneNumbers}
              onChange={(e) => setAddPhoneNumbers(e.target.value)}
            />
          </div> */}
        </div>
      </Modal>
    </main>
  );
};

export default OperatorsPage;
