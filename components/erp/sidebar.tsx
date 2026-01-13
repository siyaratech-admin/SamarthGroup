"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Building2,
  FileText,
  LayoutDashboard,
  ChevronDown,
  Home,
  TrendingUp,
  Menu,
  X,
  PieChart,
  Users
} from "lucide-react"
import { Button } from "@/components/ui/button"

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    children: [
      { name: "Sales Overview", href: "/" },
      { name: "Analytics", href: "/dashboard/analytics" },
    ],
  },
  {
    name: "Pre-Sales",
    href: "/presales",
    icon: TrendingUp,
    children: [
      { name: "Lead Pipeline", href: "/presales/leads" },
      { name: "Campaigns", href: "/presales/campaigns" },
      { name: "Channel Partner", href: "/presales/channelpartner" },
    ],
  },
  {
    name: "Sales",
    href: "/sales",
    icon: Building2,
    children: [
      { name: "Inventory", href: "/inventory" },
      { name: "Bookings", href: "/sales/bookings" },
      { name: "Reservations", href: "/sales/reservations" },
    ],
  },
  {
    name: "Post-Sales",
    href: "/postsales",
    icon: FileText,
    children: [
      { name: "Invoices & Demands", href: "/invoices" },
      { name: "Payments & Ledger", href: "/payments" },
      { name: "Documents", href: "/documents" },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>(["Pre-Sales"])
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const toggleExpand = (name: string) => {
    setExpandedItems((prev) => 
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    )
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-slate-900 text-slate-300">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 shadow-lg shadow-indigo-500/20">
          <Home className="h-4 w-4 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-tight text-white uppercase">Samarth Group</span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">SIFMS CRM</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href)
          const isExpanded = expandedItems.includes(item.name)
          const hasChildren = item.children && item.children.length > 0

          return (
            <div key={item.name} className="space-y-1">
              <button
                onClick={() => hasChildren && toggleExpand(item.name)}
                className={cn(
                  "w-full flex items-center justify-between rounded-lg px-3 py-2 text-[13px] font-medium transition-all group",
                  isActive ? "text-white bg-slate-800/50" : "text-slate-400 hover:text-white hover:bg-slate-800/30"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn("h-4 w-4", isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300")} />
                  <span>{item.name}</span>
                </div>
                {hasChildren && (
                  <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", isExpanded && "rotate-180")} />
                )}
              </button>

              {hasChildren && isExpanded && (
                <div className="ml-4 mt-1 border-l border-slate-800 pl-3 space-y-1">
                  {item.children.map((child) => {
                    const isChildActive = pathname === child.href
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "block rounded-md px-3 py-1.5 text-[12px] transition-all",
                          isChildActive 
                            ? "text-indigo-400 font-semibold bg-indigo-500/5" 
                            : "text-slate-500 hover:text-slate-300"
                        )}
                      >
                        {child.name}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* User Footer */}
      <div className="border-t border-slate-800 p-4 bg-slate-900/50">
        <div className="flex items-center gap-3 rounded-xl bg-slate-800/40 p-3 border border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-[10px] font-bold text-white uppercase">
            AV
          </div>
          <div className="flex flex-col min-w-0">
            <span className="truncate text-[12px] font-bold text-white">Aditya Verma</span>
            <span className="truncate text-[10px] font-medium text-slate-500 uppercase tracking-tight">Super Admin</span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 h-8 w-8 bg-slate-900 text-white border border-slate-800 lg:hidden"
        onClick={() => setIsMobileOpen(true)}
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-slate-800 bg-slate-900 lg:block shadow-2xl">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setIsMobileOpen(false)} />
          <aside className="fixed left-0 top-0 z-50 h-screen w-64 border-r border-slate-800 bg-slate-900 lg:hidden animate-in slide-in-from-left duration-300">
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  )
}