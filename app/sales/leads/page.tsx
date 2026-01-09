"use client"

import { useState } from "react"
import { Header } from "@/components/erp/header"
import { DataTable } from "@/components/erp/data-table"
import { StatusBadge } from "@/components/erp/status-badge"
import { Drawer } from "@/components/erp/drawer"
import { Button } from "@/components/ui/button"
import { leads, type Lead } from "@/lib/mock-data"
import { User, Mail, Phone, Calendar, Tag, UserCheck } from "lucide-react"

export default function LeadsPage() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [statusFilter, setStatusFilter] = useState("")

  const filteredLeads = leads.filter((lead) => {
    if (statusFilter && lead.status !== statusFilter) return false
    return true
  })

  const columns = [
    {
      key: "name",
      header: "Name",
      render: (item: Lead) => <span className="font-medium text-foreground">{item.name}</span>,
    },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone" },
    {
      key: "source",
      header: "Source",
      render: (item: Lead) => (
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{item.source}</span>
      ),
    },
    { key: "interestedUnit", header: "Interested Unit" },
    { key: "assignedTo", header: "Assigned To" },
    {
      key: "status",
      header: "Status",
      render: (item: Lead) => <StatusBadge status={item.status} />,
    },
  ]

  const leadCounts = {
    all: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    qualified: leads.filter((l) => l.status === "qualified").length,
    negotiation: leads.filter((l) => l.status === "negotiation").length,
    converted: leads.filter((l) => l.status === "converted").length,
    lost: leads.filter((l) => l.status === "lost").length,
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="Lead Management" subtitle="Track and manage all sales leads" />

      <div className="p-6">
        {/* Status Filter Pills */}
        <div className="mb-6 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setStatusFilter("")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              statusFilter === ""
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            All ({leadCounts.all})
          </button>
          <button
            onClick={() => setStatusFilter("new")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              statusFilter === "new" ? "bg-sky-500/20 text-sky-400" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            New ({leadCounts.new})
          </button>
          <button
            onClick={() => setStatusFilter("contacted")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              statusFilter === "contacted"
                ? "bg-indigo-500/20 text-indigo-400"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Contacted ({leadCounts.contacted})
          </button>
          <button
            onClick={() => setStatusFilter("qualified")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              statusFilter === "qualified"
                ? "bg-teal-500/20 text-teal-400"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Qualified ({leadCounts.qualified})
          </button>
          <button
            onClick={() => setStatusFilter("negotiation")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              statusFilter === "negotiation"
                ? "bg-orange-500/20 text-orange-400"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Negotiation ({leadCounts.negotiation})
          </button>
          <button
            onClick={() => setStatusFilter("converted")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              statusFilter === "converted"
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Converted ({leadCounts.converted})
          </button>
        </div>

        {/* Leads Table */}
        <DataTable columns={columns} data={filteredLeads} onRowClick={setSelectedLead} />
      </div>

      {/* Lead Detail Drawer */}
      <Drawer open={!!selectedLead} onClose={() => setSelectedLead(null)} title="Lead Details">
        {selectedLead && (
          <div className="flex flex-col gap-6">
            {/* Contact Info */}
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{selectedLead.name}</h3>
                <StatusBadge status={selectedLead.status} />
              </div>
            </div>

            {/* Contact Details */}
            <div className="flex flex-col gap-3 rounded-lg border border-border p-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{selectedLead.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{selectedLead.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">Created: {selectedLead.createdAt}</span>
              </div>
            </div>

            {/* Lead Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-muted p-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Tag className="h-3 w-3" />
                  Source
                </div>
                <div className="mt-1 text-sm font-medium text-foreground">{selectedLead.source}</div>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <UserCheck className="h-3 w-3" />
                  Assigned To
                </div>
                <div className="mt-1 text-sm font-medium text-foreground">{selectedLead.assignedTo}</div>
              </div>
            </div>

            {/* Interested Unit */}
            <div className="rounded-lg border border-border p-4">
              <div className="text-xs text-muted-foreground">Interested In</div>
              <div className="mt-1 text-lg font-semibold text-primary">{selectedLead.interestedUnit}</div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {selectedLead.status !== "converted" && selectedLead.status !== "lost" && (
                <>
                  <Button className="flex-1">Create Reservation</Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    Update Status
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}
