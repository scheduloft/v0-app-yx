"use client"

import { useState } from "react"
import { Search, Plus, Filter, ArrowUpDown, FileText, Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"

export default function InvoicesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  // Mock invoice data
  const invoices = [
    {
      id: "INV-001",
      customer: "John Smith",
      date: "June 10, 2025",
      amount: 85.0,
      status: "Paid",
      services: ["Lawn Mowing", "Edging"],
    },
    {
      id: "INV-002",
      customer: "Sarah Johnson",
      date: "June 11, 2025",
      amount: 120.0,
      status: "Unpaid",
      services: ["Lawn Mowing", "Edging", "Fertilization"],
    },
    {
      id: "INV-003",
      customer: "Michael Brown",
      date: "June 12, 2025",
      amount: 150.0,
      status: "Unpaid",
      services: ["Full Service"],
    },
    {
      id: "INV-004",
      customer: "Emily Davis",
      date: "May 29, 2025",
      amount: 85.0,
      status: "Overdue",
      services: ["Lawn Mowing"],
    },
    {
      id: "INV-005",
      customer: "David Wilson",
      date: "June 5, 2025",
      amount: 95.0,
      status: "Paid",
      services: ["Lawn Mowing", "Hedge Trimming"],
    },
  ]

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <main className="flex flex-col pb-16">
      <div className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Invoices</h1>
        <Button size="sm" variant="secondary" onClick={() => router.push("/invoices/new")}>
          <Plus className="h-4 w-4 mr-1" />
          New Invoice
        </Button>
      </div>

      <div className="p-4">
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search invoices..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex justify-between items-center mb-4">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unpaid">Unpaid</TabsTrigger>
              <TabsTrigger value="paid">Paid</TabsTrigger>
            </TabsList>

            <div className="flex justify-end mt-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="ml-auto">
                    <Filter className="h-4 w-4 mr-1" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <ArrowUpDown className="h-4 w-4 mr-1" />
                    Sort by Date
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ArrowUpDown className="h-4 w-4 mr-1" />
                    Sort by Amount
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <TabsContent value="all" className="mt-4 space-y-3">
              {filteredInvoices.map((invoice) => (
                <InvoiceCard key={invoice.id} invoice={invoice} />
              ))}
            </TabsContent>

            <TabsContent value="unpaid" className="mt-4 space-y-3">
              {filteredInvoices
                .filter((invoice) => invoice.status === "Unpaid" || invoice.status === "Overdue")
                .map((invoice) => (
                  <InvoiceCard key={invoice.id} invoice={invoice} />
                ))}
            </TabsContent>

            <TabsContent value="paid" className="mt-4 space-y-3">
              {filteredInvoices
                .filter((invoice) => invoice.status === "Paid")
                .map((invoice) => (
                  <InvoiceCard key={invoice.id} invoice={invoice} />
                ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}

function InvoiceCard({ invoice }) {
  const router = useRouter()

  const handleViewInvoice = () => {
    router.push(`/invoices/${invoice.id}`)
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 flex justify-between items-center">
          <div>
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
              <h3 className="font-medium">{invoice.id}</h3>
              <Badge
                variant={
                  invoice.status === "Paid" ? "success" : invoice.status === "Overdue" ? "destructive" : "outline"
                }
                className="ml-2"
              >
                {invoice.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{invoice.customer}</p>
          </div>
          <div className="text-right">
            <p className="font-medium">${invoice.amount.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">{invoice.date}</p>
          </div>
        </div>
        <div className="border-t border-border px-4 py-2 flex justify-between items-center bg-muted/30">
          <div className="text-xs text-muted-foreground">{invoice.services.join(", ")}</div>
          <div className="flex gap-2">
            {invoice.status !== "Paid" && (
              <Button size="sm" variant="ghost" className="h-8">
                <Send className="h-3.5 w-3.5 mr-1" />
                Send
              </Button>
            )}
            <Button size="sm" variant="outline" className="h-8" onClick={handleViewInvoice}>
              View
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
