"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface Column<T> {
  key: keyof T | string
  header: string
  render?: (item: T) => React.ReactNode
  className?: string
  hideOnMobile?: boolean
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  onRowClick?: (item: T) => void
  className?: string
}

export function DataTable<T extends { id: string }>({ columns, data, onRowClick, className }: DataTableProps<T>) {
  return (
    <div className={cn("overflow-hidden rounded-lg border border-border", className)}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {columns.map((column) => (
                <th
                  key={column.key as string}
                  className={cn(
                    "whitespace-nowrap px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground lg:px-4 lg:py-3",
                    column.className,
                    column.hideOnMobile && "hidden sm:table-cell",
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No data available
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onRowClick?.(item)}
                  className={cn("bg-card transition-colors hover:bg-muted/30", onRowClick && "cursor-pointer")}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key as string}
                      className={cn(
                        "whitespace-nowrap px-3 py-2.5 text-sm text-foreground lg:px-4 lg:py-3",
                        column.className,
                        column.hideOnMobile && "hidden sm:table-cell",
                      )}
                    >
                      {column.render ? column.render(item) : (item[column.key as keyof T] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
