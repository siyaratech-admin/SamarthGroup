"use client"

import { useState } from "react"
import { Header } from "@/components/erp/header"
import { DataTable } from "@/components/erp/data-table"
import { BuildingView } from "@/components/erp/building-view"
import { StatusBadge } from "@/components/erp/status-badge"
import { Button } from "@/components/ui/button"
import { units, projects, type Unit } from "@/lib/mock-data"
import { Filter, LayoutGrid, List, Layers, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function InventoryPage() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<"list" | "building">("building")
  const [filters, setFilters] = useState({
    project: "",
    tower: "",
    status: "",
  })

  // If viewMode is building, we need to enforce a project selection if not already selected
  const displayUnits = units.filter((unit) => {
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
    { key: "floor", header: "Floor", render: (item: Unit) => item.floor === 0 ? "Ground" : item.floor },
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

  const handleUnitClick = (unit: Unit) => {
    // In a real app we would use router.push, but for query param based demo within same layout
    // Or just a full page navigation
    router.push(`/inventory/${unit.id}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="Inventory Management" subtitle="Manage units across all projects and towers" />

      <div className="p-4 sm:p-6">
        {/* Filters & View Toggle */}
        <div className="mb-6 rounded-xl border border-border bg-card p-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Filters:</span>
            </div>

            {/* View Toggle */}
            <div className="flex bg-muted/50 p-1 rounded-lg self-start sm:self-auto">
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("building")}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'building' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
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

            {viewMode === 'list' && (
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
            )}

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
              {displayUnits.filter((u) => u.status === "available").length}
            </div>
            <div className="text-xs text-emerald-400/80 sm:text-sm">Available</div>
          </div>
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 sm:p-4">
            <div className="text-xl font-bold text-amber-400 sm:text-2xl">
              {displayUnits.filter((u) => u.status === "reserved").length}
            </div>
            <div className="text-xs text-amber-400/80 sm:text-sm">Reserved</div>
          </div>
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3 sm:p-4">
            <div className="text-xl font-bold text-blue-400 sm:text-2xl">
              {displayUnits.filter((u) => u.status === "booked").length}
            </div>
            <div className="text-xs text-blue-400/80 sm:text-sm">Booked</div>
          </div>
          <div className="rounded-xl border border-purple-500/20 bg-purple-500/10 p-3 sm:p-4">
            <div className="text-xl font-bold text-purple-400 sm:text-2xl">
              {displayUnits.filter((u) => u.status === "sold").length}
            </div>
            <div className="text-xs text-purple-400/80 sm:text-sm">Sold</div>
          </div>
        </div>

        {/* Content Area */}
        {viewMode === 'list' ? (
          <DataTable columns={columns} data={displayUnits} onRowClick={handleUnitClick} />
        ) : (
          <div className="rounded-xl border border-border bg-card overflow-hidden min-h-[500px]">
            <BuildingView
              units={units}
              projects={projects}
              selectedProject={filters.project}
              selectedTower={filters.tower}
              onUnitClick={handleUnitClick}
              onProjectSelect={(name) => setFilters(prev => ({ ...prev, project: name }))}
            />
          </div>
        )}
      </div>
    </div>
  )
}
