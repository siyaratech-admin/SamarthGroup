"use client"

import React, { useState } from "react"
import { Header } from "@/components/erp/header"
import { DataTable } from "@/components/erp/data-table"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { leads as initialLeads, type Lead } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { 
    Plus, IndianRupee, ChevronRight, MessageSquare, 
    Layout, Share2, User, Phone, 
    Target, Zap, Calendar as CalendarIcon, Info
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
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function LeadsPage() {
    const [allLeads, setAllLeads] = useState<Lead[]>(initialLeads)
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
    const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false)
    const [visitDate, setVisitDate] = useState<Date | undefined>(new Date())
    const [newLead, setNewLead] = useState({ 
        name: "", 
        phone: "", 
        budget: "", 
        unitType: "Residential",
        source: "Direct Walk-in",
        sourceCategory: "Organic"
    })
    const [remark, setRemark] = useState("")

    const sendWhatsApp = (phone: string, type: 'visit_done' | 'visit_not_done' | 'general') => {
        let message = "";
        const cleanPhone = phone.replace(/\D/g, '');
        if (type === 'visit_done') message = "Thank you for visiting Samarth Group! Our team will share the final quotation soon.";
        else if (type === 'visit_not_done') message = "Hi! We missed you today. Here is our project location and price list.";
        else message = "Hello, I am reaching out from Samarth Group regarding your property inquiry.";

        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
        toast.success("WhatsApp Template Opened");
    }

    const handleAddLead = () => {
        if (!newLead.name || !newLead.phone) {
            toast.error("Required fields missing");
            return;
        }

        const leadObj: Lead = {
            id: `L-${Math.floor(1000 + Math.random() * 9999)}`,
            name: newLead.name,
            phone: newLead.phone,
            email: `${newLead.name.toLowerCase().replace(/\s+/g, '.')}@crm.com`,
            contact: newLead.phone,
            source: newLead.source as any, 
            budget: newLead.budget || "₹75L - 1Cr",
            preferredProject: "Samarth Heights",
            interestedUnit: "Pending",
            status: "New",
            assignedTo: "System Admin",
            unitType: newLead.unitType,
            createdAt: new Date().toISOString(),
            lastActivity: "New Lead Created"
        }

        setAllLeads([leadObj, ...allLeads]);
        setIsAddDrawerOpen(false);
        setNewLead({ name: "", phone: "", budget: "", unitType: "Residential", source: "Direct Walk-in", sourceCategory: "Organic" });
        toast.success("Lead created successfully");
    }

    const leadColumns = [
        { 
            key: "name", 
            header: "PROSPECT", 
            render: (item: Lead) => (
                <div className="flex items-center gap-2 md:gap-3 py-1 text-left min-w-0">
                    <div className="h-8 w-8 md:h-9 md:w-9 flex-shrink-0 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-[10px] md:text-xs font-black shadow-sm uppercase">
                        {item.name[0]}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="font-bold text-slate-900 leading-none truncate">{item.name}</span>
                        <span className="text-[10px] text-slate-400 font-medium uppercase mt-1 tracking-tighter">{item.id}</span>
                    </div>
                </div>
            ) 
        },
        { 
            key: "status", 
            header: "STAGING", 
            render: (item: Lead) => (
                <div className="flex items-center gap-2">
                    <div className="hidden sm:block h-1.5 w-12 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${item.status === 'New' ? 'w-1/3 bg-blue-500' : 'w-full bg-emerald-500'}`} />
                    </div>
                    <span className="text-[10px] font-black uppercase text-slate-500">{item.status}</span>
                </div>
            ) 
        },
        { 
            key: "budget", 
            header: "VALUE", 
            // Hidden on mobile to prevent squishing
            className: "hidden md:table-cell",
            render: (item: Lead) => (
                <div className="font-black text-slate-900 text-sm tracking-tight whitespace-nowrap">
                    {item.budget}
                </div>
            ) 
        },
        { 
            key: "action", 
            header: "", 
            render: (item: Lead) => (
                <div className="flex items-center justify-end gap-1 md:gap-2 pr-2 md:pr-4">
                    <Button variant="outline" size="icon" className="h-7 w-7 md:h-8 md:w-8 rounded-lg border-slate-200 hover:text-emerald-600" onClick={(e) => { e.stopPropagation(); sendWhatsApp(item.phone, 'general'); }}>
                        <MessageSquare className="h-3.5 w-3.5 md:h-4 w-4" />
                    </Button>
                    <ChevronRight className="h-4 w-4 text-slate-300" />
                </div>
            ) 
        }
    ]

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Header title="Sales Intelligence" subtitle="Lead acquisition & conversion" />

            {/* Responsive padding and max-width container */}
            <div className="mx-auto max-w-[1200px] px-4 md:px-6 py-4 md:py-6 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm ring-1 ring-black/[0.02]">
                    <div className="flex items-center gap-2">
                        <div className="h-6 sm:h-8 w-1 bg-indigo-600 rounded-full" />
                        <h2 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-widest">Leads Pipeline</h2>
                    </div>
                    <Button onClick={() => setIsAddDrawerOpen(true)} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 h-10 font-bold text-xs uppercase tracking-wider shadow-lg transition-all active:scale-95">
                        <Plus className="h-4 w-4 mr-1.5" /> Add New Lead
                    </Button>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <DataTable columns={leadColumns} data={allLeads} onRowClick={(row) => setSelectedLead(row as Lead)} />
                    </div>
                </div>
            </div>

            {/* ADD LEAD DRAWER - Responsive Width */}
            <Sheet open={isAddDrawerOpen} onOpenChange={setIsAddDrawerOpen}>
                <SheetContent side="right" className="w-full sm:max-w-[420px] p-0 bg-white flex flex-col h-full shadow-2xl border-l-0">
                    <div className="p-4 md:p-6 bg-slate-900 text-white flex-shrink-0">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="h-4 w-4 text-indigo-400 fill-indigo-400" />
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Quick Intake</span>
                        </div>
                        <SheetHeader className="text-left">
                            <SheetTitle className="text-xl md:text-2xl font-black uppercase tracking-tighter text-white">Create Lead</SheetTitle>
                            <SheetDescription className="text-slate-400 text-xs font-medium">Enter prospect details for Samarth Heights</SheetDescription>
                        </SheetHeader>
                    </div>
                    
                    <ScrollArea className="flex-1 min-h-0">
                        <div className="p-4 md:p-6 space-y-6 md:space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                    <User className="h-3.5 w-3.5 text-slate-400" />
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Personal Info</h3>
                                </div>
                                <FormInput icon={User} label="Full Name" placeholder="e.g. Vikram Mehta" value={newLead.name} onChange={(v) => setNewLead({...newLead, name: v})} />
                                <FormInput icon={Phone} label="Contact Number" placeholder="+91" value={newLead.phone} onChange={(v) => setNewLead({...newLead, phone: v})} />
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                    <Target className="h-3.5 w-3.5 text-slate-400" />
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Requirement</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5 text-left">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-tight ml-1">Unit Type</label>
                                        <Select defaultValue="Residential" onValueChange={(v) => setNewLead({...newLead, unitType: v})}>
                                            <SelectTrigger className="h-11 rounded-lg border-slate-200 bg-slate-50/50 font-bold text-xs focus:ring-2 focus:ring-indigo-500">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Residential">🏠 Residential</SelectItem>
                                                <SelectItem value="Commercial">🏢 Commercial</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <FormInput icon={IndianRupee} label="Budget" placeholder="75L - 1Cr" value={newLead.budget} onChange={(v) => setNewLead({...newLead, budget: v})} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                    <Share2 className="h-3.5 w-3.5 text-slate-400" />
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Source Details</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5 text-left">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-tight ml-1">Category</label>
                                        <Select defaultValue="Organic" onValueChange={(v) => setNewLead({...newLead, sourceCategory: v})}>
                                            <SelectTrigger className="h-11 rounded-lg border-slate-200 bg-slate-50/50 font-bold text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Organic">Organic</SelectItem>
                                                <SelectItem value="Paid Media">Paid Media</SelectItem>
                                                <SelectItem value="External">External</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1.5 text-left">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-tight ml-1">Platform</label>
                                        <Select defaultValue="Direct Walk-in" onValueChange={(v) => setNewLead({...newLead, source: v})}>
                                            <SelectTrigger className="h-11 rounded-lg border-slate-200 bg-slate-50/50 font-bold text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Direct Walk-in">Walk-in</SelectItem>
                                                <SelectItem value="Facebook Ads">Facebook</SelectItem>
                                                <SelectItem value="Google Search">Google</SelectItem>
                                                <SelectItem value="Channel Partner">Partner</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                    
                    <div className="p-4 md:p-6 border-t border-slate-100 bg-slate-50/50 flex-shrink-0">
                        <Button onClick={handleAddLead} className="w-full h-12 bg-indigo-600 text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-indigo-100 shadow-xl hover:bg-indigo-700 transition-all">
                            Initialize Prospect
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* DETAILS DRAWER - Optimized for Mobile */}
            <Sheet open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
                <SheetContent side="right" className="w-full sm:max-w-[500px] p-0 flex flex-col h-full bg-white border-l shadow-2xl">
                    {selectedLead && (
                        <>
                            <VisuallyHidden.Root>
                                <SheetTitle>Lead Profile: {selectedLead.name}</SheetTitle>
                            </VisuallyHidden.Root>

                            <div className="p-4 md:p-6 border-b border-slate-100 bg-slate-50/80 flex-shrink-0">
                                <div className="flex justify-between items-start mb-4">
                                    <Badge className="bg-emerald-500 font-bold text-[9px] uppercase tracking-tighter h-5">{selectedLead.status}</Badge>
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{selectedLead.id}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 md:h-16 md:w-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xl md:text-2xl shadow-lg ring-4 ring-white flex-shrink-0">
                                        {selectedLead.name[0]}
                                    </div>
                                    <div className="flex flex-col text-left min-w-0">
                                        <h2 className="font-black text-slate-900 text-lg md:text-2xl tracking-tight leading-none mb-1 truncate">
                                            {selectedLead.name}
                                        </h2>
                                        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold truncate">
                                            <Phone className="h-3 w-3" /> {selectedLead.phone}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Tabs defaultValue="info" className="flex-1 flex flex-col min-h-0 m-0">
                                <TabsList className="w-full justify-start rounded-none border-b bg-white px-4 md:px-6 h-12 gap-4 md:gap-8 flex-shrink-0">
                                    <TabsTrigger value="info" className="data-[state=active]:border-b-2 data-[state=active]:text-indigo-600 border-indigo-600 rounded-none bg-transparent font-black text-[10px] uppercase tracking-widest p-0 h-full transition-none">Engagement</TabsTrigger>
                                    <TabsTrigger value="visit" className="data-[state=active]:border-b-2 data-[state=active]:text-indigo-600 border-indigo-600 rounded-none bg-transparent font-black text-[10px] uppercase tracking-widest p-0 h-full transition-none">Visit Logs</TabsTrigger>
                                </TabsList>

                                <ScrollArea className="flex-1">
                                    <TabsContent value="info" className="p-4 md:p-6 space-y-6 m-0 outline-none">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <InfoItem icon={Layout} label="Configuration" value={selectedLead.unitType} />
                                            <InfoItem icon={IndianRupee} label="Budget Range" value={selectedLead.budget} />
                                            <InfoItem icon={Share2} label="Lead Source" value={selectedLead.source} />
                                            <InfoItem icon={CalendarIcon} label="Creation Date" value={format(new Date(selectedLead.createdAt), 'dd MMM, yyyy')} />
                                        </div>

                                        <div className="space-y-3 pt-2">
                                            <div className="flex items-center gap-2">
                                                <MessageSquare className="h-3 w-3 text-slate-400" />
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block text-left">Outreach Hub</label>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <Button variant="outline" onClick={() => sendWhatsApp(selectedLead.phone, 'visit_done')} className="h-16 rounded-xl border-emerald-100 bg-emerald-50/30 text-emerald-700 font-black text-[9px] md:text-[10px] uppercase leading-tight hover:bg-emerald-50 text-center">Visit Done<br/><span className="text-[8px] opacity-60 font-medium lowercase">Send Pricing</span></Button>
                                                <Button variant="outline" onClick={() => sendWhatsApp(selectedLead.phone, 'visit_not_done')} className="h-16 rounded-xl border-rose-100 bg-rose-50/30 text-rose-700 font-black text-[9px] md:text-[10px] uppercase leading-tight hover:bg-rose-50 text-center">Missed Visit<br/><span className="text-[8px] opacity-60 font-medium lowercase">Send Location</span></Button>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-slate-100 text-left">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2">
                                                    <Info className="h-3 w-3 text-slate-400" />
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Internal Log</label>
                                                </div>
                                                <span className="text-[9px] font-bold text-slate-300">AUTO-SAVED</span>
                                            </div>
                                            <Textarea 
                                                value={remark}
                                                onChange={(e) => setRemark(e.target.value)}
                                                placeholder="Type your interaction notes here..." 
                                                className="min-h-[140px] rounded-xl border-slate-200 bg-slate-50/30 text-sm focus:bg-white transition-all shadow-inner" 
                                            />
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="visit" className="p-4 md:p-6 flex flex-col items-center m-0 outline-none pb-10">
                                        <div className="bg-slate-50 p-2 md:p-4 rounded-2xl w-full border border-slate-100 shadow-inner overflow-hidden">
                                            <Calendar mode="single" selected={visitDate} onSelect={setVisitDate} className="mx-auto scale-90 md:scale-100" />
                                        </div>
                                    </TabsContent>
                                </ScrollArea>
                            </Tabs>

                            <div className="p-4 md:p-6 border-t border-slate-100 bg-white flex-shrink-0 z-20">
                                <Button 
                                    onClick={() => {toast.success("Timeline Updated"); setRemark("")}} 
                                    className="w-full h-12 bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest rounded-xl shadow-lg active:scale-[0.98]"
                                >
                                    Update & Save Activity
                                </Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}

function FormInput({ label, placeholder, value, onChange, icon: Icon }: { label: string, placeholder: string, value: string, onChange: (v: string) => void, icon?: any }) {
    return (
        <div className="space-y-1.5 text-left group">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-tight ml-1 group-focus-within:text-indigo-600 transition-colors">{label}</label>
            <div className="relative">
                {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />}
                <Input 
                    placeholder={placeholder} 
                    value={value} 
                    onChange={(e) => onChange(e.target.value)} 
                    className={`h-11 border-slate-200 rounded-lg bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all ${Icon ? 'pl-10' : ''}`} 
                />
            </div>
        </div>
    )
}

function InfoItem({ icon: Icon, label, value }: { icon: any, label: string, value?: string }) {
    return (
        <div className="bg-slate-50/50 p-3 md:p-4 rounded-xl border border-slate-100 flex flex-col gap-1.5 text-left hover:bg-white hover:shadow-sm transition-all duration-200 group">
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">{label}</div>
            <div className="text-xs md:text-sm font-black text-slate-900 flex items-center gap-2 md:gap-2.5 min-w-0">
                <div className="p-1.5 bg-white rounded-md border border-slate-100 shadow-sm flex-shrink-0">
                    <Icon className="h-3 w-3 md:h-3.5 md:w-3.5 text-indigo-500" />
                </div>
                <span className="truncate">{value || '---'}</span>
            </div>
        </div>
    )
}