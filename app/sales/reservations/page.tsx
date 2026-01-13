"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/erp/header"
import { DataTable } from "@/components/erp/data-table"
import { StatusBadge } from "@/components/erp/status-badge"
import { Drawer } from "@/components/erp/drawer"
import { Button } from "@/components/ui/button"
import { 
  Clock, 
  AlertTriangle, 
  IndianRupee, 
  Calendar, 
  Phone, 
  MessageSquare, 
  History, 
  CheckCircle2, 
  Loader2,
  MoreVertical,
  ExternalLink,
  UserCheck,
  Building2,
  Filter,
  Target, // Fixed: Added missing import
  Search
} from "lucide-react"
import { toast } from "sonner"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"

// --- EXTENDED DUMMY DATA ---
const MOCK_RESERVATIONS = [
  { id: "RES-001", unitNo: "A-102", customerName: "Rahul Sharma", reservationAmount: 500000, reservationDate: "2024-05-10", expiryDate: "2024-05-15T18:00:00", status: "active", source: "Channel Partner", type: "3BHK" },
  { id: "RES-002", unitNo: "B-504", customerName: "Anita Desai", reservationAmount: 250000, reservationDate: "2024-05-11", expiryDate: "2024-05-13T10:00:00", status: "active", source: "Facebook Ads", type: "2BHK" },
  { id: "RES-003", unitNo: "C-901", customerName: "Vikram Malhotra", reservationAmount: 1000000, reservationDate: "2024-05-01", expiryDate: "2024-05-06T12:00:00", status: "booked", source: "Direct Walk-in", type: "Penthouse" },
  { id: "RES-004", unitNo: "A-703", customerName: "Sanjay Singhania", reservationAmount: 500000, reservationDate: "2024-05-12", expiryDate: "2024-05-17T15:30:00", status: "active", source: "Google Search", type: "3BHK" },
  { id: "RES-005", unitNo: "D-202", customerName: "Priya Iyer", reservationAmount: 300000, reservationDate: "2024-05-05", expiryDate: "2024-05-07T09:00:00", status: "cancelled", source: "Channel Partner", type: "2BHK" },
  { id: "RES-006", unitNo: "B-1102", customerName: "Rajesh Khanna", reservationAmount: 750000, reservationDate: "2024-05-12", expiryDate: "2024-05-14T20:00:00", status: "active", source: "Meta Ads", type: "4BHK" },
]

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

function ExpiryCountdown({ expiryDate }: { expiryDate: string }) {
  const [timeLeft, setTimeLeft] = useState("")
  const [isUrgent, setIsUrgent] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const expiry = new Date(expiryDate).getTime()
      const now = new Date().getTime()
      const diff = expiry - now
      if (diff <= 0) { setTimeLeft("Expired"); setIsUrgent(true); return }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      setTimeLeft(days > 0 ? `${days}d ${hours}h` : `${hours}h remaining`)
      setIsUrgent(days < 1)
    }
    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 60000)
    return () => clearInterval(interval)
  }, [expiryDate])

  return (
    <div className={`flex items-center gap-1.5 ${isUrgent ? "text-red-600 font-bold" : "text-amber-600 font-medium"}`}>
      {isUrgent ? <AlertTriangle className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
      <span className="text-[11px] sm:text-xs">{timeLeft}</span>
    </div>
  )
}

