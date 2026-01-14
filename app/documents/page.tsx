"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/erp/header"
import { DataTable } from "@/components/erp/data-table"
import { StatusBadge } from "@/components/erp/status-badge"
import { Drawer } from "@/components/erp/drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { documents, customers } from "@/lib/mock-data"
import { 
  FileText, Upload, CheckCircle, Clock, 
  Eye, ShieldCheck, FileSignature, 
  Search, Download, Printer, Loader2,
  Check, Send, Sparkles, X
} from "lucide-react"

export default function InteractiveDocumentsPage() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [nocStatus, setNocStatus] = useState<"idle" | "sending" | "sent">("idle")
  const [showPreview, setShowPreview] = useState(false)

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId)
  const selectedDocs = documents.filter(d => d.customerId === selectedCustomerId)

  // --- CRM Logic: Interactive Functions ---
  
  const handleGenerateAgreement = () => {
    setIsGenerating(true)
    // Simulate CRM Document Engine
    setTimeout(() => {
      setIsGenerating(false)
      setShowPreview(true)
    }, 2000)
  }

  const handleRequestNOC = () => {
    setNocStatus("sending")
    // Simulate API Call to Authority/Bank
    setTimeout(() => {
      setNocStatus("sent")
      setTimeout(() => setNocStatus("idle"), 3000)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header title="Compliance Center" subtitle="Interactive Document Management & Legal Automation" />

      <div className="p-4 sm:p-8 space-y-6 max-w-[1500px] mx-auto">
        
        {/* --- DYNAMIC CRM ACTION HEADER --- */}
        <div className="bg-indigo-900 rounded-[32px] p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl shadow-indigo-200 overflow-hidden relative">
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-indigo-300" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">Automated Workflow</span>
                </div>
                <h2 className="text-2xl font-black tracking-tight">Generate Sales Agreements Instantly</h2>
                <p className="text-indigo-200 text-sm mt-1">Our CRM engine auto-fills customer data into legally vetted templates.</p>
            </div>
            <Button className="relative z-10 h-14 px-8 rounded-2xl bg-white text-indigo-900 hover:bg-indigo-50 font-black uppercase text-xs tracking-widest shadow-lg">
                Upload New Batch
            </Button>
            {/* Background Decorative Element */}
            <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/10 to-transparent skew-x-12 translate-x-10" />
        </div>

        {/* --- MAIN DATA TABLE --- */}
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
            <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Master Document Vault</h3>
            <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input placeholder="Filter by customer..." className="pl-10 h-11 rounded-xl border-slate-200 bg-slate-50 text-xs font-medium" />
            </div>
          </div>
          <DataTable 
            columns={columns} 
            data={documents} 
            onRowClick={(row) => setSelectedCustomerId(row.customerId)} 
          />
        </div>
      </div>

      {/* --- INTERACTIVE CRM DRAWER --- */}
      <Drawer
        open={!!selectedCustomerId}
        onClose={() => {
            setSelectedCustomerId(null)
            setShowPreview(false)
        }}
        title="Account Compliance"
      >
        {selectedCustomer && (
          <div className="flex flex-col gap-6 pb-12">
            
            {/* Customer Profile Card */}
            <div className="p-5 bg-slate-50 rounded-[24px] border border-slate-100 flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-100">
                    {selectedCustomer.name[0]}
                </div>
                <div className="flex flex-col text-left">
                    <span className="text-base font-black text-slate-900">{selectedCustomer.name}</span>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Unit {selectedCustomer.unitNo}</span>
                        <div className="h-1 w-1 rounded-full bg-slate-300" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase">KYC Level 2</span>
                    </div>
                </div>
            </div>

            {/* INTERACTIVE ACTION BUTTONS */}
            <div className="grid grid-cols-2 gap-3">
               <button 
                  onClick={handleGenerateAgreement}
                  disabled={isGenerating}
                  className="flex flex-col items-center justify-center p-5 rounded-[24px] border-2 border-indigo-100 bg-indigo-50/50 gap-3 hover:bg-indigo-50 transition-all group disabled:opacity-50"
               >
                  {isGenerating ? (
                      <Loader2 className="h-6 w-6 text-indigo-600 animate-spin" />
                  ) : (
                      <FileSignature className="h-6 w-6 text-indigo-600 group-hover:scale-110 transition-transform" />
                  )}
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
                    {isGenerating ? "Drafting..." : "Generate Agreement"}
                  </span>
               </button>

               <button 
                  onClick={handleRequestNOC}
                  disabled={nocStatus !== "idle"}
                  className={`flex flex-col items-center justify-center p-5 rounded-[24px] border-2 gap-3 transition-all group 
                    ${nocStatus === "sent" ? "border-emerald-200 bg-emerald-50" : "border-slate-100 bg-slate-50 hover:bg-slate-100"}`}
               >
                  {nocStatus === "sending" ? (
                      <Loader2 className="h-6 w-6 text-slate-600 animate-spin" />
                  ) : nocStatus === "sent" ? (
                      <Check className="h-6 w-6 text-emerald-600" />
                  ) : (
                      <Send className="h-6 w-6 text-slate-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  )}
                  <span className={`text-[10px] font-black uppercase tracking-widest ${nocStatus === 'sent' ? 'text-emerald-600' : 'text-slate-600'}`}>
                    {nocStatus === "sending" ? "Requesting..." : nocStatus === "sent" ? "Request Sent" : "Request NOC"}
                  </span>
               </button>
            </div>

            {/* LIVE PREVIEW COMPONENT (Appears after Generation) */}
            {showPreview && (
                <div className="relative animate-in slide-in-from-bottom-4 duration-500">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg z-10">
                        Generated Preview
                    </div>
                    <div className="bg-white border-2 border-indigo-100 rounded-[24px] p-6 shadow-xl shadow-indigo-50/50">
                        <div className="space-y-4 opacity-60 pointer-events-none">
                            <div className="h-4 w-3/4 bg-slate-100 rounded" />
                            <div className="h-4 w-full bg-slate-100 rounded" />
                            <div className="h-4 w-1/2 bg-slate-100 rounded" />
                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <div className="h-10 bg-slate-50 rounded-lg border border-dashed border-slate-200" />
                                <div className="h-10 bg-slate-50 rounded-lg border border-dashed border-slate-200" />
                            </div>
                        </div>
                        <div className="flex gap-2 mt-6">
                            <Button className="flex-1 h-10 bg-indigo-600 text-[10px] font-black uppercase rounded-xl">E-Sign & Send</Button>
                            <Button variant="ghost" onClick={() => setShowPreview(false)} className="h-10 w-10 p-0 rounded-xl bg-slate-100 text-slate-500">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Document List */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Active Files</h4>
              {selectedDocs.map((doc) => (
                <div key={doc.id} className="p-4 rounded-2xl border border-slate-200 bg-white flex items-center justify-between group hover:border-indigo-200 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                            <FileText className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col text-left">
                           <span className="text-[11px] font-black text-slate-800">{doc.documentType}</span>
                           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{doc.uploadedAt || 'Ready for upload'}</span>
                        </div>
                    </div>
                    <StatusBadge status={doc.status} />
                </div>
              ))}
            </div>

            <Button className="w-full h-14 bg-slate-900 hover:bg-black text-white rounded-[24px] font-black uppercase text-xs tracking-widest shadow-xl">
                Download Full Dossier
            </Button>
          </div>
        )}
      </Drawer>
    </div>
  )
}

// --- Internal Table Columns ---
const columns = [
  {
    key: "customerName",
    header: "CUSTOMER",
    render: (item: any) => (
      <div className="flex items-center gap-3 py-1 text-left">
        <div className="h-8 w-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500">
            {item.customerName[0]}
        </div>
        <div className="flex flex-col">
            <span className="text-xs font-black text-slate-900">{item.customerName}</span>
            <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-tighter">Unit {item.unitNo}</span>
        </div>
      </div>
    ),
  },
  {
    key: "documentType",
    header: "DOCUMENT TYPE",
    render: (item: any) => (
        <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${item.documentType.includes('Agreement') ? 'bg-indigo-400' : 'bg-emerald-400'}`} />
            <span className="text-[11px] font-bold text-slate-700">{item.documentType}</span>
        </div>
    )
  },
  {
    key: "status",
    header: "STATUS",
    render: (item: any) => <StatusBadge status={item.status} />,
  },
  {
    key: "actions",
    header: "VAULT",
    render: () => (
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-8 w-8 rounded-lg hover:bg-indigo-50 hover:text-indigo-600"><Eye className="h-4 w-4" /></Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 rounded-lg"><Download className="h-4 w-4" /></Button>
      </div>
    ),
  },
]