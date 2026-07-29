"use client";
import { HorizontalBarChart } from "@/components/charts/horizontal-bar-chart";
import DistributorsReportTable from "@/components/distributors_report_page/distributors_report_table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { Dot, Phone, PhoneCall, Send, Wallet } from "lucide-react";
import React from "react";
type Call = {
  id: string;
  name: string;
  phone: string;
  city: string;
  status: "active" | "complete" | "blocked";
  kyc: "verified" | "Pending";
  calls: string;
  earning: string;
  joined: string;
};



const CallPage = () => {
  const [viewRow, setViewRow] = React.useState<Call | null>(null);
  const singleCustomers: Call = {
    id: "TXN-0231",
    name: "Marcus Lee",
    phone: "+1 234 567 8901",
    city: "Dubai",
    status: "complete",
    kyc: "verified",
    calls: "10",
    earning: "$482.00",
    joined: "2023-01-01",
  };
  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-title text-3xl font-bold">Distributors Report</h1>
          <p className="text-muted-foreground ">
            Aggregated performance across all approved distributors
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Active distributors</CardDescription>
            <CardTitle className="text-2xl">36</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Minutes issued (period)y</CardDescription>
            <CardTitle className="text-2xl">94,000</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Minutes transferred</CardDescription>
            <CardTitle className="text-2xl">79,730</CardTitle>
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
          <CardContent className="p-0">
            {/* <RevenueAreaChart /> */}
            <HorizontalBarChart />
            <div className=" mt-4    flex gap-2  justify-center items-center">
              <div className="text-primary flex justify-center items-center ">
                <Dot size={50} strokeWidth={3} />
                Issued
              </div>
              <div className="text-status-complete flex justify-center items-center">
                <Dot size={50} strokeWidth={3} />
                Transferred to customers
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top performer</CardTitle>
            {/* <CardDescription>1,284 calls total</CardDescription> */}
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              <div className="px-2.5 py-4.5 border border-primary! bg-primary/10 rounded-2xl ">
                <h1 className="text-sm font-bold text-white">Mehari T.</h1>
                <p className="text-xs">CU-5818 · Egypt</p>
              </div>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <dt className="text-muted-foreground text-sm">
                    Total minutes transferred
                  </dt>
                  <dd className="font-medium text-white ">53,790</dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-muted-foreground text-sm">Commission</dt>
                  <dd className="font-medium text-white ">AED 1,240</dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-muted-foreground text-sm">
                    Last activity
                  </dt>
                  <dd className="font-medium text-white ">18m ago</dd>
                </div>
              </dl>
              <Button
                onClick={()=>setViewRow(singleCustomers)}
                variant="default"
                className="w-full text-sm font-semibold py-6"
              >
                View Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Modal
        open={!!viewRow}
        onClose={() => setViewRow(null)}
        title="Customer Details"
        description="Complete profile and performance overview"
        footer={
          <>
            <Button variant="cancel" onClick={() => setViewRow(null)}>
              Close
            </Button>
          </>
        }
      >
        <Card>
          <CardHeader>
            {/* <CardTitle className="text-2xl">0</CardTitle> */}
            <CardDescription>
              <div className="flex justify-between items-center -my-3">
                <div className="flex items-center  gap-4">
                  <Avatar className="size-16">
                    <AvatarImage
                      src="https://i.pravatar.cc/64?img=12"
                      alt="Profile picture"
                    />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xl font-bold text-white">
                      {viewRow?.name}
                    </p>
                    <p className="text-xs">{viewRow?.id}</p>
                    <p className="text-xs mt-1 py-1 px-2.5 bg-status-complete w-fit text-white rounded-md">
                      active
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-xs">Member Since</p>
                  <p className=" font-medium text-white">Sep 2026</p>
                </div>
              </div>
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="flex  flex-1 items-center gap-2 border rounded-md p-2.5">
          <Phone className="text-primary" />
          <div>
            <p className="text-white text-xs">Phone</p>
            <p className="text-sm font-medium">+971 50 482 9930</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              {/* <CardTitle className="text-2xl">0</CardTitle> */}
              <CardDescription>
                <div className="flex flex-col justify-center items-center -my-3">
                  <PhoneCall className="text-primary" size={36} />
                  <p className="text-xl font-bold text-white">1234</p>
                  <p className="text-xs">Calls</p>
                </div>
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              {/* <CardTitle className="text-2xl">0</CardTitle> */}
              <CardDescription>
                <div className="flex flex-col justify-center items-center -my-3">
                  <Send className="text-white" size={36} />
                  <p className="text-xl font-bold text-white">12,000</p>
                  <p className="text-xs">Transferred minutes</p>
                </div>
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              {/* <CardTitle className="text-2xl">0</CardTitle> */}
              <CardDescription>
                <div className="flex flex-col justify-center items-center -my-3">
                  <Wallet className="text-status-complete" size={36} />
                  <p className="text-xl font-bold text-white">AED 12,415</p>
                  <p className="text-xs">Spend MTD</p>
                </div>
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Modal>

      <DistributorsReportTable />
    </main>
  );
};

export default CallPage;
