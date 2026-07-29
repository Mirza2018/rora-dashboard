import { CheckCircle2, Clock, XCircle } from "lucide-react";

import CallsTable from "@/components/calls_page/calls_table";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import DisputesTable from "@/components/disputes_page/disputes_table";

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
            <CardTitle className="text-2xl">6</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Resolved MTD</CardDescription>
            <CardTitle className="text-2xl">36</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Refund total</CardDescription>
            <CardTitle className="text-2xl">AED 1,240</CardTitle>
          </CardHeader>
        </Card>
      </div>
      <DisputesTable />
    </main>
  );
};

export default CallPage;
