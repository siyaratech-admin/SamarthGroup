"use client"

import { useState } from "react"
import { Header } from "@/components/erp/header"
import { DataTable } from "@/components/erp/data-table"
import { Drawer } from "@/components/erp/drawer"
import { Button } from "@/components/ui/button"
import { customers, type Customer } from "@/lib/mock-data"
import { 
  IndianRupee, 
  User, 
  Building2, 
  AlertTriangle, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History,
  Download,
  Mail,
  Phone,
  MapPin,
  ExternalLink
} from "lucide-react"

// --- Helper Functions ---
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function LedgerPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  const totalBilled = customers.reduce((sum, c) => sum + c.totalBilled, 0)
  const totalPaid = customers.reduce((sum, c) => sum + c.totalPaid, 0)
  const totalOutstanding = customers.reduce((sum, c) => sum + c.outstanding, 0)
  const collectionRate = Math.round((totalPaid / totalBilled) * 100)

  const columns = [
    {
      key: "name",
      header: "CUSTOMER & UNIT",
      render: (item: Customer) => (
        <div className="flex items-center gap-3 py-1">
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
        <div className="flex flex-col">
            <span className="text-emerald-600 font-bold">{formatCurrency(item.totalPaid)}</span>
            <span className="text-[9px] font-bold text-emerald-600/60 uppercase">{Math.round((item.totalPaid/item.totalBilled)*100)}% Recovered</span>
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

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header title="Customer Ledger" subtitle="Receivables management and account audits" />

      <div className="p-4 sm:p-8 space-y-6 max-w-[1440px] mx-auto">
        
        {/* SYNCED METRIC CARDS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <MetricCard title="Total Billing" value={formatCurrency(totalBilled)} icon={IndianRupee} color="indigo" />
          <MetricCard title="Total Collected" value={formatCurrency(totalPaid)} icon={TrendingUp} color="emerald" />
          <MetricCard title="Pending Dues" value={formatCurrency(totalOutstanding)} icon={AlertTriangle} color="amber" />
        </div>

        {/* COLLECTION PERFORMANCE BAR */}
        <div className="bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Recovery Milestone</span>
                <span className="text-lg font-black text-slate-900">Overall Collection Progress</span>
            </div>
            <span className="text-2xl font-black text-indigo-600">{collectionRate}%</span>
          </div>
          <div className="h-4 overflow-hidden rounded-full bg-slate-100 p-1 border border-slate-200/50">
            <div
              className="h-full rounded-full bg-indigo-600 shadow-[0_0_12px_rgba(79,70,229,0.4)] transition-all duration-1000"
              style={{ width: `${collectionRate}%` }}
            />
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
             <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Active Accounts</h3>
             <Button variant="outline" size="sm" className="h-8 rounded-lg text-[10px] font-black uppercase tracking-widest border-slate-200">
                <Download className="h-3 w-3 mr-2" /> Export Ledger
             </Button>
          </div>
          <div className="overflow-x-auto px-2">
            <DataTable columns={columns} data={customers} onRowClick={setSelectedCustomer} />
          </div>
        </div>
      </div>

      {/* SYNCED DRAWER */}
      <Drawer
        open={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        title={`Ledger Audit: ${selectedCustomer?.unitNo}`}
      >
        {selectedCustomer && (
          <div className="flex flex-col gap-6 pb-12">
            
            {/* Applicant Profile Header */}
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-100">
                <User className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-black text-slate-900 leading-tight">{selectedCustomer.name}</h3>
                <div className="flex items-center gap-1.5 text-[10px] text-indigo-600 font-black uppercase tracking-widest">
                  <Building2 className="h-3 w-3" /> Unit No. {selectedCustomer.unitNo}
                </div>
              </div>
            </div>

            {/* Quick Summary Boxes */}
            <div className="grid grid-cols-3 gap-2">
              <SummaryBox label="Billed" value={formatCurrency(selectedCustomer.totalBilled)} />
              <SummaryBox label="Received" value={formatCurrency(selectedCustomer.totalPaid)} isEmerald />
              <SummaryBox label="Balance" value={formatCurrency(selectedCustomer.outstanding)} isAmber />
            </div>

            {/* Transaction Timeline UI */}
            <div className="rounded-[24px] border border-slate-200 overflow-hidden bg-white shadow-sm">
              <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-3 flex items-center justify-between">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <History className="h-3 w-3" /> Statement of Account
                </h4>
                <Button variant="ghost" size="sm" className="h-6 text-[9px] font-bold text-indigo-600 uppercase">View All</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <tbody className="divide-y divide-slate-50">
                    {selectedCustomer.ledger.map((entry, index) => (
                      <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${entry.credit > 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
                                    {entry.credit > 0 ? <ArrowDownLeft className="h-4 w-4 text-emerald-600" /> : <ArrowUpRight className="h-4 w-4 text-red-600" />}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-black text-slate-800 leading-tight">{entry.description}</span>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase">{entry.date}</span>
                                </div>
                            </div>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="text-xs font-black text-slate-900">{formatCurrency(entry.balance)}</div>
                          <div className={`text-[9px] font-bold uppercase ${entry.credit > 0 ? 'text-emerald-500' : 'text-red-400'}`}>
                            {entry.credit > 0 ? `+${formatCurrency(entry.credit)}` : `-${formatCurrency(entry.debit)}`}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Contact Details Card */}
            <div className="space-y-3 rounded-2xl bg-slate-900 p-5 text-white shadow-xl shadow-slate-200">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 flex items-center gap-2">
                <ExternalLink className="h-3 w-3" /> Communication Profile
              </h4>
              <ContactRow icon={Mail} label="Email" value={selectedCustomer.email} />
              <ContactRow icon={Phone} label="Mobile" value={selectedCustomer.phone} />
              <ContactRow icon={MapPin} label="Address" value={selectedCustomer.address} />
            </div>

            <Button className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase text-xs tracking-[0.15em] shadow-lg shadow-indigo-100">
                Send Digital Statement
            </Button>
          </div>
        )}
      </Drawer>
    </div>
  )
}

// --- SHARED UI COMPONENTS (SYNCED) ---

function MetricCard({ title, value, icon: Icon, color }: any) {
    const variants: any = {
        indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
        emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
        amber: "bg-amber-50 text-amber-700 border-amber-100",
    }
    return (
        <div className={`p-6 rounded-[24px] border ${variants[color]} flex flex-col gap-1`}>
            <div className="p-2 bg-white/50 w-fit rounded-lg mb-2"><Icon className="h-4 w-4" /></div>
            <div className="text-2xl font-black tracking-tighter">{value}</div>
            <div className="text-[10px] font-black uppercase tracking-widest opacity-70">{title}</div>
        </div>
    )
}

function SummaryBox({ label, value, isEmerald, isAmber }: any) {
    return (
        <div className={`rounded-xl p-3 text-center border ${isEmerald ? 'bg-emerald-50 border-emerald-100' : isAmber ? 'bg-amber-50 border-amber-100' : 'bg-slate-50 border-slate-100'}`}>
          <div className={`text-xs font-black tracking-tighter sm:text-sm ${isEmerald ? 'text-emerald-700' : isAmber ? 'text-amber-700' : 'text-slate-900'}`}>{value}</div>
          <div className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-0.5">{label}</div>
        </div>
    )
}

function ContactRow({ icon: Icon, label, value }: any) {
    return (
        <div className="flex items-start gap-3">
            <Icon className="h-4 w-4 text-slate-600 mt-0.5" />
            <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">{label}</span>
                <span className="text-xs font-bold text-white leading-tight">{value}</span>
            </div>
        </div>
    )
}