"use client"

import { useState } from "react"
import { Unit } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { Building2, Store, Briefcase, Home } from "lucide-react"

interface BuildingViewProps {
    units: Unit[]
    projects: any[]
    selectedProject: string
    selectedTower: string
    onUnitClick: (unit: Unit) => void
    onProjectSelect: (projectName: string) => void
}

export function BuildingView({ units, projects, selectedProject, selectedTower, onUnitClick, onProjectSelect }: BuildingViewProps) {
    const project = projects.find(p => p.name === selectedProject)

    // If no specific project/tower selected, show project cards selection
    if (!selectedProject) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                {projects.map((p) => {
                    const pUnits = units.filter(u => u.projectName === p.name)
                    const available = pUnits.filter(u => u.status === 'available').length

                    return (
                        <div
                            key={p.id}
                            onClick={() => onProjectSelect(p.name)}
                            className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-all cursor-pointer"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                {p.type === 'Commercial' ? <Briefcase className="h-24 w-24" /> : <Building2 className="h-24 w-24" />}
                            </div>
                            <h3 className="text-xl font-bold mb-2">{p.name}</h3>
                            <div className="flex gap-2 mb-4">
                                <span className={`text-xs px-2 py-1 rounded-full border ${p.type === 'Commercial' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'}`}>
                                    {p.type}
                                </span>
                                <span className="text-xs px-2 py-1 rounded-full border bg-secondary text-secondary-foreground">
                                    {p.towers.length} Towers
                                </span>
                            </div>
                            <div className="flex gap-4 text-sm text-muted-foreground">
                                <div>
                                    <div className="font-bold text-foreground">{pUnits.length}</div>
                                    Units
                                </div>
                                <div>
                                    <div className="font-bold text-emerald-600">{available}</div>
                                    Available
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }

    const projectUnits = units.filter(u => u.projectName === selectedProject && (!selectedTower || u.towerName === selectedTower))

    // Group units by floor (descending order for building view)
    const floors = Array.from(new Set(projectUnits.map(u => u.floor))).sort((a, b) => b - a)

    return (
        <div className="p-4 sm:p-6 overflow-x-auto">
            <div className="min-w-[800px] flex flex-col gap-4">
                {floors.map((floor) => (
                    <div key={floor} className="flex gap-4">
                        {/* Floor Label */}
                        <div className="w-24 flex-shrink-0 flex items-center justify-end pr-4 border-r border-border">
                            <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                                {floor === 0 ? "Ground" : `Floor ${floor}`}
                            </span>
                        </div>

                        {/* Units Grid */}
                        <div className="flex gap-3 flex-1">
                            {projectUnits.filter(u => u.floor === floor).map((unit) => (
                                <button
                                    key={unit.id}
                                    onClick={() => onUnitClick(unit)}
                                    className={cn(
                                        "relative group flex flex-col justify-between w-32 h-24 p-3 rounded-lg border-2 transition-all hover:-translate-y-1 hover:shadow-md",
                                        getStatusColor(unit.status),
                                        unit.type === 'Shop' || unit.type === 'Showroom' ? 'w-40' : '' // Wider for commercial
                                    )}
                                >
                                    <div className="flex justify-between items-start w-full">
                                        <span className="font-bold text-sm truncate">{unit.unitNo}</span>
                                        {getUnitIcon(unit.type)}
                                    </div>

                                    <div className="text-left">
                                        <div className="text-[10px] font-medium opacity-80 uppercase truncate">{unit.type}</div>
                                        <div className="text-xs font-bold mt-0.5 opacity-90">{formatCompactCurrency(unit.price)}</div>
                                    </div>

                                    {/* Hover details */}
                                    <div className="absolute inset-0 bg-black/80 text-white p-2 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center text-center z-10">
                                        <div>{unit.carpetArea} sq.ft</div>
                                        <div className="font-bold mt-1">Click to View</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Ground / Foundation Visual */}
                <div className="h-4 bg-gradient-to-r from-muted to-muted/50 rounded-full mt-2 ml-24" />
            </div>
        </div>
    )
}

function getStatusColor(status: string) {
    switch (status) {
        case 'available': return "bg-emerald-50 border-emerald-200 text-emerald-900 hover:border-emerald-400 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-100"
        case 'reserved': return "bg-amber-50 border-amber-200 text-amber-900 hover:border-amber-400 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-100"
        case 'booked': return "bg-blue-50 border-blue-200 text-blue-900 hover:border-blue-400 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-100"
        case 'sold': return "bg-slate-100 border-slate-200 text-slate-500 hover:border-slate-400 dark:bg-slate-900/50 dark:border-slate-800 dark:text-slate-400 grayscale"
        default: return "bg-card border-border"
    }
}

function getUnitIcon(type: string) {
    if (type === 'Shop' || type === 'Showroom') return <Store className="h-4 w-4 opacity-50" />
    if (type === 'Office') return <Briefcase className="h-4 w-4 opacity-50" />
    return <Home className="h-4 w-4 opacity-50" />
}

function formatCompactCurrency(amount: number) {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`
    return `₹${amount}`
}
