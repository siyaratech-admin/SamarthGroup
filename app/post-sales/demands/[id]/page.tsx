"use client"

import { useState, use, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/erp/header"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/erp/status-badge"
import { units, bookings, invoices, customers } from "@/lib/mock-data"
import {
    ArrowLeft, CheckCircle2, Circle, Clock, AlertCircle, FileText, Send,
    Mail, Phone, MapPin, Building2, User
} from "lucide-react"

const STANDARD_MILESTONES = [
    { id: 1, name: "Booking Amount", percentage: 10, stage: "booking" },
    { id: 2, name: "Agreement Signing", percentage: 10, stage: "agreement" },
    { id: 3, name: "Foundation Complete", percentage: 15, stage: "foundation" },
    { id: 4, name: "Plinth Level", percentage: 10, stage: "plinth" },
    { id: 5, name: "1st Slab Cast", percentage: 5, stage: "slab_1" },
    { id: 6, name: "3rd Slab Cast", percentage: 5, stage: "slab_3" },
    { id: 7, name: "5th Slab Cast", percentage: 5, stage: "slab_5" },
    { id: 8, name: "Brick Work", percentage: 10, stage: "brick_work" },
    { id: 9, name: "Flooring & Finishing", percentage: 20, stage: "finishing" },
    { id: 10, name: "Possession", percentage: 10, stage: "possession" },
]

export default function DemandDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const resolvedParams = use(params)
    const unitId = resolvedParams.id

    const [raisedDemands, setRaisedDemands] = useState<number[]>([])

    const data = useMemo(() => {
        const unit = units.find(u => u.id === unitId)
        if (!unit) return null

        const booking = bookings.find(b => b.unitId === unitId)
        // Find customer linked to booking or try to mock find one
        let customer = customers.find(c => c.id === booking?.customerId)

        // Fallback for demo if no direct link (often mock data is sparse)
        if (!customer && booking) {
            customer = {
                id: 'mock-c1',
                name: booking.customerName,
                email: 'customer@example.com',
                phone: '+91 98765 43210',
                address: 'Mumbai, India',
                unitNo: unit.unitNo,
                totalBilled: 0,
                totalPaid: 0,
                outstanding: 0,
                ledger: []
            }
        }

        const unitInvoices = invoices.filter(inv => inv.unitNo === unit.unitNo)

        const raisedMilestoneIndices = new Set<number>()
        if (booking) raisedMilestoneIndices.add(0)

        unitInvoices.forEach(inv => {
            inv.milestones.forEach(m => {
                const match = STANDARD_MILESTONES.find(sm => sm.name.includes(m.name) || m.name.includes(sm.name))
                if (match) raisedMilestoneIndices.add(match.id - 1)
            })
        })

        return { unit, booking, customer, unitInvoices, raisedMilestoneIndices }
    }, [unitId])

    if (!data) return <div className="p-8">Unit not found</div>

    const { unit, booking, customer, raisedMilestoneIndices } = data

    const handleRaiseDemand = (index: number) => {
        setRaisedDemands(prev => [...prev, index])
        alert(`Demand raised successfully for: ${STANDARD_MILESTONES[index].name}`)
    }

    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <Header title="Demand Management" subtitle={`Unit: ${unit.unitNo}`} />

            <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
                <Button variant="ghost" className="mb-2 pl-0" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Details & Stats */}
                    <div className="space-y-6">
                        {/* Unit Details Card */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-slate-500" />
                                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Unit Details</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <div className="text-3xl font-black text-slate-800">{unit.unitNo}</div>
                                    <div className="text-sm font-medium text-slate-500">{unit.projectName} • {(unit as any).towerName || 'Tower A'}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="p-3 bg-slate-50 rounded-lg">
                                        <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Type</div>
                                        <div className="font-bold">{unit.type}</div>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-lg">
                                        <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Carpet Area</div>
                                        <div className="font-bold">{unit.carpetArea} sq.ft</div>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-lg">
                                        <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Floor</div>
                                        <div className="font-bold">{unit.floor}</div>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-lg">
                                        <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Facing</div>
                                        <div className="font-bold">East</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Customer Details Card */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                                <User className="h-4 w-4 text-slate-500" />
                                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Customer Info</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold shrink-0">
                                        {customer?.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900">{customer?.name}</div>
                                        <div className="text-xs text-slate-500">ID: {customer?.id || 'N/A'}</div>
                                    </div>
                                </div>
                                <div className="space-y-3 pt-2">
                                    <div className="flex items-center gap-3 text-sm">
                                        <Mail className="h-4 w-4 text-slate-400" />
                                        <span className="text-slate-600">{customer?.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Phone className="h-4 w-4 text-slate-400" />
                                        <span className="text-slate-600">{customer?.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <MapPin className="h-4 w-4 text-slate-400" />
                                        <span className="text-slate-600">{customer?.address}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Financial Summary */}
                        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 text-white shadow-xl">
                            <h3 className="font-bold text-slate-400 text-xs uppercase tracking-widest mb-4">Financial Overview</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-slate-400 text-xs mb-1">Total Unit Value</div>
                                    <div className="text-2xl font-bold">{formatCurrency(unit.price)}</div>
                                </div>
                                <div className="h-px bg-slate-800" />
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-slate-400 text-xs mb-1">Received</div>
                                        <div className="text-emerald-400 font-bold">
                                            {formatCurrency(unit.price * 0.2)} {/* Mock calculation */}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-slate-400 text-xs mb-1">Balance</div>
                                        <div className="text-white font-bold">
                                            {formatCurrency(unit.price * 0.8)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Milestones */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                                <h3 className="font-bold text-slate-800">Payment Schedule</h3>
                                <div className="text-xs font-medium text-slate-500">
                                    Booking Date: {booking?.bookingDate || 'N/A'}
                                </div>
                            </div>

                            <div className="divide-y divide-slate-100">
                                {STANDARD_MILESTONES.map((milestone, index) => {
                                    const isAlreadyRaised = raisedMilestoneIndices.has(index)
                                    const isJustRaised = raisedDemands.includes(index)
                                    const isRaised = isAlreadyRaised || isJustRaised

                                    const previousRaised = index === 0 || raisedMilestoneIndices.has(index - 1) || raisedDemands.includes(index - 1)
                                    const canRaise = !isRaised && previousRaised
                                    const amount = (unit.price * milestone.percentage) / 100

                                    return (
                                        <div key={milestone.id} className={`p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-center justify-between transition-colors ${isRaised ? 'bg-emerald-50/30' : ''}`}>
                                            <div className="flex items-start gap-4">
                                                <div className="mt-1">
                                                    {isRaised ? (
                                                        <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                                                    ) : canRaise ? (
                                                        <AlertCircle className="h-6 w-6 text-amber-500" />
                                                    ) : (
                                                        <Circle className="h-6 w-6 text-slate-200" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="flex items-baseline gap-3">
                                                        <h4 className={`font-bold text-base ${isRaised ? 'text-slate-800' : 'text-slate-500'}`}>
                                                            {milestone.name}
                                                        </h4>
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                                            {milestone.percentage}%
                                                        </span>
                                                    </div>
                                                    <div className="text-slate-500 text-sm mt-1">
                                                        Due: <span className="font-semibold text-slate-700">
                                                            {formatCurrency(amount)}
                                                        </span>
                                                    </div>
                                                    {isRaised && (
                                                        <div className="flex items-center gap-2 mt-2 text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                                                            <FileText className="h-3 w-3" /> Demand Sent
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                {isRaised ? (
                                                    <Button variant="outline" size="sm" className="border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100">
                                                        View Invoice
                                                    </Button>
                                                ) : canRaise ? (
                                                    <Button onClick={() => handleRaiseDemand(index)} size="sm" className="gap-2 shadow-lg shadow-primary/20">
                                                        <Send className="h-4 w-4" /> Raise Demand
                                                    </Button>
                                                ) : (
                                                    <Button variant="ghost" size="sm" disabled className="text-slate-300">
                                                        Locked
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
