"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/erp/header"
import { DataTable } from "@/components/erp/data-table"
import { StatusBadge } from "@/components/erp/status-badge"
import { Stepper } from "@/components/erp/stepper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Plus, X, Building2, Calendar, ShieldCheck, Zap, 
  MessageSquare, FileText, ArrowRight, MoreVertical, 
  Ban, Printer, Timer, RefreshCcw, FilterX,Check
} from "lucide-react"
import { useRouter } from "next/navigation"

// --- Mock Data ---
const initialBookings = [
  { id: "1", unitNo: "A-202", customerName: "Mohan Reddy", customerPhone: "919876543210", totalAmount: 10800000, status: "sold", bookingDate: "2024-02-25", executive: "Rajesh K." },
  { id: "2", unitNo: "B-504", customerName: "Arjun Mehra", customerPhone: "919876543212", totalAmount: 12500000, status: "reserved", holdExpiresAt: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString(), executive: "Suresh M." },
  { id: "3", unitNo: "C-102", customerName: "Priyanka Chopra", customerPhone: "919876543215", totalAmount: 9500000, status: "booked", bookingDate: "2024-03-02", executive: "Anjali P." },
  { id: "4", unitNo: "D-302", customerName: "Rahul Varma", customerPhone: "919876543219", totalAmount: 14500000, status: "reserved", holdExpiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), executive: "Rajesh K." },
]

const dummyUnits = [
  { id: "u1", unitNo: "B-505", type: "3BHK", price: 12500000 },
  { id: "u2", unitNo: "C-204", type: "2BHK", price: 8500000 },
]

const formatCurrency = (amount: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount)

const bookingSteps = [
  { title: "Lead", description: "Verification" },
  { title: "Unit", description: "Selection" },
  { title: "Plans", description: "Financials" },
  { title: "Final", description: "Close Sale" },
]

