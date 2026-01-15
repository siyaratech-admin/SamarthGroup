"use client"

import { useRouter } from "next/navigation"
import { Header } from "@/components/erp/header"
import { DataTable } from "@/components/erp/data-table"
import { StatusBadge } from "@/components/erp/status-badge"
import { units, bookings, reservations, invoices, payments } from "@/lib/mock-data"
import { useMemo } from "react"
import { IndianRupee, FileText, CheckCircle2, TrendingUp, AlertCircle, Clock } from "lucide-react"

export default function DemandsPage() {
    const router = useRouter()

    // Filter for sold/booked units and join with customer info
    const soldUnits = useMemo(() => {
        return units
            .filter(u => ['booked', 'sold', 'reserved'].includes(u.status))
            .map(unit => {
                const booking = bookings.find(b => b.unitId === unit.id)
                const reservation = reservations.find(r => r.unitId === unit.id)
                // Calculate percentage collected for this unit based on payments
                // This is a mock calculation since we don't have a direct unit-payment link always, 
                // but we can try to link via invoices if possible or just mock it.
                // For now, let's keep it simple.
                return {
                    ...unit,
                    customerName: booking?.customerName || reservation?.customerName || "N/A",
                    bookingDate: booking?.bookingDate || reservation?.reservationDate || "N/A"
                }
            })
    }, [])

    // Dashboard Statistics Calculation
    const stats = useMemo(() => {
        const totalSoldValue = soldUnits.reduce((sum, u) => sum + u.price, 0)

        // Sum of all invoices (Demands Raised)
        const totalDemanded = invoices.reduce((sum, inv) => sum + inv.amount, 0)

        // Sum of all payments (Collected)
        const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0)

        // Pending (Demanded - Collected) - Simplified
        const totalPending = totalDemanded - totalCollected

        return {
            totalSoldValue,
            totalDemanded,
            totalCollected,
            totalPending,
            soldCount: soldUnits.length
        }
    }, [soldUnits])

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount)
    }

    const columns = [
        {
            key: "unitNo",
            header: "Unit No",
            render: (u: any) => <span className="font-bold text-slate-700">{u.unitNo}</span>
        },
        { key: "projectName", header: "Project" },
        {
            key: "customerName",
            header: "Customer",
            render: (u: any) => <span className="font-medium">{u.customerName}</span>
        },
        {
            key: "price",
            header: "Unit Value",
            render: (u: any) => formatCurrency(u.price)
        },
        {
            key: "status",
            header: "Status",
            render: (item: any) => <StatusBadge status={item.status} />,
        },
        {
            key: "action",
            header: "Action",
            render: () => <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Manage Demands</span>
        }
    ]

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <Header title="Milestone Demands" subtitle="Track construction-linked payment demands" />

            <div className="p-4 sm:p-6 max-w-[1600px] mx-auto space-y-6">

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-indigo-50 rounded-lg">
                                <TrendingUp className="h-5 w-5 text-indigo-600" />
                            </div>
                            <span className="text-xs font-bold px-2 py-1 bg-slate-100 rounded-full text-slate-600">Total Projection</span>
                        </div>
                        <div className="text-2xl font-black text-slate-800 tracking-tight">{formatCurrency(stats.totalSoldValue)}</div>
                        <div className="text-xs font-medium text-slate-500 mt-1">From {stats.soldCount} Sold Units</div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-amber-50 rounded-lg">
                                <FileText className="h-5 w-5 text-amber-600" />
                            </div>
                            <span className="text-xs font-bold px-2 py-1 bg-amber-100 text-amber-700 rounded-full">Raised</span>
                        </div>
                        <div className="text-2xl font-black text-slate-800 tracking-tight">{formatCurrency(stats.totalDemanded)}</div>
                        <div className="text-xs font-medium text-slate-500 mt-1">Total Demands Sent</div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-emerald-50 rounded-lg">
                                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                            </div>
                            <span className="text-xs font-bold px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">Collected</span>
                        </div>
                        <div className="text-2xl font-black text-emerald-600 tracking-tight">{formatCurrency(stats.totalCollected)}</div>
                        <div className="text-xs font-medium text-slate-500 mt-1">
                            {Math.round((stats.totalCollected / stats.totalDemanded) * 100)}% Collection Efficiency
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-rose-50 rounded-lg">
                                <AlertCircle className="h-5 w-5 text-rose-600" />
                            </div>
                            <span className="text-xs font-bold px-2 py-1 bg-rose-100 text-rose-700 rounded-full">Pending</span>
                        </div>
                        <div className="text-2xl font-black text-slate-800 tracking-tight">{formatCurrency(stats.totalPending)}</div>
                        <div className="text-xs font-medium text-slate-500 mt-1">Outstanding Amount</div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <div>
                            <h3 className="font-bold text-slate-800">Unit-wise Demand Status</h3>
                            <p className="text-xs text-slate-500">Click on a row to manage slab-wise demands</p>
                        </div>
                        <div className="flex gap-2 text-xs font-medium text-slate-500">
                            <div className="flex items-center gap-1"><Clock className="h-3 w-3" /> Real-time Updates</div>
                        </div>
                    </div>
                    <DataTable
                        columns={columns}
                        data={soldUnits}
                        onRowClick={(row) => router.push(`/post-sales/demands/${row.id}`)}
                    />
                </div>
            </div>
        </div>
    )
}
