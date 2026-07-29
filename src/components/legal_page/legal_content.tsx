"use client";
import { Eye, SquarePen } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import RichTextEditor from "./RichTextEditor";
import { useState } from "react";
import { useRouter } from "next/navigation";

const LegalContent = () => {
  const [content, setContent] = useState("");
  const router = useRouter();
  return (
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-white">He</CardTitle>
            <CardDescription>
              Last updated: 2026-01-15 • 8 pages
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3 pt-2">
              <Button
                onClick={() => router.push("/dashboard/legal/terms-privacy")}
                variant="default"
                className="flex-1 bg-white! text-black! cursor-pointer"
              >
                <Eye /> Preview
              </Button>
              <Button
                onClick={() =>
                  router.push("/dashboard/legal/terms-privacy-edit")
                }
                className="flex-1 cursor-pointer"
              >
                <SquarePen />
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Help Center</CardTitle>
            <CardDescription>
              Last updated: 2026-01-15 • 12 pages
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3 pt-2">
              <Button
                onClick={() => router.push("/dashboard/legal/help")}
                variant="default"
                className="flex-1 bg-white! text-black! cursor-pointer"
              >
                <Eye /> Preview
              </Button>
              <Button
                onClick={() => router.push("/dashboard/legal/help-edit")}
                className="flex-1 cursor-pointer"
              >
                <SquarePen />
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LegalContent;
