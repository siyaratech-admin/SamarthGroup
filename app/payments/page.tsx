"use client"

import { useState } from "react"
import { Header } from "@/components/erp/header"
import { DataTable } from "@/components/erp/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { payments, invoices } from "@/lib/mock-data"
import { Plus, X, IndianRupee, CreditCard, Calendar, FileText, Hash } from "lucide-react"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function PaymentsPage() {
  const [showNewPayment, setShowNewPayment] = useState(false)
  const [paymentData, setPaymentData] = useState({
    customerId: "",
    invoiceId: "",
    amount: "",
    paymentMode: "bank_transfer",
    reference: "",
  })

  const columns = [
    {
      key: "customerName",
      header: "Customer",
      render: (item: (typeof payments)[0]) => <span className="font-medium text-foreground">{item.customerName}</span>,
    },
    {
      key: "invoiceId",
      header: "Invoice",
      render: (item: (typeof payments)[0]) => {
        const invoice = invoices.find((inv) => inv.id === item.invoiceId)
        return <span className="text-primary font-medium">{invoice?.invoiceNo || item.invoiceId}</span>
      },
    },
    {
      key: "amount",
      header: "Amount",
      render: (item: (typeof payments)[0]) => (
        <span className="font-semibold text-emerald-500">{formatCurrency(item.amount)}</span>
      ),
    },
    { key: "paymentDate", header: "Date" },
    {
      key: "paymentMode",
      header: "Mode",
      render: (item: (typeof payments)[0]) => (
        <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          {item.paymentMode.replace("_", " ")}
        </span>
      ),
    },
    { key: "reference", header: "Reference" },
  ]

  const totalReceived = payments.reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="min-h-screen bg-background">
      <Header title="Payments" subtitle="Track and record customer payments" />

      <div className="p-4 sm:p-6">
        {/* Summary Cards - Stack on mobile, side-by-side on desktop */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-stretch">
          <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{payments.length}</div>
                  <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Payments</div>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/20">
                  <IndianRupee className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <div className="text-xl font-bold text-emerald-500 sm:text-2xl">{formatCurrency(totalReceived)}</div>
                  <div className="text-xs font-medium uppercase tracking-wider text-emerald-500/80">Total Received</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center lg:justify-end">
            <Button onClick={() => setShowNewPayment(true)} className="h-12 w-full gap-2 px-6 lg:w-auto">
              <Plus className="h-4 w-4" /> Record Payment
            </Button>
          </div>
        </div>

        {/* Payments Table - Wrap for horizontal scroll */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <DataTable columns={columns} data={payments} />
          </div>
        </div>
      </div>

      {/* New Payment Modal - Responsive sizing */}
      {showNewPayment && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 backdrop-blur-sm sm:items-center p-0 sm:p-4">
          <div className="w-full max-w-md rounded-t-xl sm:rounded-xl border border-border bg-card shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-lg font-semibold text-foreground">Record Payment</h2>
              <button onClick={() => setShowNewPayment(false)} className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form - Scrollable if content is long on short screens */}
            <div className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto p-6">
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <FileText className="h-3 w-3" /> Invoice
                </label>
                <select
                  value={paymentData.invoiceId}
                  onChange={(e) => setPaymentData({ ...paymentData, invoiceId: e.target.value })}
                  className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select Invoice</option>
                  {invoices.map((invoice) => (
                    <option key={invoice.id} value={invoice.id}>
                      {invoice.invoiceNo} - {invoice.customerName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <IndianRupee className="h-3 w-3" /> Amount
                </label>
                <Input
                  type="number"
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                  placeholder="Enter amount"
                  className="bg-secondary"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    <CreditCard className="h-3 w-3" /> Mode
                  </label>
                  <select
                    value={paymentData.paymentMode}
                    onChange={(e) => setPaymentData({ ...paymentData, paymentMode: e.target.value })}
                    className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground"
                  >
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cheque">Cheque</option>
                    <option value="cash">Cash</option>
                    <option value="upi">UPI</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    <Calendar className="h-3 w-3" /> Date
                  </label>
                  <Input type="date" className="bg-secondary" defaultValue={new Date().toISOString().split("T")[0]} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <Hash className="h-3 w-3" /> Reference Number
                </label>
                <Input
                  value={paymentData.reference}
                  onChange={(e) => setPaymentData({ ...paymentData, reference: e.target.value })}
                  placeholder="Transaction / Cheque ID"
                  className="bg-secondary"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
              <Button variant="outline" onClick={() => setShowNewPayment(false)} className="flex-1 bg-transparent sm:flex-none">
                Cancel
              </Button>
              <Button onClick={() => setShowNewPayment(false)} className="flex-1 sm:flex-none">Record Payment</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}