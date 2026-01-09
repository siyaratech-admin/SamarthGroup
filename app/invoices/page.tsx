"use client"

import { useState } from "react"
import { Header } from "@/components/erp/header"
import { DataTable } from "@/components/erp/data-table"
import { StatusBadge } from "@/components/erp/status-badge"
import { Drawer } from "@/components/erp/drawer"
import { Button } from "@/components/ui/button"
import { invoices, type Invoice } from "@/lib/mock-data"
import { FileText, IndianRupee, Calendar, User, Building2, AlertTriangle, CheckCircle } from "lucide-react"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function InvoicesPage() {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [statusFilter, setStatusFilter] = useState("")

  const filteredInvoices = invoices.filter((invoice) => {
    if (statusFilter && invoice.status !== statusFilter) return false
    return true
  })

  const columns = [
    {
      key: "invoiceNo",
      header: "Invoice #",
      render: (item: Invoice) => <span className="font-medium text-primary">{item.invoiceNo}</span>,
    },
    { key: "customerName", header: "Customer" },
    { key: "unitNo", header: "Unit", hideOnMobile: true },
    {
      key: "amount",
      header: "Amount",
      render: (item: Invoice) => formatCurrency(item.amount),
    },
    { key: "dueDate", header: "Due Date", hideOnMobile: true },
    {
      key: "status",
      header: "Status",
      render: (item: Invoice) => <StatusBadge status={item.status} />,
    },
  ]

  const invoiceCounts = {
    all: invoices.length,
    draft: invoices.filter((i) => i.status === "draft").length,
    sent: invoices.filter((i) => i.status === "sent").length,
    paid: invoices.filter((i) => i.status === "paid").length,
    partial: invoices.filter((i) => i.status === "partial").length,
    overdue: invoices.filter((i) => i.status === "overdue").length,
  }

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0)
  const overdueAmount = invoices.filter((i) => i.status === "overdue").reduce((sum, inv) => sum + inv.amount, 0)

  return (
    <div className="min-h-screen bg-background">
      <Header title="Invoices" subtitle="Manage sales invoices and payment milestones" />

      <div className="p-4 lg:p-6">
        <div className="mb-4 grid grid-cols-2 gap-3 lg:mb-6 lg:grid-cols-4 lg:gap-4">
          <div className="rounded-lg border border-border bg-card p-3 lg:p-4">
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 lg:h-10 lg:w-10">
                <FileText className="h-4 w-4 text-primary lg:h-5 lg:w-5" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-lg font-bold text-foreground lg:text-2xl">{invoices.length}</div>
                <div className="truncate text-[10px] text-muted-foreground lg:text-sm">Total Invoices</div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-3 lg:p-4">
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-500/10 lg:h-10 lg:w-10">
                <IndianRupee className="h-4 w-4 text-blue-600 dark:text-blue-400 lg:h-5 lg:w-5" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-lg font-bold text-foreground lg:text-2xl">
                  {formatCurrency(totalAmount)}
                </div>
                <div className="truncate text-[10px] text-muted-foreground lg:text-sm">Total Billed</div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-500/20 dark:bg-emerald-500/10 lg:p-4">
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-500/20 lg:h-10 lg:w-10">
                <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 lg:h-5 lg:w-5" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-lg font-bold text-emerald-700 dark:text-emerald-400 lg:text-2xl">
                  {invoiceCounts.paid}
                </div>
                <div className="truncate text-[10px] text-emerald-600 dark:text-emerald-400/80 lg:text-sm">Paid</div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-500/20 dark:bg-red-500/10 lg:p-4">
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 dark:bg-red-500/20 lg:h-10 lg:w-10">
                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400 lg:h-5 lg:w-5" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-lg font-bold text-red-700 dark:text-red-400 lg:text-2xl">
                  {formatCurrency(overdueAmount)}
                </div>
                <div className="truncate text-[10px] text-red-600 dark:text-red-400/80 lg:text-sm">Overdue</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4 lg:mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setStatusFilter("")}
              className={`flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors lg:px-4 lg:text-sm ${
                statusFilter === ""
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              All ({invoiceCounts.all})
            </button>
            <button
              onClick={() => setStatusFilter("draft")}
              className={`flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors lg:px-4 lg:text-sm ${
                statusFilter === "draft"
                  ? "bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Draft ({invoiceCounts.draft})
            </button>
            <button
              onClick={() => setStatusFilter("sent")}
              className={`flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors lg:px-4 lg:text-sm ${
                statusFilter === "sent"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Sent ({invoiceCounts.sent})
            </button>
            <button
              onClick={() => setStatusFilter("partial")}
              className={`flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors lg:px-4 lg:text-sm ${
                statusFilter === "partial"
                  ? "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Partial ({invoiceCounts.partial})
            </button>
            <button
              onClick={() => setStatusFilter("overdue")}
              className={`flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors lg:px-4 lg:text-sm ${
                statusFilter === "overdue"
                  ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Overdue ({invoiceCounts.overdue})
            </button>
          </div>
        </div>

        {/* Invoices Table */}
        <DataTable columns={columns} data={filteredInvoices} onRowClick={setSelectedInvoice} />
      </div>

      {/* Invoice Detail Drawer */}
      <Drawer
        open={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        title={`Invoice ${selectedInvoice?.invoiceNo}`}
      >
        {selectedInvoice && (
          <div className="flex flex-col gap-4 lg:gap-5">
            {/* Invoice Header */}
            <div className="flex items-center justify-between rounded-lg border border-border p-3 lg:p-4">
              <div>
                <div className="text-xs text-muted-foreground">Invoice Number</div>
                <div className="text-base font-semibold text-primary lg:text-lg">{selectedInvoice.invoiceNo}</div>
              </div>
              <StatusBadge status={selectedInvoice.status} />
            </div>

            {/* Customer & Unit Info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-muted p-2.5 lg:p-3">
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground lg:text-xs">
                  <User className="h-3 w-3" />
                  Customer
                </div>
                <div className="mt-0.5 truncate text-sm font-medium text-foreground">
                  {selectedInvoice.customerName}
                </div>
              </div>
              <div className="rounded-lg bg-muted p-2.5 lg:p-3">
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground lg:text-xs">
                  <Building2 className="h-3 w-3" />
                  Unit
                </div>
                <div className="mt-0.5 truncate text-sm font-medium text-foreground">{selectedInvoice.unitNo}</div>
              </div>
            </div>

            {/* Amount Summary */}
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 lg:p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground lg:text-sm">
                  <IndianRupee className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                  Total Amount
                </div>
                <div className="text-xl font-bold text-primary lg:text-2xl">
                  {formatCurrency(selectedInvoice.amount)}
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs lg:text-sm">
                <span className="text-muted-foreground">Due Date</span>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground lg:h-4 lg:w-4" />
                  <span
                    className={
                      selectedInvoice.status === "overdue"
                        ? "font-medium text-red-600 dark:text-red-400"
                        : "text-foreground"
                    }
                  >
                    {selectedInvoice.dueDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Milestones */}
            <div className="rounded-lg border border-border p-3 lg:p-4">
              <h4 className="mb-3 text-sm font-medium text-foreground">Payment Milestones</h4>
              <div className="flex flex-col gap-2">
                {selectedInvoice.milestones.map((milestone, index) => (
                  <div key={milestone.id} className="flex items-center gap-3 rounded-lg bg-muted/50 p-2.5 lg:p-3">
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground lg:h-7 lg:w-7">
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-medium text-foreground">{milestone.name}</span>
                        <StatusBadge status={milestone.status as "pending" | "paid" | "overdue"} />
                      </div>
                      <div className="mt-0.5 flex items-center justify-between text-xs text-muted-foreground">
                        <span>Due: {milestone.dueDate}</span>
                        <span className="font-medium text-foreground">{formatCurrency(milestone.amount)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Progress */}
            <div className="rounded-lg border border-border p-3 lg:p-4">
              <h4 className="mb-3 text-sm font-medium text-foreground">Payment Progress</h4>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs lg:text-sm">
                  <span className="text-muted-foreground">Paid</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(
                      selectedInvoice.milestones
                        .filter((m) => m.status === "paid")
                        .reduce((sum, m) => sum + m.amount, 0),
                    )}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{
                      width: `${(selectedInvoice.milestones.filter((m) => m.status === "paid").reduce((sum, m) => sum + m.amount, 0) / selectedInvoice.amount) * 100}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs lg:text-sm">
                  <span className="text-muted-foreground">Pending</span>
                  <span className="text-foreground">
                    {formatCurrency(
                      selectedInvoice.milestones
                        .filter((m) => m.status !== "paid")
                        .reduce((sum, m) => sum + m.amount, 0),
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 lg:gap-3">
              <Button className="flex-1 text-sm">Record Payment</Button>
              <Button variant="outline" className="flex-1 bg-transparent text-sm">
                Send Reminder
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}
