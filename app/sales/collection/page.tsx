"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/erp/header"
import { DataTable } from "@/components/erp/data-table"
import { StatusBadge } from "@/components/erp/status-badge"
import { Drawer } from "@/components/erp/drawer" // Integrated Drawer
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { 
  IndianRupee, TrendingUp, AlertTriangle, Send, 
  Clock, Download, Building, MoreHorizontal,
  MailWarning, ArrowUpRight, Search, Receipt,
  Rocket, HardHat, CheckCircle, User, FileText, Eye
} from "lucide-react"

// --- Helper for Currency ---
const formatINR = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

// --- Enhanced Mock Data with Tax & Milestones ---
const INITIAL_COLLECTIONS = [
  { 
    id: "1", unit: "A-202", customer: "Mohan Reddy", totalValue: 10800000, collected: 4500000, pending: 6300000, lastPaid: "12 Jan", status: "on-track", wing: "A", aging: 5,
    taxDetails: { gst: 540000, tds: 108000, baseAmount: 10152000 },
    milestones: [
      { id: 1, name: "Booking Amount", amount: 1080000, status: "paid", dueDate: "12 Jan 2024" },
      { id: 2, name: "Slab 4 Casting", amount: 2160000, status: "pending", dueDate: "25 Mar 2026" },
      { id: 3, name: "Brickwork", amount: 1500000, status: "pending", dueDate: "15 May 2026" },
    ]
  },
  { 
    id: "2", unit: "B-504", customer: "Arjun Mehra", totalValue: 12500000, collected: 1250000, pending: 11250000, lastPaid: "02 Feb", status: "overdue", wing: "B", aging: 45,
    taxDetails: { gst: 625000, tds: 125000, baseAmount: 11750000 },
    milestones: [
      { id: 1, name: "Booking Amount", amount: 1250000, status: "paid", dueDate: "02 Feb 2024" },
      { id: 2, name: "Plinth Level", amount: 2500000, status: "overdue", dueDate: "10 Feb 2026" },
    ]
  },
]

