"use client"

import { useState } from "react"
import { Search, Plus, Phone, Mail, MapPin, MoreVertical, FileText, Edit } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  // Mock customer data
  const customers = [
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "(555) 123-4567",
      address: "123 Oak Street",
      image: "/placeholder.svg?height=40&width=40",
      initials: "JS",
      status: "Active",
      lastService: "June 6, 2025",
      nextService: "June 20, 2025",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      phone: "(555) 234-5678",
      address: "456 Maple Avenue",
      image: "/placeholder.svg?height=40&width=40",
      initials: "SJ",
      status: "Active",
      lastService: "June 10, 2025",
      nextService: "June 24, 2025",
    },
    {
      id: "3",
      name: "Michael Brown",
      email: "michael.b@example.com",
      phone: "(555) 345-6789",
      address: "789 Pine Road",
      image: "/placeholder.svg?height=40&width=40",
      initials: "MB",
      status: "Active",
      lastService: "June 12, 2025",
      nextService: "June 26, 2025",
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily.d@example.com",
      phone: "(555) 456-7890",
      address: "321 Cedar Lane",
      image: "/placeholder.svg?height=40&width=40",
      initials: "ED",
      status: "Inactive",
      lastService: "May 29, 2025",
      nextService: "Unscheduled",
    },
    {
      id: "5",
      name: "David Wilson",
      email: "david.w@example.com",
      phone: "(555) 567-8901",
      address: "654 Birch Boulevard",
      image: "/placeholder.svg?height=40&width=40",
      initials: "DW",
      status: "Active",
      lastService: "June 5, 2025",
      nextService: "June 19, 2025",
    },
  ]

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.address.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddCustomer = () => {
    router.push("/customers/new")
  }

  return (
    <main className="flex flex-col pb-16">
      <div className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Customers</h1>
        <Button size="sm" variant="secondary" onClick={handleAddCustomer}>
          <Plus className="h-4 w-4 mr-1" />
          Add Customer
        </Button>
      </div>

      <div className="p-4">
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search customers..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3">
            {filteredCustomers.map((customer) => (
              <CustomerCard key={customer.id} customer={customer} />
            ))}
          </TabsContent>

          <TabsContent value="active" className="space-y-3">
            {filteredCustomers
              .filter((customer) => customer.status === "Active")
              .map((customer) => (
                <CustomerCard key={customer.id} customer={customer} />
              ))}
          </TabsContent>

          <TabsContent value="inactive" className="space-y-3">
            {filteredCustomers
              .filter((customer) => customer.status === "Inactive")
              .map((customer) => (
                <CustomerCard key={customer.id} customer={customer} />
              ))}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

function CustomerCard({ customer }) {
  const router = useRouter()

  const handleEditCustomer = () => {
    router.push(`/customers/edit/${customer.id}`)
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={customer.image || "/placeholder.svg"} alt={customer.name} />
              <AvatarFallback>{customer.initials}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{customer.name}</h3>
              <Badge variant={customer.status === "Active" ? "outline" : "secondary"} className="mt-1">
                {customer.status}
              </Badge>
            </div>
          </div>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleEditCustomer}>
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit customer</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEditCustomer}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Customer
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`/customers/edit/${customer.id}`)}>
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/schedule")}>Schedule Service</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/invoices/new")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Create Invoice
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/invoices")}>
                  <FileText className="h-4 w-4 mr-2" />
                  View Invoices
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="mt-3 space-y-1 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Phone className="h-3.5 w-3.5 mr-2" />
            {customer.phone}
          </div>
          <div className="flex items-center text-muted-foreground">
            <Mail className="h-3.5 w-3.5 mr-2" />
            {customer.email}
          </div>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 mr-2" />
            {customer.address}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-border grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-muted-foreground">Last Service</p>
            <p className="font-medium">{customer.lastService}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Next Service</p>
            <p className="font-medium">{customer.nextService}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
