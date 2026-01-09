"use client"

import { useState } from "react"
import { Header } from "@/components/erp/header"
import { DataTable } from "@/components/erp/data-table"
import { StatusBadge } from "@/components/erp/status-badge"
import { Drawer } from "@/components/erp/drawer"
import { Button } from "@/components/ui/button"
import { documents, customers } from "@/lib/mock-data"
import { FileText, Upload, CheckCircle, Clock, AlertCircle, User, Building2, Calendar, Eye } from "lucide-react"

export default function DocumentsPage() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState("")

  const filteredDocuments = documents.filter((doc) => {
    if (statusFilter && doc.status !== statusFilter) return false
    return true
  })

  const customerGroups = customers.map((customer) => {
    const customerDocs = documents.filter((d) => d.customerId === customer.id)
    return {
      customer,
      documents: customerDocs,
      pending: customerDocs.filter((d) => d.status === "pending").length,
      received: customerDocs.filter((d) => d.status === "received").length,
      verified: customerDocs.filter((d) => d.status === "verified").length,
      total: customerDocs.length,
    }
  })

  const selectedCustomerDocs = selectedCustomerId ? documents.filter((d) => d.customerId === selectedCustomerId) : null
  const selectedCustomer = selectedCustomerId ? customers.find((c) => c.id === selectedCustomerId) : null

  const columns = [
    {
      key: "customerName",
      header: "Customer",
      render: (item: (typeof documents)[0]) => (
        <div className="min-w-[120px]">
          <span className="font-medium text-foreground block truncate">{item.customerName}</span>
          <span className="text-[10px] text-muted-foreground sm:hidden">Unit {item.unitNo}</span>
        </div>
      ),
    },
    { key: "unitNo", header: "Unit" },
    {
      key: "documentType",
      header: "Type",
      render: (item: (typeof documents)[0]) => (
        <div className="flex items-center gap-2 min-w-[100px]">
          <FileText className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
          <span className="text-sm">{item.documentType}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: (typeof documents)[0]) => <StatusBadge status={item.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (item: (typeof documents)[0]) => (
        <div className="flex items-center gap-2">
          {item.status === "pending" && (
            <Button variant="outline" size="sm" className="h-7 w-7 p-0 sm:w-auto sm:px-2 sm:gap-1 bg-transparent">
              <Upload className="h-3.5 w-3.5" /> <span className="hidden sm:inline text-[10px]">Upload</span>
            </Button>
          )}
          {item.status === "received" && (
            <Button variant="outline" size="sm" className="h-7 w-7 p-0 sm:w-auto sm:px-2 sm:gap-1 bg-transparent border-blue-500/50 text-blue-500">
              <CheckCircle className="h-3.5 w-3.5" /> <span className="hidden sm:inline text-[10px]">Verify</span>
            </Button>
          )}
          {item.status === "verified" && (
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 sm:w-auto sm:px-2 sm:gap-1">
              <Eye className="h-3.5 w-3.5" /> <span className="hidden sm:inline text-[10px]">View</span>
            </Button>
          )}
        </div>
      ),
    },
  ]

  const docCounts = {
    all: documents.length,
    pending: documents.filter((d) => d.status === "pending").length,
    received: documents.filter((d) => d.status === "received").length,
    verified: documents.filter((d) => d.status === "verified").length,
  }

  return (
    <div className="min-h-screen bg-background pb-10">
      <Header title="Documents" subtitle="Track submissions and verification" />

      <div className="p-4 sm:p-6">
        {/* Summary Cards - Grid adjustments */}
        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatMini label="Total" count={docCounts.all} icon={FileText} color="text-primary" bg="bg-primary/10" />
          <StatMini label="Pending" count={docCounts.pending} icon={Clock} color="text-amber-400" bg="bg-amber-500/10" />
          <StatMini label="Received" count={docCounts.received} icon={Upload} color="text-blue-400" bg="bg-blue-500/10" />
          <StatMini label="Verified" count={docCounts.verified} icon={CheckCircle} color="text-emerald-400" bg="bg-emerald-500/10" />
        </div>

        {/* Customer-wise Document Progress */}
        <div className="mb-8">
          <h3 className="mb-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Customer Status</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {customerGroups.map((group) => (
              <button
                key={group.customer.id}
                onClick={() => setSelectedCustomerId(group.customer.id)}
                className="group rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-primary/50 hover:shadow-md active:scale-[0.98]"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-foreground truncate text-sm">{group.customer.name}</div>
                    <div className="text-[10px] font-medium text-muted-foreground">UNIT {group.customer.unitNo}</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div className="flex gap-3 text-[10px] font-bold uppercase">
                      <span className="text-amber-500">{group.pending}P</span>
                      <span className="text-blue-500">{group.received}R</span>
                      <span className="text-emerald-500">{group.verified}V</span>
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground">
                      {Math.round((group.verified / group.total) * 100)}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted flex">
                    <div className="h-full bg-emerald-500 transition-all" style={{ width: `${(group.verified / group.total) * 100}%` }} />
                    <div className="h-full bg-blue-500 transition-all" style={{ width: `${(group.received / group.total) * 100}%` }} />
                    <div className="h-full bg-amber-500 transition-all" style={{ width: `${(group.pending / group.total) * 100}%` }} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Filters - Horizontal Scroll on mobile */}
        <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <FilterPill active={statusFilter === ""} onClick={() => setStatusFilter("")} label="All" count={docCounts.all} color="bg-primary" />
          <FilterPill active={statusFilter === "pending"} onClick={() => setStatusFilter("pending")} label="Pending" count={docCounts.pending} color="bg-amber-500" />
          <FilterPill active={statusFilter === "received"} onClick={() => setStatusFilter("received")} label="Received" count={docCounts.received} color="bg-blue-500" />
          <FilterPill active={statusFilter === "verified"} onClick={() => setStatusFilter("verified")} label="Verified" count={docCounts.verified} color="bg-emerald-500" />
        </div>

        {/* Table Container */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <DataTable columns={columns} data={filteredDocuments} />
          </div>
        </div>
      </div>

      {/* Checklist Drawer */}
      <Drawer
        open={!!selectedCustomerId}
        onClose={() => setSelectedCustomerId(null)}
        title="Verification Checklist"
      >
        {selectedCustomer && selectedCustomerDocs && (
          <div className="flex flex-col gap-6 pb-10">
            <div className="flex items-center gap-4 border-b border-border pb-6">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground leading-tight">{selectedCustomer.name}</h3>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">Unit {selectedCustomer.unitNo}</p>
              </div>
            </div>

            <div className="space-y-3">
              {selectedCustomerDocs.map((doc) => (
                <div key={doc.id} className="flex flex-col gap-3 rounded-xl border border-border p-4 bg-muted/20">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <div className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${
                        doc.status === "verified" ? "bg-emerald-500/10 text-emerald-500" : 
                        doc.status === "received" ? "bg-blue-500/10 text-blue-500" : "bg-amber-500/10 text-amber-500"
                      }`}>
                        {doc.status === "verified" ? <CheckCircle className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-foreground">{doc.documentType}</div>
                        {doc.uploadedAt && (
                          <div className="mt-1 flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                            <Calendar className="h-3 w-3" /> {doc.uploadedAt}
                          </div>
                        )}
                      </div>
                    </div>
                    <StatusBadge status={doc.status} />
                  </div>
                  
                  <div className="flex gap-2 pt-1">
                    {doc.status === "pending" ? (
                      <Button variant="default" size="sm" className="w-full gap-2 text-xs h-9">
                        <Upload className="h-3.5 w-3.5" /> Upload Now
                      </Button>
                    ) : (
                      <>
                        <Button variant="outline" size="sm" className="flex-1 gap-2 text-xs h-9 bg-card">
                          <Eye className="h-3.5 w-3.5" /> View
                        </Button>
                        {doc.status === "received" && (
                          <Button size="sm" className="flex-1 gap-2 text-xs h-9 bg-emerald-600 hover:bg-emerald-700">
                            <CheckCircle className="h-3.5 w-3.5" /> Verify
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full gap-2 border-dashed border-2 py-6 text-muted-foreground hover:text-primary hover:border-primary/50">
              <Upload className="h-4 w-4" /> Add Extra Document
            </Button>
          </div>
        )}
      </Drawer>
    </div>
  )
}

// --- Internal UI Components ---

function StatMini({ label, count, icon: Icon, color, bg }: any) {
  return (
    <div className="rounded-xl border border-border bg-card p-3 sm:p-4">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className={`flex h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-lg ${bg}`}>
          <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${color}`} />
        </div>
        <div className="min-w-0">
          <div className="text-lg sm:text-2xl font-bold text-foreground truncate leading-none">{count}</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-1">{label}</div>
        </div>
      </div>
    </div>
  )
}

function FilterPill({ active, onClick, label, count, color }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition-all ${
        active ? `${color} text-white shadow-lg shadow-primary/20` : "bg-muted text-muted-foreground hover:bg-muted/80"
      }`}
    >
      {label} <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${active ? "bg-white/20" : "bg-background/50"}`}>{count}</span>
    </button>
  )
}