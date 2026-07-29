"use client";
import RichTextEditor from "@/components/legal_page/RichTextEditor";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const HelpEditPage = () => {
  const [content, setContent] = useState("");
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/dashboard/legal");
    }
  };
  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-start">
        <div>
          <h1 className="text-title text-3xl font-bold flex items-center justify-start">
            {" "}
            <ChevronLeft onClick={handleBack} size={40} className="cursor-pointer" /> Help center Edit
          </h1>
        </div>
      </div>
      <div className="h-96 ">
        <RichTextEditor value={content} onChange={setContent} />
          </div>
          

      <div className="flex justify-center items-center gap-3">
        <Button variant="cancel">Cancel</Button>
        <Button variant="default">Save change</Button>
      </div>
    </main>
  );
};

export default HelpEditPage;
