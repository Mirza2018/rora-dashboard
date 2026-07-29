"use client";

import { BellOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatRelativeTime } from "@/lib/format-relative-time";
import { useNotifications } from "@/lib/notifications-store";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const { notifications, unreadCount, markAllAsRead } = useNotifications();

  return (
    <>
      <main className="flex-1 p-6">
        <Card className="mx-auto max-w-2xl">
          <div className="border-card-border flex items-center justify-between border-b px-6 py-4">
            <div>
              <h1 className="text-title text-lg font-semibold">
                Notifications
              </h1>
              <p className="text-muted-foreground text-sm">
                {unreadCount > 0
                  ? `${unreadCount} unread`
                  : "You're all caught up"}
              </p>
            </div>
            {unreadCount > 0 && (
              <Button variant="cancel" size="sm" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
          </div>

          <CardContent className="p-0">
            {notifications.length === 0 ? (
              <div className="text-muted-foreground flex flex-col items-center gap-2 px-6 py-16">
                <BellOff className="size-8 opacity-60" />
                <p className="text-sm">No notifications yet.</p>
              </div>
            ) : (
              <ul>
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className="border-card-border flex gap-3 border-b px-6 py-4 last:border-0 hover:bg-white/[0.02]"
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
                      <p className="text-muted-foreground mt-0.5 text-sm">
                        {n.description}
                      </p>
                      <p className="text-muted-foreground/70 mt-1.5 text-xs">
                        {formatRelativeTime(n.createdAt)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  );
}
