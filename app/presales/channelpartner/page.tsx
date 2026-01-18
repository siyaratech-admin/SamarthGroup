"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Header } from "@/components/erp/header"
import { StatusBadge } from "@/components/erp/status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
    Sheet, 
    SheetContent, 
    SheetHeader, 
    SheetTitle, 
    SheetDescription 
} from "@/components/ui/sheet"
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
    Trash2, 
    ShieldCheck, 
    ArrowUpRight, 
    UserPlus, 
    Building2, 
    PieChart, 
    IndianRupee, 
    Rocket, 
    Briefcase,
    ChevronRight
} from "lucide-react"

// --- Professional Dummy Data ---
const INITIAL_PARTNERS = [
    { id: "CP-901", name: "PropTiger Realty", rera: "PRM/KA/123", leads: 145, bookings: 12, status: "active", tier: "Platinum", revenue: 85000000 },
    { id: "CP-902", name: "Square Yards", rera: "PRM/KA/456", leads: 98, bookings: 5, status: "active", tier: "Gold", revenue: 32000000 },
    { id: "CP-903", name: "Anarock Group", rera: "PRM/KA/990", leads: 210, bookings: 18, status: "active", tier: "Platinum", revenue: 142000000 },
    { id: "CP-904", name: "360 Realtors", rera: "PRM/KA/221", leads: 67, bookings: 4, status: "pending", tier: "Silver", revenue: 21000000 },
];

const INITIAL_CAMPAIGNS = [
    { id: "CAM-01", title: "Luxury Sky-Villa Launch", type: "Digital Ads", leads: 342, budget: "₹8.5L", status: "active", roi: "4.2x" },
    { id: "CAM-02", title: "Broker Meetup: Hyatt Regency", type: "Event", leads: 56, budget: "₹4.0L", status: "completed", roi: "1.8x" },
    { id: "CAM-03", title: "Q1 Referral Bonanza", type: "Referral", leads: 128, budget: "₹2.2L", status: "active", roi: "5.1x" },
];

