"use client"

import { useState } from "react"
import { Header } from "@/components/erp/header"
import { DataTable } from "@/components/erp/data-table"
import { StatusBadge } from "@/components/erp/status-badge"
import { Drawer } from "@/components/erp/drawer"
import { Button } from "@/components/ui/button"
import { units, projects, type Unit } from "@/lib/mock-data"
import { Filter, Building2, Layers, MapPin, IndianRupee, Clock } from "lucide-react"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function InventoryPage() {
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null)
  const [filters, setFilters] = useState({
    project: "",
    tower: "",
    status: "",
  })

  const filteredUnits = units.filter((unit) => {
    if (filters.project && unit.projectName !== filters.project) return false
    if (filters.tower && unit.towerName !== filters.tower) return false
    if (filters.status && unit.status !== filters.status) return false
    return true
  })

  const columns = [
    {
      key: "unitNo",
      header: "Unit No",
      render: (item: Unit) => <span className="font-medium text-foreground">{item.unitNo}</span>,
    },
    { key: "projectName", header: "Project" },
    { key: "towerName", header: "Tower" },
    { key: "floor", header: "Floor" },
    { key: "type", header: "Type" },
    {
      key: "carpetArea",
      header: "Carpet Area",
      render: (item: Unit) => `${item.carpetArea} sq.ft`,
    },
    {
      key: "price",
      header: "Price",
      render: (item: Unit) => formatCurrency(item.price),
    },
    {
      key: "status",
      header: "Status",
      render: (item: Unit) => <StatusBadge status={item.status} />,
    },
  ]

  const selectedProject = projects.find((p) => p.name === filters.project)

  return (
    <div className="min-h-screen bg-background">
      <Header title="Inventory Management" subtitle="Manage units across all projects and towers" />

      <div className="p-4 sm:p-6">
        {/* Filters */}
        <div className="mb-6 rounded-xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center gap-2 sm:mb-0 sm:gap-4">
            <Filter className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Filters:</span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <select
              value={filters.project}
              onChange={(e) => setFilters({ ...filters, project: e.target.value, tower: "" })}
              className="w-full rounded-lg border border-border bg-secondary px-3 py-1.5 text-sm text-foreground sm:w-auto"
            >
              <option value="">All Projects</option>
              {projects.map((project) => (
                <option key={project.id} value={project.name}>
                  {project.name}
                </option>
              ))}
            </select>

            <select
              value={filters.tower}
              onChange={(e) => setFilters({ ...filters, tower: e.target.value })}
              className="w-full rounded-lg border border-border bg-secondary px-3 py-1.5 text-sm text-foreground sm:w-auto"
              disabled={!selectedProject}
            >
              <option value="">All Towers</option>
              {selectedProject?.towers.map((tower) => (
                <option key={tower} value={tower}>
                  {tower}
                </option>
              ))}
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full rounded-lg border border-border bg-secondary px-3 py-1.5 text-sm text-foreground sm:w-auto"
            >
              <option value="">All Status</option>
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="booked">Booked</option>
              <option value="sold">Sold</option>
            </select>

            {(filters.project || filters.tower || filters.status) && (
              <Button variant="ghost" size="sm" onClick={() => setFilters({ project: "", tower: "", status: "" })}>
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 sm:p-4">
            <div className="text-xl font-bold text-emerald-400 sm:text-2xl">
              {filteredUnits.filter((u) => u.status === "available").length}
            </div>
            <div className="text-xs text-emerald-400/80 sm:text-sm">Available</div>
          </div>
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 sm:p-4">
            <div className="text-xl font-bold text-amber-400 sm:text-2xl">
              {filteredUnits.filter((u) => u.status === "reserved").length}
            </div>
            <div className="text-xs text-amber-400/80 sm:text-sm">Reserved</div>
          </div>
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3 sm:p-4">
            <div className="text-xl font-bold text-blue-400 sm:text-2xl">
              {filteredUnits.filter((u) => u.status === "booked").length}
            </div>
            <div className="text-xs text-blue-400/80 sm:text-sm">Booked</div>
          </div>
          <div className="rounded-xl border border-purple-500/20 bg-purple-500/10 p-3 sm:p-4">
            <div className="text-xl font-bold text-purple-400 sm:text-2xl">
              {filteredUnits.filter((u) => u.status === "sold").length}
            </div>
            <div className="text-xs text-purple-400/80 sm:text-sm">Sold</div>
          </div>
        </div>

        {/* Units Table */}
        <DataTable columns={columns} data={filteredUnits} onRowClick={setSelectedUnit} />
      </div>

      {/* Unit Detail Drawer */}
      <Drawer open={!!selectedUnit} onClose={() => setSelectedUnit(null)} title={`Unit ${selectedUnit?.unitNo}`}>
        {selectedUnit && (
          <div className="flex flex-col gap-6">
            {/* Unit Info */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Project</div>
                  <div className="text-sm font-medium text-foreground">{selectedUnit.projectName}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                <Layers className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Tower</div>
                  <div className="text-sm font-medium text-foreground">{selectedUnit.towerName}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Floor</div>
                  <div className="text-sm font-medium text-foreground">{selectedUnit.floor}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                <div className="h-5 w-5 text-center text-muted-foreground">📐</div>
                <div>
                  <div className="text-xs text-muted-foreground">Type</div>
                  <div className="text-sm font-medium text-foreground">{selectedUnit.type}</div>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="rounded-lg border border-border p-4">
              <div className="mb-2 text-xs text-muted-foreground">Current Status</div>
              <StatusBadge status={selectedUnit.status} />
            </div>

            {/* Pricing Breakup */}
            <div className="rounded-lg border border-border p-4">
              <h4 className="mb-4 flex items-center gap-2 text-sm font-medium text-foreground">
                <IndianRupee className="h-4 w-4" />
                Pricing Details
              </h4>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Carpet Area</span>
                  <span className="text-foreground">{selectedUnit.carpetArea} sq.ft</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Rate per sq.ft</span>
                  <span className="text-foreground">{formatCurrency(selectedUnit.pricePerSqFt)}</span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-foreground">Total Price</span>
                    <span className="text-primary">{formatCurrency(selectedUnit.price)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status History */}
            <div className="rounded-lg border border-border p-4">
              <h4 className="mb-4 flex items-center gap-2 text-sm font-medium text-foreground">
                <Clock className="h-4 w-4" />
                Status History
              </h4>
              <div className="flex flex-col gap-3">
                {selectedUnit.statusHistory.map((history, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <span className="truncate text-sm font-medium text-foreground">{history.status}</span>
                        <span className="whitespace-nowrap text-xs text-muted-foreground">{history.date}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">by {history.user}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="rounded-lg border border-border p-4">
              <h4 className="mb-4 text-sm font-medium text-foreground">Amenities</h4>
              <div className="flex flex-wrap gap-2">
                {selectedUnit.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row">
              {selectedUnit.status === "available" && (
                <>
                  <Button className="flex-1">Reserve Unit</Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    Book Unit
                  </Button>
                </>
              )}
              {selectedUnit.status === "reserved" && <Button className="flex-1">Convert to Booking</Button>}
              {(selectedUnit.status === "booked" || selectedUnit.status === "sold") && (
                <Button variant="outline" className="flex-1 bg-transparent">
                  View Invoice
                </Button>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}
