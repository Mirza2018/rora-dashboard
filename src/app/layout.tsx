import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { NotificationsProvider } from "@/lib/notifications-store";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RORA",
  description:
    "Dashboard starter built with Next.js, Tailwind CSS and shadcn/ui",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Toaster
          position="top-right"
          toastOptions={{
            classNames: {
              toast:
                "!bg-card !text-foreground !border !border-card-border !rounded-lg !shadow-lg",
              title: "!text-foreground",
              description: "!text-muted-foreground",
              success: "!border-status-complete/40",
              error: "!border-status-failed/40",
              actionButton: "!bg-primary !text-primary-foreground",
              cancelButton:
                "!bg-cancel !text-cancel-foreground !border !border-cancel-border",
            },
          }}
        />
        <NotificationsProvider>{children}</NotificationsProvider>
      </body>
    </html>
  );
}
