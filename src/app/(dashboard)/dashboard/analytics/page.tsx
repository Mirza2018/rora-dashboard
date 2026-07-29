"use client";
import {
  Download,
  GitCommitHorizontal
} from "lucide-react";

import { AreaRechart } from "@/components/charts/area-chart";
import { PieChart } from "@/components/charts/pie_chart";
import { VerticalBarChart } from "@/components/charts/vertical-bar-chart";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { useState } from "react";

const CallPage = () => {
    const [plan, setPlan] = useState<string | null>(null);
  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-title text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground ">
            Detailed analytics across revenue, calls, operators and customers
          </p>
        </div>
        <div className="flex gap-3">
          <div className="space-y-1.5">
       
            <Select
              placeholder="Select time period"
              value={plan}
              onValueChange={setPlan}
              options={[
                { label: "30 days", value: "starter" },
                { label: "15 days", value: "pro" },
                { label: "7 days", value: "enterprise" },
              ]}
            />
          </div>
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
            <CardDescription>Revenue (30d)</CardDescription>
            <CardTitle className="text-2xl">AED 482,210</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Calls (30d)</CardDescription>
            <CardTitle className="text-2xl">36</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Operator earnings</CardDescription>
            <CardTitle className="text-2xl">AED 321,470</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="flex-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue (last 7 days)</CardTitle>
            {/* <CardDescription>
              AED revenue with daily call volume
            </CardDescription> */}
          </CardHeader>
          <CardContent>
            <AreaRechart />
            <div className="text-primary    flex gap-2  justify-center items-center">
              <GitCommitHorizontal />
              Revenue ($)
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Calls by status (weekly)</CardTitle>
          </CardHeader>
          <CardContent>
            <VerticalBarChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Top Operators</CardTitle>
            {/* <CardDescription>
              AED revenue with daily call volume
            </CardDescription> */}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topOperator.map((operator) => (
                <div
                  key={operator.id}
                  className="border p-2.5 rounded-2xl flex justify-between items-center"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="font-bold text-sm px-4 py-2.5  rounded-full bg-[#192331]">
                      {operator.id}
                    </div>
                    <div>
                      <h1 className="font-bold text-sm text-white">
                        {operator.name}
                      </h1>
                      <p className="text-sx">{operator.calls} calls</p>
                    </div>
                  </div>
                  <div className="font-bold text-sm text-white">
                    {operator.revenue}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
            {/* <CardDescription>
              AED revenue with daily call volume
            </CardDescription> */}
          </CardHeader>
          <CardContent>
            {" "}
            <div className="space-y-4">
              {topCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="border p-2.5 rounded-2xl flex justify-between items-center"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="font-bold text-sm px-4 py-2.5  rounded-full bg-[#182926]">
                      {customer.id}
                    </div>
                    <div>
                      <h1 className="font-bold text-sm text-white">
                        {customer.name}
                      </h1>
                    </div>
                  </div>
                  <div className="font-bold text-sm text-white">
                    {customer.revenue}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Destinations</CardTitle>
            {/* <CardDescription>1,284 calls total</CardDescription> */}
          </CardHeader>
          <CardContent>
            <PieChart
              showLabels
              data={[
                { label: "Eritrea", value: 50, color: "#2F80ED" },
                { label: "Sudan", value: 40, color: "#FFB547" },
                { label: "Others", value: 10, color: "#27C281" },
              ]}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default CallPage;

const topOperator = [
  {
    id: 1,
    name: "Ahmed Saleh",
    calls: 384,
    revenue: "AED 6,250",
  },
  {
    id: 2,
    name: "Fatima Al Zahrani",
    calls: 250,
    revenue: "AED 4,800",
  },
  {
    id: 3,
    name: "Mohammed Al Farsi",
    calls: 320,
    revenue: "AED 5,600",
  },
  {
    id: 4,
    name: "Sara Al Hamadi",
    calls: 410,
    revenue: "AED 7,100",
  },
  {
    id: 5,
    name: "Yasmin Farah",
    calls: 275,
    revenue: "AED 4,900",
  },
];

const topCustomers = [
  {
    id: 1,
    name: "Mehari T.",
    revenue: "AED 410",
  },
  {
    id: 2,
    name: "Yonas T.",
    revenue: "AED 320",
  },
  {
    id: 3,
    name: "Amina K.",
    revenue: "AED 450",
  },
  {
    id: 4,
    name: "Samir L.",
    revenue: "AED 210",
  },
  {
    id: 5,
    name: "Fatima S.",
    revenue: "AED 600",
  },
];
