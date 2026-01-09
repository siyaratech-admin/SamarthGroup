"use client"

import { Header } from "@/components/erp/header"
import { projects, units } from "@/lib/mock-data"
import { Building2, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function ProjectsPage() {
  const getProjectStats = (projectName: string) => {
    const projectUnits = units.filter((u) => u.projectName === projectName)
    return {
      total: projectUnits.length,
      available: projectUnits.filter((u) => u.status === "available").length,
      reserved: projectUnits.filter((u) => u.status === "reserved").length,
      booked: projectUnits.filter((u) => u.status === "booked").length,
      sold: projectUnits.filter((u) => u.status === "sold").length,
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="Projects Overview" subtitle="View inventory by project and tower" />

      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 gap-6">
          {projects.map((project) => {
            const stats = getProjectStats(project.name)
            return (
              <div key={project.id} className="rounded-xl border border-border bg-card p-4 sm:p-6">
                {/* Header Section - Stack on Mobile */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {project.towers.length} towers · {stats.total} units
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/inventory?project=${encodeURIComponent(project.name)}`}
                    className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    View All Units <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>

                {/* Stats Row - Responsive Grid (2 cols mobile, 3 tablet, 5 desktop) */}
                <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
                  <StatBox label="Total" value={stats.total} colorClass="text-foreground" bgClass="bg-muted/50" />
                  <StatBox label="Available" value={stats.available} colorClass="text-emerald-500" bgClass="bg-emerald-500/10" />
                  <StatBox label="Reserved" value={stats.reserved} colorClass="text-amber-500" bgClass="bg-amber-500/10" />
                  <StatBox label="Booked" value={stats.booked} colorClass="text-blue-500" bgClass="bg-blue-500/10" />
                  <StatBox label="Sold" value={stats.sold} colorClass="text-purple-500" bgClass="bg-purple-500/10" />
                </div>

                {/* Towers Grid - Responsive Grid (1 col mobile, 2 tablet, 3 desktop) */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {project.towers.map((tower) => {
                    const towerUnits = units.filter((u) => u.projectName === project.name && u.towerName === tower)
                    const towerAvailable = towerUnits.filter((u) => u.status === "available").length
                    return (
                      <Link
                        key={tower}
                        href={`/inventory?project=${encodeURIComponent(project.name)}&tower=${encodeURIComponent(tower)}`}
                        className="group rounded-lg border border-border bg-muted/30 p-4 transition-colors hover:border-primary/50 hover:bg-muted/50"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">{tower}</span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          {towerUnits.length} units · {towerAvailable} available
                        </div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-emerald-500"
                            style={{ width: `${(towerAvailable / Math.max(towerUnits.length, 1)) * 100}%` }}
                          />
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Internal Helper for cleaner code
function StatBox({ label, value, colorClass, bgClass }: { label: string, value: number, colorClass: string, bgClass: string }) {
  return (
    <div className={`rounded-lg ${bgClass} p-3 text-center`}>
      <div className={`text-xl font-bold ${colorClass}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{label}</div>
    </div>
  )
}