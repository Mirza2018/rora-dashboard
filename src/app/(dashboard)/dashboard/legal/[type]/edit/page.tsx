"use client";

import { ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

import RichTextEditor from "@/components/legal_page/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetPolicyAndHelpQuery,
  useUpdatePolicyAndHelpMutation,
} from "@/redux/api/adminApi"; // adjust to your actual path

const PolicyEditPage = () => {
  const router = useRouter();
  const params = useParams<{ type: string }>();

  const [content, setContent] = React.useState("");
  const [initialized, setInitialized] = React.useState(false);

  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetPolicyAndHelpQuery(undefined);
  const [updatePolicy, { isLoading: isSaving }] =
    useUpdatePolicyAndHelpMutation();

  const loading = isLoading || isFetching;
  const policy = (response?.data ?? []).find(
    (p: any) => p.type === params.type,
  );

  // Seed the editor once with the fetched content.
  React.useEffect(() => {
    if (policy && !initialized) {
      setContent(policy.content ?? "");
      setInitialized(true);
    }
  }, [policy, initialized]);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/dashboard/legal");
    }
  };

  const handleSave = async () => {
    if (!params.type) return;

    const toastId = toast.loading("Saving changes...");
    try {
      await updatePolicy({
        type: params.type,
        data: { content },
      }).unwrap();

      toast.success("Page updated successfully.", { id: toastId });
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to save changes.", {
        id: toastId,
      });
    }
  };

  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-start">
        <div>
          <h1 className="text-title text-3xl font-bold flex items-center justify-start">
            <ChevronLeft
              onClick={handleBack}
              size={40}
              className="cursor-pointer"
            />{" "}
            {loading ? "Loading..." : `${policy?.title ?? "Page"} Edit`}
          </h1>
        </div>
      </div>

      <div className="h-96 ">
        {loading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <RichTextEditor value={content} onChange={setContent} />
        )}
      </div>

      <div className="flex justify-center items-center gap-3">
        <Button variant="cancel" onClick={handleBack} disabled={isSaving}>
          Cancel
        </Button>
        <Button variant="default" onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save change"}
        </Button>
      </div>
    </main>
  );
};

export default PolicyEditPage;
