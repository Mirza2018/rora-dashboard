"use client";
import { CheckCircle2, Clock, Plus, XCircle } from "lucide-react";

import PricingTable from "@/components/pricing_page/pricing_table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
const ROWS = [
  {
    id: "TXN-0231",
    customer: "Marcus Lee",
    amount: "$482.00",
    status: "complete" as const,
  },
  {
    id: "TXN-0230",
    customer: "Aria Chen",
    amount: "$129.50",
    status: "pending" as const,
  },
  {
    id: "TXN-0229",
    customer: "Sofia Ruiz",
    amount: "$88.20",
    status: "failed" as const,
  },
  {
    id: "TXN-0228",
    customer: "Devon Park",
    amount: "$964.00",
    status: "suspend" as const,
  },
];

const STATUS_ICON = {
  complete: CheckCircle2,
  pending: Clock,
  failed: XCircle,
  suspend: XCircle,
};

const CallPage = () => {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
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
          {/* <Button variant="cancel">Cancel</Button> */}
          <Button onClick={() => setIsInviteOpen(true)}>
            <Plus className="size-4" />
            {/* <Download className="size-4" /> */}
            New Rate
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Active destinations</CardDescription>
            <CardTitle className="text-2xl">3</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Avg margin/min</CardDescription>
            <CardTitle className="text-2xl">AED 0.50</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Last updated</CardDescription>
            <CardTitle className="text-2xl">Today</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Modal
        open={!!isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        title={`New rate`}
        description={`Customer rate and operator payout drive the platform margin per minute.`}
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
              Create Rate
            </Button>
          </>
        }
      >
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-white">
            Destination name
          </Label>
          <Input id="name" placeholder="Ahmed Saleh" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-white">
            Prefix
          </Label>
          <Input id="phone" placeholder="+971/7" />
        </div>
        <div className="flex gap-5 ">
          <div className="space-y-1.5 flex-1">
            <Label htmlFor="min" className="text-white">
              Customer rate (AED/min)
            </Label>
            <Input id="min" placeholder="1.50" />
          </div>
          <div className="space-y-1.5 flex-1">
            <Label htmlFor="payout" className="text-white">
              Operator payout (AED/min)
            </Label>
            <Input id="payout" placeholder="1.00" />
          </div>
        </div>
      </Modal>
      <PricingTable />
    </main>
  );
};

export default CallPage;
