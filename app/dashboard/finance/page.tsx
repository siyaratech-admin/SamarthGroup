"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/erp/header"
import { DataTable } from "@/components/erp/data-table"
import { StatusBadge } from "@/components/erp/status-badge"
import { 
  IndianRupee, Clock, TrendingUp, AlertTriangle, 
  MessageSquare, Phone, Mail, CheckCircle2, 
  ShieldAlert, Zap, Trophy, Construction, 
  Filter, HelpCircle, ArrowUpRight, Search, X
} from "lucide-react"
import { 
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter 
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

// --- Helper Functions ---
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

// --- INITIAL MOCK DATA ---
const INITIAL_INVOICES = [
  { id: "1", invoiceNo: "INV-8821", customerName: "Vikas Khanna", amount: 1200000, dueDate: "2024-03-01", status: "overdue", riskScore: "High", phone: "919999999999", unit: "A-402" },
  { id: "2", invoiceNo: "INV-8825", customerName: "Anjali Rao", amount: 850000, dueDate: "2024-03-10", status: "disputed", riskScore: "Medium", phone: "918888888888", unit: "B-102" },
  { id: "3", invoiceNo: "INV-8830", customerName: "Rahul Singh", amount: 2500000, dueDate: "2024-03-15", status: "overdue", riskScore: "Critical", phone: "917777777777", unit: "C-904" },
  { id: "4", invoiceNo: "INV-8835", customerName: "Priya Sharma", amount: 450000, dueDate: "2024-02-20", status: "overdue", riskScore: "High", phone: "919666666666", unit: "A-101" },
]

const recoveryLeaderboard = [
  { agent: "Rajesh Kumar", recovered: 4500000, rate: "92%", status: "top" },
  { agent: "Sneha Patil", recovered: 3800000, rate: "88%", status: "stable" },
  { agent: "Amit Shah", recovered: 1200000, rate: "45%", status: "under" },
]

export default function InteractiveFinanceDashboard() {
  const [invoices, setInvoices] = useState(INITIAL_INVOICES)
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<"overdue" | "disputed">("overdue")
  const [searchQuery, setSearchQuery] = useState("")
  const [remark, setRemark] = useState("")

  const filteredData = useMemo(() => {
    return invoices.filter(inv => {
      const matchesTab = inv.status === activeTab
      const matchesSearch = inv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            inv.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesTab && matchesSearch
    })
  }, [invoices, activeTab, searchQuery])

  const stats = useMemo(() => {
    const total = invoices.reduce((acc, curr) => acc + curr.amount, 0)
    const critical = invoices.filter(i => i.riskScore === 'Critical').reduce((acc, curr) => acc + curr.amount, 0)
    return { total, critical }
  }, [invoices])

  const handleUpdateStatus = (newStatus: string) => {
    setInvoices(prev => prev.map(inv => 
      inv.id === selectedInvoice.id ? { ...inv, status: newStatus } : inv
    ))
    toast.success(`Status Updated`, {
      description: `${selectedInvoice.invoiceNo} is now marked as ${newStatus}.`
    })
    setSelectedInvoice(null)
    setRemark("")
  }

  const handleOutreach = (type: string) => {
    toast.info(`${type} Initialized`, {
      description: `Contacting ${selectedInvoice.customerName} via ${type}...`
    })
  }

  const invoiceColumns = [
    {
      key: "invoiceNo",
      header: "INVOICE & UNIT",
      render: (item: any) => (
        <div className="flex flex-col text-left min-w-[120px]">
          <span className="font-bold text-slate-900">{item.invoiceNo}</span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Unit: {item.unit}</span>
        </div>
      )
    },
    { key: "customerName", header: "CUSTOMER" },
    {
      key: "amount",
      header: "AMOUNT",
      render: (item: any) => <span className="font-bold text-slate-900 whitespace-nowrap">{formatCurrency(item.amount)}</span>,
    },
    {
      key: "risk",
      header: "RISK",
      render: (item: any) => (
        <div className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase inline-block ${
          item.riskScore === 'Critical' ? 'bg-red-100 text-red-600' : 
          item.riskScore === 'High' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
        }`}>
          {item.riskScore}
        </div>
      )
    },
    {
      key: "action",
      header: "",
      render: (item: any) => (
        <Button 
          size="sm" 
          variant="ghost" 
          className="h-9 w-9 rounded-xl hover:bg-indigo-50 hover:text-indigo-600"
          onClick={() => setSelectedInvoice(item)}
        >
          <ArrowUpRight className="h-4 w-4" />
        </Button>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header title="Finance Intelligence" subtitle="Predictive Collections & Recovery" />

      <div className="mx-auto max-w-[1600px] p-4 md:p-8 space-y-6">
        
        {/* --- INTERACTIVE TOP SECTION (RESPONSIVE GRID) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-slate-900 rounded-[32px] md:rounded-[40px] p-6 md:p-8 text-white relative overflow-hidden group shadow-2xl">
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-400 mb-2">Total Recovery Pipeline</p>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tighter">{formatCurrency(stats.total)}</h2>
                  </div>
                  <div className="bg-white/10 p-3 md:p-4 rounded-[18px] md:rounded-[24px] backdrop-blur-xl border border-white/10">
                     <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-emerald-400" />
                  </div>
                </div>
                {/* Mini Stats Grid - Mobile 2 cols, Desktop 4 cols */}
                <div className="mt-8 md:mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
                  <ForecastMiniStat label="Confirmed" value="₹4.2M" color="bg-emerald-500" />
                  <ForecastMiniStat label="Probable" value="₹2.8M" color="bg-indigo-50" />
                  <ForecastMiniStat label="At Risk" value={formatCurrency(stats.critical)} color="bg-red-500" />
                  <ForecastMiniStat label="Disputed" value="₹0.5M" color="bg-amber-500" />
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-[10px] font-bold text-white/40 uppercase">Last updated: Just now</p>
                <button className="text-[10px] font-black uppercase text-indigo-400 hover:text-white transition-colors">View detailed forecast →</button>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-indigo-600/20 blur-[80px] md:blur-[120px] rounded-full -mr-32 -mt-32 group-hover:bg-indigo-600/30 transition-all duration-700" />
          </div>

          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-[32px] md:rounded-[40px] p-6 md:p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6 md:mb-8">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-500" /> Recovery Leaderboard
              </h3>
              <Zap className="h-4 w-4 text-indigo-600 animate-pulse" />
            </div>
            <div className="space-y-4 md:space-y-5">
              {recoveryLeaderboard.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 group cursor-pointer">
                  <div className={`h-10 w-10 rounded-2xl flex items-center justify-center font-black text-sm transition-all group-hover:scale-110 ${
                    idx === 0 ? 'bg-amber-100 text-amber-700 shadow-sm' : 'bg-slate-50 text-slate-400'
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{item.agent}</p>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className={`h-full rounded-full ${idx === 0 ? 'bg-amber-500' : 'bg-indigo-500'}`} style={{ width: item.rate }} />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-slate-900">{item.rate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- MILESTONE TRACKER (HORIZONTAL SCROLL ON MOBILE) --- */}
        <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto no-scrollbar pb-2 md:pb-0">
            <MilestoneCard title="Basement Work" progress={100} status="Completed" date="Completed" />
            <MilestoneCard title="1st Floor Slab" progress={100} status="Billed" date="Billed on 10 Mar" />
            <MilestoneCard title="4th Floor Slab" progress={65} status="In Progress" date="Est: 20 Apr" active />
        </div>

        {/* --- INTERACTIVE DATA TABLE --- */}
        <div className="bg-white border border-slate-200 rounded-[32px] md:rounded-[40px] overflow-hidden shadow-sm">
          <div className="p-6 md:p-8 border-b border-slate-50 flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex bg-slate-100 p-1 rounded-2xl w-full lg:w-auto">
                <button 
                  onClick={() => setActiveTab("overdue")}
                  className={`flex-1 text-[10px] font-black uppercase tracking-widest px-4 md:px-8 py-3 rounded-xl transition-all ${activeTab === 'overdue' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Overdue
                </button>
                <button 
                  onClick={() => setActiveTab("disputed")}
                  className={`flex-1 text-[10px] font-black uppercase tracking-widest px-4 md:px-8 py-3 rounded-xl transition-all ${activeTab === 'disputed' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Disputed 
                </button>
            </div>
            <div className="relative w-full lg:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 rounded-2xl bg-slate-50 border-none text-sm focus:ring-2 focus:ring-indigo-500/20" 
                />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <DataTable columns={invoiceColumns} data={filteredData} onRowClick={setSelectedInvoice} />
          </div>

          {filteredData.length === 0 && (
            <div className="p-10 md:p-20 text-center flex flex-col items-center">
              <div className="bg-slate-50 p-4 rounded-full mb-4">
                <X className="h-6 w-6 text-slate-300" />
              </div>
              <p className="text-slate-400 font-bold text-sm">No records found.</p>
            </div>
          )}
        </div>
      </div>

      {/* --- MANAGEMENT SHEET --- */}
      <Sheet open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
        <SheetContent className="w-full sm:max-w-[480px] p-0 border-l border-slate-200 flex flex-col">
          <SheetHeader className="p-6 md:p-10 pb-6 text-left bg-slate-50/50 border-b">
            <div className="flex justify-between items-start">
                <div>
                  <SheetTitle className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter leading-none">RECOVERY</SheetTitle>
                  <p className="text-[10px] font-black text-indigo-600 mt-2 uppercase tracking-widest">{selectedInvoice?.invoiceNo} • {selectedInvoice?.unit}</p>
                </div>
                <div className={`px-2 py-1 md:px-3 md:py-1.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase shadow-sm ${
                    selectedInvoice?.riskScore === 'Critical' ? 'bg-red-600 text-white' : 'bg-indigo-600 text-white'
                }`}>
                    {selectedInvoice?.riskScore}
                </div>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8">
            <div className="space-y-6">
                <div className="p-6 md:p-8 rounded-[24px] md:rounded-[32px] bg-slate-900 text-white shadow-xl">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 text-center">Amount Due</p>
                    <p className="text-2xl md:text-4xl font-black text-center tabular-nums">{selectedInvoice && formatCurrency(selectedInvoice.amount)}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 md:gap-3">
                    <OutreachBtn icon={Phone} label="Call" color="text-slate-900" onClick={() => handleOutreach("Phone")} />
                    <OutreachBtn icon={MessageSquare} label="WhatsApp" color="text-emerald-600" onClick={() => handleOutreach("WA")} />
                    <OutreachBtn icon={Mail} label="Email" color="text-indigo-600" onClick={() => handleOutreach("Mail")} />
                </div>
            </div>

            <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Update Action</p>
                <div className="grid grid-cols-1 gap-3">
                    <DispositionButton icon={CheckCircle2} label="Mark Settled" onClick={() => handleUpdateStatus("paid")} color="hover:bg-emerald-50" />
                    <DispositionButton icon={HelpCircle} label="Mark Disputed" onClick={() => handleUpdateStatus("disputed")} color="hover:bg-amber-50" />
                    <DispositionButton icon={ShieldAlert} label="Legal Escalation" onClick={() => handleUpdateStatus("escalated")} color="hover:bg-red-50" />
                </div>
            </div>

            <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Activity Log</p>
                <Textarea 
                  placeholder="Record commitment..." 
                  className="rounded-2xl bg-slate-50 min-h-[100px]" 
                  value={remark} 
                  onChange={(e) => setRemark(e.target.value)} 
                />
            </div>
          </div>

          <SheetFooter className="p-6 md:p-10 border-t bg-white">
             <Button className="w-full h-14 rounded-2xl bg-slate-900 text-[12px] font-black uppercase tracking-[0.2em]" onClick={() => handleUpdateStatus("updated")}>
                Update Ledger
             </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}

// --- SUB-COMPONENTS ---

function ForecastMiniStat({ label, value, color }: any) {
    return (
        <div className="bg-white/5 p-3 md:p-4 rounded-2xl md:rounded-3xl border border-white/5">
            <div className="flex items-center gap-2 mb-1 md:mb-2">
                <div className={`h-1.5 w-1.5 rounded-full ${color}`} />
                <span className="text-[8px] md:text-[10px] font-black uppercase text-white/40">{label}</span>
            </div>
            <p className="text-sm md:text-lg font-black tracking-tight whitespace-nowrap">{value}</p>
        </div>
    )
}

function MilestoneCard({ title, progress, status, date, active }: any) {
    return (
        <div className={`flex-shrink-0 w-[240px] md:w-auto p-5 md:p-6 rounded-[28px] md:rounded-[32px] border transition-all ${active ? 'border-indigo-600 bg-white ring-4 ring-indigo-50' : 'border-slate-100 bg-white'}`}>
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h4 className="text-xs md:text-sm font-black text-slate-900 leading-tight">{title}</h4>
                    <p className="text-[9px] md:text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">{date}</p>
                </div>
                <div className={`px-2 py-0.5 rounded-lg text-[8px] md:text-[9px] font-black uppercase ${progress === 100 ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
                    {status}
                </div>
            </div>
            <div className="space-y-2">
                <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-1000 ${progress === 100 ? 'bg-emerald-500' : 'bg-indigo-600'}`} style={{ width: `${progress}%` }} />
                </div>
            </div>
        </div>
    )
}

function OutreachBtn({ icon: Icon, label, color, onClick }: any) {
    return (
        <button onClick={onClick} className="flex flex-col items-center justify-center gap-2 md:gap-3 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100 bg-white hover:bg-slate-50 active:scale-95 transition-all group">
            <Icon className={`h-4 w-4 md:h-5 md:w-5 ${color}`} />
            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</span>
        </button>
    )
}

function DispositionButton({ icon: Icon, label, onClick, color }: any) {
    return (
        <button onClick={onClick} className={`w-full flex items-center gap-3 md:gap-4 p-4 md:p-5 rounded-xl md:rounded-2xl border border-slate-100 bg-white text-[11px] md:text-[12px] font-bold text-slate-700 transition-all ${color}`}>
            <div className="p-1.5 rounded-lg bg-slate-50">
                <Icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </div>
            {label}
            <ArrowUpRight className="h-3.5 w-3.5 md:h-4 md:w-4 ml-auto opacity-20" />
        </button>
    )
}