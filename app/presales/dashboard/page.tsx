"use client"

import { useState } from "react"
import { Header } from "@/components/erp/header"
import { StatCard } from "@/components/erp/stat-card"
import { dashboardStats } from "@/lib/mock-data"
import { 
  Users, TrendingUp, Calendar, 
  Mail, MessageSquare, Phone, CheckCircle2, XCircle, 
  MoreHorizontal, Clock, ShieldCheck, IndianRupee,
  BellRing, Loader2
} from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { 
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter 
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export default function PreSalesDashboard() {
    const { presales } = dashboardStats
    const [selectedTask, setSelectedTask] = useState<any>(null)
    const [isNudging, setIsNudging] = useState<string | null>(null)
    const [note, setNote] = useState("")

    // Real-feel Nudge Workflow
    const handleNudge = (name: string) => {
        setIsNudging(name)
        setTimeout(() => {
            toast.success(`Demand Reminder Sent`, {
                description: `WhatsApp & Email reminder delivered to ${name}.`
            })
            setIsNudging(null)
        }, 1500)
    }

    const handleAction = (status: string) => {
        toast.success(`Disposition Updated`, {
            description: `${selectedTask?.name} marked as ${status}.`
        })
        setSelectedTask(null)
        setNote("")
    }

    return (
        <div className="min-h-screen bg-[#F9FAFB] text-[#111827] antialiased">
            <Header title="Engagement Dashboard" subtitle="Lead Intelligence & Payment Collection Pipeline" />

            <div className="mx-auto max-w-[1600px] px-6 py-8 space-y-8">
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard title="Total Pipeline" value={presales.totalLeads} subtitle="Gross volume" icon={Users} trend={{ value: 12, isPositive: true }} />
                    <StatCard title="Active Tours" value={presales.siteVisits} subtitle="Scheduled operations" icon={Calendar} />
                    <StatCard title="Demands Raised" value="₹42.5L" subtitle="Pending collection" icon={IndianRupee} />
                    <StatCard title="Collection Efficiency" value="88%" subtitle="Target: 95%" icon={ShieldCheck} />
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* Main Analytics */}
                    <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-slate-100 bg-white flex justify-between items-center">
                            <h3 className="text-[11px] font-bold uppercase tracking-[0.05em] text-slate-500">Acquisition vs Collection</h3>
                        </div>
                        <div className="h-[380px] p-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={presales.leadsBySource} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="0" vertical={false} stroke="#F1F5F9" />
                                    <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 500, fill: '#64748B' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11, fontWeight: 500, fill: '#64748B' }} axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{fill: '#F8FAFC'}} contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Bar dataKey="value" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={32} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Follow-up Side Panel */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* SECTION: OVERDUE DEMANDS (New!) */}
                        <div className="bg-white border border-red-100 rounded-xl overflow-hidden shadow-sm ring-1 ring-red-50">
                            <div className="px-5 py-3 border-b border-red-50 bg-red-50/30 flex justify-between items-center">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.05em] text-red-600">Overdue Demands</h3>
                                <span className="bg-red-100 text-red-700 text-[9px] px-1.5 py-0.5 rounded-full font-bold">3 URGENT</span>
                            </div>
                            <div className="divide-y divide-slate-50">
                                <CollectionFollowUp 
                                    name="Amit Shah" 
                                    amount="₹5,00,000" 
                                    due="4 days ago" 
                                    isNudging={isNudging === "Amit Shah"}
                                    onNudge={() => handleNudge("Amit Shah")}
                                />
                                <CollectionFollowUp 
                                    name="Ramesh Gupta" 
                                    amount="₹2,50,000" 
                                    due="12 days ago" 
                                    isNudging={isNudging === "Ramesh Gupta"}
                                    onNudge={() => handleNudge("Ramesh Gupta")}
                                />
                            </div>
                        </div>

                        {/* SECTION: GENERAL TASKS */}
                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                                <h3 className="text-[11px] font-bold uppercase tracking-[0.05em] text-slate-500">Sales Engagements</h3>
                            </div>
                            <div className="divide-y divide-slate-100">
                                <EngagementItem 
                                    name="Rajesh Kumar" 
                                    time="14:00 Today" 
                                    channel="Voice" 
                                    onClick={() => setSelectedTask({ name: "Rajesh Kumar" })}
                                />
                                <EngagementItem 
                                    name="Sunita Patel" 
                                    time="16:30 Today" 
                                    channel="Site Tour" 
                                    onClick={() => setSelectedTask({ name: "Sunita Patel" })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Engagement Sheet */}
            <Sheet open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
                <SheetContent className="w-full sm:max-w-[440px] p-0 border-l border-slate-200 flex flex-col">
                    <SheetHeader className="p-8 pb-6 text-left border-b border-slate-100 bg-white">
                        <SheetTitle className="text-2xl font-bold tracking-tight text-slate-900">Log Interaction</SheetTitle>
                        <SheetDescription className="text-sm font-medium text-slate-500 mt-1 uppercase">Client: {selectedTask?.name}</SheetDescription>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto p-8 space-y-8">
                        <div className="space-y-3">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Direct Outreach</span>
                            <div className="grid grid-cols-3 gap-2">
                                <OutreachBtn icon={Phone} label="Voice" />
                                <OutreachBtn icon={MessageSquare} label="WhatsApp" color="text-green-600" />
                                <OutreachBtn icon={Mail} label="Email" color="text-blue-600" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Disposition</span>
                            <div className="grid grid-cols-2 gap-3">
                                <Button variant="outline" className="h-11 border-emerald-200 font-bold text-xs text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all" onClick={() => handleAction("Converted")}>
                                    <CheckCircle2 className="mr-2 h-4 w-4" /> Convert
                                </Button>
                                <Button variant="outline" className="h-11 border-red-200 font-bold text-xs text-red-700 hover:bg-red-600 hover:text-white transition-all" onClick={() => handleAction("Disqualified")}>
                                    <XCircle className="mr-2 h-4 w-4" /> Disqualify
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-3 pb-24">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Notes</span>
                            <Textarea placeholder="Interaction details..." className="min-h-[120px] rounded-xl bg-slate-50/50 border-slate-200" value={note} onChange={(e) => setNote(e.target.value)} />
                        </div>
                    </div>

                    <SheetFooter className="absolute bottom-0 w-full p-8 border-t border-slate-100 bg-white">
                        <Button className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-100" onClick={() => { toast.success("Activity logged"); setSelectedTask(null); }}>
                            Save Activity
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    )
}

