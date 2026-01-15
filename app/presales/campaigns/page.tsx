"use client"

import React, { useState } from "react"
import { Header } from "@/components/erp/header"
import { DataTable } from "@/components/erp/data-table"
import { Button } from "@/components/ui/button"
import { 
    Plus, 
    ChevronRight, 
    Target, 
    TrendingUp, 
    Users, 
    IndianRupee, 
    PieChart,
    MousePointer2,
    ShieldCheck,
    AlertCircle,
    Zap,
    Loader2,
    SearchCheck,
    Calendar,
    Globe,
    Layers
} from "lucide-react"
import { 
    Sheet, 
    SheetContent, 
    SheetHeader, 
    SheetTitle, 
    SheetDescription 
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"

const dummyCampaigns = [
    { id: "CMP-001", name: "Summer Luxury Villas Launch", type: "Social Media", channel: "Meta Ads", status: "Active", spend: 450000, leads: 124, conv: "12%", roi: 320, quality: 85, demandsRaised: 14 },
    { id: "CMP-002", name: "Pune Metro Smart Homes", type: "Search", channel: "Google Ads", status: "Paused", spend: 125000, leads: 56, conv: "8%", roi: 180, quality: 42, demandsRaised: 3 },
    { id: "CMP-003", name: "Weekend Getaway Plots", type: "Email", channel: "Mailchimp", status: "Completed", spend: 35000, leads: 210, conv: "15%", roi: 540, quality: 92, demandsRaised: 32 },
    { id: "CMP-004", name: "NRI Investment Meetup", type: "Direct", channel: "Webinar", status: "Scheduled", spend: 85000, leads: 0, conv: "0%", roi: 0, quality: 0, demandsRaised: 0 },
    { id: "CMP-005", name: "Retirement Homes - Kerala", type: "Offline", channel: "Newspaper", status: "Active", spend: 320000, leads: 89, conv: "5%", roi: 210, quality: 68, demandsRaised: 8 },
]

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount)
}

