import type { ReactNode } from "react";
import Image from "next/image";
import AllImages from "@/assets/AllImages";

export function AuthLayout({
  title = "Admin Portal",
  subtitle,
  children,
}: {
  title?: string;
  subtitle: string;
  children: ReactNode;
  }) {
  const year = new Date().getFullYear();
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4 py-16"
      style={{
        background:
          "linear-gradient(145deg, #2F80ED 0%, #0A0A0B 50%, #2F80ED 100%)",
      }}
    >
      <div className="flex flex-col items-center">
        <Image
          src={AllImages.logo}
          alt="RORA"
          width={96}
          height={96}
          className="rounded-full"
          priority
        />
        <h1 className="mt-4 text-2xl font-bold text-white">{title}</h1>
        <p className="mt-1 text-sm text-[#BFBFBF]">{subtitle}</p>
      </div>

      <div className="mt-8 w-full max-w-md rounded-xl border border-card-border bg-card p-6 shadow-2xl">
        {children}
      </div>

      <p className="mt-6 text-xs text-[#BFBFBF]/70">
        © {year} RORA. All rights reserved.
      </p>
    </div>
  );
}
