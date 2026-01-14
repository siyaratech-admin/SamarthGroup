"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/erp/header"
import { DataTable } from "@/components/erp/data-table"
import { Drawer } from "@/components/erp/drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  payments, 
  invoices, 
  customers, 
  type Customer 
} from "@/lib/mock-data"
import { 
  IndianRupee, TrendingUp, AlertTriangle, Plus, X, 
  CreditCard, Calendar, FileText, Hash, History, 
  Download, ArrowUpRight, ArrowDownLeft, User, 
  Building2, Search, Receipt, Wallet, Printer
} from "lucide-react"

// --- Helper Functions ---
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function UnifiedFinancePage() {
  // --- States ---
  const [activeTab, setActiveTab] = useState<"ledger" | "transactions">("ledger")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showNewPayment, setShowNewPayment] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // --- Calculations ---
  const totalBilled = customers.reduce((sum, c) => sum + c.totalBilled, 0)
  const totalPaid = customers.reduce((sum, c) => sum + c.totalPaid, 0)
  const totalOutstanding = customers.reduce((sum, c) => sum + c.outstanding, 0)
  const collectionRate = Math.round((totalPaid / totalBilled) * 100)

  // --- Table Columns: Ledger View ---
  const ledgerColumns = [
    {
      key: "name",
      header: "CUSTOMER & UNIT",
      render: (item: Customer) => (
        <div className="flex items-center gap-3 py-1 text-left">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[11px] font-black text-indigo-600 border border-indigo-100">
            {item.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-slate-900 truncate">{item.name}</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Unit: {item.unitNo}</span>
          </div>
        </div>
      ),
    },
    {
      key: "totalBilled",
      header: "BILLED",
      render: (item: Customer) => <span className="font-semibold text-slate-600">{formatCurrency(item.totalBilled)}</span>,
    },
    {
      key: "totalPaid",
      header: "COLLECTED",
      render: (item: Customer) => (
        <div className="flex flex-col text-left">
          <span className="text-emerald-600 font-bold">{formatCurrency(item.totalPaid)}</span>
          <span className="text-[9px] font-bold text-emerald-600/60 uppercase">{Math.round((item.totalPaid / item.totalBilled) * 100)}% Recovered</span>
        </div>
      ),
    },
    {
      key: "outstanding",
      header: "OUTSTANDING",
      render: (item: Customer) => (
        <div className={`px-2 py-1 rounded-lg w-fit ${item.outstanding > 0 ? "bg-amber-50 text-amber-700 font-bold" : "text-slate-400 font-medium"}`}>
          {formatCurrency(item.outstanding)}
        </div>
      ),
    },
  ]

  // --- Table Columns: Transaction History View ---
  const transactionColumns = [
    {
      key: "customerName",
      header: "CUSTOMER",
      render: (item: any) => <span className="font-bold text-slate-700">{item.customerName}</span>,
    },
    {
      key: "amount",
      header: "AMOUNT",
      render: (item: any) => <span className="font-black text-emerald-600">{formatCurrency(item.amount)}</span>,
    },
    { key: "paymentDate", header: "DATE" },
    {
      key: "paymentMode",
      header: "MODE",
      render: (item: any) => (
        <span className="rounded-lg bg-slate-100 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-slate-500">
          {item.paymentMode.replace("_", " ")}
        </span>
      ),
    },
    {
      key: "receipt",
      header: "RECEIPT",
      render: () => (
        <Button variant="ghost" size="sm" className="h-8 w-8 rounded-lg hover:bg-indigo-50 hover:text-indigo-600">
          <Printer className="h-4 w-4" />
        </Button>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header title="Finance & Collections" subtitle="Manage customer ledgers and incoming payments" />

      <div className="p-4 sm:p-8 space-y-6 max-w-[1500px] mx-auto">
        
        {/* --- TOP METRICS --- */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <MetricCard title="Total Billing" value={formatCurrency(totalBilled)} icon={IndianRupee} color="indigo" />
          <MetricCard title="Total Collected" value={formatCurrency(totalPaid)} icon={TrendingUp} color="emerald" />
          <MetricCard title="Pending Dues" value={formatCurrency(totalOutstanding)} icon={AlertTriangle} color="amber" />
          <div className="bg-indigo-600 rounded-[24px] p-6 text-white shadow-lg shadow-indigo-100 flex flex-col justify-between">
             <div className="flex justify-between items-start">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Collection Efficiency</span>
                <Wallet className="h-5 w-5 opacity-50" />
             </div>
             <div className="text-3xl font-black">{collectionRate}%</div>
             <div className="w-full bg-white/20 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-white h-full" style={{ width: `${collectionRate}%` }} />
             </div>
          </div>
        </div>

        {/* --- MAIN CONTENT AREA --- */}
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Header & Controls */}
          <div className="p-6 border-b border-slate-50 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button 
                  onClick={() => setActiveTab("ledger")}
                  className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "ledger" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  Customer Ledgers
                </button>
                <button 
                  onClick={() => setActiveTab("transactions")}
                  className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "transactions" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  Transaction History
                </button>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input 
                    placeholder="Search accounts..." 
                    className="pl-10 h-10 rounded-xl border-slate-200 bg-slate-50/50 text-xs focus:ring-indigo-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button onClick={() => setShowNewPayment(true)} className="h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 gap-2 px-5 font-black uppercase text-[10px] tracking-widest">
                  <Plus className="h-4 w-4" /> Record Payment
                </Button>
              </div>
            </div>
          </div>

          {/* Dynamic Table Content */}
          <div className="overflow-x-auto">
            {activeTab === "ledger" ? (
              <DataTable columns={ledgerColumns} data={customers} onRowClick={setSelectedCustomer} />
            ) : (
              <DataTable columns={transactionColumns} data={payments} />
            )}
          </div>
        </div>
      </div>

      {/* --- MODAL: RECORD PAYMENT --- */}
      {showNewPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-50 px-8 py-6">
              <div className="flex flex-col">
                 <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Record Payment</h2>
                 <p className="text-[10px] font-bold text-slate-400 uppercase">Generate digital receipt instantly</p>
              </div>
              <button onClick={() => setShowNewPayment(false)} className="rounded-full p-2 hover:bg-slate-100 text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Select Invoice</label>
                <select className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20">
                  <option>Choose active demand...</option>
                  {invoices.map((inv) => <option key={inv.id}>{inv.invoiceNo} - {inv.customerName}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Amount (₹)</label>
                  <Input type="number" placeholder="0.00" className="h-12 rounded-xl border-slate-200 bg-slate-50 text-xs font-bold" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Date</label>
                  <Input type="date" className="h-12 rounded-xl border-slate-200 bg-slate-50 text-xs font-bold" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Reference / UTR No.</label>
                <Input placeholder="Transaction ID" className="h-12 rounded-xl border-slate-200 bg-slate-50 text-xs font-bold" />
              </div>

              <Button onClick={() => setShowNewPayment(false)} className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-xs tracking-[0.15em] shadow-lg shadow-indigo-100 mt-4">
                Confirm & Send Receipt
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* --- DRAWER: CUSTOMER LEDGER AUDIT --- */}
      <Drawer
        open={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        title={`Ledger Audit: ${selectedCustomer?.unitNo}`}
      >
        {selectedCustomer && (
          <div className="flex flex-col gap-6 pb-12">
            <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-100 font-black text-indigo-600 text-lg">
                {selectedCustomer.name[0]}
              </div>
              <div className="flex flex-col text-left">
                <h3 className="text-lg font-black text-slate-900 leading-tight">{selectedCustomer.name}</h3>
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Unit {selectedCustomer.unitNo}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <SummaryBox label="Billed" value={formatCurrency(selectedCustomer.totalBilled)} />
              <SummaryBox label="Collected" value={formatCurrency(selectedCustomer.totalPaid)} isEmerald />
              <SummaryBox label="Dues" value={formatCurrency(selectedCustomer.outstanding)} isAmber />
            </div>

            {/* Transaction Timeline */}
            <div className="rounded-[24px] border border-slate-200 overflow-hidden bg-white shadow-sm">
              <div className="border-b border-slate-100 bg-slate-50 px-5 py-3 flex items-center justify-between">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Account Statement</h4>
                <Receipt className="h-3.5 w-3.5 text-slate-300" />
              </div>
              <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-50">
                {selectedCustomer.ledger.map((entry, idx) => (
                  <div key={idx} className="px-5 py-4 flex justify-between items-center hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${entry.credit > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        {entry.credit > 0 ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-[11px] font-black text-slate-800 leading-tight">{entry.description}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">{entry.date}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-slate-900">{formatCurrency(entry.balance)}</div>
                      <div className={`text-[9px] font-bold uppercase ${entry.credit > 0 ? 'text-emerald-500' : 'text-red-400'}`}>
                        {entry.credit > 0 ? `+${formatCurrency(entry.credit)}` : `-${formatCurrency(entry.debit)}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase text-xs tracking-[0.15em]">
              Send Statement to WhatsApp
            </Button>
          </div>
        )}
      </Drawer>
    </div>
  )
}

// --- SHARED UI COMPONENTS ---

function MetricCard({ title, value, icon: Icon, color }: any) {
  const variants: any = {
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
  }
  return (
    <div className={`p-6 rounded-[24px] border ${variants[color]} flex flex-col gap-1 text-left shadow-sm`}>
      <div className="p-2 bg-white/50 w-fit rounded-lg mb-2 shadow-inner"><Icon className="h-4 w-4" /></div>
      <div className="text-2xl font-black tracking-tighter">{value}</div>
      <div className="text-[10px] font-black uppercase tracking-widest opacity-70">{title}</div>
    </div>
  )
}

function SummaryBox({ label, value, isEmerald, isAmber }: any) {
  return (
    <div className={`rounded-xl p-3 text-center border ${isEmerald ? 'bg-emerald-50 border-emerald-100' : isAmber ? 'bg-amber-50 border-amber-100' : 'bg-slate-50 border-slate-100'}`}>
      <div className={`text-[11px] font-black tracking-tighter sm:text-xs ${isEmerald ? 'text-emerald-700' : isAmber ? 'text-amber-700' : 'text-slate-900'}`}>{value}</div>
      <div className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-0.5">{label}</div>
    </div>
  )
}