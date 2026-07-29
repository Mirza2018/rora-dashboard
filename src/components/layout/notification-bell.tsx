"use client";

import * as React from "react";
import { Bell, BellOff } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { useFloatingPosition } from "@/lib/use-floating-position";
import { Portal } from "@/components/ui/portal";
import { useNotifications } from "@/lib/notifications-store";
import { formatRelativeTime } from "@/lib/format-relative-time";

export function NotificationBell() {
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const [open, setOpen] = React.useState(false);
  const { triggerRef, panelRef, style } = useFloatingPosition(open, {
    matchWidth: false,
    align: "end",
    gap: 10,
  });

  React.useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      const insideTrigger = triggerRef.current?.contains(target);
      const insidePanel = panelRef.current?.contains(target);
      if (!insideTrigger && !insidePanel) setOpen(false);
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, triggerRef, panelRef]);

  function handleToggle() {
    setOpen((prev) => !prev);
  }

  React.useEffect(() => {
    if (open) {
      markAllAsRead();
    }
  }, [open, markAllAsRead]);
  const recent = notifications.slice(0, 6);

  return (
    <>
      <button
        ref={triggerRef as React.RefObject<HTMLButtonElement>}
        type="button"
        onClick={handleToggle}
        aria-label="Notifications"
        className="relative text-sidebar-foreground hover:text-title transition-colors"
      >
        <Bell className="size-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-status-failed px-1 text-[10px] font-semibold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <Portal>
          <div
            ref={panelRef as React.RefObject<HTMLDivElement>}
            style={style}
            className="bg-card border-card-border z-[60] flex w-80 flex-col overflow-hidden rounded-md border shadow-xl"
          >
            <div className="border-card-border border-b px-4 py-3">
              <p className="text-foreground text-sm font-semibold">
                Notifications
              </p>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {recent.length === 0 ? (
                <div className="flex flex-col items-center gap-2 px-4 py-10 text-muted-foreground">
                  <BellOff className="size-6 opacity-60" />
                  <p className="text-sm">No notifications yet.</p>
                </div>
              ) : (
                recent.map((n) => (
                  <div
                    key={n.id}
                    className="border-card-border flex gap-3 border-b px-4 py-3 last:border-0 hover:bg-white/[0.03]"
                  >
                    <span
                      className={cn(
                        "mt-1.5 size-2 shrink-0 rounded-full",
                        !n.read && "bg-primary",
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-foreground text-sm font-medium">
                        {n.title}
                      </p>
                      <p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs">
                        {n.description}
                      </p>
                      <p className="text-muted-foreground/70 mt-1 text-xs">
                        {formatRelativeTime(n.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <Link
              href="/dashboard/notifications"
              onClick={() => setOpen(false)}
              className="border-card-border text-title border-t px-4 py-2.5 text-center text-sm font-medium hover:bg-white/5"
            >
              See all notifications
            </Link>
          </div>
        </Portal>
      )}
    </>
  );
}