// --- Specialized Sub-components ---

function CollectionFollowUp({ name, amount, due, onNudge, isNudging }: any) {
    return (
        <div className="flex items-center justify-between px-5 py-4 hover:bg-red-50/20 transition-colors">
            <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-slate-900">{name}</h4>
                <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-red-600">{amount}</span>
                    <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                    <span className="text-[10px] font-medium text-slate-400 uppercase">Due {due}</span>
                </div>
            </div>
            <Button 
                size="sm" 
                variant="outline" 
                disabled={isNudging}
                onClick={onNudge}
                className="h-8 rounded-lg border-red-200 text-[10px] font-black uppercase text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm"
            >
                {isNudging ? <Loader2 className="h-3 w-3 animate-spin" /> : <BellRing className="h-3 w-3 mr-1.5" />}
                Nudge
            </Button>
        </div>
    )
}

function EngagementItem({ name, time, channel, isUrgent, onClick }: any) {
    return (
        <div onClick={onClick} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50/80 cursor-pointer group transition-colors">
            <div className="space-y-0.5">
                <h4 className="text-sm font-semibold text-slate-900">{name}</h4>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{channel}</span>
                    <span className="text-[11px] font-medium text-slate-500">{time}</span>
                </div>
            </div>
            <MoreHorizontal className="h-4 w-4 text-slate-300 group-hover:text-slate-900" />
        </div>
    )
}

function OutreachBtn({ icon: Icon, label, color }: any) {
    return (
        <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-slate-100 bg-slate-50/30 hover:bg-white hover:border-slate-300 transition-all group">
            <Icon className={`h-4 w-4 ${color || 'text-slate-700'} group-hover:scale-110 transition-transform`} />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{label}</span>
        </button>
    )
}