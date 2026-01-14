"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/erp/header"
import { DataTable } from "@/components/erp/data-table"
import { BuildingView } from "@/components/erp/building-view"
import { StatusBadge } from "@/components/erp/status-badge"
import { Button } from "@/components/ui/button"
import { units, projects, type Unit } from "@/lib/mock-data"
import { 
  Filter, LayoutGrid, List, Layers, MapPin, 
  Info, CheckCircle2, Clock, Ban, IndianRupee 
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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
    project: "Samarth Heights", // Defaulting to your main project
    tower: "",
    status: "",
  })

  // Enhanced Filter Logic for Sales Module
  const displayUnits = useMemo(() => {
    return units.filter((unit) => {
      if (filters.project && unit.projectName !== filters.project) return false
      if (filters.tower && unit.towerName !== filters.tower) return false
      if (filters.status && unit.status !== filters.status) return false
      return true
    })
  }, [filters])

  const columns = [
    {
      key: "unitNo",
      header: "Unit No",
      render: (item: Unit) => (
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900">{item.unitNo}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-3.5 w-3.5 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent className="p-3 bg-white border shadow-xl">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Specifications</p>
                <p className="text-sm font-bold">Carpet: {item.carpetArea} sq.ft</p>
                <p className="text-xs text-slate-500">Floor: {item.floor === 0 ? "Ground" : `${item.floor}th Floor`}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
    },
    { key: "towerName", header: "Tower" },
    { key: "type", header: "BHK" },
    {
      key: "price",
      header: "Price",
      render: (item: Unit) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-700">{formatCurrency(item.price)}</span>
          <span className="text-[9px] text-slate-400 uppercase font-black">All Inclusive</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: Unit) => <StatusBadge status={item.status} />,
    },
    {
      key: "actions",
      header: "Action",
      render: (item: Unit) => (
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 text-[10px] font-bold uppercase tracking-wider"
          onClick={(e) => {
             e.stopPropagation();
             router.push(`/sales/booking?unitId=${item.id}`);
          }}
          disabled={item.status === 'sold'}
        >
          {item.status === 'available' ? 'Reserve Unit' : 'View Booking'}
        </Button>
      )
    }
  ]

  const selectedProject = projects.find((p) => p.name === filters.project)

  const handleUnitClick = (unit: Unit) => {
    router.push(`/inventory/${unit.id}`)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header 
        title="Inventory Control" 
        subtitle="Real-time Unit Status & Sales Tracking" 
      />

      <div className="p-4 sm:p-6 max-w-[1600px] mx-auto">
        
        {/* Sales Stats Strip */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <InventoryStatCard 
            label="Available" 
            count={displayUnits.filter((u) => u.status === "available").length} 
            color="emerald" 
            icon={CheckCircle2}
          />
          <InventoryStatCard 
            label="Reserved/Hold" 
            count={displayUnits.filter((u) => u.status === "reserved").length} 
            color="amber" 
            icon={Clock}
          />
          <InventoryStatCard 
            label="Booked" 
            count={displayUnits.filter((u) => u.status === "booked").length} 
            color="blue" 
            icon={IndianRupee}
          />
          <InventoryStatCard 
            label="Sold Out" 
            count={displayUnits.filter((u) => u.status === "sold").length} 
            color="slate" 
            icon={Ban}
          />
        </div>

        {/* Filters & View Toggle */}
        <div className="mb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 pr-4 border-r border-slate-100">
              <Filter className="h-4 w-4 text-slate-400" />
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Filters</span>
            </div>
            
            <select
              value={filters.project}
              onChange={(e) => setFilters({ ...filters, project: e.target.value, tower: "" })}
              className="rounded-lg border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {projects.map((project) => (
                <option key={project.id} value={project.name}>{project.name}</option>
              ))}
            </select>

            <select
              value={filters.tower}
              onChange={(e) => setFilters({ ...filters, tower: e.target.value })}
              className="rounded-lg border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold outline-none"
              disabled={!selectedProject}
            >
              <option value="">All Towers</option>
              {selectedProject?.towers.map((tower) => (
                <option key={tower} value={tower}>{tower}</option>
              ))}
            </select>

            <div className="h-6 w-px bg-slate-100 mx-2" />

            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode("building")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider transition-all ${viewMode === 'building' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
              >
                <LayoutGrid className="h-3.5 w-3.5" /> Building View
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
              >
                <List className="h-3.5 w-3.5" /> Unit List
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {viewMode === 'list' ? (
            <DataTable columns={columns} data={displayUnits} onRowClick={handleUnitClick} />
          ) : (
            <div className="p-6 min-h-[600px]">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-800 uppercase tracking-tighter">Floor-wise Status Grid</h2>
                  <p className="text-xs text-slate-500 font-medium">Click on any unit to initiate booking or view details</p>
                </div>
                <div className="flex gap-4 text-[10px] font-bold uppercase">
                   <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-emerald-500 rounded-sm" /> Available</div>
                   <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-amber-500 rounded-sm" /> Hold</div>
                   <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-slate-300 rounded-sm" /> Sold</div>
                </div>
              </div>
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
    </div>
  )
}

// Sub-component for Stats
function InventoryStatCard({ label, count, color, icon: Icon }: any) {
  const colorMap: any = {
    emerald: "border-emerald-100 bg-emerald-50 text-emerald-600",
    amber: "border-amber-100 bg-amber-50 text-amber-600",
    blue: "border-blue-100 bg-blue-50 text-blue-600",
    slate: "border-slate-200 bg-slate-100 text-slate-600",
  }

  return (
    <div className={`rounded-2xl border p-4 transition-all hover:shadow-md ${colorMap[color]}`}>
      <div className="flex justify-between items-start">
        <div>
          <div className="text-2xl font-black mb-1">{count}</div>
          <div className="text-[10px] font-black uppercase tracking-[0.1em] opacity-80">{label}</div>
        </div>
        <div className="p-2 bg-white/50 rounded-lg">
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  )
}