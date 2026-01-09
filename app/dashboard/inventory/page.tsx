"use client"

import { Header } from "@/components/erp/header"
import { StatCard } from "@/components/erp/stat-card"
import { dashboardStats, projects, units } from "@/lib/mock-data"
import { Building2, Layers, Home, Package } from "lucide-react"

export default function InventoryDashboard() {
  const { inventory } = dashboardStats

  const projectData = projects.map((project) => {
    const projectUnits = units.filter((u) => u.projectName === project.name)
    return {
      name: project.name,
      total: projectUnits.length,
      available: projectUnits.filter((u) => u.status === "available").length,
      reserved: projectUnits.filter((u) => u.status === "reserved").length,
      booked: projectUnits.filter((u) => u.status === "booked").length,
      sold: projectUnits.filter((u) => u.status === "sold").length,
    }
  })

  return (
    <div className="min-h-screen bg-background">
      <Header title="Inventory Dashboard" subtitle="Overview of all inventory across projects" />

      <div className="p-4 sm:p-6">
        {/* Stats Grid - Responsive from 1 to 4 columns */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:mb-8">
          <StatCard title="Total Projects" value={inventory.projects} icon={Building2} />
          <StatCard title="Total Towers" value={inventory.towers} icon={Layers} />
          <StatCard title="Total Units" value={inventory.totalUnits} icon={Home} />
          <StatCard
            title="Available Units"
            value={inventory.available}
            subtitle={`${Math.round((inventory.available / inventory.totalUnits) * 100)}% of total`}
            icon={Package}
          />
        </div>

        {/* Status Distribution - Responsive from 1 to 2 columns */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Circular Chart Section */}
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
            <h3 className="mb-6 text-sm font-medium text-foreground">Overall Unit Status Distribution</h3>
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
              <div className="relative h-40 w-40 flex-shrink-0 sm:h-48 sm:w-48">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-emerald-500"
                    strokeDasharray={`${(inventory.available / inventory.totalUnits) * 88} 88`}
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-amber-500"
                    strokeDasharray={`${(inventory.reserved / inventory.totalUnits) * 88} 88`}
                    strokeDashoffset={`-${(inventory.available / inventory.totalUnits) * 88}`}
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-blue-500"
                    strokeDasharray={`${(inventory.booked / inventory.totalUnits) * 88} 88`}
                    strokeDashoffset={`-${((inventory.available + inventory.reserved) / inventory.totalUnits) * 88}`}
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-purple-500"
                    strokeDasharray={`${(inventory.sold / inventory.totalUnits) * 88} 88`}
                    strokeDashoffset={`-${((inventory.available + inventory.reserved + inventory.booked) / inventory.totalUnits) * 88}`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-foreground sm:text-3xl">{inventory.totalUnits}</span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground sm:text-xs">Total Units</span>
                </div>
              </div>

              {/* Legend Grid - 2 columns on mobile, 1 column on larger screens */}
              <div className="grid w-full grid-cols-2 gap-3 sm:flex sm:flex-col">
                <LegendItem color="bg-emerald-500" label="Available" count={inventory.available} total={inventory.totalUnits} />
                <LegendItem color="bg-amber-500" label="Reserved" count={inventory.reserved} total={inventory.totalUnits} />
                <LegendItem color="bg-blue-500" label="Booked" count={inventory.booked} total={inventory.totalUnits} />
                <LegendItem color="bg-purple-500" label="Sold" count={inventory.sold} total={inventory.totalUnits} />
              </div>
            </div>
          </div>

          {/* Project Wise Bar Section */}
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
            <h3 className="mb-6 text-sm font-medium text-foreground">Project-wise Distribution</h3>
            <div className="flex flex-col gap-6">
              {projectData.map((project) => (
                <div key={project.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-foreground">{project.name}</span>
                    <span className="text-muted-foreground">{project.total} units</span>
                  </div>
                  <div className="flex h-5 overflow-hidden rounded-md bg-muted/50">
                    <div
                      className="bg-emerald-500 transition-all"
                      style={{ width: `${(project.available / Math.max(project.total, 1)) * 100}%` }}
                    />
                    <div
                      className="bg-amber-500 transition-all"
                      style={{ width: `${(project.reserved / Math.max(project.total, 1)) * 100}%` }}
                    />
                    <div
                      className="bg-blue-500 transition-all"
                      style={{ width: `${(project.booked / Math.max(project.total, 1)) * 100}%` }}
                    />
                    <div
                      className="bg-purple-500 transition-all"
                      style={{ width: `${(project.sold / Math.max(project.total, 1)) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper component for Legend to keep code clean
function LegendItem({ color, label, count, total }: { color: string; label: string; count: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`h-3 w-3 flex-shrink-0 rounded ${color}`} />
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
        <span className="text-xs font-medium text-foreground sm:text-sm">{label}</span>
        <span className="text-[10px] text-muted-foreground sm:text-xs">
          {count} ({Math.round((count / total) * 100)}%)
        </span>
      </div>
    </div>
  )
}