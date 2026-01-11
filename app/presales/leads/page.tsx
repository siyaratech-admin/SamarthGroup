"use client"

import { useState } from "react"
import { Header } from "@/components/erp/header"
import { DataTable } from "@/components/erp/data-table"
import { StatusBadge } from "@/components/erp/status-badge"
import { leads, activities, type Lead } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Drawer } from "@/components/erp/drawer"
import { Plus, Phone, Calendar, Mail, User, MapPin, IndianRupee, Clock, Building2 } from "lucide-react"

const leadColumns = [
    { key: "name", header: "Name" },
    { key: "phone", header: "Contact" },
    { key: "source", header: "Source" },
    { key: "budget", header: "Budget" },
    { key: "preferredProject", header: "Project" },
    {
        key: "status",
        header: "Status",
        render: (item: Lead) => <StatusBadge status={item.status as any} />
    },
    { key: "assignedTo", header: "Assigned To" },
]

export default function LeadsPage() {
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

    const leadActivities = selectedLead ? activities : [] // In real app, filter by leadId

    return (
        <div className="min-h-screen bg-background">
            <Header title="Lead Management" subtitle="Manage and track all potential customer leads" />

            <div className="p-4 sm:p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">All Leads</h2>
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Lead
                    </Button>
                </div>

                <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                    <DataTable columns={leadColumns} data={leads} onRowClick={setSelectedLead} />
                </div>
            </div>

            <Drawer
                open={!!selectedLead}
                onClose={() => setSelectedLead(null)}
                title={selectedLead?.name || "Lead Details"}
            >
                {selectedLead && (
                    <div className="space-y-6">
                        {/* Header Info */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                    {selectedLead.name[0]}
                                </div>
                                <div>
                                    <div className="font-semibold text-lg">{selectedLead.name}</div>
                                    <div className="text-xs text-muted-foreground">ID: {selectedLead.id}</div>
                                </div>
                            </div>
                            <StatusBadge status={selectedLead.status as any} />
                        </div>

                        {/* Contact & Preference Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <InfoItem icon={Phone} label="Phone" value={selectedLead.phone} />
                            <InfoItem icon={Mail} label="Email" value={selectedLead.email} />
                            <InfoItem icon={IndianRupee} label="Budget" value={selectedLead.budget} />
                            <InfoItem icon={Building2} label="Project" value={selectedLead.preferredProject} />
                            <InfoItem icon={MapPin} label="Unit Type" value={selectedLead.unitType} />
                            <InfoItem icon={User} label="Assigned To" value={selectedLead.assignedTo} />
                        </div>

                        {/* Activity Timeline */}
                        <div className="border-t border-border pt-4">
                            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                <Clock className="h-4 w-4" /> Activity History
                            </h3>
                            <div className="space-y-4">
                                {leadActivities.length > 0 ? leadActivities.map((act) => (
                                    <div key={act.id} className="flex gap-3 relative pb-4 last:pb-0">
                                        <div className="absolute top-2 left-3.5 bottom-0 w-px bg-border last:hidden" />
                                        <div className={`h-7 w-7 rounded-full shrink-0 flex items-center justify-center text-xs z-10 ${act.type === 'Call' ? 'bg-blue-100 text-blue-600' :
                                                act.type === 'Site Visit' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {act.type[0]}
                                        </div>
                                        <div className="flex-1 text-sm bg-muted/30 p-2 rounded-lg">
                                            <div className="flex justify-between font-medium">
                                                <span>{act.type}</span>
                                                <span className="text-xs text-muted-foreground">{act.date}</span>
                                            </div>
                                            <p className="text-muted-foreground mt-1 text-xs">{act.description}</p>
                                            <p className="text-emerald-600 text-xs mt-1 font-medium">Outcome: {act.outcome}</p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-sm text-muted-foreground italic">No activity recorded</div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 border-t border-border pt-4">
                            <Button className="flex-1" size="sm">
                                <Phone className="h-4 w-4 mr-2" /> Call
                            </Button>
                            <Button className="flex-1" variant="outline" size="sm">
                                <Calendar className="h-4 w-4 mr-2" /> Schedule Visit
                            </Button>
                        </div>
                    </div>
                )}
            </Drawer>
        </div>
    )
}

function InfoItem({ icon: Icon, label, value }: any) {
    return (
        <div className="bg-muted/30 p-2.5 rounded-lg flex items-start gap-2.5">
            <Icon className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="overflow-hidden">
                <div className="text-[10px] uppercase font-bold text-muted-foreground">{label}</div>
                <div className="text-sm font-medium truncate" title={value}>{value}</div>
            </div>
        </div>
    )
}
