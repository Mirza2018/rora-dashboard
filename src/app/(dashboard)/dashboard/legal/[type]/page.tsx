"use client";

import { ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";
import { useGetPolicyAndHelpQuery } from "@/redux/api/adminApi"; // adjust to your actual path

const PolicyPreviewPage = () => {
  const router = useRouter();
  const params = useParams<{ type: string }>();

  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetPolicyAndHelpQuery(undefined);

  const loading = isLoading || isFetching;
  const policy = (response?.data ?? []).find(
    (p: any) => p.type === params.type,
  );

  console.log(policy);
  
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
            <ChevronLeft
              onClick={handleBack}
              size={40}
              className="cursor-pointer"
            />{" "}
            {loading ? "Loading..." : `${policy?.title ?? "Page"} Preview`}
          </h1>
        </div>
      </div>

      {loading ? (
        <div className="container mx-auto max-w-xl space-y-3">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full mt-6" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      ) : !policy ? (
        <p className="text-muted-foreground">
          This policy page couldn&apos;t be found.
        </p>
      ) : !policy.content ? (
        <p className="text-muted-foreground">
          No content has been added yet. Click Edit to add it.
        </p>
      ) : (
        <div
          className="container mx-auto max-w-xl prose prose-invert"
          dangerouslySetInnerHTML={{ __html: policy.content }}
        />
      )}
    </main>
  );
};

export default PolicyPreviewPage;