export default function CampaignsPage() {
    const [allCampaigns, setAllCampaigns] = useState(dummyCampaigns)
    const [selectedCampaign, setSelectedCampaign] = useState<typeof dummyCampaigns[0] | null>(null)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isAuditing, setIsAuditing] = useState(false)

    const handleAuditQuality = () => {
        if (!selectedCampaign) return;
        setIsAuditing(true);
        setTimeout(() => {
            const auditBoost = Math.floor(Math.random() * 8) + 2;
            const newQuality = Math.min(selectedCampaign.quality + auditBoost, 100);
            const updated = { ...selectedCampaign, quality: newQuality };
            setAllCampaigns(prev => prev.map(c => c.id === selectedCampaign.id ? updated : c));
            setSelectedCampaign(updated);
            setIsAuditing(false);
            toast.success("Audit Complete", {
                description: `Quality improved to ${newQuality}%`,
                icon: <SearchCheck className="h-4 w-4 text-emerald-500" />
            });
        }, 2000);
    }

    const handleScaleBudget = () => {
        if (!selectedCampaign) return;
        const newSpend = selectedCampaign.spend + 50000;
        const updated = { ...selectedCampaign, spend: newSpend };
        setAllCampaigns(prev => prev.map(c => c.id === selectedCampaign.id ? updated : c));
        setSelectedCampaign(updated);
        toast.info("Budget Scaled", {
            description: `Added ₹50,000 to campaign.`,
            icon: <Zap className="h-4 w-4 text-amber-500" />
        });
    }

    const campaignColumns = [
        { 
            key: "name", 
            header: "CAMPAIGN", 
            render: (item: typeof dummyCampaigns[0]) => (
                <div className="flex items-center gap-2 md:gap-3 py-1">
                    <div className="h-8 w-8 md:h-9 md:w-9 rounded-xl bg-[#F0F5FF] text-[#4F46E5] flex items-center justify-center shrink-0">
                        <Target className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="font-bold text-[#1E293B] text-xs md:text-sm truncate leading-tight">{item.name}</span>
                        <span className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-tight">{item.channel}</span>
                    </div>
                </div>
            ) 
        },
        { 
            key: "status", 
            header: "STATUS", 
            className: "hidden sm:table-cell",
            render: (item: typeof dummyCampaigns[0]) => (
                <span className={`px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-bold uppercase border whitespace-nowrap ${
                    item.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                    item.status === 'Paused' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                    'bg-slate-50 text-slate-600 border-slate-100'
                }`}>
                    {item.status}
                </span>
            ) 
        },
        { 
            key: "spend", 
            header: "INVESTMENT", 
            render: (item: typeof dummyCampaigns[0]) => (
                <span className="text-[#1E293B] font-bold text-xs md:text-sm whitespace-nowrap">
                    {formatCurrency(item.spend)}
                </span>
            )
        },
        { 
            key: "quality", 
            header: "QUALITY", 
            className: "hidden md:table-cell",
            render: (item: typeof dummyCampaigns[0]) => (
                <div className="flex items-center gap-2">
                    <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                            className={`h-full rounded-full transition-all duration-700 ${item.quality > 70 ? 'bg-emerald-500' : item.quality > 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                            style={{ width: `${item.quality}%` }}
                        />
                    </div>
                    <span className="text-[11px] font-bold text-slate-600">{item.quality}%</span>
                </div>
            ) 
        },
        { key: "action", header: "", render: () => <ChevronRight className="h-4 w-4 text-slate-300" /> }
    ]

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Header title="Campaigns" subtitle="Track marketing spend vs conversion" />

            <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-6 md:py-8 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div className="space-y-1">
                        <h2 className="text-lg md:text-xl font-bold text-[#1E293B] tracking-tight">Marketing Performance</h2>
                        <p className="text-[11px] md:text-xs text-slate-500 font-medium">Analyze which channels drive paying customers</p>
                    </div>
                    <Button 
                        onClick={() => setIsCreateOpen(true)} 
                        className="w-full sm:w-auto bg-[#4F46E5] hover:bg-[#4338CA] text-white h-10 md:h-11 px-6 rounded-xl font-bold text-xs md:text-sm shadow-sm transition-all active:scale-95"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Campaign
                    </Button>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden overflow-x-auto">
                    <DataTable 
                        columns={campaignColumns} 
                        data={allCampaigns} 
                        onRowClick={(row) => setSelectedCampaign(row as typeof dummyCampaigns[0])}
                    />
                </div>
            </div>

            {/* CREATE CAMPAIGN DRAWER - BUTTON VISIBILITY FIXED */}
            <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <SheetContent side="right" className="w-full sm:max-w-[500px] p-0 flex flex-col bg-white border-l-0 h-full">
                    <SheetHeader className="p-6 md:p-8 border-b border-slate-50 bg-slate-50/30 shrink-0 text-left">
                        <div className="flex items-center gap-2 mb-2">
                            <Layers className="h-4 w-4 text-indigo-600" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Campaign Builder</span>
                        </div>
                        <SheetTitle className="text-xl md:text-2xl font-black text-slate-900 leading-tight">Configure New Campaign</SheetTitle>
                        <SheetDescription className="font-medium text-xs md:text-sm text-slate-500">Enter details to launch your marketing activity</SheetDescription>
                    </SheetHeader>
                    
                    <ScrollArea className="flex-1 overflow-y-auto">
                        <div className="p-6 md:p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Campaign Name</label>
                                <Input placeholder="e.g. Q1 Premium Luxury Villas" className="h-11 md:h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white text-sm" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform</label>
                                    <Select>
                                        <SelectTrigger className="h-11 md:h-12 border-slate-200 rounded-xl bg-slate-50/50 text-sm">
                                            <SelectValue placeholder="Select..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="meta">Meta (FB & IG)</SelectItem>
                                            <SelectItem value="google">Google Search</SelectItem>
                                            <SelectItem value="linkedin">LinkedIn Ads</SelectItem>
                                            <SelectItem value="offline">Offline / Print</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Initial Budget</label>
                                    <div className="relative">
                                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                        <Input placeholder="50,000" className="h-11 md:h-12 pl-9 rounded-xl border-slate-200 bg-slate-50/50 text-sm" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Audience</label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input placeholder="e.g. NRIs, Tech Professionals" className="h-11 md:h-12 pl-10 rounded-xl border-slate-200 bg-slate-50/50 text-sm" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tentative End Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input type="date" className="h-11 md:h-12 pl-10 rounded-xl border-slate-200 bg-slate-50/50 text-sm" />
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex gap-3">
                                <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
                                <p className="text-[11px] text-amber-700 leading-relaxed font-medium">
                                    <strong>Note:</strong> Quality Audit will be available 24 hours after campaign deployment.
                                </p>
                            </div>
                        </div>
                    </ScrollArea>

                    {/* STICKY FOOTER */}
                    <div className="p-6 md:p-8 border-t border-slate-50 bg-white shrink-0 mt-auto">
                        <Button 
                            onClick={() => { toast.success("Campaign Scheduled!"); setIsCreateOpen(false); }} 
                            className="w-full h-12 md:h-14 bg-[#4F46E5] text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:scale-[1.01] active:scale-95 transition-all text-sm"
                        >
                            Launch Campaign
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* INSIGHTS DRAWER - BUTTON VISIBILITY FIXED */}
            <Sheet open={!!selectedCampaign} onOpenChange={() => setSelectedCampaign(null)}>
                <SheetContent className="w-full sm:max-w-[500px] p-0 flex flex-col bg-white overflow-hidden border-l-0 h-full">
                    {isAuditing && (
                        <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center">
                            <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
                            <h4 className="text-lg font-bold text-slate-900">Auditing Data Quality...</h4>
                        </div>
                    )}

                    <SheetHeader className="p-6 border-b border-slate-50 text-left bg-slate-50/30 shrink-0">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Live Performance</span>
                        </div>
                        <SheetTitle className="text-lg md:text-xl font-bold text-slate-900 truncate">{selectedCampaign?.name}</SheetTitle>
                    </SheetHeader>
                    
                    {selectedCampaign && (
                        <>
                            <ScrollArea className="flex-1 overflow-y-auto">
                                <div className="p-4 md:p-6 space-y-6 md:space-y-8">
                                    <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
                                        <ShieldCheck className="absolute -right-4 -bottom-4 h-24 w-24 md:h-32 md:w-32 text-white/10 rotate-12" />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Payment Conversion Intent</p>
                                        <h3 className="text-3xl md:text-4xl font-bold mt-1">{selectedCampaign.quality}%</h3>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                        <StatCard icon={Users} label="Total Leads" value={selectedCampaign.leads.toString()} color="blue" />
                                        <StatCard icon={MousePointer2} label="Conversion" value={selectedCampaign.conv} color="emerald" />
                                        <StatCard icon={IndianRupee} label="Total Spend" value={formatCurrency(selectedCampaign.spend)} color="amber" />
                                        <StatCard icon={TrendingUp} label="Demands Raised" value={selectedCampaign.demandsRaised.toString()} color="indigo" />
                                    </div>
                                </div>
                            </ScrollArea>

                            {/* STICKY FOOTER */}
                            <div className="p-6 md:p-8 border-t border-slate-100 bg-white shrink-0 mt-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Button onClick={handleAuditQuality} variant="outline" className="h-12 rounded-xl font-bold text-xs"><PieChart className="h-4 w-4 mr-2" /> Audit Quality</Button>
                                <Button onClick={handleScaleBudget} className="h-12 bg-black text-white rounded-xl font-bold text-xs"><Zap className="h-4 w-4 mr-2 text-amber-400" /> Scale Budget</Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}

function StatCard({ icon: Icon, label, value, color }: { icon: any, label: string, value: string, color: string }) {
    const colors: any = {
        blue: "bg-blue-50 text-blue-600",
        emerald: "bg-emerald-50 text-emerald-600",
        amber: "bg-amber-50 text-amber-600",
        indigo: "bg-indigo-50 text-indigo-600"
    }
    return (
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
            <div className={`p-2 w-fit rounded-lg mb-3 ${colors[color]}`}>
                <Icon className="h-4 w-4" />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{label}</p>
            <p className="text-base md:text-lg font-bold text-slate-900 mt-1 truncate">{value}</p>
        </div>
    )
}