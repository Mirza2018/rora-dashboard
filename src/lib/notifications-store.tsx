"use client"

import * as React from "react"

export type NotificationItem = {
  id: string
  title: string
  description: string
  /** ISO timestamp string. */
  createdAt: string
  read: boolean
}

type NotificationsContextType = {
  notifications: NotificationItem[]
  unreadCount: number
  markAllAsRead: () => void
  markAsRead: (id: string) => void
}

const NotificationsContext = React.createContext<NotificationsContextType | null>(null)

function seedNotifications(): NotificationItem[] {
  const now = Date.now()
  const minutes = (n: number) => new Date(now - n * 60 * 1000).toISOString()
  const hours = (n: number) => minutes(n * 60)
  const days = (n: number) => hours(n * 24)

  return [
    {
      id: "1",
      title: "New order received",
      description: "Order #4821 was placed by Marcus Lee for $482.00.",
      createdAt: minutes(2),
      read: false,
    },
    {
      id: "2",
      title: "Payment failed",
      description: "Payment for order #4819 from Sofia Ruiz could not be processed.",
      createdAt: minutes(45),
      read: false,
    },
    {
      id: "3",
      title: "New customer signed up",
      description: "Aria Chen created an account and subscribed to the Pro plan.",
      createdAt: hours(3),
      read: false,
    },
    {
      id: "4",
      title: "Payout processed",
      description: "Your weekly payout of $2,140.00 has been sent to your bank account.",
      createdAt: days(1),
      read: true,
    },
    {
      id: "5",
      title: "Dispute opened",
      description: "Devon Park opened a dispute for order #4790.",
      createdAt: days(3),
      read: true,
    },
    {
      id: "6",
      title: "Weekly report ready",
      description: "Your analytics report for last week is ready to view.",
      createdAt: days(6),
      read: true,
    },
  ]
}

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = React.useState<NotificationItem[]>(seedNotifications)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllAsRead = React.useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const markAsRead = React.useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }, [])

  const value = React.useMemo(
    () => ({ notifications, unreadCount, markAllAsRead, markAsRead }),
    [notifications, unreadCount, markAllAsRead, markAsRead]
  )

  return (
    <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const ctx = React.useContext(NotificationsContext)
  if (!ctx) {
    throw new Error("useNotifications must be used within a NotificationsProvider")
  }
  return ctx
}
