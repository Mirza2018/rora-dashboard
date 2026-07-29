import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  GitCommitHorizontal,
  XCircle,
} from "lucide-react";

import { AreaRechart } from "@/components/charts/area-chart";
import { PieChart } from "@/components/charts/pie_chart";
import OverviewTable from "@/components/overview_page/overview_table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
          <h1 className="text-title text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground ">
            Monitor your platform performance and key metrics
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Total Customers</CardDescription>
            <CardTitle className="text-2xl">12,458</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Total Operators</CardDescription>
            <CardTitle className="text-2xl">456</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-2xl">AED 1,245,000</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Pending Payouts</CardDescription>
            <CardTitle className="text-2xl">AED 23,500</CardTitle>
          </CardHeader>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="flex-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue (last 7 days)</CardTitle>
            <CardDescription>
              AED revenue with daily call volume
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AreaRechart />
            <div className="text-primary mt-4    flex gap-2  justify-center items-center">
              <GitCommitHorizontal />
              Revenue ($)
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Calls by status (today)</CardTitle>
            <CardDescription>1,284 calls total</CardDescription>
          </CardHeader>
          <CardContent>
            <PieChart
              showLabels
              data={[
                { label: "Failed", value: 10, color: "#FF5C5C" },
                { label: "Complete", value: 50, color: "#2F80ED" },
                { label: "Pending", value: 40, color: "#FFB547" },
              ]}
            />
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <OverviewTable />
        <Card className="my-9">
          <CardHeader>
            <CardTitle>Needs your attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {attention.map((item) => (
                <div
                  key={item.id}
                  className="rounded-md w-full p-4 flex justify-between items-center gap-2 border-2"
                  style={{
                    borderColor: item.color,
                    backgroundColor: `${item.color}1A`, // ~10% opacity
                  }}
                >
                  <div>
                    <h1 className="text-white text-sm font-bold">
                      {item.title}
                    </h1>
                    <p className="text-muted-foreground text-xs ">
                      {item.description}
                    </p>
                  </div>

                  <ArrowUpRight className="text-white" />
                </div>
              ))}
              {/* <div
                className={`border-2 border-[#FFB547]! rounded-md w-full bg-[#FFB547]/10 p-2.5 flex justify-between items-center gap-2`}
              >
                <div>
                 <h1 className="text-white text-sm font-bold">
                  1 open disputes
                </h1>
                <p className="text-muted-foreground text-xs ">
                  Oldest waiting 1d 4h — escalation threshold passed.
                </p> 
                </div>
                
                <div>
                  <ArrowUpRight className="text-white" />
                </div>
              </div> */}
            </div>
          </CardContent>
        </Card>
      </div>
      
    </main>
  );
};

export default CallPage;

const attention = [
  {
    id: 1,
    title: "1 open disputes",
    description: "Oldest waiting 1d 4h — escalation threshold passed.",
    color: "#FFB547",
  },
  {
    id: 2,
    title: "1 payouts pending",
    description: "EGP 412,950 awaiting Finance approval.",
    color: "#2F80ED",
  },
  {
    id: 3,
    title: "3 new KYC submissions",
    description: "One submission flagged high-risk by automated check.",
    color: "#FFB547",
  },
  {
    id: 4,
    title: "2 accounts under review",
    description: "User activity triggered compliance checks.",
    color: "#2F80ED",
  },
];
