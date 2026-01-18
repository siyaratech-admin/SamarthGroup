"use client"

import React, { useState, useMemo, useEffect } from "react"
import { 
  Users, TrendingUp, PhoneCall, ShieldCheck, 
  ArrowUpRight, Clock, Star, Calendar,
  Map, Briefcase, FileText, Filter, Search, X, ChevronRight,
  History, IndianRupee, MoreVertical, MessageSquare,
  BadgePercent, UserCheck, HardHat, Building, Download
} from "lucide-react"
import { 
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetDescription 
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// --- TYPES ---
interface Interaction {
  date: string;
  type: string;
  note: string;
  icon: any;
}

interface Lead {
  id: string;
  name: string;
  score: number;
  status: string;
  broker: string;
  source: string;
  type: string;
  budget: string;
  lastContact: string;
  assignedTo: string;
  preferredUnit?: string;
  interactions: Interaction[];
}

// --- MOCK DATA ---
const CRM_LEADS: Lead[] = [
  { 
    id: "L-8842", 
    name: "Rahul Sharma", 
    score: 94, 
    status: "Hot", 
    broker: "PropTiger", 
    source: "Facebook Ads", 
    type: "3BHK",
    budget: "₹1.4 Cr - ₹1.8 Cr",
    lastContact: "2 hours ago",
    assignedTo: "Rajesh Kumar",
    preferredUnit: "A-1001",
    interactions: [
      { date: "Jan 15, 14:20", type: "call", note: "Discussed payment plan for 1001. Requested 10:90 scheme.", icon: PhoneCall },
      { date: "Jan 12, 11:00", type: "visit", note: "Site visit completed with family. High interest in East facing units.", icon: Map }
    ]
  },
  { 
    id: "L-9012", 
    name: "Ananya Iyer", 
    score: 72, 
    status: "Warm", 
    broker: "Direct", 
    source: "Organic", 
    type: "2BHK",
    budget: "₹85 L - ₹95 L",
    lastContact: "Yesterday",
    assignedTo: "Sneha Patil",
    interactions: [
      { date: "Jan 14, 16:45", type: "email", note: "Inquiry regarding car parking charges.", icon: FileText }
    ]
  }
];

const INVENTORY_SUMMARY = [
  { label: "Available", count: 45, color: "bg-emerald-500" },
  { label: "Booked", count: 12, color: "bg-blue-500" },
  { label: "Blocked", count: 8, color: "bg-amber-500" },
  { label: "Sold", count: 35, color: "bg-slate-300" },
];

export default function SalesIntelligence() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [activeTab, setActiveTab] = useState("presales")
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => { setMounted(true) }, [])

  const filteredLeads = useMemo(() => {
    return CRM_LEADS.filter(l => 
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      l.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      <div className="bg-white border-b p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Sales Intelligence</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Real-time Lead Velocity & Inventory Control</p>
        </div>
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {INVENTORY_SUMMARY.map((stat, i) => (
                <div key={i} className="flex items-center gap-2 bg-white border px-3 py-1.5 rounded-xl shrink-0">
                    <div className={`w-2 h-2 rounded-full ${stat.color}`} />
                    <span className="text-[10px] font-black uppercase text-slate-500">{stat.count} {stat.label}</span>
                </div>
            ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] p-4 md:p-8 space-y-8">
        
        {/* --- PERFORMANCE DASHBOARD --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-slate-900 rounded-[32px] p-6 md:p-10 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-2">Revenue Realization Target</p>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter flex items-baseline gap-3">
                ₹12.80 Cr <span className="text-lg text-emerald-400 font-bold uppercase tracking-widest">+18.2%</span>
              </h2>
              
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatBox label="New Leads" value="1,284" sub="Last 30 Days" />
                <StatBox label="Site Visits" value="342" sub="Avg 12/Day" />
                <StatBox label="Tokens" value="42" color="text-emerald-400" sub="Cleared" />
                <StatBox label="Closing %" value="12.4%" color="text-indigo-400" sub="Efficiency" />
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[100px] rounded-full -mr-20 -mt-20" />
          </div>

          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm">
             <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
               <Briefcase className="h-4 w-4 text-indigo-600" /> Source Contribution
             </h3>
             <div className="space-y-5">
                <SourceProgress label="Facebook/Meta Ads" value={65} color="bg-blue-600" />
                <SourceProgress label="Channel Partners" value={42} color="bg-indigo-600" />
                <SourceProgress label="Direct Walk-ins" value={28} color="bg-emerald-500" />
             </div>
          </div>
        </div>

        {/* --- CRM LEADS LIST --- */}
        <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
          <div className="p-6 md:p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex bg-slate-100 p-1 rounded-2xl w-full md:w-auto">
              {["presales", "sales", "inventory"].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 md:flex-none text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl transition-all ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search name, ID or unit..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 rounded-2xl bg-slate-50 border-none text-sm focus-visible:ring-indigo-500" 
                />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50 bg-slate-50/50">
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Lead Profile</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Assignment</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Score</th>
                  <th className="px-8 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="group hover:bg-slate-50/80 cursor-pointer border-b border-slate-50" onClick={() => setSelectedLead(lead)}>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs">
                           {lead.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-black text-slate-900">{lead.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{lead.type} • {lead.budget}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                        <p className="text-xs font-bold text-slate-700">{lead.assignedTo}</p>
                        <p className="text-[10px] font-medium text-slate-400 uppercase">{lead.broker}</p>
                    </td>
                    <td className="px-8 py-5 text-center">
                        <div className={`inline-flex h-9 w-9 rounded-xl items-center justify-center text-[11px] font-black ${
                          lead.score > 80 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                        }`}>
                          {lead.score}
                        </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-indigo-600 transition-colors inline" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- LEAD DOSSIER CONTROL CENTER --- */}
      <Sheet open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <SheetContent side="right" className="w-full sm:max-w-[600px] p-0 border-l flex flex-col bg-white">
          {selectedLead && (
            <>
              <SheetHeader className="p-8 pb-6 text-left bg-slate-900 text-white">
                <div className="flex justify-between items-start mb-4">
                    <Badge className="bg-indigo-500 border-none px-3 py-1 font-black text-[10px]">{selectedLead.status.toUpperCase()} PROSPECT</Badge>
                    <span className="text-[10px] font-black text-white/40 tracking-widest uppercase">Lead ID: {selectedLead.id}</span>
                </div>
                <SheetTitle className="text-4xl font-black text-white tracking-tighter uppercase mb-2">{selectedLead.name}</SheetTitle>
                <div className="flex items-center gap-4 text-xs font-bold text-indigo-300">
                    <span className="flex items-center gap-1"><PhoneCall className="h-3 w-3" /> +91 98XXX XXX01</span>
                    <span className="flex items-center gap-1 uppercase tracking-widest"><Map className="h-3 w-3" /> {selectedLead.type}</span>
                </div>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto p-8 space-y-10 bg-white">
                
                {/* PRIMARY ACTIONS GRID */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <LeadActionBtn icon={PhoneCall} label="Log Call" onClick={() => alert('Opening call log...')} />
                    <LeadActionBtn icon={Calendar} label="Schedule Visit" onClick={() => alert('Opening calendar...')} />
                    <LeadActionBtn icon={IndianRupee} label="Generate Offer" variant="highlight" />
                    <LeadActionBtn icon={BadgePercent} label="Request Discount" />
                    <LeadActionBtn icon={UserCheck} label="KYC Verify" />
                    <LeadActionBtn icon={MessageSquare} label="Send WhatsApp" />
                    <LeadActionBtn icon={Download} label="Brochure" />
                    <LeadActionBtn icon={MoreVertical} label="Other Actions" />
                </div>

                {/* INVENTORY LINKING */}
                <div className="p-6 rounded-[24px] bg-slate-50 border-2 border-dashed border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Building className="h-4 w-4" /> Unit Selection
                        </p>
                        {selectedLead.preferredUnit ? (
                            <Badge className="bg-emerald-100 text-emerald-700 border-none font-black text-[10px] uppercase">
                                Linked: {selectedLead.preferredUnit}
                            </Badge>
                        ) : (
                            <Button size="sm" variant="outline" className="text-[9px] font-black uppercase h-7">Link Unit</Button>
                        )}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {["A-1001", "A-1002", "A-1003"].map(u => (
                            <button key={u} className={`p-3 rounded-xl border-2 text-[11px] font-black transition-all ${selectedLead.preferredUnit === u ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-100 text-slate-400'}`}>
                                {u}
                            </button>
                        ))}
                    </div>
                </div>

                {/* TIMELINE */}
                <div className="space-y-6">
                   <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                     <History className="h-4 w-4" /> Interaction Timeline
                   </p>
                   <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
                      {selectedLead.interactions.map((event, i) => (
                        <div key={i} className="flex gap-4 relative">
                           <div className="h-6 w-6 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center shrink-0 z-10 shadow-sm">
                              <event.icon className="h-3 w-3 text-slate-600" />
                           </div>
                           <div className="flex-1">
                              <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{event.date}</p>
                              <div className="text-xs text-slate-500 mt-1.5 leading-relaxed bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                                 {event.note}
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>

              <SheetFooter className="p-8 border-t bg-slate-50/50">
                <Button className="w-full h-16 rounded-[20px] bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-100 group">
                  Convert to Booking <ArrowUpRight className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

// --- REUSABLE SUB-COMPONENTS ---

function StatBox({ label, value, color = "text-white", sub }: any) {
  return (
    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
      <p className="text-[9px] font-black text-white/40 uppercase mb-1">{label}</p>
      <p className={`text-xl font-black ${color}`}>{value}</p>
      {sub && <p className="text-[8px] font-bold text-white/20 mt-1 uppercase tracking-tighter">{sub}</p>}
    </div>
  )
}

function SourceProgress({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-tight">
        <span className="text-slate-500">{label}</span>
        <span className="text-slate-900">{value}%</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

function LeadActionBtn({ icon: Icon, label, onClick, variant }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 py-5 rounded-2xl border-2 transition-all active:scale-95 ${
        variant === 'highlight' 
        ? 'border-indigo-100 bg-indigo-50/50 text-indigo-600 hover:bg-indigo-100' 
        : 'border-slate-50 bg-white hover:border-slate-100 hover:bg-slate-50 text-slate-600'
      }`}
    >
      <Icon className={`h-5 w-5 ${variant === 'highlight' ? 'text-indigo-600' : 'text-slate-900'}`} />
      <span className="text-[8px] font-black uppercase tracking-widest text-center px-2">{label}</span>
    </button>
  )
}