export default function BookingsPage() {
  const router = useRouter()
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [showNewBooking, setShowNewBooking] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisitConfirmed, setIsVisitConfirmed] = useState(false)
  const [bookingData, setBookingData] = useState({
    customerName: "", customerPhone: "", selectedUnit: "", tokenAmount: "", paymentMode: "Cheque"
  })

  const filteredData = useMemo(() => {
    if (!filterStatus) return initialBookings;
    return initialBookings.filter(item => item.status === filterStatus);
  }, [filterStatus]);

  const getRemainingTime = (expiryDate: string) => {
    const total = Date.parse(expiryDate) - Date.parse(new Date().toString())
    if (total <= 0) return "Expired"
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24)
    const days = Math.floor(total / (1000 * 60 * 60 * 24))
    return `${days}d ${hours}h left`
  }

  const handleNextStep = () => {
    if (currentStep === 0 && !isVisitConfirmed) return alert("Confirm site visit first.")
    if (currentStep < bookingSteps.length - 1) setCurrentStep(prev => prev + 1)
  }

  const handlePrevStep = () => { if (currentStep > 0) setCurrentStep(prev => prev - 1) }

  const resetBooking = () => {
    setShowNewBooking(false); setCurrentStep(0); setIsVisitConfirmed(false)
    setBookingData({ customerName: "", customerPhone: "", selectedUnit: "", tokenAmount: "", paymentMode: "Cheque" })
  }

  const columns = [
    {
      key: "unitNo",
      header: "UNIT / HOLD",
      render: (item: any) => (
        <div className="flex flex-col min-w-[80px]">
          <span className="font-black text-slate-900">{item.unitNo}</span>
          {item.status === "reserved" && (
            <span className="text-[9px] text-amber-600 font-bold flex items-center gap-1">
              <Timer className="h-2.5 w-2.5" /> {getRemainingTime(item.holdExpiresAt)}
            </span>
          )}
        </div>
      ),
    },
    { key: "customerName", header: "CUSTOMER" },
    { key: "totalAmount", header: "VALUE", render: (item: any) => <span className="font-bold">{formatCurrency(item.totalAmount)}</span> },
    { key: "status", header: "STATUS", render: (item: any) => <StatusBadge status={item.status} /> },
    {
      key: "actions",
      header: "OPS",
      render: (item: any) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-emerald-600" onClick={() => window.open(`https://wa.me/${item.customerPhone}`, '_blank')}>
            <MessageSquare className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0"><MoreVertical className="h-4 w-4 text-slate-400" /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 font-bold text-[10px] uppercase">
              <DropdownMenuItem onClick={() => router.push(`/sales/bookings/${item.id}`)}><FileText className="mr-2 h-4 w-4" /> View Details</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600"><Ban className="mr-2 h-4 w-4" /> Cancel</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header title="Sales Control" subtitle="Inventory & Revenue" />

      <div className="p-4 md:p-6 max-w-[1400px] mx-auto">
        
        {/* Banner - Responsive Flex */}
        {initialBookings.some(b => b.status === "reserved") && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-amber-500 p-2 rounded-xl text-white"><Timer className="h-5 w-5" /></div>
              <div>
                <p className="text-xs font-black text-amber-900 uppercase tracking-tight">Pending Reservations</p>
                <p className="text-[10px] font-bold text-amber-700/70 uppercase">Verify token payments before expiry.</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full sm:w-auto text-[10px] font-black border-amber-200" onClick={() => setFilterStatus(filterStatus === "reserved" ? null : "reserved")}>
              {filterStatus === "reserved" ? "Show All" : "View Holds"}
            </Button>
          </div>
        )}

        {/* Stats Grid - Responsive Cols */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden h-32 flex flex-col justify-center">
              <p className="text-[10px] font-black uppercase text-indigo-400 mb-1">MTD Revenue</p>
              <p className="text-2xl md:text-3xl font-black">{formatCurrency(45000000)}</p>
              <Building2 className="absolute -bottom-2 -right-2 h-20 w-20 text-white/5 rotate-12" />
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hidden sm:flex flex-col justify-center h-32">
             <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Conversion</p>
             <p className="text-2xl md:text-3xl font-black text-slate-800">18.4%</p>
             <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full"><div className="bg-indigo-600 h-full w-[18%]" /></div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm h-32 flex flex-col justify-center">
             <Button onClick={() => setShowNewBooking(true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-[10px] h-12 rounded-xl shadow-lg">
                <Plus className="h-4 w-4 mr-2" /> New Booking
             </Button>
          </div>
        </div>

        {/* Table - Responsive Scroll */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center bg-white">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{filterStatus ? `${filterStatus} bookings` : "Recent Activity"}</h3>
            {filterStatus && <Button variant="ghost" size="sm" onClick={() => setFilterStatus(null)} className="h-8 text-[10px] font-black uppercase text-indigo-600"><FilterX className="h-3.5 w-3.5 mr-2" /> Reset</Button>}
          </div>
          <div className="overflow-x-auto whitespace-nowrap">
            <DataTable columns={columns} data={filteredData} />
          </div>
        </div>
      </div>

      {/* NEW BOOKING RESPONSIVE DRAWER */}
      {showNewBooking && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-slate-900/60 backdrop-blur-md p-0 md:p-4">
          <div className="w-full h-[92vh] md:h-auto md:max-h-[90vh] md:max-w-4xl bg-white rounded-t-[2.5rem] md:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
            
            {/* Header matches image_f6e665.png */}
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center shrink-0">
              <h2 className="text-xl font-black uppercase tracking-tighter">Reserve Unit</h2>
              <button onClick={resetBooking} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-all"><X className="h-5 w-5" /></button>
            </div>

            <div className="p-4 bg-slate-50 border-b overflow-x-auto"><Stepper steps={bookingSteps} currentStep={currentStep} /></div>

            <div className="flex-1 overflow-y-auto p-6 md:p-10">
              {currentStep === 0 && (
                <div className="max-w-md mx-auto space-y-8">
                  <h3 className="text-xl font-black text-slate-800 uppercase text-center md:text-left">Lead Verification</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Customer Details</label>
                        <Input className="h-14 rounded-2xl border-slate-200 text-sm px-5 focus:ring-indigo-500" placeholder="Full Name" value={bookingData.customerName} onChange={(e) => setBookingData({...bookingData, customerName: e.target.value})} />
                    </div>
                    <div onClick={() => setIsVisitConfirmed(!isVisitConfirmed)} className={`p-5 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${isVisitConfirmed ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 bg-slate-50'}`}>
                        <div className="flex items-center gap-3">
                            <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${isVisitConfirmed ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-slate-300'}`}>
                                {isVisitConfirmed && <Check className="h-3 w-3 text-white" />}
                            </div>
                            <p className="text-sm font-black text-slate-800">Site Visit Completed</p>
                        </div>
                        <Calendar className="h-5 w-5 text-slate-300" />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="font-black text-slate-800 uppercase text-center md:text-left">Select Unit</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {dummyUnits.map((unit) => (
                      <button key={unit.id} onClick={() => setBookingData({ ...bookingData, selectedUnit: unit.id })} className={`p-6 rounded-2xl border-2 text-left transition-all ${bookingData.selectedUnit === unit.id ? "border-indigo-600 bg-indigo-50/30 ring-2 ring-indigo-50" : "border-slate-100"}`}>
                        <div className="font-black text-2xl">{unit.unitNo}</div>
                        <div className="mt-4 text-lg font-black text-indigo-600">{formatCurrency(unit.price)}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep >= 2 && (
                <div className="text-center py-10 space-y-4">
                    <ShieldCheck className="h-20 w-20 text-emerald-600 mx-auto" />
                    <h3 className="text-2xl font-black text-slate-800 uppercase">Ready to Reserve?</h3>
                    <p className="text-sm text-slate-500 font-medium">This will lock the unit for 48 hours.</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t flex items-center justify-between bg-white shrink-0">
              <Button variant="ghost" onClick={currentStep === 0 ? resetBooking : handlePrevStep} className="text-[10px] font-black uppercase">Back</Button>
              <Button onClick={currentStep === bookingSteps.length - 1 ? resetBooking : handleNextStep} className="h-12 px-10 bg-indigo-600 text-white font-black uppercase text-[10px] rounded-2xl shadow-lg">
                {currentStep === bookingSteps.length - 1 ? "Finish" : "Continue"} <ArrowRight className="h-3.5 w-3.5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}