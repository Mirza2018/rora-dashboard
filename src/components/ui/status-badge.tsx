import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  CircleCheckBig,
  CircleX,
  Clock3,
  Play,
  PauseCircle,
  Ban,
  FolderOpen,
  BadgeCheck,
  Wallet,
  PackageCheck,
  XCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-sm capitalize font-medium ",
  {
    variants: {
      status: {
        complete:
          "bg-status-complete/10 text-status-complete border-status-complete/30",
        verified:
          "bg-status-complete/10 text-status-complete border-status-complete/30",

        failed:
          "bg-status-failed/10 text-status-failed border-status-failed/30",

        pending:
          "bg-status-pending/10 text-status-pending border-status-pending/30",

        active:
          "bg-status-active/10 text-status-active border-status-active/30",

        suspended:
          "bg-status-suspended/10 text-status-suspended border-status-suspended/30",

        blocked:
          "bg-status-blocked/10 text-status-blocked border-status-blocked/30",

        open: "bg-status-open/10 text-status-open border-status-open/30",

        resolved:
          "bg-status-resolved/10 text-status-resolved border-status-resolved/30",

        rejected:
          "bg-status-rejected/10 text-status-rejected border-status-rejected/30",

        paid: "bg-status-paid/10 text-status-paid border-status-paid/30",

        delivered:
          "bg-status-delivered/10 text-status-delivered border-status-delivered/30",
      },
    },
    defaultVariants: {
      status: "pending",
    },
  },
);

const statusIcons = {
  complete: CircleCheckBig,
  verified: BadgeCheck,
  failed: CircleX,
  pending: Clock3,
  active: Play,
  suspended: PauseCircle,
  blocked: Ban,
  open: FolderOpen,
  resolved: BadgeCheck,
  rejected: XCircle,
  paid: Wallet,
  delivered: PackageCheck,
} as const;

type Status = keyof typeof statusIcons;

interface StatusBadgeProps
  extends
    React.ComponentProps<"span">,
    VariantProps<typeof statusBadgeVariants> {}

function StatusBadge({
  className,
  status = "pending",
  children,
  ...props
}: StatusBadgeProps) {
  const Icon = statusIcons[status as Status];

  return (
    <span
      data-slot="status-badge"
      className={cn(statusBadgeVariants({ status, className }))}
      {...props}
    >
      {/* <span
        className="size-1.5 rounded-full"
        style={{ backgroundColor: "currentColor" }}
      /> */}

      <Icon className="size-4" />

      {children}
    </span>
  );
}

export { StatusBadge, statusBadgeVariants };

// import * as React from "react";
// import { cva, type VariantProps } from "class-variance-authority";
// import { cn } from "@/lib/utils";
// import {
//   CircleCheckBig,
//   ClipboardCheck,
//   Truck,
//   DollarSign,
//   XCircle,
//   X,
//   Ban,
//   Clock,
//   PauseCircle,
//   PlayCircle,
//   CircleDot,
// } from "lucide-react";

// const statusBadgeVariants = cva(
//   "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border text-sm capitalize",
//   {
//     variants: {
//       status: {
//         // success family
//         complete:
//           "bg-status-complete/10 text-status-complete border-status-complete/30",
//         resolved:
//           "bg-status-complete/10 text-status-complete border-status-complete/30",
//         delivered:
//           "bg-status-complete/10 text-status-complete border-status-complete/30",
//         paid: "bg-status-complete/10 text-status-complete border-status-complete/30",

//         // danger family
//         failed:
//           "bg-status-failed/10 text-status-failed border-status-failed/30",
//         rejected:
//           "bg-status-failed/10 text-status-failed border-status-failed/30",
//         blocked:
//           "bg-status-failed/10 text-status-failed border-status-failed/30",

//         // warning / hold family
//         pending:
//           "bg-status-pending/10 text-status-pending border-status-pending/30",
//         suspended:
//           "bg-status-pending/10 text-status-pending border-status-pending/30",

//         // info / active family
//         active:
//           "bg-status-active/10 text-status-active border-status-active/30",
//         open: "bg-status-active/10 text-status-active border-status-active/30",
//       },
//     },
//     defaultVariants: {
//       status: "pending",
//     },
//   },
// );

// // icon differentiates meaning within a color family
// const statusIconMap = {
//   complete: CircleCheckBig,
//   resolved: ClipboardCheck,
//   delivered: Truck,
//   paid: DollarSign,

//   failed: XCircle,
//   rejected: X,
//   blocked: Ban,

//   pending: Clock,
//   suspended: PauseCircle,

//   active: PlayCircle,
//   open: CircleDot,
// } as const;

// function StatusBadge({
//   className,
//   status,
//   children,
//   ...props
// }: React.ComponentProps<"span"> & VariantProps<typeof statusBadgeVariants>) {
//   const Icon = statusIconMap[status ?? "pending"];
//   return (
//     <span
//       data-slot="status-badge"
//       className={cn(statusBadgeVariants({ status, className }))}
//       {...props}
//     >
//       <Icon className="size-4" style={{ color: "currentColor" }} />
//       {children}
//     </span>
//   );
// }

// export { StatusBadge, statusBadgeVariants };