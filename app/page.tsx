"use client"

import { Header } from "@/components/erp/header"
import { StatCard } from "@/components/erp/stat-card"
import { DataTable } from "@/components/erp/data-table"
import { StatusBadge } from "@/components/erp/status-badge"
import { dashboardStats, bookings, invoices } from "@/lib/mock-data"
import { Building2, AlertCircle, IndianRupee, Package } from "lucide-react"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

const bookingColumns = [
  { key: "unitNo", header: "Unit" },
  { key: "customerName", header: "Customer" },
  {
    key: "totalAmount",
    header: "Amount",
    render: (item: (typeof bookings)[0]) => formatCurrency(item.totalAmount),
  },
  { key: "bookingDate", header: "Date" },
  {
    key: "status",
    header: "Status",
    render: (item: (typeof bookings)[0]) => <StatusBadge status={item.status} />,
  },
]

const invoiceColumns = [
  { key: "invoiceNo", header: "Invoice #" },
  { key: "customerName", header: "Customer" },
  {
    key: "amount",
    header: "Amount",
    render: (item: (typeof invoices)[0]) => formatCurrency(item.amount),
  },
  { key: "dueDate", header: "Due Date" },
  {
    key: "status",
    header: "Status",
    render: (item: (typeof invoices)[0]) => <StatusBadge status={item.status} />,
  },
]

export default function SalesDashboard() {
  const { sales, finance } = dashboardStats

  return (
    <div className="min-h-screen bg-background">
      <Header title="Sales Dashboard" subtitle="Overview of sales performance and key metrics" />

      <div className="p-4 sm:p-6 max-w-full overflow-hidden">
        {/* Business Flow Indicator - Better scroll handling */}
        <div className="mb-6 rounded-xl border border-border bg-card p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap">Business Flow:</span>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
              {["Inventory", "Lead", "Reservation", "Booking", "Invoice", "Payment", "Ledger"].map((step, index) => (
                <div key={step} className="flex items-center gap-2 flex-shrink-0">
                  <span className="whitespace-nowrap rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                    {step}
                  </span>
                  {index < 6 && <span className="text-muted-foreground">→</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Grid - Fixed Grid sizing */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Units" value={sales.totalUnits} subtitle={`${sales.unitsAvailable} available`} icon={Building2} />
          <StatCard title="Units Sold" value={sales.unitsSold} subtitle={`${Math.round((sales.unitsSold / sales.totalUnits) * 100)}% sold`} icon={Package} trend={{ value: 12, isPositive: true }} />
          <StatCard title="Revenue Collected" value={formatCurrency(sales.revenueCollected)} subtitle={`Target: ${formatCurrency(sales.revenueTarget)}`} icon={IndianRupee} trend={{ value: 8, isPositive: true }} />
          <StatCard title="Overdue Amount" value={formatCurrency(finance.overdue)} subtitle={`${finance.overdueInvoices} invoices`} icon={AlertCircle} />
        </div>

        {/* Charts Grid - Fixed spillage by removing h-48 and adding flex-wrap */}
        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Unit Status Card */}
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6 flex flex-col">
            <h3 className="mb-6 text-sm font-semibold text-foreground uppercase tracking-tight">Unit Status Distribution</h3>
            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-10 grow">
              <div className="relative h-28 w-28 sm:h-32 sm:w-32 flex-shrink-0">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="3" className="text-muted/30" />
                  <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="40 100" className="text-purple-500" />
                  <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="20 100" strokeDashoffset="-40" className="text-blue-500" />
                  <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="15 100" strokeDashoffset="-60" className="text-amber-500" />
                </svg>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:flex sm:flex-col sm:gap-3 w-full sm:w-auto">
                <LegendItem color="bg-emerald-500" label="Available" val={sales.unitsAvailable} />
                <LegendItem color="bg-amber-500" label="Reserved" val={sales.unitsReserved} />
                <LegendItem color="bg-blue-500" label="Booked" val={sales.unitsBooked} />
                <LegendItem color="bg-purple-500" label="Sold" val={sales.unitsSold} />
              </div>
            </div>
          </div>

          {/* Revenue Progress Card */}
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6 flex flex-col">
            <h3 className="mb-6 text-sm font-semibold text-foreground uppercase tracking-tight">Revenue Progress</h3>
            <div className="flex flex-col justify-between grow space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <span className="text-xs font-medium text-muted-foreground uppercase">Collected</span>
                  <span className="text-sm font-bold text-foreground">{formatCurrency(sales.revenueCollected)}</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${(sales.revenueCollected / sales.revenueTarget) * 100}%` }} />
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <span className="text-xs font-medium text-muted-foreground uppercase">Target</span>
                  <span className="text-sm font-semibold text-foreground/70">{formatCurrency(sales.revenueTarget)}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted/50" />
              </div>

              <div className="text-center pt-2">
                <p className="text-4xl font-black text-primary tracking-tighter">
                  {Math.round((sales.revenueCollected / sales.revenueTarget) * 100)}%
                </p>
                <p className="text-[10px] font-bold uppercase text-muted-foreground mt-1">Achieved</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tables Section - min-w-0 prevents flex items from expanding */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="space-y-3 min-w-0">
            <h3 className="text-sm font-semibold text-foreground px-1 uppercase tracking-wider">Recent Bookings</h3>
            <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
              <DataTable columns={bookingColumns} data={bookings} />
            </div>
          </div>
          <div className="space-y-3 min-w-0">
            <h3 className="text-sm font-semibold text-foreground px-1 uppercase tracking-wider">Recent Invoices</h3>
            <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
              <DataTable columns={invoiceColumns} data={invoices} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LegendItem({ color, label, val }: { color: string, label: string, val: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${color}`} />
      <span className="text-[11px] sm:text-xs font-medium text-muted-foreground whitespace-nowrap">{label} <span className="text-foreground font-bold">({val})</span></span>
    </div>
  )
}