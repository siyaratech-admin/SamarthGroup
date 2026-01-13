"use client"

import React, { useState } from "react"
import { Header } from "@/components/erp/header"
import { StatusBadge } from "@/components/erp/status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { 
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Users, 
    TrendingUp, 
    Plus, 
    Search,
    MoreHorizontal,
    Target,
    HandCoins,
    Download,
    Eye,
    Edit3,
    Trash2,
    CheckCircle,
    UserPlus,
    Building2,
    ShieldCheck,
    ArrowUpRight
} from "lucide-react"

// --- Professional Dummy Data ---
const INITIAL_PARTNERS = [
    { id: "CP-901", name: "PropTiger Realty", rera: "PRM/KA/123", leads: 145, bookings: 12, status: "active", tier: "Platinum" },
    { id: "CP-902", name: "Square Yards", rera: "PRM/KA/456", leads: 98, bookings: 5, status: "active", tier: "Gold" },
    { id: "CP-903", name: "Anarock Group", rera: "PRM/KA/990", leads: 210, bookings: 18, status: "active", tier: "Platinum" },
    { id: "CP-904", name: "360 Realtors", rera: "PRM/KA/221", leads: 67, bookings: 4, status: "pending", tier: "Silver" },
];

const INITIAL_CAMPAIGNS = [
    { id: "CAM-01", title: "Luxury Sky-Villa Launch", type: "Digital Ads", leads: 342, budget: "₹8.5L", status: "active" },
    { id: "CAM-02", title: "Broker Meetup: Hyatt Regency", type: "Event", leads: 56, budget: "₹4.0L", status: "completed" },
    { id: "CAM-03", title: "Q1 Referral Bonanza", type: "Referral", leads: 128, budget: "₹2.2L", status: "active" },
    { id: "CAM-04", title: "Facebook First-Time Buyer", type: "Social", leads: 890, budget: "₹5.0L", status: "active" },
];

const DUMMY_LEADS = [
    { name: "Rahul Deshmukh", phone: "+91 98XXX XXX10", status: "Hot Lead" },
    { name: "Priya Sharma", phone: "+91 99XXX XXX22", status: "Negotiation" },
    { name: "Kevin Peter", phone: "+91 88XXX XXX44", status: "New" },
];

