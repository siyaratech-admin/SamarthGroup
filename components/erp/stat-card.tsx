import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, className }: StatCardProps) {
  return (
    <div className={cn("rounded-lg border border-border bg-card p-4 lg:p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate text-xs text-muted-foreground lg:text-sm">{title}</span>
          <span className="truncate text-lg font-semibold text-card-foreground lg:text-xl xl:text-2xl">{value}</span>
          {subtitle && <span className="truncate text-[10px] text-muted-foreground lg:text-xs">{subtitle}</span>}
          {trend && (
            <span
              className={cn(
                "text-[10px] font-medium lg:text-xs",
                trend.isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400",
              )}
            >
              {trend.isPositive ? "+" : ""}
              {trend.value}% from last month
            </span>
          )}
        </div>
        {Icon && (
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 lg:h-10 lg:w-10">
            <Icon className="h-4 w-4 text-primary lg:h-5 lg:w-5" />
          </div>
        )}
      </div>
    </div>
  )
}