export default function ReservationsPage() {
  const [selectedReservation, setSelectedReservation] = useState<any | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [filter, setFilter] = useState("active")
  const [searchTerm, setSearchTerm] = useState("")

  const handleConversion = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      toast.success("Booking Confirmed", { description: `Unit ${selectedReservation?.unitNo} moved to sales.` })
      setSelectedReservation(null)
    }, 2000)
  }

  const columns = [
    {
      key: "unitNo",
      header: "INVENTORY",
      render: (item: any) => (
        <div className="flex items-center gap-2 sm:gap-3 py-1">
          <div className="hidden sm:flex h-9 w-9 rounded-xl bg-slate-100 items-center justify-center text-slate-600">
            <Building2 className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 text-sm sm:text-base">{item.unitNo}</span>
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-black uppercase tracking-tighter">{item.type}</span>
          </div>
        </div>
      ),
    },
    { 
      key: "customerName", 
      header: "APPLICANT",
      render: (item: any) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-700 text-xs sm:text-sm">{item.customerName}</span>
          <span className="text-[9px] sm:text-[10px] text-indigo-600 font-bold uppercase tracking-tight">{item.source}</span>
        </div>
      )
    },
    {
      key: "reservationAmount",
      header: "HOLD AMOUNT",
      render: (item: any) => <span className="font-bold text-slate-900 text-xs sm:text-sm">{formatCurrency(item.reservationAmount)}</span>,
    },
    {
      key: "expiryDate",
      header: "SLA / TIME",
      render: (item: any) => item.status === "active" ? <ExpiryCountdown expiryDate={item.expiryDate} /> : <span className="text-slate-300">-</span>,
    },
    {
      key: "status",
      header: "STATUS",
      render: (item: any) => <StatusBadge status={item.status} />,
    },
    { key: "actions", header: "", render: () => <MoreVertical className="h-4 w-4 text-slate-300" /> }
  ]

  const filteredData = MOCK_RESERVATIONS.filter(r => {
    const matchesFilter = filter === "all" ? true : r.status === filter
    const matchesSearch = r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || r.unitNo.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header title="Unit Reservations" subtitle="Manage inventory blocks and sales conversions" />

      <div className="p-4 sm:p-8 space-y-6 max-w-[1440px] mx-auto">
        
        {/* RESPONSIVE METRIC CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <MetricCard title="Total Holds" value={MOCK_RESERVATIONS.length} icon={Building2} color="indigo" />
          <MetricCard title="Active SLA" value={MOCK_RESERVATIONS.filter(r => r.status === "active").length} icon={Clock} color="amber" />
          <MetricCard title="Total Value" value={formatCurrency(4500000)} icon={IndianRupee} color="emerald" />
          <MetricCard title="Expiring Soon" value="02" icon={AlertTriangle} color="red" />
        </div>

        {/* TABLE SECTION */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col gap-4 bg-white">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <Tabs defaultValue="active" onValueChange={setFilter} className="w-full sm:w-auto">
                  <TabsList className="bg-slate-100/50 p-1 border-none rounded-xl w-full sm:w-auto flex overflow-x-auto">
                      <TabsTrigger value="active" className="flex-1 sm:flex-none rounded-lg px-4 sm:px-6 font-bold text-xs sm:text-sm">Active</TabsTrigger>
                      <TabsTrigger value="booked" className="flex-1 sm:flex-none rounded-lg px-4 sm:px-6 font-bold text-xs sm:text-sm">Booked</TabsTrigger>
                      <TabsTrigger value="all" className="flex-1 sm:flex-none rounded-lg px-4 sm:px-6 font-bold text-xs sm:text-sm">All</TabsTrigger>
                  </TabsList>
              </Tabs>
              
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search unit or customer..." 
                  className="pl-9 h-10 rounded-xl border-slate-200 text-sm focus:ring-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <DataTable columns={columns} data={filteredData} onRowClick={setSelectedReservation} />
          </div>
        </div>
      </div>

      {/* MOBILE-READY DRAWER */}
      <Drawer open={!!selectedReservation} onClose={() => setSelectedReservation(null)} title={`Unit ${selectedReservation?.unitNo} Details`}>
        {selectedReservation && (
          <div className="flex flex-col gap-5 sm:gap-6 pb-6">
            
            {/* Quick Actions Panel */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 p-1 bg-slate-50 rounded-2xl border border-slate-100">
                <Button onClick={() => toast.info("Dialing...")} variant="ghost" className="h-12 sm:h-14 bg-white rounded-xl shadow-sm font-black text-indigo-600 uppercase text-[9px] sm:text-[10px] tracking-widest"><Phone className="h-3.5 w-3.5 mr-2" /> Call</Button>
                <Button onClick={() => toast.info("Opening WhatsApp...")} variant="ghost" className="h-12 sm:h-14 bg-white rounded-xl shadow-sm font-black text-emerald-600 uppercase text-[9px] sm:text-[10px] tracking-widest"><MessageSquare className="h-3.5 w-3.5 mr-2" /> WhatsApp</Button>
            </div>

            {/* Hold Details Card */}
            <div className="bg-indigo-600 rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-100">
                <Building2 className="absolute -right-4 -bottom-4 h-24 w-24 sm:h-32 sm:w-32 text-white/10 rotate-12" />
                <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200 mb-2 text-center sm:text-left">Inventory SLA Status</p>
                <div className="flex items-baseline justify-center sm:justify-start gap-2">
                    {selectedReservation.status === "active" ? (
                        <div className="text-2xl sm:text-3xl font-black italic"><ExpiryCountdown expiryDate={selectedReservation.expiryDate} /></div>
                    ) : (
                        <div className="text-2xl sm:text-3xl font-black uppercase italic">{selectedReservation.status}</div>
                    )}
                </div>
            </div>

            {/* Detail List */}
            <div className="space-y-2 sm:space-y-3">
                <DetailItem label="Applicant Name" value={selectedReservation.customerName} icon={UserCheck} />
                <DetailItem label="Hold Amount" value={formatCurrency(selectedReservation.reservationAmount)} icon={IndianRupee} highlight />
                <DetailItem label="Lead Source" value={selectedReservation.source} icon={Target} />
                <DetailItem label="Reservation Date" value={selectedReservation.reservationDate} icon={Calendar} />
            </div>

            {/* Footer Actions */}
            {selectedReservation.status === "active" && (
              <div className="flex flex-col gap-3 pt-4 sm:pt-6">
                <Button onClick={handleConversion} disabled={isProcessing} className="w-full h-14 sm:h-16 bg-slate-900 hover:bg-black text-white rounded-xl sm:rounded-2xl font-black uppercase text-[10px] sm:text-xs tracking-widest transition-all">
                  {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : "Finalize Booking"}
                </Button>
                <Button variant="ghost" className="w-full h-10 sm:h-12 text-red-500 font-bold hover:bg-red-50 rounded-xl uppercase text-[9px] sm:text-[10px] tracking-widest">Release Inventory</Button>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  )
}

// --- HELPER COMPONENTS ---

function MetricCard({ title, value, icon: Icon, color }: any) {
    const variants: any = {
        indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
        amber: "bg-amber-50 text-amber-700 border-amber-100",
        emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
        red: "bg-red-50 text-red-700 border-red-100",
    }
    return (
        <div className={`p-4 sm:p-6 rounded-2xl sm:rounded-[24px] border ${variants[color]} flex flex-col gap-1`}>
            <div className="p-1.5 sm:p-2 bg-white/50 w-fit rounded-lg mb-1 sm:mb-2"><Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" /></div>
            <div className="text-xl sm:text-2xl font-black tracking-tighter truncate">{value}</div>
            <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest opacity-70 truncate">{title}</div>
        </div>
    )
}

function DetailItem({ label, value, icon: Icon, highlight }: any) {
    return (
        <div className="flex items-center justify-between p-3 sm:p-4 bg-white border border-slate-100 rounded-xl sm:rounded-2xl">
            <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100"><Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400" /></div>
                <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
            </div>
            <span className={`text-xs sm:text-sm ${highlight ? 'font-black text-indigo-600' : 'font-bold text-slate-800'}`}>{value}</span>
        </div>
    )
}