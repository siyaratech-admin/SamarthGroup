"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Building2,
  FileText,
  CreditCard,
  FolderOpen,
  LayoutDashboard,
  ChevronDown,
  Home,
  TrendingUp,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    children: [
      { name: "Sales Overview", href: "/" },
      { name: "Finance Overview", href: "/dashboard/finance" },
      { name: "Inventory Overview", href: "/dashboard/inventory" },
    ],
  },
  {
    name: "Inventory",
    href: "/inventory",
    icon: Building2,
    children: [
      { name: "All Units", href: "/inventory" },
      { name: "By Project", href: "/inventory/projects" },
    ],
  },
  {
    name: "Sales",
    href: "/sales",
    icon: TrendingUp,
    children: [
      { name: "Leads", href: "/sales/leads" },
      { name: "Reservations", href: "/sales/reservations" },
      { name: "Bookings", href: "/sales/bookings" },
    ],
  },
  {
    name: "Invoicing",
    href: "/invoices",
    icon: FileText,
  },
  {
    name: "Payments",
    href: "/payments",
    icon: CreditCard,
    children: [
      { name: "All Payments", href: "/payments" },
      { name: "Customer Ledger", href: "/payments/ledger" },
    ],
  },
  {
    name: "Documents",
    href: "/documents",
    icon: FolderOpen,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>(["Dashboard", "Inventory", "Sales", "Payments"])
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileOpen])

  const toggleExpand = (name: string) => {
    setExpandedItems((prev) => (prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]))
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center gap-2.5 border-b border-sidebar-border px-4 lg:h-16 lg:px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Home className="h-4 w-4 text-primary-foreground" />
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-semibold text-sidebar-foreground">Samarth Group</span>
          <span className="text-[10px] text-muted-foreground lg:text-xs">SIFMS</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto h-8 w-8 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 lg:p-4">
        <div className="flex flex-col gap-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            const isExpanded = expandedItems.includes(item.name)
            const hasChildren = item.children && item.children.length > 0

            return (
              <div key={item.name}>
                <div
                  className={cn(
                    "flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors cursor-pointer",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                  )}
                  onClick={() => hasChildren && toggleExpand(item.name)}
                >
                  <Link
                    href={item.href}
                    className="flex min-w-0 flex-1 items-center gap-3"
                    onClick={(e) => {
                      if (hasChildren) e.preventDefault()
                      else setIsMobileOpen(false)
                    }}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </Link>
                  {hasChildren && (
                    <ChevronDown
                      className={cn("h-4 w-4 flex-shrink-0 transition-transform", isExpanded && "rotate-180")}
                    />
                  )}
                </div>

                {hasChildren && isExpanded && (
                  <div className="ml-5 mt-1 flex flex-col gap-0.5 border-l border-sidebar-border pl-3 lg:ml-6">
                    {item.children.map((child) => {
                      const isChildActive = pathname === child.href
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "rounded-lg px-3 py-1.5 text-sm transition-colors",
                            isChildActive
                              ? "text-primary font-medium"
                              : "text-muted-foreground hover:text-sidebar-foreground",
                          )}
                          onClick={() => setIsMobileOpen(false)}
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
        </div>
      </nav>

      <div className="border-t border-sidebar-border p-3 lg:p-4">
        <div className="rounded-lg bg-sidebar-accent/50 p-2.5 lg:p-3">
          <div className="flex items-center gap-2.5 lg:gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
              SG
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-xs font-medium text-sidebar-foreground">Admin User</span>
              <span className="truncate text-[10px] text-muted-foreground lg:text-xs">Super Admin</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed left-3 top-3 z-50 h-9 w-9 bg-background shadow-sm lg:hidden"
        onClick={() => setIsMobileOpen(true)}
      >
        <Menu className="h-4 w-4" />
      </Button>

      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-60 border-r border-sidebar-border bg-sidebar lg:block xl:w-64">
        <SidebarContent />
      </aside>

      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="fixed left-0 top-0 z-50 h-screen w-64 max-w-[85vw] border-r border-sidebar-border bg-sidebar shadow-xl lg:hidden">
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  )
}
