"use client"

import { useState } from "react"
import { Header } from "@/components/erp/header"
import { DataTable } from "@/components/erp/data-table"
import { StatusBadge } from "@/components/erp/status-badge"
import { Stepper } from "@/components/erp/stepper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, X, Check, ChevronRight, IndianRupee, User, Building2, CreditCard } from "lucide-react"

// --- Expanded Dummy Data ---
// In a real app, these would come from your @/lib/mock-data file
const extendedBookings = [
  { id: "1", unitNo: "A-202", customerName: "Mohan Reddy", totalAmount: 10800000, bookingAmount: 1080000, bookingDate: "2024-02-25", status: "confirmed", executive: "Rajesh K." },
  { id: "2", unitNo: "A-201", customerName: "Kavita Shah", totalAmount: 7800000, bookingAmount: 780000, bookingDate: "2024-02-28", status: "confirmed", executive: "Rajesh K." },
  { id: "3", unitNo: "B-504", customerName: "Arjun Mehra", totalAmount: 12500000, bookingAmount: 1250000, bookingDate: "2024-03-01", status: "pending", executive: "Suresh M." },
  { id: "4", unitNo: "C-102", customerName: "Priyanka Chopra", totalAmount: 9500000, bookingAmount: 950000, bookingDate: "2024-03-02", status: "confirmed", executive: "Anjali P." },
  { id: "5", unitNo: "A-303", customerName: "Vikram Singh", totalAmount: 11200000, bookingAmount: 1120000, bookingDate: "2024-03-05", status: "cancelled", executive: "Rajesh K." },
  { id: "6", unitNo: "B-202", customerName: "Sanjay Gupta", totalAmount: 8900000, bookingAmount: 890000, bookingDate: "2024-03-10", status: "confirmed", executive: "Suresh M." },
  { id: "7", unitNo: "D-901", customerName: "Rohan Varma", totalAmount: 15400000, bookingAmount: 1540000, bookingDate: "2024-03-12", status: "pending", executive: "Anjali P." },
]

const dummyUnits = [
  { id: "u1", unitNo: "B-505", type: "3BHK", carpetArea: 1250, price: 12500000, status: "available" },
  { id: "u2", unitNo: "C-204", type: "2BHK", carpetArea: 950, price: 8500000, status: "available" },
  { id: "u3", unitNo: "A-401", type: "4BHK", carpetArea: 1800, price: 21000000, status: "reserved" },
]

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

const bookingSteps = [
  { title: "Customer Details", description: "Information" },
  { title: "Unit Selection", description: "Inventory" },
  { title: "Payment", description: "Token Amount" },
  { title: "Review", description: "Finalize" },
]

export default function BookingsPage() {
  const [showNewBooking, setShowNewBooking] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [bookingData, setBookingData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    selectedUnit: "",
    bookingAmount: "",
    paymentMode: "bank_transfer",
  })

  const columns = [
    {
      key: "unitNo",
      header: "UNIT",
      render: (item: any) => <span className="font-semibold text-foreground">{item.unitNo}</span>,
    },
    { key: "customerName", header: "CUSTOMER" },
    {
      key: "totalAmount",
      header: "TOTAL AMOUNT",
      render: (item: any) => formatCurrency(item.totalAmount),
    },
    { key: "bookingDate", header: "DATE" },
    { 
      key: "executive", 
      header: "SALES REP",
      render: (item: any) => <span className="text-primary/80">{item.executive}</span>
    },
    {
      key: "status",
      header: "STATUS",
      render: (item: any) => <StatusBadge status={item.status} />,
    },
  ]

  const selectedUnitData = dummyUnits.find((u) => u.id === bookingData.selectedUnit)

  const handleNextStep = () => currentStep < bookingSteps.length - 1 && setCurrentStep(currentStep + 1)
  const handlePrevStep = () => currentStep > 0 && setCurrentStep(currentStep - 1)

  const resetBooking = () => {
    setShowNewBooking(false)
    setCurrentStep(0)
    setBookingData({
      customerName: "", customerEmail: "", customerPhone: "",
      selectedUnit: "", bookingAmount: "", paymentMode: "bank_transfer",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="BOOKINGS" subtitle="MANAGE PROPERTY INVENTORY AND SALES" />

      <div className="p-6">
        {/* Stats Row */}
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-4">
            <div className="rounded-2xl border border-border bg-card p-5 min-w-[180px]">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Monthly Target</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold">12/20</span>
                <span className="text-sm font-semibold text-emerald-500">60%</span>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 min-w-[220px]">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Revenue (MTD)</p>
              <p className="mt-2 text-3xl font-bold text-primary">{formatCurrency(45000000)}</p>
            </div>
          </div>
          <Button onClick={() => setShowNewBooking(true)} size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6 gap-2">
            <Plus className="h-5 w-5" /> Create New Booking
          </Button>
        </div>

        {/* Bookings Table */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <DataTable columns={columns} data={extendedBookings} />
        </div>
      </div>

      {/* New Booking Modal */}
      {showNewBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl rounded-2xl border border-border bg-card shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border p-6">
              <h2 className="text-xl font-bold uppercase tracking-tight">New Booking</h2>
              <button onClick={resetBooking} className="rounded-full p-2 hover:bg-muted transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-4 border-b border-border bg-muted/30">
              <Stepper steps={bookingSteps} currentStep={currentStep} />
            </div>

            <div className="p-8 max-h-[60vh] overflow-y-auto">
              {currentStep === 0 && (
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 flex items-center gap-3 mb-2 text-primary">
                    <User className="h-5 w-5" /> <span className="font-bold">Customer Profile</span>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground">Full Name</label>
                    <Input placeholder="John Doe" value={bookingData.customerName} onChange={(e) => setBookingData({...bookingData, customerName: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground">Phone Number</label>
                    <Input placeholder="+91..." value={bookingData.customerPhone} onChange={(e) => setBookingData({...bookingData, customerPhone: e.target.value})} />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground">Email Address</label>
                    <Input type="email" placeholder="john@example.com" value={bookingData.customerEmail} onChange={(e) => setBookingData({...bookingData, customerEmail: e.target.value})} />
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-primary">
                    <Building2 className="h-5 w-5" /> <span className="font-bold">Inventory Selection</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {dummyUnits.map((unit) => (
                      <button
                        key={unit.id}
                        onClick={() => setBookingData({ ...bookingData, selectedUnit: unit.id })}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${bookingData.selectedUnit === unit.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/50"}`}
                      >
                        <div className="font-bold text-lg">{unit.unitNo}</div>
                        <div className="text-sm text-muted-foreground">{unit.type} · {unit.carpetArea} sq.ft</div>
                        <div className="mt-2 text-primary font-bold">{formatCurrency(unit.price)}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep >= 2 && (
                <div className="text-center py-10">
                   <div className="h-20 w-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="h-10 w-10" />
                   </div>
                   <h3 className="text-2xl font-bold">Ready to Confirm?</h3>
                   <p className="text-muted-foreground mt-2">Check all details before generating the booking ID.</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-border p-6 bg-muted/10">
              <Button variant="outline" onClick={currentStep === 0 ? resetBooking : handlePrevStep} className="rounded-xl px-6">
                {currentStep === 0 ? "Cancel" : "Back"}
              </Button>
              <Button onClick={currentStep === bookingSteps.length - 1 ? resetBooking : handleNextStep} className="rounded-xl px-8 gap-2">
                {currentStep === bookingSteps.length - 1 ? "Finish" : "Next Step"} <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}