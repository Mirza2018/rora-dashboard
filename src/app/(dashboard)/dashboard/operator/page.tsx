"use client";
import OperatorsTable from "@/components/operators_page/operators_table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React from "react";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { Select } from "@/components/ui/select";

const OperatorsPage = () => {
  const [isInviteOpen, setIsInviteOpen] = React.useState(false);
  const [plan, setPlan] = React.useState<string | null>(null);
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
          {/* <Button variant="cancel">Cancel</Button> */}
          <Button onClick={() => setIsInviteOpen(true)}>
            <Plus className="size-4" />
            {/* <Download className="size-4" /> */}
            Invite Operator
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Total operators</CardDescription>
            <CardTitle className="text-2xl">612</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Active</CardDescription>
            <CardTitle className="text-2xl">498</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Awaiting KYC</CardDescription>
            <CardTitle className="text-2xl">7</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Suspended</CardDescription>
            <CardTitle className="text-2xl">0</CardTitle>
          </CardHeader>
        </Card>
      </div>
      <OperatorsTable />
      


      <Modal
        open={!!isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        title={`Invite operator`}
        description={`Send an SMS invite with a one-time link to start onboarding.`}
        footer={
          <>
            <Button variant="cancel" onClick={() => setIsInviteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={() => {
                // call your delete API here
                setIsInviteOpen(false);
              }}
            >
              Send Invite
            </Button>
          </>
        }
      >
        <div className="space-y-1.5">
          <Label htmlFor="fullName" className="text-white">
            Full name
          </Label>
          <Input id="fullName" placeholder="Ahmed Saleh" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-white">
            Phone
          </Label>
          <Input id="phone" placeholder="+971 - 4575 5878 474" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="city" className="text-white">
            City
          </Label>
          <Select
            searchable
            searchPlaceholder="Search citys..."
            placeholder="Select a city"
            value={plan}
            onValueChange={setPlan}
            options={[
              { label: "Dubai", value: "dubai" },
              { label: "Sharjah", value: "Sharjah" },
              { label: "Abu Dhabi", value: "Abu Dhabi" },
              { label: "Ajman", value: "Ajman" },
              { label: "Fujairah", value: "Fujairah" },
              { label: "Ras Al Khaimah", value: "Ras Al Khaimah" },
            ]}
          />
        </div>
      </Modal>
    </main>
  );
};

export default OperatorsPage;
