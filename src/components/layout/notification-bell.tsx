"use client";

import * as React from "react";
import { Bell, BellOff } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { useFloatingPosition } from "@/lib/use-floating-position";
import { Portal } from "@/components/ui/portal";
import { formatRelativeTime } from "@/lib/format-relative-time";
import { useGetNotificationsQuery } from "@/redux/api/adminApi"; // adjust to your actual path

const SEEN_STORAGE_KEY = "admin-notifications-seen-ids";
const POLL_INTERVAL_MS = 30_000;

const readSeenIds = (): Set<string> => {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(SEEN_STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
};

const writeSeenIds = (ids: Set<string>) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SEEN_STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    // ignore storage failures (e.g. private browsing)
  }
};

export function NotificationBell() {
  const [open, setOpen] = React.useState(false);
  const [seenIds, setSeenIds] = React.useState<Set<string>>(() => new Set());

  const { triggerRef, panelRef, style } = useFloatingPosition(open, {
    matchWidth: false,
    align: "end",
    gap: 10,
  });

  const { data: response } = useGetNotificationsQuery(
    { page: 1, limit: 6 },
    { pollingInterval: POLL_INTERVAL_MS },
  );

  const recent = response?.data?.notifications ?? [];

  // Load seen ids from storage once on mount (client only).
  React.useEffect(() => {
    setSeenIds(readSeenIds());
  }, []);

  const unreadCount = React.useMemo(
    () => recent.filter((n: any) => !seenIds.has(n._id)).length,
    [recent, seenIds],
  );

  const markAllAsRead = React.useCallback(() => {
    setSeenIds((prev) => {
      const next = new Set(prev);
      recent.forEach((n:any) => next.add(n._id));
      writeSeenIds(next);
      return next;
    });
  }, [recent]);

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
                recent.map((n:any) => (
                  <div
                    key={n._id}
                    className="border-card-border flex gap-3 border-b px-4 py-3 last:border-0 hover:bg-white/[0.03]"
                  >
                    <span
                      className={cn(
                        "mt-1.5 size-2 shrink-0 rounded-full",
                        !seenIds.has(n._id) && "bg-primary",
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-foreground text-sm font-medium">
                        {n.title}
                      </p>
                      <p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs">
                        {n.message}
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
              href="/dashboard/notification"
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
