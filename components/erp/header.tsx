"use client"

import React, { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { 
    Bell, 
    Search, 
    Sun, 
    Moon, 
    User,
    Settings,
    LogOut,
    Command
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface HeaderProps {
    title: string
    subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Wait until mounted to avoid hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900 text-slate-300">
            <div className="flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
                
                {/* Left Side: Brand & Title */}
                <div className="flex items-center min-w-0 flex-1 mr-4">
                    <div className="flex flex-col border-l-2 border-indigo-500 pl-3 md:pl-4 overflow-hidden">
                        <h1 className="text-xs md:text-sm font-bold text-white tracking-wide uppercase truncate">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-[9px] md:text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-0.5 truncate">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>

                {/* Right Side: Actions */}
                <div className="flex items-center gap-1 md:gap-4 flex-shrink-0">
                    
                    {/* Search Logic */}
                    <div className="relative">
                        <div className="hidden lg:block relative">
                            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
                            <Input 
                                placeholder="Quick find..." 
                                className="h-9 w-64 xl:w-72 rounded-lg border-slate-700 bg-slate-800/50 pl-9 text-[13px] text-slate-200 placeholder:text-slate-500 transition-all focus:bg-slate-800 focus:ring-1 focus:ring-slate-600 border-none outline-none"
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-slate-700 bg-slate-900 text-[10px] text-slate-500 font-mono">
                                <Command className="h-2 w-2" /> K
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden h-9 w-9 rounded-lg text-slate-400 hover:bg-slate-800"
                        >
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="flex items-center gap-0.5 md:gap-1">
                        {/* Theme Toggle - Hydration Fixed */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        >
                            {/* We only render the icon if mounted is true */}
                            {!mounted ? (
                                <div className="h-4 w-4" /> 
                            ) : theme === "dark" ? (
                                <Sun className="h-4 w-4" />
                            ) : (
                                <Moon className="h-4 w-4" />
                            )}
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative h-9 w-9 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
                        >
                            <Bell className="h-4 w-4" />
                            <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-indigo-500 ring-2 ring-slate-900" />
                        </Button>
                    </div>

                    {/* User Profile - Responsive & Functional */}
                    <div className="flex items-center ml-1 md:ml-2 border-l border-slate-700 pl-2 md:pl-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div 
                                    role="button" 
                                    tabIndex={0} 
                                    className="flex items-center gap-3 group outline-none cursor-pointer select-none"
                                >
                                    <div className="hidden md:flex flex-col items-end text-right">
                                        <span className="text-[12px] font-bold text-white leading-tight">
                                            Aditya Verma
                                        </span>
                                        <span className="text-[10px] font-medium text-slate-500 tracking-tight">
                                            Super Admin
                                        </span>
                                    </div>
                                    <Avatar className="h-8 w-8 md:h-9 md:w-9 rounded-lg border border-slate-700 ring-2 ring-transparent group-hover:ring-indigo-500/30 transition-all">
                                        <AvatarImage src="https://github.com/shadcn.png" />
                                        <AvatarFallback className="text-xs bg-indigo-600 text-white font-bold">AV</AvatarFallback>
                                    </Avatar>
                                </div>
                            </DropdownMenuTrigger>
                            
                            <DropdownMenuContent 
                                className="w-56 mt-2 rounded-xl border-slate-800 bg-slate-900 text-slate-300 shadow-2xl p-1" 
                                align="end"
                            >
                                <DropdownMenuLabel className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    Platform Access
                                </DropdownMenuLabel>
                                <DropdownMenuItem className="rounded-lg text-[13px] py-2.5 cursor-pointer hover:bg-slate-800 focus:bg-slate-800 focus:text-white">
                                    <User className="mr-2 h-4 w-4 text-slate-500" /> My Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem className="rounded-lg text-[13px] py-2.5 cursor-pointer hover:bg-slate-800 focus:bg-slate-800 focus:text-white">
                                    <Settings className="mr-2 h-4 w-4 text-slate-500" /> Preferences
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-slate-800" />
                                <DropdownMenuItem className="rounded-lg text-[13px] py-2.5 cursor-pointer text-rose-400 hover:bg-rose-500/10 focus:bg-rose-500/10 focus:text-rose-400">
                                    <LogOut className="mr-2 h-4 w-4" /> Logout Session
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                </div>
            </div>
        </header>
    )
}