import { CheckCircle2, Clock, Download, XCircle } from "lucide-react";

import PayoutsTable from "@/components/payouts_page/payouts_table";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-title text-3xl font-bold">Payouts</h1>
          <p className="text-muted-foreground ">
            Review, approve and track operator payouts
          </p>
        </div>
        <div className="flex gap-3">
          <Button>
            <Download className="size-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-2xl">AED 41,260</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Paid MTD</CardDescription>
            <CardTitle className="text-2xl">AED 184,720</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Rejected</CardDescription>
            <CardTitle className="text-2xl">AED 2,210</CardTitle>
          </CardHeader>
        </Card>
      </div>
      <PayoutsTable />
    </main>
  );
};

export default CallPage;
