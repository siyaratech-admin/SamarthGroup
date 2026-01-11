"use client"

import { Header } from "@/components/erp/header"
import { DataTable } from "@/components/erp/data-table"
import { StatusBadge } from "@/components/erp/status-badge"
import { campaigns } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount)
}

const campaignColumns = [
    { key: "name", header: "Campaign Name" },
    { key: "type", header: "Type" },
    { key: "channel", header: "Channel" },
    {
        key: "status",
        header: "Status",
        render: (item: typeof campaigns[0]) => <StatusBadge status={item.status as any} />
    },
    {
        key: "spend",
        header: "Spend",
        render: (item: typeof campaigns[0]) => formatCurrency(item.spend)
    },
    { key: "leadsGenerated", header: "Leads" },
    { key: "conversions", header: "Conversions" },
    {
        key: "roi",
        header: "ROI (%)",
        render: (item: typeof campaigns[0]) => <span className={item.roi >= 100 ? "text-emerald-600 font-bold" : "text-foreground"}>{item.roi}%</span>
    },
]

export default function CampaignsPage() {
    return (
        <div className="min-h-screen bg-background">
            <Header title="Campaign Management" subtitle="Track marketing performance and ROI" />

            <div className="p-4 sm:p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">All Campaigns</h2>
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Campaign
                    </Button>
                </div>

                <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                    <DataTable columns={campaignColumns} data={campaigns} />
                </div>
            </div>
        </div>
    )
}
