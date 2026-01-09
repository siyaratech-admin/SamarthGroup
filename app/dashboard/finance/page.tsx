"use client"

import { Header } from "@/components/erp/header"
import { StatCard } from "@/components/erp/stat-card"
import { DataTable } from "@/components/erp/data-table"
import { StatusBadge } from "@/components/erp/status-badge"
import { dashboardStats, invoices, customers } from "@/lib/mock-data"
import { IndianRupee, AlertTriangle, Clock, TrendingUp, FileText, Users } from "lucide-react"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function FinanceDashboard() {
  const { finance } = dashboardStats

  const overdueInvoices = invoices.filter((inv) => inv.status === "overdue")
  const topOutstanding = [...customers].sort((a, b) => b.outstanding - a.outstanding).slice(0, 5)

  const invoiceColumns = [
    {
      key: "invoiceNo",
      header: "Invoice",
      render: (item: (typeof invoices)[0]) => <span className="font-medium text-primary">{item.invoiceNo}</span>,
    },
    { key: "customerName", header: "Customer" },
    {
      key: "amount",
      header: "Amount",
      render: (item: (typeof invoices)[0]) => formatCurrency(item.amount),
    },
    { key: "dueDate", header: "Due Date", hideOnMobile: true },
    {
      key: "status",
      header: "Status",
      render: (item: (typeof invoices)[0]) => <StatusBadge status={item.status} />,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header title="Finance Dashboard" subtitle="Receivables, collections and financial health overview" />

      <div className="p-4 lg:p-6">
        <div className="mb-4 grid grid-cols-2 gap-3 lg:mb-6 lg:grid-cols-4 lg:gap-4">
          <StatCard
            title="Total Receivables"
            value={formatCurrency(finance.totalReceivables)}
            subtitle={`${finance.pendingInvoices} pending invoices`}
            icon={IndianRupee}
          />
          <StatCard
            title="Current Due"
            value={formatCurrency(finance.currentDue)}
            subtitle="Due within 30 days"
            icon={Clock}
          />
          <StatCard
            title="Overdue Amount"
            value={formatCurrency(finance.overdue)}
            subtitle={`${finance.overdueInvoices} overdue invoices`}
            icon={AlertTriangle}
          />
          <StatCard
            title="Total Collected"
            value={formatCurrency(finance.collected)}
            subtitle="This quarter"
            icon={TrendingUp}
            trend={{ value: 15, isPositive: true }}
          />
        </div>

        <div className="mb-4 grid grid-cols-1 gap-4 lg:mb-6 lg:grid-cols-2">
          {/* Receivables Breakdown */}
          <div className="rounded-lg border border-border bg-card p-4 lg:p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-foreground lg:mb-6">
              <IndianRupee className="h-4 w-4 text-primary" />
              Receivables Breakdown
            </h3>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
              <div className="relative h-32 w-32 flex-shrink-0 lg:h-40 lg:w-40">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-emerald-500"
                    strokeDasharray={`${(finance.collected / (finance.totalReceivables + finance.collected)) * 88} 88`}
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-blue-500"
                    strokeDasharray={`${(finance.currentDue / (finance.totalReceivables + finance.collected)) * 88} 88`}
                    strokeDashoffset={`-${(finance.collected / (finance.totalReceivables + finance.collected)) * 88}`}
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-red-500"
                    strokeDasharray={`${(finance.overdue / (finance.totalReceivables + finance.collected)) * 88} 88`}
                    strokeDashoffset={`-${((finance.collected + finance.currentDue) / (finance.totalReceivables + finance.collected)) * 88}`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold text-foreground lg:text-xl">
                    {Math.round((finance.collected / (finance.totalReceivables + finance.collected)) * 100)}%
                  </span>
                  <span className="text-[10px] text-muted-foreground lg:text-xs">Collected</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 lg:gap-3">
                <div className="flex items-center gap-2 lg:gap-3">
                  <div className="h-3 w-3 flex-shrink-0 rounded bg-emerald-500 lg:h-4 lg:w-4" />
                  <span className="text-xs text-foreground lg:text-sm">Collected</span>
                  <span className="ml-auto whitespace-nowrap text-xs font-medium text-emerald-600 dark:text-emerald-400 lg:text-sm">
                    {formatCurrency(finance.collected)}
                  </span>
                </div>
                <div className="flex items-center gap-2 lg:gap-3">
                  <div className="h-3 w-3 flex-shrink-0 rounded bg-blue-500 lg:h-4 lg:w-4" />
                  <span className="text-xs text-foreground lg:text-sm">Current Due</span>
                  <span className="ml-auto whitespace-nowrap text-xs font-medium text-foreground lg:text-sm">
                    {formatCurrency(finance.currentDue)}
                  </span>
                </div>
                <div className="flex items-center gap-2 lg:gap-3">
                  <div className="h-3 w-3 flex-shrink-0 rounded bg-red-500 lg:h-4 lg:w-4" />
                  <span className="text-xs text-foreground lg:text-sm">Overdue</span>
                  <span className="ml-auto whitespace-nowrap text-xs font-medium text-red-600 dark:text-red-400 lg:text-sm">
                    {formatCurrency(finance.overdue)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Outstanding Customers */}
          <div className="rounded-lg border border-border bg-card p-4 lg:p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-foreground lg:mb-6">
              <Users className="h-4 w-4 text-primary" />
              Top Outstanding Accounts
            </h3>
            <div className="flex flex-col gap-3 lg:gap-4">
              {topOutstanding.map((customer, index) => (
                <div key={customer.id} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground lg:h-8 lg:w-8">
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between gap-2">
                      <span className="truncate text-xs font-medium text-foreground lg:text-sm">{customer.name}</span>
                      <span className="flex-shrink-0 text-xs font-medium text-amber-600 dark:text-amber-400 lg:text-sm">
                        {formatCurrency(customer.outstanding)}
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-amber-500"
                        style={{
                          width: `${(customer.outstanding / customer.totalBilled) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Overdue Invoices */}
        <div className="mb-4 lg:mb-6">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground lg:mb-4">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            Overdue Invoices ({overdueInvoices.length})
          </h3>
          {overdueInvoices.length > 0 ? (
            <DataTable columns={invoiceColumns} data={overdueInvoices} />
          ) : (
            <div className="rounded-lg border border-border bg-card p-6 text-center lg:p-8">
              <FileText className="mx-auto h-10 w-10 text-muted-foreground lg:h-12 lg:w-12" />
              <p className="mt-3 text-sm text-muted-foreground lg:mt-4">No overdue invoices</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:gap-4">
          <div className="rounded-lg border border-border bg-card p-4 lg:p-5">
            <div className="mb-2 text-xs text-muted-foreground lg:mb-3 lg:text-sm">Average Collection Period</div>
            <div className="text-2xl font-bold text-foreground lg:text-3xl">
              32 <span className="text-base font-normal text-muted-foreground lg:text-lg">days</span>
            </div>
            <div className="mt-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 lg:mt-2 lg:text-xs">
              -3 days from last month
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 lg:p-5">
            <div className="mb-2 text-xs text-muted-foreground lg:mb-3 lg:text-sm">Collection Efficiency</div>
            <div className="text-2xl font-bold text-foreground lg:text-3xl">
              87<span className="text-base font-normal text-muted-foreground lg:text-lg">%</span>
            </div>
            <div className="mt-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 lg:mt-2 lg:text-xs">
              +5% from last month
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 lg:p-5">
            <div className="mb-2 text-xs text-muted-foreground lg:mb-3 lg:text-sm">Pending Approvals</div>
            <div className="text-2xl font-bold text-foreground lg:text-3xl">4</div>
            <div className="mt-1.5 text-[10px] text-amber-600 dark:text-amber-400 lg:mt-2 lg:text-xs">
              Requires attention
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
