import { cn } from "@/lib/utils"

type StatusType =
  | "available"
  | "reserved"
  | "booked"
  | "sold"
  | "new"
  | "contacted"
  | "qualified"
  | "negotiation"
  | "converted"
  | "lost"
  | "active"
  | "expired"
  | "pending"
  | "confirmed"
  | "cancelled"
  | "draft"
  | "sent"
  | "paid"
  | "overdue"
  | "partial"
  | "received"
  | "verified"

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  // Unit statuses
  available: {
    label: "Available",
    className:
      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30",
  },
  reserved: {
    label: "Reserved",
    className:
      "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30",
  },
  booked: {
    label: "Booked",
    className:
      "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30",
  },
  sold: {
    label: "Sold",
    className:
      "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-500/20 dark:text-slate-400 dark:border-slate-500/30",
  },

  // Lead statuses
  new: {
    label: "New",
    className: "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-500/20 dark:text-sky-400 dark:border-sky-500/30",
  },
  contacted: {
    label: "Contacted",
    className:
      "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-400 dark:border-indigo-500/30",
  },
  qualified: {
    label: "Qualified",
    className:
      "bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-500/20 dark:text-teal-400 dark:border-teal-500/30",
  },
  negotiation: {
    label: "Negotiation",
    className:
      "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/30",
  },
  converted: {
    label: "Converted",
    className:
      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30",
  },
  lost: {
    label: "Lost",
    className: "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30",
  },

  // Reservation statuses
  active: {
    label: "Active",
    className:
      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30",
  },
  expired: {
    label: "Expired",
    className: "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30",
  },

  // Booking/General statuses
  pending: {
    label: "Pending",
    className:
      "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30",
  },
  confirmed: {
    label: "Confirmed",
    className:
      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30",
  },

  // Invoice statuses
  draft: {
    label: "Draft",
    className:
      "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-500/20 dark:text-slate-400 dark:border-slate-500/30",
  },
  sent: {
    label: "Sent",
    className:
      "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30",
  },
  paid: {
    label: "Paid",
    className:
      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30",
  },
  overdue: {
    label: "Overdue",
    className: "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30",
  },
  partial: {
    label: "Partial",
    className:
      "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/30",
  },

  // Document statuses
  received: {
    label: "Received",
    className:
      "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30",
  },
  verified: {
    label: "Verified",
    className:
      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30",
  },
}

interface StatusBadgeProps {
  status: StatusType
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || {
    label: status,
    className: "bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium",
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  )
}
