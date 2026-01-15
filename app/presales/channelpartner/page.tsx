"use client"

import React, { useState, useEffect } from "react"
import { Header } from "@/components/erp/header"
import { StatusBadge } from "@/components/erp/status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
    Search,
    MoreHorizontal,
    Target,
    HandCoins,
    Download,
    Eye,
    Edit3,
    Trash2,
    ShieldCheck,
    ArrowUpRight,
    UserPlus,
    Building2
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

export default function ChannelManagement() {
    const [partners, setPartners] = useState(INITIAL_PARTNERS);
    const [searchTerm, setSearchTerm] = useState("");
    const [isMounted, setIsMounted] = useState(false);

    // Fix hydration mismatch error from your screenshot
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    const filteredPartners = partners.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

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
                
                {/* Stats Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard icon={<Users className="w-5 h-5"/>} label="Registered CP" value={partners.length.toString()} color="indigo" />
                    <StatCard icon={<Target className="w-5 h-5"/>} label="Total Leads" value="1,842" color="emerald" />
                    <StatCard icon={<HandCoins className="w-5 h-5"/>} label="Payouts Due" value="₹4.2L" color="amber" />
                    <StatCard icon={<TrendingUp className="w-5 h-5"/>} label="Conv. Rate" value="9.2%" color="blue" />
                </div>

                {/* Fixed Action Bar - Handling responsiveness for Add Partner Button */}
                <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="relative flex-1 lg:max-w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input 
                            placeholder="Search agency or RERA..." 
                            className="pl-11 h-11 bg-slate-50 border-none focus-visible:ring-2 ring-indigo-500/20 w-full"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <Button 
                            variant="outline" 
                            onClick={handleExport} 
                            className="flex-1 md:flex-none h-11 border-slate-200 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50"
                        >
                            <Download className="mr-2 h-4 w-4" /> Export
                        </Button>
                        
                        {/* Add Partner Trigger */}
                        <AddPartnerModal onAdd={(p: any) => setPartners([p, ...partners])} />
                    </div>
                </div>

                <Tabs defaultValue="directory" className="w-full">
                    <TabsList className="bg-slate-200/50 p-1 mb-6 flex w-full md:w-fit overflow-x-auto">
                        <TabsTrigger value="directory" className="flex-1 md:flex-none px-8 font-bold text-xs uppercase">Directory</TabsTrigger>
                        <TabsTrigger value="campaigns" className="flex-1 md:flex-none px-8 font-bold text-xs uppercase">Campaigns</TabsTrigger>
                    </TabsList>

                    <TabsContent value="directory">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left min-w-[800px]">
                                    <thead className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">
                                        <tr>
                                            <th className="px-8 py-5">Agency</th>
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
                                                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] uppercase shrink-0">{p.name.charAt(0)}</div>
                                                        <span className="truncate max-w-[200px]">{p.name}</span>
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

                    <TabsContent value="campaigns" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                        {INITIAL_CAMPAIGNS.map(c => (
                            <CampaignCard key={c.id} data={c} />
                        ))}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

// Modal Component - Optimized for Mobile Viewport and Hydration
function AddPartnerModal({ onAdd }: { onAdd: (p: any) => void }) {
    const [open, setOpen] = useState(false);
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {/* Full responsiveness: Expands to fill space on tiny screens, compact on desktop */}
                <Button className="flex-1 md:flex-none h-11 bg-indigo-600 hover:bg-indigo-700 text-[10px] md:text-xs font-bold uppercase tracking-widest px-6 shadow-lg shadow-indigo-200">
                    <UserPlus className="mr-2 h-4 w-4 shrink-0" /> Add Partner
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none rounded-2xl flex flex-col max-h-[90vh] w-[95vw]">
                <div className="bg-indigo-600 p-6 md:p-8 text-white shrink-0">
                    <DialogHeader>
                        <DialogTitle className="text-xl md:text-2xl font-black flex items-center gap-2">
                            <Building2 className="w-6 h-6" /> Partner Onboarding
                        </DialogTitle>
                        <DialogDescription className="text-indigo-100/70 text-sm">
                            Add a new Channel Partner to your ecosystem.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <ScrollArea className="flex-1 overflow-y-auto px-6 md:px-8 py-6">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400">Agency Name</label>
                            <Input placeholder="Enter legal entity name" className="h-12 bg-slate-50 border-none" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400">RERA ID</label>
                                <Input placeholder="PRM/..." className="h-12 bg-slate-50 border-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400">Tier</label>
                                <Input placeholder="Silver/Gold" className="h-12 bg-slate-50 border-none" />
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <div className="p-6 md:p-8 bg-white border-t border-slate-100 shrink-0">
                    <Button 
                        onClick={() => {
                            onAdd({ id: `CP-${Math.floor(Math.random() * 900) + 100}`, name: "New Agency", rera: "PRM/KA/PENDING", leads: 0, bookings: 0, status: "pending", tier: "Silver" });
                            setOpen(false);
                            toast.success("Partner created successfully");
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

// Stat Card Sub-component
function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) {
    const colors: Record<string, string> = { 
        indigo: "text-indigo-600 bg-indigo-50", 
        emerald: "text-emerald-600 bg-emerald-50", 
        amber: "text-amber-600 bg-amber-50", 
        blue: "text-blue-600 bg-blue-50" 
    };
    return (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${colors[color]}`}>{icon}</div>
            <div className="min-w-0">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 truncate">{label}</p>
                <div className="flex items-center gap-2">
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-none truncate">{value}</h3>
                    <ArrowUpRight className="w-3 h-3 text-emerald-500 shrink-0" />
                </div>
            </div>
        </div>
    )
}

function CampaignCard({ data }: { data: any }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full hover:border-indigo-500 transition-all">
            <div className="flex justify-between items-start mb-6">
                <StatusBadge status={data.status} />
                <span className="text-[10px] font-bold text-slate-300 uppercase">{data.id}</span>
            </div>
            <h4 className="font-bold text-slate-900 text-lg mb-1">{data.title}</h4>
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-6">{data.type}</p>
            <div className="mt-auto pt-6 border-t border-slate-50 flex justify-between">
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Leads</p>
                    <p className="text-xl font-black text-slate-900">{data.leads}</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Budget</p>
                    <p className="text-sm font-bold text-slate-600">{data.budget}</p>
                </div>
            </div>
        </div>
    )
}

function PartnerActions({ partner, onDelete }: { partner: any, onDelete: (id: string) => void }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600"><MoreHorizontal size={18}/></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 p-2 rounded-xl shadow-xl">
                <DropdownMenuLabel className="text-[10px] font-black uppercase text-slate-400 px-3 py-2">Management</DropdownMenuLabel>
                <DropdownMenuItem className="rounded-lg py-2 cursor-pointer font-semibold"><Eye className="mr-3 h-4 w-4" /> View Details</DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg py-2 cursor-pointer font-semibold"><ShieldCheck className="mr-3 h-4 w-4" /> Compliance</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onDelete(partner.id)} className="rounded-lg py-2 cursor-pointer text-rose-600 focus:bg-rose-50 font-semibold"><Trash2 className="mr-3 h-4 w-4" /> Terminate</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}