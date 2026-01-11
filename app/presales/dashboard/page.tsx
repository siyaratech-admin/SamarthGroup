"use client"

import { Header } from "@/components/erp/header"
import { StatCard } from "@/components/erp/stat-card"
import { dashboardStats } from "@/lib/mock-data"
import { Users, PhoneIncoming, Search, TrendingUp, Calendar, AlertCircle } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

export default function PreSalesDashboard() {
    const { presales } = dashboardStats

    return (
        <div className="min-h-screen bg-background pb-10">
            <Header title="Pre-Sales Dashboard" subtitle="Lead Generation & Marketing Performance" />

            <div className="p-4 sm:p-6 max-w-full overflow-hidden space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Leads"
                        value={presales.totalLeads}
                        subtitle={`${presales.newLeads} new this month`}
                        icon={Users}
                        trend={{ value: 12, isPositive: true }}
                    />
                    <StatCard
                        title="Site Visits"
                        value={presales.siteVisits}
                        subtitle="Scheduled this week"
                        icon={Calendar}
                        trend={{ value: 5, isPositive: true }}
                    />
                    <StatCard
                        title="Hot Leads"
                        value={presales.hotLeads}
                        subtitle="High probability closure"
                        icon={TrendingUp}
                    />
                    <StatCard
                        title="Campaign Spend"
                        value={`₹${(presales.campaignSpend / 100000).toFixed(2)}L`}
                        subtitle="Current active campaigns"
                        icon={Search}
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Leads by Source Chart */}
                    <div className="rounded-xl border border-border bg-card p-4 sm:p-6 flex flex-col h-[400px]">
                        <h3 className="mb-6 text-sm font-semibold text-foreground uppercase tracking-tight">Leads by Source</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={presales.leadsBySource}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                                />
                                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Quick Actions / Important Metrics */}
                    <div className="space-y-6">
                        <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
                            <h3 className="mb-4 text-sm font-semibold text-foreground uppercase tracking-tight">Conversion Funnel</h3>
                            <div className="space-y-4">
                                <FunnelStep label="Total Leads" value={presales.totalLeads} color="bg-blue-500" width="100%" />
                                <FunnelStep label="Contacted" value={Math.round(presales.totalLeads * 0.8)} color="bg-blue-400" width="80%" />
                                <FunnelStep label="Site Visits" value={presales.siteVisits} color="bg-blue-300" width="40%" />
                                <FunnelStep label="Negotiation" value={Math.round(presales.siteVisits * 0.5)} color="bg-blue-200" width="20%" />
                                <FunnelStep label="Booked" value={Math.round(presales.totalLeads * (presales.conversionRate / 100))} color="bg-green-500" width="12%" />
                            </div>
                        </div>

                        <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
                            <h3 className="mb-4 text-sm font-semibold text-foreground uppercase tracking-tight">Pending Tasks</h3>
                            <div className="space-y-3">
                                <TaskItem title="Follow up with Rajesh Kumar" time="2 hours ago" type="Call" />
                                <TaskItem title="Site Visit: Sunita Patel" time="Today, 4:00 PM" type="Visit" />
                                <TaskItem title="Send brochure to Vikram" time="Yesterday" type="Email" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function FunnelStep({ label, value, color, width }: { label: string, value: number, color: string, width: string }) {
    return (
        <div className="group flex items-center gap-4">
            <div className="w-24 text-xs font-medium text-muted-foreground">{label}</div>
            <div className="flex-1">
                <div className={`h-8 rounded-r-lg ${color} flex items-center px-3 text-xs font-bold text-white transition-all group-hover:opacity-90`} style={{ width }}>
                    {value}
                </div>
            </div>
        </div>
    )
}

function TaskItem({ title, time, type }: { title: string, time: string, type: string }) {
    return (
        <div className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-accent/50 transition-colors">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${type === 'Call' ? 'bg-blue-100 text-blue-600' :
                    type === 'Visit' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                }`}>
                {type[0]}
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">{title}</div>
                <div className="text-xs text-muted-foreground">{time}</div>
            </div>
            <div className="h-2 w-2 rounded-full bg-red-400" />
        </div>
    )
}
