"use client"

import { useState } from "react"
import { Header } from "@/components/erp/header"
import { DataTable } from "@/components/erp/data-table"
import { StatusBadge } from "@/components/erp/status-badge"
import { Stepper } from "@/components/erp/stepper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { bookings, units, type Booking } from "@/lib/mock-data"
import { Plus, X, Check, ChevronRight, IndianRupee, User, Building2, CreditCard } from "lucide-react"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

const bookingSteps = [
  { title: "Customer Details", description: "Enter customer information" },
  { title: "Unit Confirmation", description: "Confirm unit selection" },
  { title: "Payment", description: "Token / Booking amount" },
  { title: "Complete", description: "Booking confirmation" },
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
      header: "Unit",
      render: (item: Booking) => <span className="font-medium text-foreground">{item.unitNo}</span>,
    },
    { key: "customerName", header: "Customer" },
    {
      key: "totalAmount",
      header: "Total Amount",
      render: (item: Booking) => formatCurrency(item.totalAmount),
    },
    {
      key: "bookingAmount",
      header: "Booking Amount",
      render: (item: Booking) => formatCurrency(item.bookingAmount),
    },
    { key: "bookingDate", header: "Booking Date" },
    {
      key: "status",
      header: "Status",
      render: (item: Booking) => <StatusBadge status={item.status} />,
    },
  ]

  const availableUnits = units.filter((u) => u.status === "available" || u.status === "reserved")
  const selectedUnitData = units.find((u) => u.id === bookingData.selectedUnit)

  const handleNextStep = () => {
    if (currentStep < bookingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const resetBooking = () => {
    setShowNewBooking(false)
    setCurrentStep(0)
    setBookingData({
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      selectedUnit: "",
      bookingAmount: "",
      paymentMode: "bank_transfer",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="Bookings" subtitle="Manage property bookings" />

      <div className="p-4 sm:p-6">
        {/* Actions Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <div className="rounded-xl border border-border bg-card px-4 py-2">
              <span className="text-xl font-bold text-foreground sm:text-2xl">{bookings.length}</span>
              <span className="ml-2 text-xs text-muted-foreground sm:text-sm">Total Bookings</span>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2">
              <span className="text-xl font-bold text-emerald-400 sm:text-2xl">
                {bookings.filter((b) => b.status === "confirmed").length}
              </span>
              <span className="ml-2 text-xs text-emerald-400/80 sm:text-sm">Confirmed</span>
            </div>
          </div>
          <Button onClick={() => setShowNewBooking(true)} className="gap-2">
            <Plus className="h-4 w-4" /> New Booking
          </Button>
        </div>

        {/* Bookings Table */}
        <DataTable columns={columns} data={bookings} />
      </div>

      {/* New Booking Modal */}
      {showNewBooking && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-background/80 p-4 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-3xl rounded-xl border border-border bg-card shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-6">
              <h2 className="text-base font-semibold text-foreground sm:text-lg">New Booking</h2>
              <button onClick={resetBooking} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Stepper */}
            <div className="overflow-x-auto border-b border-border px-4 py-4 sm:px-6">
              <Stepper steps={bookingSteps} currentStep={currentStep} />
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
              {currentStep === 0 && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-4">
                    <User className="h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="font-medium text-foreground">Customer Information</span>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm text-muted-foreground">Full Name</label>
                      <Input
                        value={bookingData.customerName}
                        onChange={(e) => setBookingData({ ...bookingData, customerName: e.target.value })}
                        placeholder="Enter customer name"
                        className="bg-secondary"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm text-muted-foreground">Email</label>
                      <Input
                        type="email"
                        value={bookingData.customerEmail}
                        onChange={(e) => setBookingData({ ...bookingData, customerEmail: e.target.value })}
                        placeholder="Enter email address"
                        className="bg-secondary"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1.5 block text-sm text-muted-foreground">Phone Number</label>
                      <Input
                        type="tel"
                        value={bookingData.customerPhone}
                        onChange={(e) => setBookingData({ ...bookingData, customerPhone: e.target.value })}
                        placeholder="Enter phone number"
                        className="bg-secondary"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-4">
                    <Building2 className="h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="font-medium text-foreground">Select Unit</span>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {availableUnits.map((unit) => (
                      <button
                        key={unit.id}
                        onClick={() => setBookingData({ ...bookingData, selectedUnit: unit.id })}
                        className={`flex items-center justify-between rounded-lg border p-4 text-left transition-colors ${
                          bookingData.selectedUnit === unit.id
                            ? "border-primary bg-primary/10"
                            : "border-border bg-muted/30 hover:border-primary/50"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-foreground">{unit.unitNo}</div>
                          <div className="truncate text-sm text-muted-foreground">
                            {unit.type} · {unit.carpetArea} sq.ft
                          </div>
                        </div>
                        <div className="ml-2 text-right">
                          <div className="whitespace-nowrap text-sm font-medium text-primary">
                            {formatCurrency(unit.price)}
                          </div>
                          <StatusBadge status={unit.status} />
                        </div>
                      </button>
                    ))}
                  </div>
                  {selectedUnitData && (
                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Selected Unit</span>
                        <span className="font-medium text-foreground">{selectedUnitData.unitNo}</span>
                      </div>
                      <div className="mt-2 flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Price</span>
                        <span className="font-semibold text-primary">{formatCurrency(selectedUnitData.price)}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentStep === 2 && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-4">
                    <CreditCard className="h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="font-medium text-foreground">Payment Details</span>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm text-muted-foreground">Booking Amount (10%)</label>
                    <div className="flex items-center gap-3">
                      <IndianRupee className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                      <Input
                        type="number"
                        value={bookingData.bookingAmount || (selectedUnitData ? selectedUnitData.price * 0.1 : "")}
                        onChange={(e) => setBookingData({ ...bookingData, bookingAmount: e.target.value })}
                        placeholder="Enter booking amount"
                        className="bg-secondary"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm text-muted-foreground">Payment Mode</label>
                    <select
                      value={bookingData.paymentMode}
                      onChange={(e) => setBookingData({ ...bookingData, paymentMode: e.target.value })}
                      className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground"
                    >
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="cheque">Cheque</option>
                      <option value="cash">Cash</option>
                      <option value="upi">UPI</option>
                    </select>
                  </div>
                  {selectedUnitData && (
                    <div className="rounded-lg border border-border p-4">
                      <h4 className="mb-3 text-sm font-medium text-foreground">Booking Summary</h4>
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Unit</span>
                          <span className="text-foreground">{selectedUnitData.unitNo}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Total Price</span>
                          <span className="text-foreground">{formatCurrency(selectedUnitData.price)}</span>
                        </div>
                        <div className="flex justify-between border-t border-border pt-2 text-sm font-medium">
                          <span className="text-foreground">Booking Amount</span>
                          <span className="text-primary">
                            {formatCurrency(Number(bookingData.bookingAmount) || selectedUnitData.price * 0.1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentStep === 3 && (
                <div className="flex flex-col items-center gap-6 py-8">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20">
                    <Check className="h-10 w-10 text-emerald-400" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-foreground">Booking Confirmed!</h3>
                    <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                      Booking has been successfully created for {bookingData.customerName}
                    </p>
                  </div>
                  {selectedUnitData && (
                    <div className="w-full rounded-lg border border-border p-4">
                      <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                        <div>
                          <span className="text-muted-foreground">Unit</span>
                          <div className="font-medium text-foreground">{selectedUnitData.unitNo}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Customer</span>
                          <div className="truncate font-medium text-foreground">{bookingData.customerName}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total Amount</span>
                          <div className="font-medium text-foreground">{formatCurrency(selectedUnitData.price)}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Booking Amount</span>
                          <div className="font-medium text-primary">
                            {formatCurrency(Number(bookingData.bookingAmount) || selectedUnitData.price * 0.1)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-border px-4 py-4 sm:px-6">
              <Button
                variant="outline"
                onClick={currentStep === 0 ? resetBooking : handlePrevStep}
                className="bg-transparent"
              >
                {currentStep === 0 ? "Cancel" : "Back"}
              </Button>
              {currentStep < bookingSteps.length - 1 ? (
                <Button onClick={handleNextStep} className="gap-2">
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={resetBooking}>Close</Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
