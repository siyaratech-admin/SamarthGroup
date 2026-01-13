"use client"

import { cn } from "@/lib/utils"

// 1. Keep your StatusType strict
export type StatusType =
  | "available" | "reserved" | "booked" | "sold"
  | "new" | "contacted" | "qualified" | "negotiation" | "converted" | "lost"
  | "active" | "expired" | "pending" | "confirmed" | "cancelled"
  | "draft" | "sent" | "paid" | "overdue" | "partial"
  | "received" | "verified"

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  available: { label: "Available", className: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30" },
  reserved: { label: "Reserved", className: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30" },
  booked: { label: "Booked", className: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30" },
  sold: { label: "Sold", className: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-500/20 dark:text-slate-400 dark:border-slate-500/30" },
  new: { label: "New", className: "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-500/20 dark:text-sky-400 dark:border-sky-500/30" },
  contacted: { label: "Contacted", className: "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-400 dark:border-indigo-500/30" },
  qualified: { label: "Qualified", className: "bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-500/20 dark:text-teal-400 dark:border-teal-500/30" },
  negotiation: { label: "Negotiation", className: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/30" },
  converted: { label: "Converted", className: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30" },
  lost: { label: "Lost", className: "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30" },
  active: { label: "Active", className: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30" },
  expired: { label: "Expired", className: "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30" },
  pending: { label: "Pending", className: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30" },
  confirmed: { label: "Confirmed", className: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30" },
  draft: { label: "Draft", className: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-500/20 dark:text-slate-400 dark:border-slate-500/30" },
  sent: { label: "Sent", className: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30" },
  paid: { label: "Paid", className: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30" },
  overdue: { label: "Overdue", className: "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30" },
  partial: { label: "Partial", className: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/30" },
  received: { label: "Received", className: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30" },
  verified: { label: "Verified", className: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30" },
}

interface StatusBadgeProps {
  // 2. Accept string to allow flexible data input from mock data/API
  status: StatusType | string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  // 3. Normalize the key safely
  const normalizedKey = status.toLowerCase() as StatusType
  
  // 4. Check if the key exists in config, otherwise fallback
  const config = statusConfig[normalizedKey]

  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
        config ? config.className : "bg-slate-100 text-slate-600 border-slate-200",
        className,
      )}
    >
      {config ? config.label : status}
    </span>
  )
}