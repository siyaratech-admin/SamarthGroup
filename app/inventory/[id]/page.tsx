"use client"

import { useState } from "react"
import { Header } from "@/components/erp/header"
import { StatusBadge } from "@/components/erp/status-badge"
import { Button } from "@/components/ui/button"
import { units, projects } from "@/lib/mock-data"
import { useRouter } from "next/navigation" // Use next/navigation for router
import { ArrowLeft, Building2, MapPin, Layers, Home, IndianRupee, Printer, Share2, Heart, History, CheckCircle, CreditCard, ChevronRight } from "lucide-react"

// Simple hook to simulate getting params
import { usePathname } from 'next/navigation'

export default function UnitDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    // In a real server component, params.id works directly. 
    // For client static export/demo, we search by ID from mock data
    const unitId = params.id
    const unit = units.find(u => u.id === unitId)

    if (!unit) {
        return <div className="p-10 text-center">Unit not found</div>
    }

    const project = projects.find(p => p.name === unit.projectName)
    const isCommercial = unit.type === 'Shop' || unit.type === 'Showroom' || unit.type === 'Office'

    return (
        <div className="min-h-screen bg-background pb-10">
            {/* Top Navigation Bar */}
            <div className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur px-4 h-14 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-lg font-semibold">{unit.projectName} <span className="text-muted-foreground font-normal">/ {unit.unitNo}</span></h1>
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
                    {/* Visual / Gallery Placeholder */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="w-full aspect-video bg-muted rounded-2xl border border-border flex flex-col items-center justify-center relative overflow-hidden group">
                            {/* Placeholder for 3D View / Image */}
                            <Building2 className="h-20 w-20 text-muted-foreground/50 mb-4" />
                            <div className="text-muted-foreground font-medium">3D Floor Plan Visualization</div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                <Button variant="secondary" className="gap-2">View Gallery</Button>
                            </div>
                        </div>
                    </div>

                    {/* Key Details Card */}
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-3xl font-bold">{unit.unitNo}</h2>
                                    <p className="text-muted-foreground">{unit.type} • {unit.towerName}</p>
                                </div>
                                <StatusBadge status={unit.status} className="scale-125 origin-top-right" />
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <div className="text-sm text-muted-foreground mb-1">Total Price</div>
                                    <div className="text-4xl font-black text-primary tracking-tight">
                                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(unit.price)}
                                    </div>
                                    <div className="text-xs font-medium text-emerald-600 mt-1">
                                        ₹{unit.pricePerSqFt}/sq.ft base rate
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                                    <DetailItem icon={Layers} label="Floor" value={unit.floor === 0 ? "Ground" : unit.floor} />
                                    <DetailItem icon={MapPin} label="Facing" value="East" />
                                    <DetailItem icon={Home} label="Carpet Area" value={`${unit.carpetArea} sq.ft`} />
                                    <DetailItem icon={Building2} label="Super Built-up" value={`${Math.round(unit.carpetArea * 1.35)} sq.ft`} />
                                </div>

                                {unit.status === 'available' && (
                                    <Button size="lg" className="w-full text-base font-semibold shadow-lg shadow-primary/25 mt-4">
                                        Block Unit Now
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Amenities */}
                        <div className="rounded-2xl border border-border bg-card p-6">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <Heart className="h-4 w-4 text-rose-500" /> Key Features
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {unit.amenities.map(a => (
                                    <span key={a} className="px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium border border-border/50">
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
                    <div className="rounded-2xl border border-border bg-card overflow-hidden">
                        <div className="bg-muted/30 px-6 py-4 border-b border-border">
                            <h3 className="font-semibold flex items-center gap-2">
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
                            <div className="flex justify-between items-center text-lg font-bold">
                                <span>Grand Total</span>
                                <span>{formatCurrency(unit.price * 1.05 + 475000)}</span>
                            </div>
                        </div>
                    </div>

                    {/* History & Timeline */}
                    <div className="rounded-2xl border border-border bg-card overflow-hidden">
                        <div className="bg-muted/30 px-6 py-4 border-b border-border">
                            <h3 className="font-semibold flex items-center gap-2">
                                <History className="h-4 w-4" /> Unit History
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="relative border-l border-border ml-2 space-y-6">
                                {unit.statusHistory.map((h, i) => (
                                    <div key={i} className="pl-6 relative">
                                        <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background" />
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                                            <span className="font-medium text-foreground">{h.status}</span>
                                            <span className="text-xs text-muted-foreground">{h.date}</span>
                                        </div>
                                        <div className="text-sm text-muted-foreground mt-0.5">Updated by {h.user}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function DetailItem({ icon: Icon, label, value }: any) {
    return (
        <div>
            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <Icon className="h-3.5 w-3.5" />
                <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
            </div>
            <div className="font-semibold text-foreground">{value}</div>
        </div>
    )
}

function CostRow({ label, value, isBold }: { label: string, value: number, isBold?: boolean }) {
    return (
        <div className={`flex justify-between items-center text-sm ${isBold ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
            <span>{label}</span>
            <span className={isBold ? 'text-foreground' : ''}>{formatCurrency(value)}</span>
        </div>
    )
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount)
}
