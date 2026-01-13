"use client"

import React, { useState } from "react"
import { Header } from "@/components/erp/header"
import { DataTable } from "@/components/erp/data-table"
import { leads as initialLeads, type Lead } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { 
    Plus, Phone, IndianRupee, ChevronRight, MessageSquare, 
    Mail, Clock, History
} from "lucide-react"
import { 
    Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription 
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { toast } from "sonner"

export default function LeadsPage() {
    const [allLeads, setAllLeads] = useState<Lead[]>(initialLeads)
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
    const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false)
    const [visitDate, setVisitDate] = useState<Date | undefined>(new Date())
    const [newLead, setNewLead] = useState({ name: "", phone: "", budget: "", unitType: "3BHK" })
    const [remark, setRemark] = useState("")

    const handleAddLead = () => {
        if (!newLead.name || !newLead.phone) {
            toast.error("Name and Phone are required")
            return
        }

        const leadObj: Lead = {
            id: `L-${Math.floor(1000 + Math.random() * 9999)}`,
            name: newLead.name,
            phone: newLead.phone,
            email: `${newLead.name.toLowerCase().replace(/\s+/g, '.')}@crm.com`,
            contact: newLead.phone,
            source: "Digital Ads" as any, 
            budget: newLead.budget || "₹85,00,000",
            preferredProject: "The Grand Residency",
            interestedUnit: "Unit-" + Math.floor(100 + Math.random() * 900),
            status: "New",
            assignedTo: "Arun Joshi",
            unitType: newLead.unitType,
            createdAt: new Date().toISOString(),
            lastActivity: "Lead created"
        }

        setAllLeads([leadObj, ...allLeads])
        setIsAddDrawerOpen(false)
        setNewLead({ name: "", phone: "", budget: "", unitType: "3BHK" })
        toast.success("Lead synced successfully")
    }

    const leadColumns = [
        { 
            key: "name", 
            header: "PROSPECT", 
            render: (item: Lead) => (
                <div className="flex items-center gap-3 py-1 text-left">
                    <div className="h-9 w-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold border border-indigo-100 uppercase">
                        {item.name[0]}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-900 leading-none">{item.name}</span>
                        <span className="text-[10px] text-slate-400 font-medium uppercase mt-1">{item.id}</span>
                    </div>
                </div>
            ) 
        },
        { key: "phone", header: "CONTACT" },
        { key: "budget", header: "VALUE", render: (item: Lead) => <span className="font-bold text-slate-900">{item.budget}</span> },
        { 
            key: "status", 
            header: "STATUS", 
            render: (item: Lead) => (
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${
                    item.status === 'New' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                }`}>
                    {item.status}
                </span>
            ) 
        },
        { key: "action", header: "", render: () => <ChevronRight className="h-4 w-4 text-slate-300" /> }
    ]

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Header title="Pre-Sales Intelligence" subtitle="Lead acquisition & conversion" />

            <div className="mx-auto max-w-[1400px] px-8 py-8 space-y-6">
                <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">Lead Pipeline</h2>
                    <Button onClick={() => setIsAddDrawerOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 font-bold shadow-lg shadow-indigo-100">
                        <Plus className="h-4 w-4 mr-2" /> Create lead
                    </Button>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <DataTable columns={leadColumns} data={allLeads} onRowClick={(row) => setSelectedLead(row as Lead)} />
                </div>
            </div>

            {/* CREATE LEAD DRAWER - FIXED TITLE ERROR */}
            <Sheet open={isAddDrawerOpen} onOpenChange={setIsAddDrawerOpen}>
                <SheetContent className="w-full sm:max-w-[440px] p-6 space-y-6 bg-white">
                    <SheetHeader className="text-left">
                        <SheetTitle className="text-xl font-black uppercase tracking-tight text-slate-900">New Lead Entry</SheetTitle>
                        <SheetDescription className="text-xs font-medium text-slate-500 uppercase tracking-widest">Manual Pipeline Sync</SheetDescription>
                    </SheetHeader>
                    <div className="space-y-4">
                        <FormInput label="Full Name" placeholder="e.g. Vikram Malhotra" value={newLead.name} onChange={(v) => setNewLead({...newLead, name: v})} />
                        <FormInput label="Phone Number" placeholder="+91" value={newLead.phone} onChange={(v) => setNewLead({...newLead, phone: v})} />
                        <FormInput label="Budget Range" placeholder="₹1.2 Cr" value={newLead.budget} onChange={(v) => setNewLead({...newLead, budget: v})} />
                        <div className="space-y-1.5 text-left">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Unit Requirement</label>
                            <Select onValueChange={(v) => setNewLead({...newLead, unitType: v})}>
                                <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50/50">
                                    <SelectValue placeholder="Select Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="2BHK">2 BHK</SelectItem>
                                    <SelectItem value="3BHK">3 BHK</SelectItem>
                                    <SelectItem value="Villa">Villa</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Button onClick={handleAddLead} className="w-full h-12 bg-black text-white rounded-xl font-bold mt-4 shadow-xl">Sync lead</Button>
                </SheetContent>
            </Sheet>

            {/* MAIN PROSPECT DRAWER - FIXED TITLE ERROR */}
            <Sheet open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
                <SheetContent className="w-full sm:max-w-[580px] p-0 flex flex-col bg-white">
                    <Tabs defaultValue="activity" className="flex-1 flex flex-col">
                        <div className="p-6 bg-slate-50 border-b border-slate-200">
                            <SheetHeader className="mb-6">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl uppercase">{selectedLead?.name[0]}</div>
                                        <div className="text-left">
                                            <SheetTitle className="font-black text-slate-900 text-lg leading-none">{selectedLead?.name}</SheetTitle>
                                            <SheetDescription className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{selectedLead?.id}</SheetDescription>
                                        </div>
                                    </div>
                                    <TabsList className="bg-slate-200/50 rounded-lg p-1">
                                        <TabsTrigger value="activity" className="text-[10px] font-bold uppercase">Engagement</TabsTrigger>
                                        <TabsTrigger value="visit" className="text-[10px] font-bold uppercase">Visit</TabsTrigger>
                                    </TabsList>
                                </div>
                            </SheetHeader>
                        </div>

                        <TabsContent value="activity" className="flex-1 overflow-y-auto m-0 p-6 space-y-8">
                            <div className="grid grid-cols-2 gap-3">
                                <InfoItem icon={Phone} label="Contact" value={selectedLead?.phone} />
                                <InfoItem icon={IndianRupee} label="Budget" value={selectedLead?.budget} />
                            </div>
                            
                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest text-left">Execute Outreach</p>
                                <div className="grid grid-cols-3 gap-2">
                                    <OutreachBtn icon={Phone} label="Call" />
                                    <OutreachBtn icon={MessageSquare} label="WhatsApp" color="text-emerald-500" />
                                    <OutreachBtn icon={Mail} label="Email" color="text-blue-500" />
                                </div>
                                
                                <div className="pt-6 border-t border-slate-100 text-left">
                                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">Internal Remarks</label>
                                    <Textarea 
                                        value={remark}
                                        onChange={(e) => setRemark(e.target.value)}
                                        placeholder="Log interaction details..." 
                                        className="min-h-[120px] rounded-2xl border-slate-200 bg-slate-50/30 p-4 focus:bg-white" 
                                    />
                                    <Button onClick={() => {toast.success("Activity logged"); setRemark("")}} className="w-full h-11 bg-indigo-600 font-bold rounded-xl mt-3">
                                        Commit Activity
                                    </Button>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="visit" className="flex-1 overflow-y-auto m-0 p-6 space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block text-center">Schedule Site Visit</label>
                                <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm flex justify-center">
                                    <Calendar mode="single" selected={visitDate} onSelect={setVisitDate} className="rounded-md" />
                                </div>
                            </div>
                            <Button 
                                onClick={() => toast.success(`Scheduled for ${visitDate ? format(visitDate, "PPP") : "Today"}`)} 
                                className="w-full h-12 bg-black text-white font-bold rounded-xl"
                            >
                                <Clock className="h-4 w-4 mr-2" /> Confirm Appointment
                            </Button>
                        </TabsContent>
                    </Tabs>
                </SheetContent>
            </Sheet>
        </div>
    )
}

function OutreachBtn({ icon: Icon, label, color = "text-slate-600" }: { icon: any, label: string, color?: string }) {
    return (
        <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all">
            <Icon className={`h-5 w-5 ${color}`} />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">{label}</span>
        </button>
    )
}

function FormInput({ label, placeholder, value, onChange }: { label: string, placeholder: string, value: string, onChange: (v: string) => void }) {
    return (
        <div className="space-y-1.5 text-left">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{label}</label>
            <Input placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className="h-12 border-slate-200 rounded-xl bg-slate-50/50" />
        </div>
    )
}

function InfoItem({ icon: Icon, label, value }: { icon: any, label: string, value?: string }) {
    return (
        <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-start gap-3 shadow-sm text-left">
            <div className="p-2 bg-slate-50 rounded-lg"><Icon className="h-4 w-4 text-slate-400" /></div>
            <div>
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</div>
                <div className="text-sm font-bold text-slate-900">{value || '---'}</div>
            </div>
        </div>
    )
}

// "use client"

// import React, { useState } from "react"
// import { Header } from "@/components/erp/header"
// import { DataTable } from "@/components/erp/data-table"
// import { StatusBadge } from "@/components/erp/status-badge"
// import { Button } from "@/components/ui/button"
// import { 
//     Plus, ChevronRight, IndianRupee, Printer, 
//     FileText, Calendar, Building2, User, 
//     CreditCard, ShieldCheck, Download, MoreHorizontal
// } from "lucide-react"
// import { 
//     Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription 
// } from "@/components/ui/sheet"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { toast } from "sonner"

// // --- EXTENDED DUMMY DATA ---
// const dummyBookings = [
//     { id: "B-8821", unitNo: "A-101", customerName: "Rajesh Thapar", totalAmount: 12500000, bookingAmount: 1250000, date: "2023-10-24", status: "confirmed", email: "rajesh.t@gmail.com", phone: "+91 98220 12345", project: "The Grand Residency", type: "3 BHK" },
//     { id: "B-8822", unitNo: "B-504", customerName: "Ananya Iyer", totalAmount: 8500000, bookingAmount: 850000, date: "2023-10-22", status: "pending", email: "ananya.i@outlook.com", phone: "+91 98450 67890", project: "The Grand Residency", type: "2 BHK" },
//     { id: "B-8823", unitNo: "C-202", customerName: "Vikram Malhotra", totalAmount: 21000000, bookingAmount: 2100000, date: "2023-10-20", status: "confirmed", email: "vikram@malhotra.com", phone: "+91 99001 22334", project: "Skyline Villas", type: "4 BHK Villa" },
//     { id: "B-8824", unitNo: "A-901", customerName: "Sanjay Singhania", totalAmount: 14500000, bookingAmount: 1450000, date: "2023-10-18", status: "cancelled", email: "sanjay.s@corp.in", phone: "+91 91234 56789", project: "The Grand Residency", type: "3.5 BHK" },
//     { id: "B-8825", unitNo: "B-302", customerName: "Priya Sharma", totalAmount: 9200000, bookingAmount: 1000000, date: "2023-10-15", status: "confirmed", email: "priya.sharma@yahoo.com", phone: "+91 98765 43210", project: "The Grand Residency", type: "2 BHK" },
//     { id: "B-8826", unitNo: "D-105", customerName: "Amitabh Varma", totalAmount: 11000000, bookingAmount: 500000, date: "2023-10-12", status: "pending", email: "amit.varma@gmail.com", phone: "+91 90000 11111", project: "Green Meadows", type: "3 BHK" },
// ]

// const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat("en-IN", {
//         style: "currency",
//         currency: "INR",
//         maximumFractionDigits: 0,
//     }).format(amount)
// }

// export default function BookingsPage() {
//     const [selectedBooking, setSelectedBooking] = useState<any | null>(null)

//     const bookingColumns = [
//         {
//             key: "unitNo",
//             header: "UNIT / INVENTORY",
//             render: (item: any) => (
//                 <div className="flex items-center gap-3 py-1 text-left">
//                     <div className="h-9 w-9 rounded-xl bg-slate-900 text-white flex items-center justify-center text-[10px] font-black border border-slate-800 uppercase">
//                         {item.unitNo}
//                     </div>
//                     <div className="flex flex-col">
//                         <span className="font-bold text-slate-900 leading-none">{item.project}</span>
//                         <span className="text-[10px] text-slate-400 font-medium uppercase mt-1">{item.type}</span>
//                     </div>
//                 </div>
//             )
//         },
//         { 
//             key: "customerName", 
//             header: "CUSTOMER",
//             render: (item: any) => (
//                 <div className="text-left">
//                     <div className="font-bold text-slate-700">{item.customerName}</div>
//                     <div className="text-[10px] text-slate-400">{item.phone}</div>
//                 </div>
//             )
//         },
//         { 
//             key: "totalAmount", 
//             header: "TOTAL VALUE", 
//             render: (item: any) => <span className="font-bold text-slate-900">{formatCurrency(item.totalAmount)}</span> 
//         },
//         { 
//             key: "status", 
//             header: "TRANS. STATUS", 
//             render: (item: any) => (
//                 <div className="flex justify-start">
//                     <StatusBadge status={item.status} />
//                 </div>
//             ) 
//         },
//         { 
//             key: "action", 
//             header: "", 
//             render: () => <ChevronRight className="h-4 w-4 text-slate-300" /> 
//         }
//     ]

//     return (
//         <div className="min-h-screen bg-[#F8FAFC]">
//             <Header title="Sales Ledger" subtitle="Inventory bookings & financial records" />

//             <div className="mx-auto max-w-[1400px] px-8 py-8 space-y-6">
//                 {/* Stats Grid */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <StatCard label="Live Bookings" value={dummyBookings.length.toString()} color="text-indigo-600" />
//                     <StatCard label="Collection (MTD)" value="₹4.2 Cr" color="text-emerald-600" />
//                     <StatCard label="Pending KYC" value="02" color="text-amber-600" />
//                 </div>

//                 {/* Actions Bar */}
//                 <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
//                     <div className="flex items-center gap-4">
//                         <h2 className="text-lg font-bold text-slate-900 tracking-tight">Booking Pipeline</h2>
//                         <div className="h-6 w-[1px] bg-slate-200" />
//                         <span className="text-xs font-medium text-slate-500 italic">Showing all active sales</span>
//                     </div>
//                     <Button onClick={() => toast.info("New Booking Wizard Started")} className="bg-black hover:bg-slate-800 text-white rounded-xl px-6 font-bold shadow-lg">
//                         <Plus className="h-4 w-4 mr-2" /> New Sales Entry
//                     </Button>
//                 </div>

//                 {/* Table */}
//                 <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
//                     <DataTable 
//                         columns={bookingColumns} 
//                         data={dummyBookings} 
//                         onRowClick={(row) => setSelectedBooking(row)} 
//                     />
//                 </div>
//             </div>

//             {/* BOOKING DETAIL DRAWER */}
//             <Sheet open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
//                 <SheetContent className="w-full sm:max-w-[600px] p-0 flex flex-col bg-white">
//                     {selectedBooking && (
//                         <Tabs defaultValue="overview" className="flex-1 flex flex-col">
//                             <div className="p-6 bg-slate-950 text-white">
//                                 <SheetHeader className="mb-6">
//                                     <div className="flex justify-between items-start">
//                                         <div className="flex items-center gap-4">
//                                             <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center font-black text-2xl text-white border border-white/20">
//                                                 {selectedBooking.unitNo}
//                                             </div>
//                                             <div className="text-left">
//                                                 <SheetTitle className="font-black text-white text-xl leading-none">
//                                                     {selectedBooking.customerName}
//                                                 </SheetTitle>
//                                                 <div className="flex items-center gap-2 mt-2">
//                                                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedBooking.id}</span>
//                                                     <div className="h-1 w-1 rounded-full bg-slate-600" />
//                                                     <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{selectedBooking.status}</span>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div className="flex gap-2">
//                                             <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"><Printer className="h-4 w-4 text-slate-300" /></button>
//                                             <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"><Download className="h-4 w-4 text-slate-300" /></button>
//                                         </div>
//                                     </div>
//                                 </SheetHeader>
                                
//                                 <TabsList className="bg-white/5 border border-white/10 rounded-xl p-1 w-full flex">
//                                     <TabsTrigger value="overview" className="flex-1 text-[10px] font-bold uppercase data-[state=active]:bg-white data-[state=active]:text-black">Overview</TabsTrigger>
//                                     <TabsTrigger value="ledger" className="flex-1 text-[10px] font-bold uppercase data-[state=active]:bg-white data-[state=active]:text-black">Financial Ledger</TabsTrigger>
//                                     <TabsTrigger value="documents" className="flex-1 text-[10px] font-bold uppercase data-[state=active]:bg-white data-[state=active]:text-black">KYC Docs</TabsTrigger>
//                                 </TabsList>
//                             </div>

//                             <TabsContent value="overview" className="flex-1 overflow-y-auto m-0 p-6 space-y-6">
//                                 <div className="grid grid-cols-2 gap-4">
//                                     <DetailBox icon={Building2} label="Project" value={selectedBooking.project} />
//                                     <DetailBox icon={Calendar} label="Booking Date" value={selectedBooking.date} />
//                                     <DetailBox icon={User} label="Primary Applicant" value={selectedBooking.customerName} />
//                                     <DetailBox icon={CreditCard} label="Payment Mode" value="Wire Transfer" />
//                                 </div>

//                                 <div className="p-6 rounded-3xl border border-slate-100 bg-slate-50/50 space-y-4">
//                                     <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest text-left">Price Breakdown</p>
//                                     <div className="space-y-3">
//                                         <PriceRow label="Agreement Value" value={formatCurrency(selectedBooking.totalAmount)} />
//                                         <PriceRow label="Other Charges" value={formatCurrency(450000)} />
//                                         <PriceRow label="Taxes (GST)" value={formatCurrency(selectedBooking.totalAmount * 0.05)} />
//                                         <div className="pt-3 border-t border-slate-200">
//                                             <PriceRow label="Total Payable" value={formatCurrency(selectedBooking.totalAmount * 1.05 + 450000)} bold />
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="flex gap-3">
//                                     <Button className="flex-1 h-12 bg-black text-white rounded-xl font-bold shadow-lg">Confirm Receipt</Button>
//                                     <Button variant="outline" className="h-12 w-12 rounded-xl border-slate-200"><MoreHorizontal className="h-5 w-5" /></Button>
//                                 </div>
//                             </TabsContent>

//                             <TabsContent value="ledger" className="flex-1 m-0 p-6">
//                                 <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
//                                     <FileText className="h-8 w-8 opacity-20" />
//                                     <p className="text-xs font-bold uppercase tracking-widest opacity-50">Ledger details loading...</p>
//                                 </div>
//                             </TabsContent>
//                         </Tabs>
//                     )}
//                 </SheetContent>
//             </Sheet>
//         </div>
//     )
// }

// // --- UI HELPER COMPONENTS ---

// function StatCard({ label, value, color }: { label: string, value: string, color: string }) {
//     return (
//         <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-left">
//             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</div>
//             <div className={`text-2xl font-black ${color}`}>{value}</div>
//         </div>
//     )
// }

// function DetailBox({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
//     return (
//         <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-start gap-3 shadow-sm text-left">
//             <div className="p-2 bg-slate-50 rounded-lg"><Icon className="h-4 w-4 text-slate-400" /></div>
//             <div>
//                 <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</div>
//                 <div className="text-sm font-bold text-slate-900 leading-tight">{value}</div>
//             </div>
//         </div>
//     )
// }

// function PriceRow({ label, value, bold = false }: { label: string, value: string, bold?: boolean }) {
//     return (
//         <div className="flex justify-between items-center">
//             <span className={`text-xs ${bold ? 'font-bold text-slate-900' : 'text-slate-500 font-medium'}`}>{label}</span>
//             <span className={`text-sm ${bold ? 'text-indigo-600 font-black' : 'text-slate-700 font-bold'}`}>{value}</span>
//         </div>
//     )
// }