export default function CollectionsPage() {
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null)
  const [activeWing, setActiveWing] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredData = useMemo(() => {
    return INITIAL_COLLECTIONS.filter(item => {
      const matchesWing = activeWing === "All" || `Wing ${item.wing}` === activeWing;
      const matchesSearch = item.customer.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.unit.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesWing && matchesSearch;
    });
  }, [activeWing, searchQuery]);

  const columns = [
    { 
      key: "unit", 
      header: "UNIT / WING", 
      render: (item: any) => (
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-black text-xs ${item.status === 'overdue' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-600'}`}>
            {item.unit}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Wing {item.wing}</span>
            <span className="text-xs font-bold text-slate-900">Residential</span>
          </div>
        </div>
      ) 
    },
    { 
      key: "customer", 
      header: "CUSTOMER & AGING",
      render: (item: any) => (
        <div className="flex flex-col text-left">
          <span className="font-bold text-slate-700 text-sm">{item.customer}</span>
          <div className="flex items-center gap-2 mt-0.5">
             <div className={`h-1.5 w-1.5 rounded-full ${item.aging > 30 ? 'bg-red-500' : 'bg-emerald-500'}`} />
             <span className="text-[9px] font-black text-slate-400 uppercase">{item.aging} Days Aging</span>
          </div>
        </div>
      )
    },
    { 
      key: "progress", 
      header: "PAYMENT EQUITY",
      render: (item: any) => {
        const percentage = Math.round((item.collected / item.totalValue) * 100)
        return (
          <div className="w-full max-w-[180px] space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-md font-black text-slate-900 leading-none">{percentage}% <small className="text-[9px] text-slate-400 uppercase">Paid</small></span>
              <span className="text-[9px] font-bold text-slate-400">OF {formatINR(item.totalValue)}</span>
            </div>
            <Progress value={percentage} className="h-1.5" />
          </div>
        )
      }
    },
    { 
        key: "actions", 
        header: "VIEW", 
        render: (item: any) => (
          <Button variant="ghost" size="sm" className="h-9 w-9 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        )
    }
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header title="Revenue & Collections" subtitle="Samarth Heights · Finance Dashboard" />

      <div className="p-6 max-w-[1500px] mx-auto space-y-8">
        
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Receivables" value="₹8.42 Cr" icon={<IndianRupee />} color="indigo" />
            <StatCard title="Overdue (60d+)" value="₹42.5 L" icon={<AlertTriangle />} color="red" />
            <StatCard title="Target Recovery" value="₹1.85 Cr" icon={<TrendingUp />} color="emerald" />
            <StatCard title="Demands Pending" value="14 Files" icon={<Clock />} color="amber" />
        </div>

        {/* Ledger Table Section */}
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
           <div className="p-6 border-b border-slate-100 space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="bg-indigo-600 h-2 w-2 rounded-full animate-pulse" />
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Active Receivables</h3>
                </div>
                
                <div className="relative w-full md:w-64 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <Input 
                        placeholder="Search Customer..." 
                        className="pl-10 h-10 rounded-xl border-slate-200 bg-slate-50/50 text-xs font-medium focus-visible:ring-indigo-600"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {["All", "Wing A", "Wing B", "Wing C"].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveWing(tab)}
                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeWing === tab ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
           </div>
           
           <DataTable 
             columns={columns} 
             data={filteredData} 
             onRowClick={(row) => setSelectedInvoice(row)} 
           />
        </div>
      </div>

      {/* --- REVENUE & TAX DRAWER --- */}
      <Drawer
        open={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        title={`Financial Statement: Unit ${selectedInvoice?.unit}`}
      >
        {selectedInvoice && (
          <div className="flex flex-col gap-6">
            
            {/* Customer Overview */}
            <div className="flex items-center justify-between p-5 rounded-[24px] bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                  <User className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Applicant</p>
                  <p className="text-lg font-bold text-slate-900">{selectedInvoice.customer}</p>
                </div>
              </div>
              <StatusBadge status={selectedInvoice.status} />
            </div>

            {/* Tax & Financial Breakdown */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 px-1">
                <Receipt className="h-4 w-4 text-indigo-500" /> Tax & Billed Summary
              </h4>
              <div className="grid grid-cols-1 gap-3">
                <div className="p-4 rounded-[20px] border border-slate-100 bg-white shadow-sm flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500 uppercase">Base Consideration</span>
                  <span className="font-bold text-slate-900">{formatINR(selectedInvoice.taxDetails.baseAmount)}</span>
                </div>
                <div className="p-4 rounded-[20px] border border-emerald-100 bg-emerald-50/40 flex justify-between items-center group">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-emerald-700 uppercase">GST (Applicable)</span>
                    <span className="text-[9px] text-emerald-600 font-medium">Billed to Customer</span>
                  </div>
                  <span className="font-black text-emerald-700">+{formatINR(selectedInvoice.taxDetails.gst)}</span>
                </div>
                <div className="p-4 rounded-[20px] border border-red-100 bg-red-50/40 flex justify-between items-center">
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-red-700 uppercase">TDS Deductible (1%)</span>
                    <span className="text-[9px] text-red-600 font-medium">Customer Responsibility</span>
                  </div>
                  <span className="font-black text-red-700">-{formatINR(selectedInvoice.taxDetails.tds)}</span>
                </div>
              </div>
            </div>

            {/* Demand Letter Section */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 px-1">
                <FileText className="h-4 w-4 text-indigo-500" /> Demand Letters
              </h4>
              <div className="bg-indigo-600 rounded-[28px] p-5 text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
                <div className="relative z-10 space-y-4 text-left">
                    <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase opacity-60 tracking-[0.2em]">Latest Demand Raised</p>
                        <p className="text-xl font-bold">Milestone: {selectedInvoice.milestones.find((m: any) => m.status === 'pending')?.name || 'Plinth Level'}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="secondary" className="flex-1 h-11 rounded-xl bg-white/20 hover:bg-white/30 border-none text-white font-black uppercase text-[10px]">
                            <Eye className="h-3.5 w-3.5 mr-2" /> Preview PDF
                        </Button>
                        <Button variant="secondary" className="flex-1 h-11 rounded-xl bg-white text-indigo-600 hover:bg-slate-50 border-none font-black uppercase text-[10px]">
                            <Download className="h-3.5 w-3.5 mr-2" /> Download
                        </Button>
                    </div>
                </div>
                <FileText className="absolute -bottom-4 -right-4 h-24 w-24 text-white/10 rotate-12" />
              </div>
            </div>

            {/* Payment Milestone Tracking */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest px-1">Construction Milestones</h4>
              <div className="space-y-3">
                {selectedInvoice.milestones.map((m: any, idx: number) => (
                  <div key={m.id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 group hover:border-indigo-100 hover:bg-white transition-all">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-xs font-bold transition-colors ${m.status === 'paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-50'}`}>
                      {m.status === 'paid' ? <CheckCircle className="h-5 w-5" /> : idx + 1}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-xs font-bold text-slate-900">{m.name}</p>
                      <p className="text-[10px] text-slate-500 uppercase font-black">Due: {m.dueDate}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-black text-slate-900">{formatINR(m.amount)}</p>
                        <span className={`text-[9px] font-black uppercase ${m.status === 'overdue' ? 'text-red-500' : 'text-slate-400'}`}>{m.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Global Actions */}
            <div className="pt-4 flex flex-col gap-3">
              <Button className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-100">
                Record Payment Entry
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 h-12 rounded-xl border-slate-200 text-slate-500 font-black uppercase text-[10px] tracking-widest">
                  Log Dispute
                </Button>
                <Button variant="outline" className="flex-1 h-12 rounded-xl border-emerald-200 text-emerald-600 hover:bg-emerald-50 font-black uppercase text-[10px] tracking-widest">
                  WhatsApp Demand
                </Button>
              </div>
            </div>

          </div>
        )}
      </Drawer>
    </div>
  )
}

function StatCard({ title, value, icon, color }: any) {
    const colorMap: any = {
        indigo: "bg-indigo-50 text-indigo-600",
        emerald: "bg-emerald-50 text-emerald-600",
        red: "bg-red-50 text-red-600",
        amber: "bg-amber-50 text-amber-600"
    }
    return (
        <div className="bg-white border border-slate-200 p-6 rounded-[32px] shadow-sm hover:shadow-xl transition-all duration-300 text-left">
            <div className={`${colorMap[color]} w-12 h-12 rounded-2xl flex items-center justify-center mb-6`}>{icon}</div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
            <p className="text-3xl font-black text-slate-900 tracking-tighter">{value}</p>
        </div>
    )
}