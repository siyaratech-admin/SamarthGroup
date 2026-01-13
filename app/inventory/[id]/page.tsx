"use client"

import React, { useState, useEffect, use } from "react"
import { StatusBadge } from "@/components/erp/status-badge"
import { Button } from "@/components/ui/button"
import { units, projects } from "@/lib/mock-data"
import { useRouter } from "next/navigation" 
import { 
    ArrowLeft, Building2, MapPin, Layers, Home, 
    IndianRupee, Printer, Share2, Heart, History
} from "lucide-react"

// Move utility outside or keep it inside. Common practice for Indian ERPs:
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount)
}

export default function UnitDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    
    /** * FIX: In Next.js 15, params is a Promise. 
     * We use React.use() to unwrap it in a Client Component.
     */
    const resolvedParams = use(params) 
    const unitId = resolvedParams.id
    
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const unit = units.find(u => u.id === unitId)
    const project = projects.find(p => p.name === unit?.projectName)

    if (!unit) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center space-y-4">
                    <p className="text-xl font-bold text-slate-500">Unit not found</p>
                    <Button onClick={() => router.back()} variant="outline">Go Back</Button>
                </div>
            </div>
        )
    }

    // Prevent hydration mismatch
    if (!mounted) return null

    return (
        <div className="min-h-screen bg-background pb-10">
            {/* Top Navigation Bar */}
            <div className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur px-4 h-14 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-lg font-semibold flex items-center gap-2">
                        <span className="hidden md:inline">{unit.projectName}</span>
                        <span className="text-muted-foreground font-normal">/</span>
                        <span>{unit.unitNo || unit.id}</span>
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
                        <Share2 className="h-4 w-4" /> Share
                    </Button>
                    <Button variant="default" size="sm" className="gap-2">
                        <Printer className="h-4 w-4" /> Print Fact Sheet
                    </Button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">

                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Gallery/Floor Plan Visualization */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="w-full aspect-video bg-muted rounded-2xl border border-border flex flex-col items-center justify-center relative overflow-hidden group">
                            <Building2 className="h-20 w-20 text-muted-foreground/50 mb-4" />
                            <div className="text-muted-foreground font-medium">3D Floor Plan Visualization</div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                <Button variant="secondary" className="gap-2 font-semibold">View Gallery</Button>
                            </div>
                        </div>
                    </div>

                    {/* Key Details Card */}
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-3xl font-bold tracking-tight">{unit.unitNo || unit.id}</h2>
                                    <p className="text-muted-foreground font-medium">
                                        {unit.type} • {(unit as any).towerName || (unit as any).tower || 'Tower A'}
                                    </p>
                                </div>
                                <StatusBadge status={unit.status} className="scale-110 origin-top-right" />
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <div className="text-sm text-muted-foreground mb-1 font-medium">Total Price</div>
                                    <div className="text-4xl font-black text-primary tracking-tighter">
                                        {formatCurrency(unit.price)}
                                    </div>
                                    <div className="text-xs font-semibold text-emerald-600 mt-1">
                                        ₹{Math.round(unit.price / 1450)}/sq.ft base rate
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                                    <DetailItem icon={Layers} label="Floor" value={unit.floor === 0 ? "Ground" : unit.floor} />
                                    <DetailItem icon={MapPin} label="Facing" value="East" />
                                    <DetailItem icon={Home} label="Carpet Area" value={`${(unit as any).carpetArea || 1100} sq.ft`} />
                                    <DetailItem icon={Building2} label="Super Built-up" value="1450 sq.ft" />
                                </div>

                                {unit.status === 'available' && (
                                    <Button size="lg" className="w-full text-base font-bold shadow-lg shadow-primary/25 mt-4 rounded-xl">
                                        Block Unit Now
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Features/Amenities */}
                        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                            <h3 className="font-bold text-sm mb-4 flex items-center gap-2 uppercase tracking-wider text-slate-700">
                                <Heart className="h-4 w-4 text-rose-500" /> Key Features
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {((unit as any).amenities || ["Vastu Compliant", "Corner Unit", "Park Facing"]).map((a: string) => (
                                    <span key={a} className="px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-[11px] font-bold border border-border/50 uppercase">
                                        {a}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Cost Sheet */}
                    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                        <div className="bg-muted/30 px-6 py-4 border-b border-border">
                            <h3 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wider">
                                <IndianRupee className="h-4 w-4" /> Cost Breakdown
                            </h3>
                        </div>
                        <div className="p-6 space-y-3">
                            <CostRow label="Basic Cost" value={unit.price} isBold />
                            <CostRow label="GST (5%)" value={unit.price * 0.05} />
                            <CostRow label="Car Parking" value={300000} />
                            <CostRow label="Club Membership" value={150000} />
                            <CostRow label="Legal & Documentation" value={25000} />
                            <div className="h-px bg-border my-2" />
                            <div className="flex justify-between items-center text-xl font-black">
                                <span>Grand Total</span>
                                <span className="text-primary">{formatCurrency(unit.price * 1.05 + 475000)}</span>
                            </div>
                        </div>
                    </div>

                    {/* History & Timeline */}
                    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                        <div className="bg-muted/30 px-6 py-4 border-b border-border">
                            <h3 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wider">
                                <History className="h-4 w-4" /> Unit History
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="relative border-l-2 border-slate-100 ml-2 space-y-6">
                                <div className="pl-6 relative">
                                    <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full bg-primary ring-4 ring-background" />
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                                        <span className="font-bold text-slate-900 uppercase text-xs tracking-wide">Status: {unit.status}</span>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Jan 12, 2024</span>
                                    </div>
                                    <div className="text-sm text-slate-500 mt-1 font-medium">Updated by System Admin</div>
                                </div>
                                <div className="pl-6 relative">
                                    <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full bg-slate-200 ring-4 ring-background" />
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                                        <span className="font-bold text-slate-400 uppercase text-xs tracking-wide">Unit Created</span>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Dec 01, 2023</span>
                                    </div>
                                    <div className="text-sm text-slate-400 mt-1 font-medium">Inventory Initialization</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

/** Helper Components */

function DetailItem({ icon: Icon, label, value }: { icon: any, label: string, value: string | number }) {
    return (
        <div>
            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <Icon className="h-3.5 w-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
            </div>
            <div className="font-bold text-foreground text-sm">{value}</div>
        </div>
    )
}

function CostRow({ label, value, isBold }: { label: string, value: number, isBold?: boolean }) {
    return (
        <div className={`flex justify-between items-center text-sm ${isBold ? 'font-bold text-foreground' : 'text-muted-foreground font-medium'}`}>
            <span>{label}</span>
            <span className={isBold ? 'text-foreground' : ''}>{formatCurrency(value)}</span>
        </div>
    )
}