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

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function UnifiedFinancePage() {
  const [activeTab, setActiveTab] = useState<"ledger" | "transactions">("ledger")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showNewPayment, setShowNewPayment] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const totalBilled = customers.reduce((sum, c) => sum + c.totalBilled, 0)
  const totalPaid = customers.reduce((sum, c) => sum + c.totalPaid, 0)
  const totalOutstanding = customers.reduce((sum, c) => sum + c.outstanding, 0)
  const collectionRate = Math.round((totalPaid / totalBilled) * 100)

  // Filtering logic for responsiveness/utility
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.unitNo.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  const ledgerColumns = [
    {
      key: "name",
      header: "CUSTOMER",
      render: (item: Customer) => (
        <div className="flex items-center gap-2 py-1 text-left min-w-[150px]">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-[10px] font-black text-indigo-600 border border-indigo-100">
            {item.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-slate-900 truncate text-xs">{item.name}</span>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Unit: {item.unitNo}</span>
          </div>
        </div>
      ),
    },
    {
      key: "totalPaid",
      header: "COLLECTED",
      render: (item: Customer) => (
        <div className="flex flex-col text-left min-w-[100px]">
          <span className="text-emerald-600 font-bold text-xs">{formatCurrency(item.totalPaid)}</span>
          <span className="text-[8px] font-bold text-emerald-600/60 uppercase">{Math.round((item.totalPaid / item.totalBilled) * 100)}%</span>
        </div>
      ),
    },
    {
      key: "outstanding",
      header: "DUE",
      render: (item: Customer) => (
        <div className={`text-xs font-bold ${item.outstanding > 0 ? "text-amber-600" : "text-slate-400"}`}>
          {formatCurrency(item.outstanding)}
        </div>
      ),
    },
  ]

  const transactionColumns = [
    {
      key: "customerName",
      header: "CUSTOMER",
      render: (item: any) => <span className="font-bold text-slate-700 text-xs truncate max-w-[120px] block">{item.customerName}</span>,
    },
    {
      key: "amount",
      header: "AMOUNT",
      render: (item: any) => <span className="font-black text-emerald-600 text-xs">{formatCurrency(item.amount)}</span>,
    },
    { key: "paymentDate", header: "DATE" },
    {
      key: "receipt",
      header: "DOC",
      render: () => <Button variant="ghost" size="sm" className="h-8 w-8"><Printer className="h-3 w-3" /></Button>
    }
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-10">
      <Header title="Finance" subtitle="Collections & Ledgers" />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1500px] mx-auto">
        
        {/* --- RESPONSIVE METRICS GRID --- */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard title="Billing" value={formatCurrency(totalBilled)} icon={IndianRupee} color="indigo" />
          <MetricCard title="Collected" value={formatCurrency(totalPaid)} icon={TrendingUp} color="emerald" />
          <MetricCard title="Pending" value={formatCurrency(totalOutstanding)} icon={AlertTriangle} color="amber" />
          
          <div className="bg-indigo-600 rounded-[24px] p-5 text-white shadow-lg shadow-indigo-100 flex flex-col justify-between min-h-[120px]">
             <div className="flex justify-between items-start">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Efficiency</span>
                <Wallet className="h-4 w-4 opacity-50" />
             </div>
             <div className="text-2xl font-black">{collectionRate}%</div>
             <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                <div className="bg-white h-full transition-all duration-500" style={{ width: `${collectionRate}%` }} />
             </div>
          </div>
        </div>

        {/* --- MAIN TABLE SECTION --- */}
        <div className="bg-white rounded-[24px] md:rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
          
          <div className="p-4 md:p-6 border-b border-slate-50 space-y-4">
            <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
              {/* Tab Toggle */}
              <div className="flex bg-slate-100 p-1 rounded-xl w-full lg:w-fit overflow-x-auto scrollbar-hide">
                <TabButton active={activeTab === "ledger"} onClick={() => setActiveTab("ledger")} label="Ledgers" />
                <TabButton active={activeTab === "transactions"} onClick={() => setActiveTab("transactions")} label="History" />
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input 
                    placeholder="Search accounts..." 
                    className="pl-9 h-11 rounded-xl border-slate-200 bg-slate-50/50 text-xs"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button onClick={() => setShowNewPayment(true)} className="w-full sm:w-auto h-11 rounded-xl bg-indigo-600 font-black uppercase text-[10px] tracking-widest px-6">
                  <Plus className="h-4 w-4 mr-2" /> Record
                </Button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-full inline-block align-middle">
                {activeTab === "ledger" ? (
                  <DataTable columns={ledgerColumns} data={filteredCustomers} onRowClick={setSelectedCustomer} />
                ) : (
                  <DataTable columns={transactionColumns} data={payments} />
                )}
            </div>
          </div>
        </div>
      </div>

      {/* --- RESPONSIVE MODAL: RECORD PAYMENT --- */}
      {showNewPayment && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 sm:p-4">
          <div className="w-full sm:max-w-md rounded-t-[32px] sm:rounded-[32px] bg-white shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in duration-300">
            <div className="flex items-center justify-between border-b px-6 py-5">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-tighter">Record Payment</h2>
              <button onClick={() => setShowNewPayment(false)} className="rounded-full p-2 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Invoice</label>
                <select className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-bold outline-none">
                  <option>Select active demand...</option>
                  {invoices.map((inv) => <option key={inv.id}>{inv.invoiceNo} - {inv.customerName}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Amount</label>
                  <Input type="number" placeholder="0.00" className="h-12 rounded-xl text-xs font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Date</label>
                  <Input type="date" className="h-12 rounded-xl text-xs font-bold" />
                </div>
              </div>

              <Button className="w-full h-14 rounded-2xl bg-indigo-600 text-white font-black uppercase text-xs tracking-widest mt-2">
                Generate Receipt
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* --- RESPONSIVE DRAWER: AUDIT --- */}
      <Drawer
        open={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        title={`Audit: ${selectedCustomer?.unitNo}`}
      >
        {selectedCustomer && (
          <div className="flex flex-col gap-6 pb-20 sm:pb-12">
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm font-black text-indigo-600 text-base">
                {selectedCustomer.name[0]}
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-black text-slate-900 truncate">{selectedCustomer.name}</h3>
                <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">Unit {selectedCustomer.unitNo}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <SummaryBox label="Billed" value={formatCurrency(selectedCustomer.totalBilled)} />
              <SummaryBox label="Paid" value={formatCurrency(selectedCustomer.totalPaid)} isEmerald />
              <SummaryBox label="Dues" value={formatCurrency(selectedCustomer.outstanding)} isAmber />
            </div>

            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
              <div className="bg-slate-50 px-4 py-2 flex items-center justify-between border-b">
                <h4 className="text-[9px] font-black uppercase text-slate-400">Statement</h4>
                <Receipt className="h-3 w-3 text-slate-300" />
              </div>
              <div className="max-h-[250px] overflow-y-auto divide-y">
                {selectedCustomer.ledger.map((entry, idx) => (
                  <div key={idx} className="px-4 py-3 flex justify-between items-center text-xs">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-800 text-[10px]">{entry.description}</span>
                      <span className="text-[8px] font-bold text-slate-400">{entry.date}</span>
                    </div>
                    <div className="text-right font-black text-[10px]">
                      {entry.credit > 0 ? `+${formatCurrency(entry.credit)}` : `-${formatCurrency(entry.debit)}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button className="w-full h-12 bg-indigo-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest">
              Share to WhatsApp
            </Button>
          </div>
        )}
      </Drawer>
    </div>
  )
}

// --- SUB-COMPONENTS ---

function TabButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex-1 lg:flex-none px-6 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${active ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"}`}
    >
      {label}
    </button>
  )
}

function MetricCard({ title, value, icon: Icon, color }: any) {
  const variants: any = {
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
  }
  return (
    <div className={`p-5 rounded-[20px] border ${variants[color]} flex flex-col gap-1 shadow-sm`}>
      <div className="p-1.5 bg-white/60 w-fit rounded-lg mb-1 shadow-sm"><Icon className="h-3.5 w-3.5" /></div>
      <div className="text-xl font-black tracking-tighter">{value}</div>
      <div className="text-[9px] font-black uppercase tracking-widest opacity-70">{title}</div>
    </div>
  )
}

function SummaryBox({ label, value, isEmerald, isAmber }: any) {
  return (
    <div className={`rounded-lg p-2 text-center border ${isEmerald ? 'bg-emerald-50' : isAmber ? 'bg-amber-50' : 'bg-slate-50'}`}>
      <div className={`text-[9px] font-black truncate ${isEmerald ? 'text-emerald-700' : isAmber ? 'text-amber-700' : 'text-slate-900'}`}>{value}</div>
      <div className="text-[7px] font-black uppercase text-slate-400">{label}</div>
    </div>
  )
}