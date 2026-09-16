"use client";

import {
  Banknote,
  ChartColumn,
  ChevronDown,
  Crown,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquareDot,
  OctagonAlert,
  PhoneCall,
  Settings,
  Tag,
  UserCog,
  Users
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";

import AllImages from "@/assets/AllImages";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Portal } from "@/components/ui/portal";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useFloatingPosition } from "@/lib/use-floating-position";
import { cn } from "@/lib/utils";
import { clearAuth } from "@/redux/slices/authSlice";
import { RootState } from "@/redux/store";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "universal-cookie";

type NavChild = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
};
type NavItem = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  children?: NavChild[];
};

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard/overview" },
  { label: "Distributors Report", icon: Crown, href: "/dashboard/report" },
  { label: "Analytics", icon: ChartColumn, href: "/dashboard/analytics" },
  { label: "Calls", icon: PhoneCall, href: "/dashboard/calls" },
  { label: "Operators", icon: UserCog, href: "/dashboard/operator" },
  { label: "Customers", icon: Users, href: "/dashboard/customers" },

  { label: "Disputes", icon: OctagonAlert, href: "/dashboard/disputes" },
  { label: "Payouts", icon: Banknote, href: "/dashboard/payouts" },
  { label: "Pricing & Rates", icon: Tag, href: "/dashboard/pricing" },
  { label: "Legal Contents", icon: FileText, href: "/dashboard/legal" },
  {
    label: "Send Notification",
    icon: MessageSquareDot,
    href: "/dashboard/notification",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
];

function isItemActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
const cookies = new Cookies();
  // Inline expand/collapse for the tree when the sidebar itself is expanded.
  const settingsActive = isItemActive(
    pathname,
    NAV_ITEMS.find((i) => i.label === "Settings")!.href,
  );
  const [settingsOpen, setSettingsOpen] = React.useState(settingsActive);
  React.useEffect(() => {
    if (settingsActive) setSettingsOpen(true);
  }, [settingsActive]);

  // Flyout for a parent-with-children item when the sidebar is collapsed.
  // Only one can be open at a time, so a single positioned instance is reused.
  const [flyoutFor, setFlyoutFor] = React.useState<string | null>(null);
  const {
    triggerRef,
    panelRef,
    style: flyoutStyle,
  } = useFloatingPosition(!!flyoutFor, {
    side: "right",
    matchWidth: false,
    align: "start",
    gap: 8,
  });

  React.useEffect(() => {
    if (!flyoutFor) return;
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        panelRef.current &&
        !panelRef.current.contains(target)
      ) {
        setFlyoutFor(null);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setFlyoutFor(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [flyoutFor, triggerRef, panelRef]);

  // Close the flyout automatically if the sidebar expands again.
  React.useEffect(() => {
    if (!collapsed) setFlyoutFor(null);
  }, [collapsed]);

  const flyoutItem = NAV_ITEMS.find((i) => i.label === flyoutFor) ?? null;

  const userInfo:any = useSelector((state: RootState) => state.auth.userInfo);

 
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
    <Sidebar className="sticky top-0">
      {/* Logo */}

      {/* Header Logo start */}
      {/* <SidebarHeader className={cn(collapsed && "justify-center px-0")}>
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </div>
          {!collapsed && (
            <span className="text-title font-semibold tracking-tight truncate">
              RORA
            </span>
          )}
        </div>
      </SidebarHeader> */}

      {/* Header Logo Center */}
      <SidebarHeader className="flex items-center justify-center px-0">
        <div className="flex items-center justify-center">
          <div
            className={cn(
              "flex shrink-0 items-center justify-center rounded-md text-primary-foreground transition-all",
              collapsed ? "size-12" : "size-14",
            )}
          >
            <Image
              className={cn("transition-all", collapsed ? "size-8" : "size-12")}
              src={AllImages.logo}
              alt="logo"
              width={100}
              height={100}
            />
          </div>
        </div>
      </SidebarHeader>

      {/* Nav */}
      <SidebarContent>
        <SidebarMenu>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = isItemActive(pathname, item.href);

            if (item.children) {
              // Collapsed: clicking opens a flyout to the right (no inline tree fits).
              if (collapsed) {
                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      ref={(node: HTMLButtonElement | null) => {
                        if (flyoutFor === item.label) {
                          triggerRef.current = node;
                        }
                      }}
                      isActive={isActive}
                      tooltip={item.label}
                      onClick={() =>
                        setFlyoutFor((v) =>
                          v === item.label ? null : item.label,
                        )
                      }
                    >
                      <Icon className="size-4 shrink-0" />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              }

              // Expanded: inline collapsible tree.
              return (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    isActive={isActive && !settingsOpen}
                    tooltip={item.label}
                    onClick={() => setSettingsOpen((v) => !v)}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span className="truncate flex-1 text-left">
                      {item.label}
                    </span>
                    <ChevronDown
                      className={cn(
                        "size-4 shrink-0 transition-transform",
                        settingsOpen && "rotate-180",
                      )}
                    />
                  </SidebarMenuButton>

                  {settingsOpen && (
                    <ul className="mt-1 flex flex-col gap-1 border-l border-sidebar-border pl-4">
                      {item.children.map((child) => {
                        const ChildIcon = child.icon;
                        const childActive = isItemActive(pathname, child.href);
                        return (
                          <li key={child.label}>
                            <Link
                              href={child.href}
                              className={cn(
                                "flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm text-sidebar-foreground hover:bg-white/5 transition-colors",
                                childActive &&
                                  "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent",
                              )}
                            >
                              <ChildIcon className="size-3.5 shrink-0" />
                              <span className="truncate">{child.label}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </SidebarMenuItem>
              );
            }

            return (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <Icon className="size-4 shrink-0" />
                    {!collapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Collapsed-sidebar flyout for parent-with-children items */}
      {flyoutItem && (
        <Portal>
          <div
            ref={panelRef as React.RefObject<HTMLDivElement>}
            style={flyoutStyle}
            className="z-[60] w-48 overflow-hidden rounded-md border border-sidebar-border bg-sidebar py-1.5 shadow-xl"
          >
            <div className="flex items-center gap-2 px-3 pb-1.5 text-xs font-medium text-muted-foreground">
              <flyoutItem.icon className="size-3.5" />
              {flyoutItem.label}
            </div>
            <div className="border-t border-sidebar-border pt-1">
              {flyoutItem.children!.map((child) => {
                const ChildIcon = child.icon;
                const childActive = isItemActive(pathname, child.href);
                return (
                  <Link
                    key={child.label}
                    href={child.href}
                    onClick={() => setFlyoutFor(null)}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-1.5 text-sm text-sidebar-foreground hover:bg-white/5 transition-colors",
                      childActive &&
                        "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent",
                    )}
                  >
                    <ChildIcon className="size-3.5 shrink-0" />
                    <span className="truncate">{child.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </Portal>
      )}

      {/* Footer: profile pic, name, email, logout */}
      <SidebarFooter>
        <div
          className={cn(
            "flex items-center gap-2.5 rounded-md p-2",
            collapsed && "flex-col",
          )}
        >
          <Avatar>
            <AvatarImage
              src={userInfo?.image}
              alt={userInfo?.name ?? "Profile picture"}
            />
            <AvatarFallback>{getInitials(userInfo?.name)}</AvatarFallback>
          </Avatar>

          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {userInfo?.name ?? "—"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {userInfo?.phone ?? "—"}
              </p>
            </div>
          )}

          <button
            onClick={handleLogout}
            className={cn(
              "flex shrink-0 items-center justify-center rounded-md p-1.5 text-muted-foreground hover:text-status-failed hover:bg-white/5 transition-colors",
              collapsed && "mt-1",
            )}
            title="Log out"
            aria-label="Log out"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