export default function ChannelManagement() {
    const [partners, setPartners] = useState(INITIAL_PARTNERS);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPartner, setSelectedPartner] = useState<any>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => { setIsMounted(true) }, []);

    // --- Logic Functions ---
    const filteredPartners = useMemo(() => {
        return partners.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            p.rera.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [partners, searchTerm]);

    const totalStats = useMemo(() => {
        const totalRev = partners.reduce((acc, p) => acc + p.revenue, 0);
        // Tiered logic: Platinum (2.5%), Gold (1.8%), Silver (1.2%)
        const payouts = partners.reduce((acc, p) => {
            const rate = p.tier === "Platinum" ? 0.025 : p.tier === "Gold" ? 0.018 : 0.012;
            return acc + (p.revenue * rate);
        }, 0);
        return { totalRev, payouts };
    }, [partners]);

    const handleExport = () => {
        toast.promise(new Promise((res) => setTimeout(res, 1500)), {
            loading: 'Generating CP Performance Audit...',
            success: 'Channel_Report_2026.xlsx ready',
            error: 'Export failed',
        });
    };

    if (!isMounted) return null;

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20">
            <Header title="Channel Management" subtitle="Pre-Sales > Partner Ecosystem" />

            <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-6 md:space-y-8">
                
                {/* Finance-Style Stats Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard icon={<Users className="w-5 h-5" />} label="Registered CP" value={partners.length.toString()} color="indigo" />
                    <StatCard icon={<Target className="w-5 h-5" />} label="Total Leads" value="1,842" color="emerald" />
                    <StatCard icon={<IndianRupee className="w-5 h-5" />} label="Est. Payouts" value={`₹${(totalStats.payouts / 100000).toFixed(1)}L`} color="amber" />
                    <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Avg. Conv Rate" value="9.2%" color="blue" />
                </div>

                {/* Sales-Style Action Bar */}
                <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 bg-white p-3 md:p-4 rounded-[24px] border border-slate-200 shadow-sm">
                    <div className="relative flex-1 lg:max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input 
                            placeholder="Search Agency or RERA..." 
                            className="pl-11 h-12 bg-slate-50 border-none rounded-xl focus-visible:ring-2 ring-indigo-500/20 w-full font-medium"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex items-center gap-2 md:gap-3">
                        <Button variant="outline" onClick={handleExport} className="flex-1 md:flex-none h-12 border-slate-200 font-black text-[10px] uppercase tracking-widest px-6 rounded-xl hover:bg-slate-50">
                            <Download className="mr-2 h-4 w-4" /> Export
                        </Button>
                        <AddPartnerModal onAdd={(p: any) => setPartners([p, ...partners])} />
                    </div>
                </div>

                <Tabs defaultValue="directory" className="w-full">
                    <TabsList className="bg-slate-200/50 p-1 mb-6 flex w-full md:w-fit overflow-x-auto rounded-xl">
                        <TabsTrigger value="directory" className="flex-1 md:flex-none px-8 font-black text-[10px] uppercase rounded-lg">Directory</TabsTrigger>
                        <TabsTrigger value="campaigns" className="flex-1 md:flex-none px-8 font-black text-[10px] uppercase rounded-lg">Campaign Performance</TabsTrigger>
                    </TabsList>

                    <TabsContent value="directory">
                        <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left min-w-[900px]">
                                    <thead className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <tr>
                                            <th className="px-8 py-6">Agency Details</th>
                                            <th className="px-8 py-6">RERA ID</th>
                                            <th className="px-8 py-6">Tier</th>
                                            <th className="px-8 py-6 text-center">Bookings</th>
                                            <th className="px-8 py-6">Status</th>
                                            <th className="px-8 py-6 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filteredPartners.map((p) => (
                                            <tr 
                                                key={p.id} 
                                                className="hover:bg-indigo-50/30 transition-colors group cursor-pointer"
                                                onClick={() => setSelectedPartner(p)}
                                            >
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs shrink-0">
                                                            {p.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-slate-900 leading-none mb-1">{p.name}</p>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{p.id}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 font-mono text-[11px] font-bold text-slate-500">{p.rera}</td>
                                                <td className="px-8 py-5">
                                                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                                        p.tier === 'Platinum' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                        {p.tier}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-center font-black text-indigo-600">{p.bookings}</td>
                                                <td className="px-8 py-5"><StatusBadge status={p.status} /></td>
                                                <td className="px-8 py-5 text-right" onClick={(e) => e.stopPropagation()}>
                                                    <PartnerActions partner={p} onDelete={(id) => setPartners(partners.filter(x => x.id !== id))} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="campaigns" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {INITIAL_CAMPAIGNS.map(c => <CampaignCard key={c.id} data={c} />)}
                    </TabsContent>
                </Tabs>
            </div>

            {/* PARTNER DOSSIER DRAWER */}
            <Sheet open={!!selectedPartner} onOpenChange={() => setSelectedPartner(null)}>
                <SheetContent className="w-full sm:max-w-[450px] p-0 border-none bg-white flex flex-col">
                    {selectedPartner && (
                        <>
                            <div className="bg-slate-900 p-8 text-white">
                                <SheetHeader className="text-left">
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="h-12 w-12 rounded-xl bg-indigo-500 flex items-center justify-center font-black text-xl">
                                            {selectedPartner.name.charAt(0)}
                                        </div>
                                        <StatusBadge status={selectedPartner.status} />
                                    </div>
                                    <SheetTitle className="text-2xl font-black text-white uppercase">{selectedPartner.name}</SheetTitle>
                                    <SheetDescription className="text-indigo-300 font-bold text-[10px] uppercase tracking-widest">
                                        {selectedPartner.id} • {selectedPartner.tier} Tier Partner
                                    </SheetDescription>
                                </SheetHeader>
                            </div>

                            <ScrollArea className="flex-1 p-6">
                                <div className="space-y-8">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Financial Metrics</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                <p className="text-[9px] font-bold text-slate-500 uppercase">Gross Revenue</p>
                                                <p className="text-lg font-black text-slate-900">₹{(selectedPartner.revenue / 10000000).toFixed(1)} Cr</p>
                                            </div>
                                            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                                                <p className="text-[9px] font-bold text-emerald-600 uppercase">Commission</p>
                                                <p className="text-lg font-black text-emerald-700">₹{((selectedPartner.revenue * 0.02) / 100000).toFixed(1)}L</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lead Pipeline</p>
                                        <div className="space-y-4">
                                            <FunnelStep label="Inbound Leads" value={selectedPartner.leads} total={selectedPartner.leads} color="bg-indigo-500" />
                                            <FunnelStep label="Site Visits" value={Math.floor(selectedPartner.leads * 0.4)} total={selectedPartner.leads} color="bg-amber-500" />
                                            <FunnelStep label="Final Closures" value={selectedPartner.bookings} total={selectedPartner.leads} color="bg-emerald-500" />
                                        </div>
                                    </div>
                                </div>
                            </ScrollArea>

                            <div className="p-6 border-t bg-slate-50">
                                <Button className="w-full h-12 bg-indigo-600 font-black uppercase tracking-widest rounded-xl">
                                    Generate Invoice <ChevronRight className="ml-2 w-4 h-4" />
                                </Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}

// --- HELPER COMPONENTS ---

function StatCard({ icon, label, value, color }: { icon: any, label: string, value: string, color: string }) {
    const variants: any = {
        indigo: "border-indigo-100 text-indigo-600 bg-indigo-50/50",
        emerald: "border-emerald-100 text-emerald-600 bg-emerald-50/50",
        amber: "border-amber-100 text-amber-600 bg-amber-50/50",
        blue: "border-blue-100 text-blue-600 bg-blue-50/50",
    };
    return (
        <div className={`bg-white p-5 rounded-[20px] border flex items-center gap-4 transition-transform hover:scale-[1.02] ${variants[color]}`}>
            <div className="h-10 w-10 rounded-xl bg-white border flex items-center justify-center shadow-sm shrink-0">{icon}</div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
                <h3 className="text-xl font-black text-slate-900 leading-none mt-1">{value}</h3>
            </div>
        </div>
    )
}

function FunnelStep({ label, value, total, color }: { label: string, value: number, total: number, color: string }) {
    const percentage = (value / total) * 100;
    return (
        <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-bold">
                <span className="text-slate-500 uppercase tracking-tighter">{label}</span>
                <span className="text-slate-900">{value}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${percentage}%` }} />
            </div>
        </div>
    )
}

function CampaignCard({ data }: { data: any }) {
    return (
        <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm hover:border-indigo-500 transition-all flex flex-col h-full">
            <div className="flex justify-between mb-6">
                <StatusBadge status={data.status} />
                <Rocket className="w-4 h-4 text-slate-300" />
            </div>
            <h4 className="font-black text-slate-900 text-lg uppercase tracking-tighter mb-1">{data.title}</h4>
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-6">{data.type}</p>
            <div className="mt-auto grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Leads</p>
                    <p className="text-xl font-black text-slate-900">{data.leads}</p>
                </div>
                <div className="text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ROI</p>
                    <p className="text-xl font-black text-emerald-600">{data.roi}</p>
                </div>
            </div>
        </div>
    )
}

function AddPartnerModal({ onAdd }: { onAdd: (p: any) => void }) {
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="flex-1 md:flex-none h-12 bg-slate-900 hover:bg-black text-[10px] font-black uppercase tracking-widest px-8 rounded-xl">
                    <UserPlus className="mr-2 h-4 w-4" /> Add Partner
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none rounded-[24px]">
                <div className="bg-slate-900 p-8 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black uppercase">Onboard Agency</DialogTitle>
                        <DialogDescription className="text-slate-400 font-medium">Add a new CP to the ecosystem</DialogDescription>
                    </DialogHeader>
                </div>
                <div className="p-8 space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-400">Legal Agency Name</label>
                        <Input placeholder="Enter name" className="bg-slate-50 border-none h-12 rounded-xl" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-slate-400">RERA ID</label>
                            <Input placeholder="PRM/KA/..." className="bg-slate-50 border-none h-12 rounded-xl" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-slate-400">Tier</label>
                            <Input placeholder="Silver/Gold/Platinum" className="bg-slate-50 border-none h-12 rounded-xl" />
                        </div>
                    </div>
                    <Button 
                        onClick={() => {
                            onAdd({ id: "CP-NEW", name: "New Agency", rera: "PENDING", leads: 0, bookings: 0, status: "pending", tier: "Silver", revenue: 0 });
                            setOpen(false);
                            toast.success("Onboarding Initiated");
                        }}
                        className="w-full h-12 bg-indigo-600 font-black uppercase tracking-widest rounded-xl mt-4"
                    >
                        Register Partner
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function PartnerActions({ partner, onDelete }: { partner: any, onDelete: (id: string) => void }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400"><MoreHorizontal size={18}/></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 p-2 rounded-xl shadow-xl">
                <DropdownMenuLabel className="text-[10px] font-black uppercase text-slate-400 px-3 py-2">Management</DropdownMenuLabel>
                <DropdownMenuItem className="rounded-lg py-2 font-bold text-xs cursor-pointer"><Eye className="mr-2 h-4 w-4" /> View Full Dossier</DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg py-2 font-bold text-xs cursor-pointer"><ShieldCheck className="mr-2 h-4 w-4" /> Compliance Audit</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onDelete(partner.id)} className="rounded-lg py-2 font-bold text-xs text-rose-600 cursor-pointer"><Trash2 className="mr-2 h-4 w-4" /> Terminate</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}