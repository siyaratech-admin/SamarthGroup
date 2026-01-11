"use client"

import { useState } from "react"
import { Header } from "@/components/erp/header"
import { DataTable } from "@/components/erp/data-table"
import { StatusBadge } from "@/components/erp/status-badge"
import { Drawer } from "@/components/erp/drawer"
import { Button } from "@/components/ui/button"
import { units, customers, documents, type Unit } from "@/lib/mock-data"
import { CheckCircle, AlertTriangle, Key, ClipboardList, PenTool } from "lucide-react"

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount)
}

export default function PossessionPage() {
    const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null)

    // Filter for units that are 'sold' or 'booked' and ready for possession logic
    // For demo, we just show 'booked' and 'sold' units
    const possessionUnits = units.filter(u => u.status === 'booked' || u.status === 'sold')

    const columns = [
        { key: "unitNo", header: "Unit No", render: (item: Unit) => <span className="font-bold">{item.unitNo}</span> },
        { key: "projectName", header: "Project" },
        { key: "towerName", header: "Tower" },
        { key: "type", header: "Type" },
        { key: "status", header: "Status", render: (item: Unit) => <StatusBadge status={item.status} /> },
    ]

    // Mock possession checklist status
    const getChecklistStatus = (unit: Unit) => {
        // In a real app, calculate this dynamically
        return {
            payments: true,
            documents: false,
            snags: false,
            keys: false
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <Header title="Possession Management" subtitle="Handover checklist and key release" />

            <div className="p-4 sm:p-6 space-y-6">
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                    <DataTable columns={columns} data={possessionUnits} onRowClick={setSelectedUnit} />
                </div>
            </div>

            <Drawer
                open={!!selectedUnit}
                onClose={() => setSelectedUnit(null)}
                title={`Possession: Unit ${selectedUnit?.unitNo}`}
            >
                {selectedUnit && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-muted rounded-lg">
                                <span className="text-xs text-muted-foreground block">Customer</span>
                                <span className="font-semibold block">Mohan Reddy (Mock)</span>
                            </div>
                            <div className="p-3 bg-muted rounded-lg">
                                <span className="text-xs text-muted-foreground block">Project</span>
                                <span className="font-semibold block">{selectedUnit.projectName}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Handover Checklist</h3>

                            <ChecklistItem
                                title="Payment Clearance"
                                description="All dues including GST, Maintenance, Corpus Fund cleared."
                                status="completed"
                                icon={CheckCircle}
                            />
                            <ChecklistItem
                                title="Legal Documentation"
                                description="Sale Deed registration and original documents verification."
                                status="pending"
                                icon={ClipboardList}
                            />
                            <ChecklistItem
                                title="Snag List & QC"
                                description="Unit inspection, defect reporting and rectification."
                                status="pending"
                                icon={PenTool}
                            />
                            <ChecklistItem
                                title="Key Handover"
                                description="Final handover of keys and possession letter issuance."
                                status="locked"
                                icon={Key}
                            />
                        </div>

                        <div className="pt-4 border-t border-border">
                            <Button className="w-full" disabled>Generate Possession Letter</Button>
                            <p className="text-xs text-center text-muted-foreground mt-2">Complete all checklist items to proceed</p>
                        </div>
                    </div>
                )}
            </Drawer>
        </div>
    )
}

function ChecklistItem({ title, description, status, icon: Icon }: any) {
    const isCompleted = status === 'completed'
    const isLocked = status === 'locked'

    return (
        <div className={`flex items-start gap-3 p-3 rounded-lg border ${isCompleted ? 'bg-emerald-500/10 border-emerald-500/20' :
                isLocked ? 'bg-muted border-border opacity-60' : 'bg-card border-border'
            }`}>
            <div className={`p-2 rounded-full ${isCompleted ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'
                }`}>
                <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-center">
                    <h4 className={`font-medium text-sm ${isCompleted ? 'text-emerald-700 dark:text-emerald-400' : 'text-foreground'}`}>
                        {title}
                    </h4>
                    {isCompleted && <span className="text-[10px] font-bold uppercase text-emerald-600">Done</span>}
                    {!isCompleted && !isLocked && <Button size="sm" variant="outline" className="h-6 text-[10px]">Mark Done</Button>}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{description}</p>
            </div>
        </div>
    )
}
