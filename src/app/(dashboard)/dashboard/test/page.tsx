import { CheckCircle2, CircleCheckBig, CircleX, Clock, Clock3, PauseCircle, Plus, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/ui/status-badge";
import Loading from "@/app/loading";

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
    status: "suspended" as const,
  },
];

const STATUS_ICON = {
  complete: CircleCheckBig,
  pending: Clock3,
  failed: CircleX,
  suspended: PauseCircle,
} as const;

const Overviewpage = () => {
  return (
    <main className="flex-1 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-title text-xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Overview of your store performance
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="cancel">Cancel</Button>
          <Button>
            <Plus className="size-4" />
            Add new
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Total revenue</CardDescription>
            <CardTitle className="text-2xl">$48,204</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Active orders</CardDescription>
            <CardTitle className="text-2xl">312</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Failed payments</CardDescription>
            <CardTitle className="text-2xl">7</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
            <CardDescription>Last 7 months</CardDescription>
          </CardHeader>
          <CardContent>
            {/* <RevenueAreaChart /> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Orders vs Returns</CardTitle>
            <CardDescription>This week</CardDescription>
          </CardHeader>
          <CardContent>
            {/* <OrdersBarChart /> */}
          </CardContent>
        </Card>
      </div>

      {/* Table + form */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent transactions</CardTitle>
            <CardDescription>Latest activity across your store</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {ROWS.map((row) => {
                const Icon = STATUS_ICON[row.status];
                return (
                  <div
                    key={row.id}
                    className="flex items-center justify-between rounded-md px-2 py-3 border-b border-card-border last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="size-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {row.id}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {row.customer}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-foreground">
                        {row.amount}
                      </span>
                      <StatusBadge status={row.status}>
                        {row.status}
                      </StatusBadge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick add</CardTitle>
            <CardDescription>Create a new customer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Jane Cooper" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="jane@company.com" />
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="cancel" className="flex-1">
                Cancel
              </Button>
              <Button className="flex-1">Save</Button>
            </div>
          </CardContent>
        </Card>
        <Loading/>
      </div>
    </main>
  );
};

export default Overviewpage;
