"use client";

import { Eye, SquarePen } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { useGetPolicyAndHelpQuery } from "@/redux/api/adminApi"; // adjust to your actual path
import { cn } from "@/lib/utils";

type Policy = {
  _id: string;
  type: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

// Rough word-based "pages" estimate so the card still shows a page count
// without a dedicated backend field for it.
const estimatePages = (html: string) => {
  const text = html.replace(/<[^>]+>/g, " ").trim();
  if (!text) return 0;
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.round(words / 300));
};

const LegalContent = () => {
  const router = useRouter();
  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetPolicyAndHelpQuery(undefined);

  const loading = isLoading || isFetching;
  const policies: Policy[] = response?.data ?? [];

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-56 mt-2" />
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 pt-2">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 flex-1" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {policies.map((policy) => (
        <Card key={policy._id}>
          <CardHeader>
            <CardTitle className="text-white">{policy.title}</CardTitle>
            <CardDescription>
              Last updated: {formatDate(policy.updatedAt)} •{" "}
              {estimatePages(policy.content)} page
              {estimatePages(policy.content) !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent className={`${cn("sm:px-4 px-0")} space-y-6`}>
            <div className="flex gap-3 pt-2">
              <Button
                onClick={() => router.push(`/dashboard/legal/${policy.type}`)}
                variant="default"
                className="flex-1 bg-white! text-black! cursor-pointer "
              >
                <Eye /> Preview
              </Button>
              <Button
                onClick={() =>
                  router.push(`/dashboard/legal/${policy.type}/edit`)
                }
                className={`flex-1 cursor-pointer ${cn(
                  "px-0 sm:px-4",
                )}`}
              >
                <SquarePen />
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LegalContent;
