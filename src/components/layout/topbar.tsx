"use client";
import { Bell, LogOut, Search, User } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Select } from "../ui/select";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { NotificationBell } from "./notification-bell";

export function Topbar() {
  const router = useRouter();
  return (
    <header className="bg-sidebar text-sidebar-foreground border-b border-sidebar-border flex h-14 items-center justify-between px-4 gap-4 sticky top-0 z-50">
      <div className="flex items-center gap-3 flex-1">
        <SidebarTrigger />
        {/* <div className="relative w-72 max-w-full">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-8" />
        </div> */}
      </div>
      <div className="flex items-center gap-4">
        {/* <button className="text-sidebar-foreground hover:text-title transition-colors">
          <Bell className="size-5" />
        </button> */}
        <div className="size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
          JD
        </div>
        <NotificationBell />
        <Select
          placeholder={"Admin"}
          options={[
            {
              label: (
                <>
                  <div
                    onClick={() => router.push("/dashboard/settings")}
                    className="flex items-center gap-2 hover:text-primary"
                  >
                    <User size={16} />
                    Profile
                  </div>
                </>
              ),
              value: "profile",
            },
            {
              label: (
                <>
                  <div
                    onClick={() => router.push("/sign-in")}
                    className="flex items-center gap-2 hover:text-status-failed"
                  >
                    <LogOut size={16} />
                    Logout
                  </div>
                </>
              ),
              value: "logout",
            },
          ]}
          // value={field.value ?? null}
          // onValueChange={field.onChange}
          triggerClassName={cn(
            "border-0 bg-transparent shadow-non text-white!",
          )}
        />
      </div>
    </header>
  );
}
