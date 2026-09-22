"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { clearAuth } from "@/redux/slices/authSlice";
import { RootState } from "@/redux/store";
import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "universal-cookie";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Select } from "../ui/select";
import { NotificationBell } from "./notification-bell";

export function Topbar() {
  const router = useRouter();
  const userInfo:any = useSelector((state: RootState) => state.auth.userInfo);
  const dispatch = useDispatch();
  const cookies = new Cookies();
  const getInitials = (name?: string) => {
    if (!name) return "TA";
    const parts = name.trim().split(/\s+/);
    const initials = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "");
    return initials.join("") || "TA";
  };
    const handleLogout = () => {
      dispatch(clearAuth());
      router.push("/sign-in");
      cookies.remove("rora_dashboard_accessToken");
    };

  
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
        <Avatar>
          <AvatarImage
            src={userInfo?.image}
            alt={userInfo?.name ?? "Profile picture"}
          />
          <AvatarFallback>{getInitials(userInfo?.name)}</AvatarFallback>
        </Avatar>
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
                    onClick={handleLogout}
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
