// app/ClientLayout.tsx
"use client";

import Providers from "@/redux/lib/Providers";
// import { Analytics } from "@vercel/analytics/next";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      {children}
      {/* <Analytics /> */}
    </Providers>
  );
}
