"use client"

import { Bell, Search, Settings, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTheme } from "@/components/theme-provider"

interface HeaderProps {
  title: string
  subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/40 bg-background/80 px-4 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 lg:h-16 lg:px-6 shadow-sm shadow-black/5">
      <div className="min-w-0 flex-1 pl-11 lg:pl-0">
        <h1 className="truncate text-base font-semibold text-foreground lg:text-lg">{title}</h1>
        {subtitle && <p className="hidden truncate text-xs text-muted-foreground sm:block lg:text-sm">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
        {/* Search - hidden on mobile */}
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search..." className="h-8 w-32 bg-secondary pl-8 text-sm lg:h-9 lg:w-48 xl:w-56" />
        </div>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 lg:h-9 lg:w-9"
          onClick={toggleTheme}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        {/* Notifications - hidden on small mobile */}
        <Button variant="ghost" size="icon" className="relative hidden h-8 w-8 sm:flex lg:h-9 lg:w-9">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
            3
          </span>
        </Button>

        {/* Settings - hidden on small mobile */}
        <Button variant="ghost" size="icon" className="hidden h-8 w-8 sm:flex lg:h-9 lg:w-9">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
