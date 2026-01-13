"use client"

import * as React from "react"
import { useState } from "react"
import { Header } from "@/components/erp/header"
import { DataTable } from "@/components/erp/data-table"
import { StatusBadge } from "@/components/erp/status-badge"
import { Drawer } from "@/components/erp/drawer"
import { Button } from "@/components/ui/button"
import { SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { leads, type Lead } from "@/lib/mock-data"
import { User, Mail, Phone, Calendar, Tag, UserCheck, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

// --- Helper Components ---

interface FilterButtonProps {
  active: boolean
  onClick: () => void
  label: string
  color?: "primary" | "sky" | "indigo" | "teal"
}

function FilterButton({ active, onClick, label, color = "primary" }: FilterButtonProps) {
  const colorVariants = {
    primary: active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80",
    sky: active ? "bg-sky-500 text-white" : "bg-sky-500/10 text-sky-600 border border-sky-500/20 hover:bg-sky-500/20",
    indigo: active ? "bg-indigo-500 text-white" : "bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 hover:bg-indigo-500/20",
    teal: active ? "bg-teal-500 text-white" : "bg-teal-500/10 text-teal-600 border border-teal-500/20 hover:bg-teal-500/20",
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold transition-all",
        colorVariants[color]
      )}
    >
      {label}
    </button>
  )
}

function DetailItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-sm font-medium text-foreground/80">{label}</span>
    </div>
  )
}

// --- Main Page Component ---

export default function LeadsPage() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("")

  const filteredLeads = leads.filter((lead) => {
    if (statusFilter && lead.status !== statusFilter) return false
    return true
  })

  const columns = [
    {
      key: "name",
      header: "Lead Name",
      render: (item: Lead) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {item.name.charAt(0)}
          </div>
          <span className="font-medium text-foreground">{item.name}</span>
        </div>
      ),
    },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone" },
    {
      key: "source",
      header: "Source",
      render: (item: Lead) => (
        <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground border border-border/50">
          {item.source}
        </span>
      ),
    },
    { key: "interestedUnit", header: "Interested Unit" },
    {
      key: "status",
      header: "Status",
      // Cast status if StatusBadge expects lowercase but mock-data is Title Case
      render: (item: Lead) => <StatusBadge status={item.status as any} />,
    },
    {
      key: "actions",
      header: "",
      render: () => <MoreHorizontal className="h-4 w-4 text-muted-foreground cursor-pointer" />,
    },
  ]

  const leadCounts = {
    all: leads.length,
    new: leads.filter((l) => l.status === "New").length,
    contacted: leads.filter((l) => l.status === "Contacted").length,
    qualified: leads.filter((l) => l.status === "Qualified").length,
  }

  return (
    <div className="min-h-screen bg-background/50">
      <Header title="Lead Management" subtitle="Track and manage all sales leads" />

      <div className="p-6">
        {/* Status Filter Pills */}
        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <FilterButton
            active={statusFilter === ""}
            onClick={() => setStatusFilter("")}
            label={`All (${leadCounts.all})`}
          />
          <FilterButton
            active={statusFilter === "New"}
            onClick={() => setStatusFilter("New")}
            label={`New (${leadCounts.new})`}
            color="sky"
          />
          <FilterButton
            active={statusFilter === "Contacted"}
            onClick={() => setStatusFilter("Contacted")}
            label={`Contacted (${leadCounts.contacted})`}
            color="indigo"
          />
          <FilterButton
            active={statusFilter === "Qualified"}
            onClick={() => setStatusFilter("Qualified")}
            label={`Qualified (${leadCounts.qualified})`}
            color="teal"
          />
        </div>

        {/* Leads Table Wrapper */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <DataTable 
            columns={columns} 
            data={filteredLeads} 
            onRowClick={(row) => setSelectedLead(row as Lead)} 
          />
        </div>
      </div>

      {/* Lead Detail Drawer */}
      <Drawer 
        open={!!selectedLead} 
        onClose={() => setSelectedLead(null)}
        title="Lead Details" // FIXED: Added required title prop
      >
        {selectedLead && (
          <div className="flex flex-col gap-6 h-full">
            <SheetHeader className="text-left px-0">
              <SheetTitle className="text-xl">Lead Information</SheetTitle>
              <SheetDescription>
                Detailed overview of the lead's contact and unit interests.
              </SheetDescription>
            </SheetHeader>

            {/* Contact Info Profile Section */}
            <div className="flex items-center gap-4 py-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 border-2 border-primary/20">
                <User className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground leading-none mb-2">{selectedLead.name}</h3>
                <StatusBadge status={selectedLead.status as any} />
              </div>
            </div>

            {/* Contact Details Grid */}
            <div className="space-y-3 rounded-xl border border-border p-4 bg-muted/30">
              <DetailItem icon={<Mail className="h-4 w-4" />} label={selectedLead.email} />
              <DetailItem icon={<Phone className="h-4 w-4" />} label={selectedLead.phone} />
              <DetailItem 
                icon={<Calendar className="h-4 w-4" />} 
                label={`Created: ${selectedLead.createdAt}`} 
              />
            </div>

            {/* Lead Info Badges */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-muted/50 p-3 border border-border/50">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase">
                  <Tag className="h-3 w-3" />
                  Source
                </div>
                <div className="mt-1 text-sm font-semibold text-foreground">{selectedLead.source}</div>
              </div>
              <div className="rounded-xl bg-muted/50 p-3 border border-border/50">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase">
                  <UserCheck className="h-3 w-3" />
                  Assigned
                </div>
                <div className="mt-1 text-sm font-semibold text-foreground">{selectedLead.assignedTo}</div>
              </div>
            </div>

            {/* Unit Focus Card */}
            <div className="rounded-xl border-2 border-primary/10 bg-primary/5 p-4">
              <div className="text-[10px] font-bold uppercase tracking-wider text-primary/70">Interested Unit</div>
              <div className="mt-1 text-xl font-bold text-primary">{selectedLead.interestedUnit}</div>
            </div>

            {/* Action Footer */}
            <div className="flex flex-col gap-2 mt-auto pb-6">
              {selectedLead.status !== "Converted" && ( // FIXED: Comparison with Title Case
                <>
                  <Button className="w-full shadow-md">Create Reservation</Button>
                  <Button variant="outline" className="w-full">Update Lead Status</Button>
                </>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}