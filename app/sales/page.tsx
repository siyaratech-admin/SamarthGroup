"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, Users, ShieldCheck, ArrowUpRight, 
  PhoneCall, Calendar, HardHat, CheckCircle2, Clock 
} from "lucide-react"

export default function SalesPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Header Section */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Sales Lifecycle</h2>
          <p className="text-muted-foreground">Manage your customer journey from lead to possession.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1 text-sm font-medium">FY 2025-26</Badge>
          <Badge className="bg-green-500 hover:bg-green-600 px-3 py-1 text-sm font-medium">Live Sync</Badge>
        </div>
      </div>

      {/* Main Tabs Breakdown */}
      <Tabs defaultValue="presales" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
          <TabsTrigger value="presales" className="flex gap-2">
            <PhoneCall className="h-4 w-4" /> <span className="hidden sm:inline">Pre-Sales</span>
          </TabsTrigger>
          <TabsTrigger value="sales" className="flex gap-2">
            <TrendingUp className="h-4 w-4" /> <span className="hidden sm:inline">Sales</span>
          </TabsTrigger>
          <TabsTrigger value="postsales" className="flex gap-2">
            <ShieldCheck className="h-4 w-4" /> <span className="hidden sm:inline">Post-Sales</span>
          </TabsTrigger>
        </TabsList>

        {/* --- PRE-SALES CONTENT --- */}
        <TabsContent value="presales" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Leads" value="1,284" trend="+18%" icon={Users} color="text-blue-500" />
            <StatCard title="Site Visits" value="342" trend="+5%" icon={Calendar} color="text-orange-500" />
            <StatCard title="Hot Leads" value="89" trend="+22%" icon={TrendingUp} color="text-red-500" />
            <StatCard title="Conv. Rate" value="12.4%" trend="+2%" icon={ArrowUpRight} color="text-green-500" />
          </div>
          <DataList title="Active Pre-Sales Activities" data={preSalesData} />
        </TabsContent>

        {/* --- SALES CONTENT --- */}
        <TabsContent value="sales" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Bookings" value="156" trend="+10%" icon={CheckCircle2} color="text-green-500" />
            <StatCard title="Reservations" value="42" trend="-3%" icon={Clock} color="text-yellow-500" />
            <StatCard title="Revenue" value="₹12.8 Cr" trend="+15%" icon={TrendingUp} color="text-emerald-500" />
            <StatCard title="Inventory Sold" value="68%" trend="+4%" icon={HardHat} color="text-blue-600" />
          </div>
          <DataList title="Current Sales Pipeline" data={salesData} />
        </TabsContent>

        {/* --- POST-SALES CONTENT --- */}
        <TabsContent value="postsales" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Possessions" value="92" trend="+12" icon={ShieldCheck} color="text-purple-500" />
            <StatCard title="Pending Docs" value="18" trend="-5" icon={Clock} color="text-orange-400" />
            <StatCard title="Satisfaction" value="4.8/5" trend="Stable" icon={Users} color="text-pink-500" />
            <StatCard title="Maintenance" value="5 Open" trend="-2" icon={HardHat} color="text-indigo-500" />
          </div>
          <DataList title="Post-Sales Support & Handover" data={postSalesData} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Reusable Stat Card Component
function StatCard({ title, value, trend, icon: Icon, color }: any) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          <span className={trend.startsWith('+') ? "text-green-500" : trend.startsWith('-') ? "text-red-500" : ""}>
            {trend}
          </span>{" "}
          from last month
        </p>
      </CardContent>
    </Card>
  )
}

// Reusable Data List for the "Scrollable Details" look
function DataList({ title, data }: { title: string, data: any[] }) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="max-h-[400px] overflow-y-auto pr-2">
        <div className="space-y-4">
          {data.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-muted/40 rounded-lg border border-border/50 hover:bg-muted/80 transition-colors">
              <div className="flex flex-col">
                <span className="font-semibold text-sm">{item.label}</span>
                <span className="text-xs text-muted-foreground">{item.sub}</span>
              </div>
              <div className="text-right">
                <Badge variant={item.statusType === "success" ? "default" : "secondary"}>{item.status}</Badge>
                <div className="text-[10px] text-muted-foreground mt-1">{item.date}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// --- DUMMY DATA ---
const preSalesData = [
  { label: "Rahul Sharma", sub: "Site Visit Scheduled", status: "Hot", statusType: "success", date: "Today, 2:00 PM" },
  { label: "Ananya Iyer", sub: "Inquiry: 3BHK Penthouse", status: "Follow-up", statusType: "secondary", date: "Yesterday" },
  { label: "Vikram Malhotra", sub: "Brochure Sent", status: "New", statusType: "secondary", date: "2 hours ago" },
  { label: "Siddharth Jain", sub: "site visit completed", status: "Warm", statusType: "success", date: "Jan 08, 2026" },
]

const salesData = [
  { label: "Unit #402 - Samarth Heights", sub: "Payment 2nd Installment", status: "Verified", statusType: "success", date: "Paid Today" },
  { label: "Unit #1005 - SG Avenue", sub: "Agreement Signing", status: "Pending", statusType: "secondary", date: "Scheduled 12th Jan" },
  { label: "Priya Deshmukh", sub: "Parking Slot Allocation", status: "In Process", statusType: "secondary", date: "Updated Today" },
]

const postSalesData = [
  { label: "Unit #102 - Possession", sub: "Key Handover Ready", status: "Complete", statusType: "success", date: "Jan 05, 2026" },
  { label: "Amit Verma", sub: "GST Refund Status", status: "Processing", statusType: "secondary", date: "Ongoing" },
  { label: "Maintenance Request", sub: "Leakage in bathroom #305", status: "Urgent", statusType: "secondary", date: "Logged 1 hour ago" },
]