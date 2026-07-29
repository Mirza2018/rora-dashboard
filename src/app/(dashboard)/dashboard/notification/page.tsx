"use client";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

import NotificationTable from "@/components/notification_page/notification_table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader
} from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldTitle
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

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
  const [value, setValue] = React.useState("all");
  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-title text-3xl font-bold">Send Notification</h1>
          <p className="text-muted-foreground ">
            Type by your own and send customized notifications.
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          {/* <CardTitle className="text-2xl">0</CardTitle> */}
          <CardDescription>
            <div className="space-y-6">
              <div className="">
                <Label htmlFor="title" className="text-xs font-medium">
                  Notification Title
                </Label>
                <Input
                  id="title"
                  className="mt-2"
                  placeholder="Enter notification title"
                />
              </div>
              <div className="">
                <Label htmlFor="message" className="text-xs font-medium">
                  Message
                </Label>
                <Textarea
                  className="mt-2"
                  rows={6}
                  id="message"
                  placeholder="Write your notification message here"
                />
              </div>
              <Label htmlFor="userOption" className="text-xs font-medium">
                Send to
              </Label>
              <RadioGroup
                orientation="horizontal"
                className=""
                itemClassName="px-4 py-2 rounded-md text-white text-sm bg-black"
                selectedItemClassName="border border-primary!"
                options={[
                  {
                    value: "all",
                    label: "All Users",
                  },
                  {
                    value: "operators",
                    label: "Operators",
                  },
                  {
                    value: "customers",
                    label: "Customers",
                  },
                ]}
                value={value ?? null}
                onValueChange={setValue}
                // disabled={disabled}
              />
            </div>
          </CardDescription>
        </CardHeader>
      </Card>
      <Button variant={"default"} className="w-full">
        Send Notification
      </Button>
      {/* Stat cards */}
      <NotificationTable />
    </main>
  );
};

export default CallPage;




              
              // <RadioGroup defaultValue="plus" className="flex ">
              //   <FieldLabel htmlFor="plus-plan">
              //     <Field orientation="horizontal">
              //       <FieldContent>
              //         <FieldTitle>All Users</FieldTitle>
              //         {/* <FieldDescription>
              //           For individuals and small teams.
              //         </FieldDescription> */}
              //       </FieldContent>
              //       <RadioGroupItem value="plus" id="plus-plan" />
              //     </Field>
              //   </FieldLabel>
              //   <FieldLabel htmlFor="pro-plan">
              //     <Field orientation="horizontal">
              //       <FieldContent>
              //         <FieldTitle>Operators</FieldTitle>
              //         {/* <FieldDescription>
              //           For growing businesses.
              //         </FieldDescription> */}
              //       </FieldContent>
              //       <RadioGroupItem value="pro" id="pro-plan" />
              //     </Field>
              //   </FieldLabel>
              //   <FieldLabel htmlFor="enterprise-plan">
              //     <Field orientation="horizontal">
              //       <FieldContent>
              //         <FieldTitle>Customers</FieldTitle>
              //         {/* <FieldDescription>
              //           For large teams and enterprises.
              //         </FieldDescription> */}
              //       </FieldContent>
              //       <RadioGroupItem value="enterprise" id="enterprise-plan" />
              //     </Field>
              //   </FieldLabel>
              // </RadioGroup>;

