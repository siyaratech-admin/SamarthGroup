"use client"

import { useState } from "react"
import { Header } from "@/components/erp/header"
import { StatCard } from "@/components/erp/stat-card"
import { DataTable } from "@/components/erp/data-table"
import { StatusBadge } from "@/components/erp/status-badge"
import { dashboardStats, invoices, customers } from "@/lib/mock-data"
import { 
  IndianRupee, AlertTriangle, Clock, TrendingUp, FileText, 
  Users, Phone, MessageSquare, Mail, CheckCircle2, 
  XCircle, MoreHorizontal, Receipt, ShieldAlert
} from "lucide-react"
import { 
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter 
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function FinanceDashboard() {
  const { finance } = dashboardStats
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
  const [remark, setRemark] = useState("")

  const overdueInvoices = invoices.filter((inv) => inv.status === "overdue")
  const topOutstanding = [...customers].sort((a, b) => b.outstanding - a.outstanding).slice(0, 5)

  const handleFinanceAction = (status: string) => {
    toast.success(`Finance Ledger Updated`, {
      description: `Invoice ${selectedInvoice?.invoiceNo} marked as ${status}.`
    })
    setSelectedInvoice(null)
    setRemark("")
  }

  const invoiceColumns = [
    {
      key: "invoiceNo",
      header: "Invoice",
      render: (item: any) => (
        <button 
          onClick={() => setSelectedInvoice(item)}
          className="font-bold text-slate-900 hover:text-blue-600 transition-colors"
        >
          {item.invoiceNo}
        </button>
      ),
    },
    { key: "customerName", header: "Customer" },
    {
      key: "amount",
      header: "Amount",
      render: (item: any) => <span className="font-semibold">{formatCurrency(item.amount)}</span>,
    },
    { key: "dueDate", header: "Due Date", hideOnMobile: true },
    {
      key: "status",
      header: "Status",
      render: (item: any) => <StatusBadge status={item.status} />,
    },
    {
        key: "actions",
        header: "",
        render: (item: any) => (
            <Button variant="ghost" size="icon" onClick={() => setSelectedInvoice(item)}>
                <MoreHorizontal className="h-4 w-4 text-slate-400" />
            </Button>
        )
    }
  ]

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] antialiased">
      <Header title="Finance Dashboard" subtitle="Receivables & Financial Health Analysis" />

      <div className="mx-auto max-w-[1600px] px-6 py-8 space-y-8">
        
        {/* Top Tier Metrics */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Receivables" value={formatCurrency(finance.totalReceivables)} subtitle={`${finance.pendingInvoices} pending`} icon={IndianRupee} />
          <StatCard title="Current Due" value={formatCurrency(finance.currentDue)} subtitle="Within 30 days" icon={Clock} />
          <StatCard title="Overdue Total" value={formatCurrency(finance.overdue)} subtitle={`${finance.overdueInvoices} overdue`} icon={AlertTriangle} />
          <StatCard title="Quarterly Collection" value={formatCurrency(finance.collected)} subtitle="Revenue Inflow" icon={TrendingUp} trend={{ value: 15, isPositive: true }} />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Receivables Breakdown - 7 Columns */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                <Receipt className="h-4 w-4 text-slate-400" />
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Collection Distribution</h3>
            </div>
            <div className="p-8 flex flex-col items-center gap-8 sm:flex-row lg:gap-12">
              <div className="relative h-40 w-40 flex-shrink-0">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray={`${(finance.collected / (finance.totalReceivables + finance.collected)) * 88} 88`} />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray={`${(finance.currentDue / (finance.totalReceivables + finance.collected)) * 88} 88`} strokeDashoffset={`-${(finance.collected / (finance.totalReceivables + finance.collected)) * 88}`} />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#ef4444" strokeWidth="4" strokeDasharray={`${(finance.overdue / (finance.totalReceivables + finance.collected)) * 88} 88`} strokeDashoffset={`-${((finance.collected + finance.currentDue) / (finance.totalReceivables + finance.collected)) * 88}`} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">{Math.round((finance.collected / (finance.totalReceivables + finance.collected)) * 100)}%</span>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Yield</span>
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <LegendItem color="bg-emerald-500" label="Collected" amount={finance.collected} />
                <LegendItem color="bg-blue-500" label="Current Due" amount={finance.currentDue} />
                <LegendItem color="bg-red-500" label="Overdue" amount={finance.overdue} isAlert />
              </div>
            </div>
          </div>

          {/* Top Outstanding Customers - 5 Columns */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                <Users className="h-4 w-4 text-slate-400" />
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Critical Accounts</h3>
            </div>
            <div className="p-6 divide-y divide-slate-50">
              {topOutstanding.map((customer, index) => (
                <div key={customer.id} className="py-3 flex items-center gap-4 group">
                  <span className="text-xs font-bold text-slate-300">0{index + 1}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-semibold text-slate-800">{customer.name}</span>
                      <span className="text-sm font-bold text-amber-600">{formatCurrency(customer.outstanding)}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(customer.outstanding / customer.totalBilled) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Overdue Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-red-500" />
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Overdue Recovery Queue ({overdueInvoices.length})</h3>
            </div>
          </div>
          <div className="p-0">
             <DataTable columns={invoiceColumns} data={overdueInvoices} />
          </div>
        </div>

        {/* Efficiency KPIs */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <KPICard label="Avg. Collection Period" value="32 Days" trend="-3 Days" isPositive />
          <KPICard label="Collection Efficiency" value="87%" trend="+5%" isPositive />
          <KPICard label="Approvals Pending" value="04" trend="Action Required" isWarning />
        </div>
      </div>

      {/* Finance Recovery Sheet */}
      <Sheet open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
        <SheetContent className="w-full sm:max-w-[440px] p-0 border-l border-slate-200 flex flex-col">
          <SheetHeader className="p-8 pb-6 text-left border-b border-slate-100">
            <SheetTitle className="text-2xl font-semibold tracking-tight">Recovery Management</SheetTitle>
            <SheetDescription className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-tighter">
                Invoice: {selectedInvoice?.invoiceNo} • {selectedInvoice?.customerName}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Balance Outstanding</div>
                <div className="text-2xl font-bold text-slate-900">{selectedInvoice && formatCurrency(selectedInvoice.amount)}</div>
            </div>

            {/* Collection Outreach */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Recovery Outreach</span>
              <div className="grid grid-cols-3 gap-2">
                <OutreachBtn icon={Phone} label="Call Client" />
                <OutreachBtn icon={MessageSquare} label="WhatsApp" color="text-green-600" />
                <OutreachBtn icon={Mail} label="Demand Letter" color="text-blue-600" />
              </div>
            </div>

            {/* Payment Disposition */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Payment Disposition</span>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                    variant="outline" 
                    className="h-11 border-emerald-200 font-bold text-xs text-emerald-700 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all rounded-lg group"
                    onClick={() => handleFinanceAction("Paid")}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500 group-hover:text-white" /> Settle Invoice
                </Button>
                <Button 
                    variant="outline" 
                    className="h-11 border-red-200 font-bold text-xs text-red-700 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all rounded-lg group"
                    onClick={() => handleFinanceAction("Escalated")}
                >
                  <AlertTriangle className="mr-2 h-4 w-4 text-red-500 group-hover:text-white" /> Escalate
                </Button>
              </div>
            </div>

            {/* Collection Remarks */}
            <div className="space-y-3 pb-24">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Collection Remarks</span>
              <Textarea 
                placeholder="Log payment promises or dispute details..." 
                className="min-h-[120px] rounded-lg border-slate-200 bg-slate-50/50 text-sm focus:ring-slate-900"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
              />
            </div>
          </div>

          <SheetFooter className="absolute bottom-0 w-full p-8 border-t border-slate-100 bg-white/80 backdrop-blur-md">
            <Button className="w-full h-12 bg-[#0F172A] hover:bg-slate-800 rounded-lg font-bold text-sm shadow-lg shadow-slate-200" onClick={() => handleFinanceAction("Logged")}>
              Update Ledger
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}

// --- Specialized Components ---

function LegendItem({ color, label, amount, isAlert }: any) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${color}`} />
                <span className="text-xs font-semibold text-slate-600">{label}</span>
            </div>
            <span className={`text-sm font-bold ${isAlert ? 'text-red-600' : 'text-slate-900'}`}>{formatCurrency(amount)}</span>
        </div>
    )
}

function KPICard({ label, value, trend, isPositive, isWarning }: any) {
    return (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{label}</div>
            <div className="text-2xl font-bold text-slate-900">{value}</div>
            <div className={`mt-2 text-[10px] font-bold ${isPositive ? 'text-emerald-600' : isWarning ? 'text-amber-600' : 'text-slate-500'}`}>
                {trend}
            </div>
        </div>
    )
}

function OutreachBtn({ icon: Icon, label, color }: any) {
    return (
        <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-slate-100 bg-slate-50/30 hover:bg-white hover:border-slate-300 hover:shadow-md transition-all group">
            <Icon className={`h-4 w-4 ${color || 'text-slate-700'} group-hover:scale-110 transition-transform`} />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight text-center leading-tight">{label}</span>
        </button>
    )
}