export default function ChannelManagement() {
    const [partners, setPartners] = useState(INITIAL_PARTNERS);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredPartners = partners.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    // 1. Export Report Function
    const handleExport = () => {
        toast.promise(new Promise((res) => setTimeout(res, 1500)), {
            loading: 'Generating encrypted report...',
            success: 'Report_2026_CP.xlsx downloaded successfully',
            error: 'Export failed',
        });
    };

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            <Header title="Channel Management" subtitle="Pre-Sales > Partner Ecosystem" />

            <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8">
                
                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard icon={<Users className="w-5 h-5"/>} label="Registered CP" value={partners.length.toString()} color="indigo" />
                    <StatCard icon={<Target className="w-5 h-5"/>} label="Total Leads" value="1,842" color="emerald" />
                    <StatCard icon={<HandCoins className="w-5 h-5"/>} label="Payouts Due" value="₹4.2L" color="amber" />
                    <StatCard icon={<TrendingUp className="w-5 h-5"/>} label="Conv. Rate" value="9.2%" color="blue" />
                </div>

                {/* Main Action Bar */}
                <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="relative w-full lg:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input 
                            placeholder="Search by agency name or RERA..." 
                            className="pl-11 h-11 bg-slate-50 border-none focus-visible:ring-2 ring-indigo-500/20"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <Button variant="outline" onClick={handleExport} className="flex-1 lg:flex-none h-11 border-slate-200 font-bold text-xs uppercase tracking-widest hover:bg-slate-50">
                            <Download className="mr-2 h-4 w-4" /> Export
                        </Button>
                        <AddPartnerModal onAdd={(p: any) => setPartners([p, ...partners])} />
                    </div>
                </div>

                <Tabs defaultValue="directory" className="w-full">
                    <TabsList className="bg-slate-200/50 p-1 mb-8">
                        <TabsTrigger value="directory" className="px-10 font-bold text-xs uppercase">Directory</TabsTrigger>
                        <TabsTrigger value="campaigns" className="px-10 font-bold text-xs uppercase">Campaigns</TabsTrigger>
                    </TabsList>

                    {/* PARTNER DIRECTORY TAB */}
                    <TabsContent value="directory">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">
                                        <tr>
                                            <th className="px-8 py-5">Agency Details</th>
                                            <th className="px-8 py-5">RERA Registration</th>
                                            <th className="px-8 py-5 text-center">Bookings</th>
                                            <th className="px-8 py-5">Status</th>
                                            <th className="px-8 py-5 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 text-[14px]">
                                        {filteredPartners.map((p) => (
                                            <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-8 py-5 font-bold text-slate-900">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] uppercase">{p.name.charAt(0)}</div>
                                                        {p.name}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 font-mono text-[12px] text-slate-500">{p.rera}</td>
                                                <td className="px-8 py-5 text-center font-black text-indigo-600">
                                                    <span className="bg-indigo-50 px-3 py-1 rounded-full">{p.bookings}</span>
                                                </td>
                                                <td className="px-8 py-5"><StatusBadge status={p.status} /></td>
                                                <td className="px-8 py-5 text-right">
                                                    <PartnerActions partner={p} onDelete={(id: string) => setPartners(partners.filter(x => x.id !== id))} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </TabsContent>

                    {/* CAMPAIGNS TAB */}
                    <TabsContent value="campaigns" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        {INITIAL_CAMPAIGNS.map(c => (
                            <CampaignCard key={c.id} data={c} />
                        ))}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

// --- SUB-COMPONENT: CAMPAIGN CARD ---
function CampaignCard({ data }: { data: any }) {
    return (
        <div className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/5 transition-all flex flex-col h-full">
            <div className="flex justify-between items-start mb-6">
                <StatusBadge status={data.status} />
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">{data.id}</span>
            </div>
            
            <h4 className="font-bold text-slate-900 text-lg mb-1 leading-tight group-hover:text-indigo-600 transition-colors">{data.title}</h4>
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-6">{data.type}</p>
            
            <div className="mt-auto space-y-4 pt-6 border-t border-slate-50">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Leads</p>
                        <p className="text-xl font-black text-slate-900 leading-none">{data.leads}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Budget</p>
                        <p className="text-sm font-bold text-slate-600 leading-none">{data.budget}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="w-full h-9 bg-slate-900 hover:bg-indigo-600 text-[10px] font-bold uppercase tracking-wider">Leads</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-xl">Leads for {data.title}</DialogTitle>
                                <DialogDescription>Real-time lead data captured from this campaign</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-3 py-4">
                                {DUMMY_LEADS.map((l, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                                        <div>
                                            <p className="font-bold text-sm">{l.name}</p>
                                            <p className="text-[10px] text-slate-500 font-mono">{l.phone}</p>
                                        </div>
                                        <span className="text-[10px] font-black uppercase text-indigo-600 px-2 py-1 bg-white border border-indigo-100 rounded-md">{l.status}</span>
                                    </div>
                                ))}
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Button variant="outline" className="w-full h-9 text-[10px] font-bold uppercase tracking-wider border-slate-200" onClick={() => toast.info("Campaign Editor Opened")}>
                        <Edit3 className="mr-2 h-3 w-3" /> Edit
                    </Button>
                </div>
            </div>
        </div>
    )
}

// --- SUB-COMPONENT: PARTNER ACTIONS ---
function PartnerActions({ partner, onDelete }: { partner: any, onDelete: (id: string) => void }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"><MoreHorizontal size={18}/></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl shadow-xl border-slate-200">
                <DropdownMenuLabel className="text-[10px] font-black uppercase text-slate-400 px-3 py-2">Partner Management</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => toast.info(`Accessing ${partner.name} Vault`)} className="rounded-lg py-2.5 cursor-pointer">
                    <Eye className="mr-3 h-4 w-4 text-slate-400" /> <span className="text-sm font-semibold">View Analytics</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.success("RERA Compliance Updated")} className="rounded-lg py-2.5 cursor-pointer">
                    <ShieldCheck className="mr-3 h-4 w-4 text-slate-400" /> <span className="text-sm font-semibold">Audit Compliance</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1 bg-slate-100" />
                <DropdownMenuItem onClick={() => onDelete(partner.id)} className="rounded-lg py-2.5 cursor-pointer text-rose-600 focus:bg-rose-50 focus:text-rose-600">
                    <Trash2 className="mr-3 h-4 w-4" /> <span className="text-sm font-semibold">Terminate Access</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

// --- SUB-COMPONENT: ADD PARTNER MODAL ---
function AddPartnerModal({ onAdd }: { onAdd: (p: any) => void }) {
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="flex-1 lg:flex-none h-11 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold uppercase tracking-widest px-6 shadow-lg shadow-indigo-200">
                    <UserPlus className="mr-2 h-4 w-4" /> Add Partner
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none rounded-2xl">
                <div className="bg-indigo-600 p-8 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black flex items-center gap-2">
                            <Building2 className="w-6 h-6" /> Partner Onboarding
                        </DialogTitle>
                        <DialogDescription className="text-indigo-100/70 text-sm">
                            Register a new Channel Partner into the ecosystem.
                        </DialogDescription>
                    </DialogHeader>
                </div>
                <div className="p-8 space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Legal Agency Name</label>
                        <Input placeholder="e.g. Paramount Real Estate" className="h-12 bg-slate-50 border-none focus-visible:ring-2 ring-indigo-500/20" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">RERA ID</label>
                            <Input placeholder="PRM/KA/..." className="h-12 bg-slate-50 border-none" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Initial Tier</label>
                            <Input placeholder="Silver" className="h-12 bg-slate-50 border-none" />
                        </div>
                    </div>
                    <Button 
                        onClick={() => {
                            onAdd({ id: Date.now().toString(), name: "Newly Added Agency", rera: "PRM/KA/PENDING", leads: 0, bookings: 0, status: "pending", tier: "Silver" });
                            setOpen(false);
                        }} 
                        className="w-full h-12 bg-indigo-600 font-bold uppercase tracking-widest shadow-lg shadow-indigo-100"
                    >
                        Register Partner
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// --- UI HELPER: STAT CARD ---
function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) {
    const colors: Record<string, string> = { 
        indigo: "text-indigo-600 bg-indigo-50", 
        emerald: "text-emerald-600 bg-emerald-50", 
        amber: "text-amber-600 bg-amber-50", 
        blue: "text-blue-600 bg-blue-50" 
    };
    return (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${colors[color]}`}>{icon}</div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1.5 leading-none">{label}</p>
                <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-black text-slate-900 leading-none">{value}</h3>
                    <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                </div>
            </div>
        </div>
    )
}