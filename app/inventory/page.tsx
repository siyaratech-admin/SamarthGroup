"use client"

import { useState, useMemo, useEffect } from "react"
import { Header } from "@/components/erp/header"
import { DataTable } from "@/components/erp/data-table"
import { BuildingView } from "@/components/erp/building-view"
import { StatusBadge } from "@/components/erp/status-badge"
import { Button } from "@/components/ui/button"
import { units, projects, type Unit } from "@/lib/mock-data"
import { 
  Filter, LayoutGrid, List, Info, CheckCircle2, 
  Clock, Ban, IndianRupee, Search, Plus
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
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    project: "Samarth Heights",
    tower: "",
    status: "",
  })

  // Solve the "A tree hydrated but some attributes..." error
  useEffect(() => {
    setMounted(true)
  }, [])

  const displayUnits = useMemo(() => {
    return units.filter((unit) => {
      const matchesSearch = unit.unitNo.toLowerCase().includes(searchQuery.toLowerCase())
      if (!matchesSearch) return false
      if (filters.project && unit.projectName !== filters.project) return false
      if (filters.tower && unit.towerName !== filters.tower) return false
      if (filters.status && unit.status !== filters.status) return false
      return true
    })
  }, [filters, searchQuery])

  const columns = [
    {
      key: "unitNo",
      header: "Unit",
      render: (item: Unit) => (
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900">{item.unitNo}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 text-slate-400 cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent className="p-3 bg-white border shadow-xl z-50">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Details</p>
                <p className="text-sm font-bold">{item.carpetArea} sq.ft Carpet</p>
                <p className="text-xs text-slate-500">{item.floor === 0 ? "Ground" : `${item.floor}th Floor`}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
    },
    { key: "type", header: "BHK" },
    {
      key: "price",
      header: "Price",
      render: (item: Unit) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-700">{formatCurrency(item.price)}</span>
          <span className="text-[8px] text-slate-400 uppercase font-black">Inc. GST</span>
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
          className="h-8 text-[10px] font-bold uppercase tracking-wider bg-white"
          onClick={(e) => {
             e.stopPropagation();
             router.push(`/sales/booking?unitId=${item.id}`);
          }}
          disabled={item.status === 'sold'}
        >
          {item.status === 'available' ? 'Reserve' : 'View'}
        </Button>
      )
    }
  ]

  if (!mounted) return null

  const selectedProject = projects.find((p) => p.name === filters.project)

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <Header title="Inventory Control" subtitle="Real-time Unit Status" />

      <div className="p-3 md:p-6 max-w-[1600px] mx-auto space-y-4 md:space-y-6">
        
        {/* Optimized Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <InventoryStatCard label="Available" count={displayUnits.filter(u => u.status === "available").length} color="emerald" icon={CheckCircle2} />
          <InventoryStatCard label="Reserved" count={displayUnits.filter(u => u.status === "reserved").length} color="amber" icon={Clock} />
          <InventoryStatCard label="Booked" count={displayUnits.filter(u => u.status === "booked").length} color="blue" icon={IndianRupee} />
          <InventoryStatCard label="Sold" count={displayUnits.filter(u => u.status === "sold").length} color="slate" icon={Ban} />
        </div>

        {/* Global Toolbar */}
        <div className="flex flex-col gap-4 bg-white p-3 md:p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
            {/* Search - Matches yource07a6 reference */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Search by unit no..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="flex items-center gap-2">
               <Button variant="outline" className="flex-1 md:flex-none text-xs font-bold gap-2">
                 <Filter className="h-3.5 w-3.5" /> EXPORT
               </Button>
               <Button className="flex-1 md:flex-none text-xs font-bold gap-2 bg-indigo-600">
                 <Plus className="h-3.5 w-3.5" /> ADD PARTNER
               </Button>
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Filters & View Toggles */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
            <div className="flex flex-wrap gap-2">
              <select
                value={filters.project}
                onChange={(e) => setFilters({ ...filters, project: e.target.value, tower: "" })}
                className="h-9 rounded-lg border-slate-200 bg-slate-50 px-3 text-xs font-bold outline-none ring-offset-white focus:ring-2 focus:ring-indigo-500"
              >
                {projects.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
              </select>

              <select
                value={filters.tower}
                onChange={(e) => setFilters({ ...filters, tower: e.target.value })}
                className="h-9 rounded-lg border-slate-200 bg-slate-50 px-3 text-xs font-bold outline-none disabled:opacity-50"
                disabled={!selectedProject}
              >
                <option value="">All Towers</option>
                {selectedProject?.towers.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode("building")}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider transition-all ${viewMode === 'building' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
              >
                <LayoutGrid className="h-3.5 w-3.5" /> Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
              >
                <List className="h-3.5 w-3.5" /> List
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Display Area */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px]">
          {viewMode === 'list' ? (
            <div className="overflow-x-auto">
              <DataTable columns={columns} data={displayUnits} onRowClick={(unit) => router.push(`/inventory/${unit.id}`)} />
            </div>
          ) : (
            <div className="p-4 md:p-6 overflow-x-auto">
              <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-slate-800 uppercase tracking-tighter">Tower Status Grid</h2>
                  <p className="text-xs text-slate-500 font-medium">Click unit to view Price Details & History</p>
                </div>
                <div className="flex flex-wrap gap-3 text-[9px] font-bold uppercase bg-slate-50 p-2 rounded-lg border border-slate-100">
                   <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-emerald-500 rounded-sm" /> Available</div>
                   <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-amber-500 rounded-sm" /> On-Hold</div>
                   <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-blue-500 rounded-sm" /> Booked</div>
                   <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-slate-300 rounded-sm" /> Sold</div>
                </div>
              </div>
              
              <div className="min-w-[700px]">
                <BuildingView
                  units={displayUnits}
                  projects={projects}
                  selectedProject={filters.project}
                  selectedTower={filters.tower}
                  onUnitClick={(unit) => router.push(`/inventory/${unit.id}`)}
                  onProjectSelect={(name) => setFilters(prev => ({ ...prev, project: name }))}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function InventoryStatCard({ label, count, color, icon: Icon }: any) {
  const colorMap: any = {
    emerald: "border-emerald-100 bg-emerald-50 text-emerald-600",
    amber: "border-amber-100 bg-amber-50 text-amber-600",
    blue: "border-blue-100 bg-blue-50 text-blue-600",
    slate: "border-slate-200 bg-slate-100 text-slate-600",
  }

  return (
    <div className={`rounded-xl border p-3 md:p-4 transition-all hover:shadow-md ${colorMap[color]}`}>
      <div className="flex justify-between items-start">
        <div className="min-w-0">
          <div className="text-xl md:text-2xl font-black mb-1 truncate">{count}</div>
          <div className="text-[9px] font-black uppercase tracking-widest opacity-80 truncate">{label}</div>
        </div>
        <div className="p-1.5 md:p-2 bg-white/50 rounded-lg shrink-0">
          <Icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
        </div>
      </div>
    </div>
  )
}