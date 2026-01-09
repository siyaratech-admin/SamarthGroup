"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/erp/header"
import { DataTable } from "@/components/erp/data-table"
import { StatusBadge } from "@/components/erp/status-badge"
import { Drawer } from "@/components/erp/drawer"
import { Button } from "@/components/ui/button"
import { reservations, type Reservation } from "@/lib/mock-data"
import { Clock, AlertTriangle, IndianRupee, Calendar } from "lucide-react"

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
      const expiry = new Date(expiryDate)
      const now = new Date()
      const diff = expiry.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeLeft("Expired")
        setIsUrgent(true)
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h`)
        setIsUrgent(days <= 2)
      } else {
        setTimeLeft(`${hours}h`)
        setIsUrgent(true)
      }
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 60000)
    return () => clearInterval(interval)
  }, [expiryDate])

  return (
    <div className={`flex items-center gap-1.5 ${isUrgent ? "text-red-400" : "text-amber-400"}`}>
      {isUrgent ? <AlertTriangle className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
      <span className="text-xs sm:text-sm font-medium whitespace-nowrap">{timeLeft}</span>
    </div>
  )
}

export default function ReservationsPage() {
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)

  const columns = [
    {
      key: "unitNo",
      header: "Unit",
      render: (item: Reservation) => <span className="font-medium text-foreground">{item.unitNo}</span>,
    },
    { key: "customerName", header: "Customer" },
    {
      key: "reservationAmount",
      header: "Amount",
      render: (item: Reservation) => formatCurrency(item.reservationAmount),
    },
    { key: "reservationDate", header: "Reserved On" },
    {
      key: "expiryDate",
      header: "Expires In",
      render: (item: Reservation) =>
        item.status === "active" ? <ExpiryCountdown expiryDate={item.expiryDate} /> : "-",
    },
    {
      key: "status",
      header: "Status",
      render: (item: Reservation) => <StatusBadge status={item.status} />,
    },
  ]

  const activeReservations = reservations.filter((r) => r.status === "active")

  return (
    <div className="min-h-screen bg-background">
      <Header title="Reservations" subtitle="Manage unit reservations and conversions" />

      <div className="p-4 sm:p-6">
        {/* Summary Cards - Responsive Grid */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="text-2xl font-bold text-foreground">{reservations.length}</div>
            <div className="text-sm text-muted-foreground font-medium">Total Reservations</div>
          </div>
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
            <div className="text-2xl font-bold text-emerald-500">{activeReservations.length}</div>
            <div className="text-sm text-emerald-500/80 font-medium">Active Reservations</div>
          </div>
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 sm:col-span-2 lg:col-span-1">
            <div className="text-2xl font-bold text-amber-500">
              {formatCurrency(activeReservations.reduce((sum, r) => sum + r.reservationAmount, 0))}
            </div>
            <div className="text-sm text-amber-500/80 font-medium">Total Reserved Amount</div>
          </div>
        </div>

        {/* Reservations Table - Horizontal Scroll on Mobile */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="overflow-x-auto">
            <DataTable columns={columns} data={reservations} onRowClick={setSelectedReservation} />
          </div>
        </div>
      </div>

      {/* Reservation Detail Drawer */}
      <Drawer
        open={!!selectedReservation}
        onClose={() => setSelectedReservation(null)}
        title={`Reservation - ${selectedReservation?.unitNo}`}
      >
        {selectedReservation && (
          <div className="flex flex-col gap-6 pb-8">
            {/* Status Card */}
            <div className="rounded-lg border border-border p-4">
              <div className="mb-2 text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Current Status</div>
              <StatusBadge status={selectedReservation.status} />
              {selectedReservation.status === "active" && (
                <div className="mt-4 rounded-lg bg-amber-500/10 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-amber-600">Time Remaining</span>
                    <ExpiryCountdown expiryDate={selectedReservation.expiryDate} />
                  </div>
                </div>
              )}
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-muted p-3">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Reserved On
                </div>
                <div className="mt-1 text-sm font-semibold text-foreground">{selectedReservation.reservationDate}</div>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Expiry Date
                </div>
                <div className="mt-1 text-sm font-semibold text-foreground">{selectedReservation.expiryDate}</div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="rounded-lg border border-border p-4">
              <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Customer</div>
              <div className="mt-1 text-base font-semibold text-foreground">{selectedReservation.customerName}</div>
            </div>

            {/* Amount */}
            <div className="rounded-lg border border-primary/20 bg-primary/10 p-4">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-bold text-primary/80">
                <IndianRupee className="h-3 w-3" />
                Reservation Amount
              </div>
              <div className="mt-1 text-2xl font-bold text-primary">
                {formatCurrency(selectedReservation.reservationAmount)}
              </div>
            </div>

            {/* Actions - Stacked on very small screens, side-by-side on others */}
            {selectedReservation.status === "active" && (
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button className="w-full">Convert to Booking</Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent text-destructive border-destructive/50 hover:bg-destructive/10"
                >
                  Cancel Reservation
                </Button>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  )
}