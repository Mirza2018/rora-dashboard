"use client";

import React from "react";

import NotificationTable from "@/components/notification_page/notification_table";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useCreateNotificationMutation } from "@/redux/api/adminApi"; // adjust to your actual path

const NotificationPage = () => {
  const [title, setTitle] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [audience, setAudience] = React.useState("all");
  const [error, setError] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  const [createNotification, { isLoading: isSending }] =
    useCreateNotificationMutation();

  const handleSend = async () => {
    setError(null);
    setSuccessMsg(null);

    if (!title.trim() || !message.trim()) {
      setError("Please fill in both the title and the message.");
      return;
    }

    try {
      const res = await createNotification({
        title: title.trim(),
        message: message.trim(),
        audience,
      }).unwrap();

      setSuccessMsg(
        `Notification "${res.data.title}" queued for ${res.data.audience}.`,
      );
      setTitle("");
      setMessage("");
      setAudience("all");
    } catch (err) {
      console.error("Failed to send notification", err);
      setError("Something went wrong while sending. Please try again.");
    }
  };

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
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isSending}
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
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isSending}
                />
              </div>
              <Label htmlFor="userOption" className="text-xs font-medium">
                Send to
              </Label>
              <RadioGroup
                orientation="horizontal"
                itemClassName="px-4 py-2 rounded-md text-white text-sm bg-black"
                selectedItemClassName="border border-primary!"
                options={[
                  { value: "all", label: "All Users" },
                  { value: "operators", label: "Operators" },
                  { value: "customers", label: "Customers" },
                ]}
                value={audience ?? null}
                onValueChange={setAudience}
                disabled={isSending}
              />

              {error && <p className="text-sm text-status-failed">{error}</p>}
              {successMsg && (
                <p className="text-sm text-status-success">{successMsg}</p>
              )}
            </div>
          </CardDescription>
        </CardHeader>
      </Card>
      <Button
        variant={"default"}
        className="w-full"
        onClick={handleSend}
        disabled={isSending}
      >
        {isSending ? "Sending..." : "Send Notification"}
      </Button>

      <NotificationTable />
    </main>
  );
};

export default NotificationPage;
