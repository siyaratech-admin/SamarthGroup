"use client"

import { useState } from "react"
import { Header } from "@/components/erp/header"
import { StatCard } from "@/components/erp/stat-card"
import { DataTable } from "@/components/erp/data-table"
import { Drawer } from "@/components/erp/drawer"
import { customers, type Customer } from "@/lib/mock-data"
import { IndianRupee, User, Building2, AlertTriangle, TrendingDown, TrendingUp } from "lucide-react"

// --- Types ---
interface DetailBoxProps {
  label: string
  value: string | number
  color?: string
  bg?: string
}

interface ContactItemProps {
  label: string
  value: string
}

// --- Helper Components ---
function DetailBox({ label, value, color = "text-foreground", bg = "bg-muted/50" }: DetailBoxProps) {
  return (
    <div className={`rounded-lg p-3 text-center ${bg}`}>
      <div className={`text-sm font-bold sm:text-base ${color}`}>{value}</div>
      <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  )
}

function ContactItem({ label, value }: ContactItemProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
      <span className="text-xs font-medium text-foreground">{value}</span>
    </div>
  )
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

// --- Main Page Component ---
export default function LedgerPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  const totalBilled = customers.reduce((sum, c) => sum + c.totalBilled, 0)
  const totalPaid = customers.reduce((sum, c) => sum + c.totalPaid, 0)
  const totalOutstanding = customers.reduce((sum, c) => sum + c.outstanding, 0)

  const columns = [
    {
      key: "name",
      header: "Customer",
      render: (item: Customer) => (
        <div className="flex items-center gap-3 min-w-[150px]">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
            {item.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <span className="font-medium text-foreground truncate">{item.name}</span>
        </div>
      ),
    },
    { key: "unitNo", header: "Unit" },
    {
      key: "totalBilled",
      header: "Billed",
      render: (item: Customer) => formatCurrency(item.totalBilled),
    },
    {
      key: "totalPaid",
      header: "Paid",
      render: (item: Customer) => <span className="text-emerald-500 font-medium">{formatCurrency(item.totalPaid)}</span>,
    },
    {
      key: "outstanding",
      header: "Outstanding",
      render: (item: Customer) => (
        <span className={item.outstanding > 0 ? "font-bold text-amber-500" : "text-foreground"}>
          {formatCurrency(item.outstanding)}
        </span>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header title="Customer Ledger" subtitle="Account summaries and transaction history" />

      <div className="p-4 sm:p-6">
        {/* Responsive Stat Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Billed"
            value={formatCurrency(totalBilled)}
            subtitle={`${customers.length} customers`}
            icon={IndianRupee}
          />
          <StatCard
            title="Total Collected"
            value={formatCurrency(totalPaid)}
            subtitle={`${Math.round((totalPaid / totalBilled) * 100)}% coverage`}
            icon={TrendingUp}
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Total Outstanding"
            value={formatCurrency(totalOutstanding)}
            subtitle="Current Receivables"
            icon={AlertTriangle}
          />
        </div>

        {/* Collection Bar */}
        <div className="mb-6 rounded-xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Overall Collection Progress</span>
            <span className="text-sm font-bold text-foreground">{Math.round((totalPaid / totalBilled) * 100)}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{ width: `${(totalPaid / totalBilled) * 100}%` }}
            />
          </div>
        </div>

        {/* Scrollable Table Container */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <DataTable columns={columns} data={customers} onRowClick={setSelectedCustomer} />
          </div>
        </div>
      </div>

      {/* Customer Ledger Drawer */}
      <Drawer
        open={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        title={`Ledger: ${selectedCustomer?.name}`}
      >
        {selectedCustomer && (
          <div className="flex flex-col gap-6 pb-12">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                <User className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">{selectedCustomer.name}</h3>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                  <Building2 className="h-3.5 w-3.5" /> Unit {selectedCustomer.unitNo}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <DetailBox label="Billed" value={formatCurrency(selectedCustomer.totalBilled)} />
              <DetailBox label="Paid" value={formatCurrency(selectedCustomer.totalPaid)} color="text-emerald-500" bg="bg-emerald-500/10" />
              <DetailBox label="Due" value={formatCurrency(selectedCustomer.outstanding)} color="text-amber-500" bg="bg-amber-500/10" />
            </div>

            <div className="rounded-lg border border-border overflow-hidden">
              <div className="border-b border-border bg-muted/50 px-4 py-2">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Transactions</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border bg-muted/20">
                      <th className="px-4 py-2 text-[10px] font-bold uppercase text-muted-foreground">Date</th>
                      <th className="px-4 py-2 text-[10px] font-bold uppercase text-muted-foreground">Description</th>
                      <th className="px-4 py-2 text-right text-[10px] font-bold uppercase text-muted-foreground">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {selectedCustomer.ledger.map((entry, index) => (
                      <tr key={index} className="hover:bg-muted/30">
                        <td className="whitespace-nowrap px-4 py-2.5 text-[11px] text-muted-foreground">{entry.date}</td>
                        <td className="px-4 py-2.5 text-[11px] font-medium text-foreground leading-tight">
                          {entry.description}
                          <div className="mt-1 flex gap-2">
                            {entry.debit > 0 && <span className="text-red-400">Dr {formatCurrency(entry.debit)}</span>}
                            {entry.credit > 0 && <span className="text-emerald-500">Cr {formatCurrency(entry.credit)}</span>}
                          </div>
                        </td>
                        <td className="px-4 py-2.5 text-right text-[11px] font-bold text-foreground">
                          {formatCurrency(entry.balance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-4 rounded-lg border border-border p-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-2">Customer Profile</h4>
              <ContactItem label="Email Address" value={selectedCustomer.email} />
              <ContactItem label="Contact Number" value={selectedCustomer.phone} />
              <ContactItem label="Residential Address" value={selectedCustomer.address} />
            </div>
            <div/>
          </div>
        )}
      </Drawer>
    </div>
  )
}