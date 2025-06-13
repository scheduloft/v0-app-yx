"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ServiceSelection } from "@/components/service-selection"

// Mock customer data - in a real app, you would fetch this from your API
const mockCustomers = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    address: "123 Oak Street",
    city: "Anytown",
    state: "ST",
    zipCode: "12345",
    image: "/placeholder.svg?height=40&width=40",
    initials: "JS",
    status: "Active",
    lastService: "June 6, 2025",
    nextService: "June 20, 2025",
    notes: "Front gate code: 1234. Dog is friendly.",
    serviceFrequency: "Bi-weekly",
    preferredDay: "Friday",
    serviceType: "1", // Lawn Mowing
    servicePackage: "", // No package selected
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "(555) 234-5678",
    address: "456 Maple Avenue",
    city: "Anytown",
    state: "ST",
    zipCode: "12345",
    image: "/placeholder.svg?height=40&width=40",
    initials: "SJ",
    status: "Active",
    lastService: "June 10, 2025",
    nextService: "June 24, 2025",
    notes: "Please text before arrival.",
    serviceFrequency: "Weekly",
    preferredDay: "Monday",
    serviceType: "", // No individual service
    servicePackage: "3", // Complete Garden Care package
  },
]

export default function EditCustomerPage({ params }) {
  const router = useRouter()
  const { id } = params
  const [isLoading, setIsLoading] = useState(true)
  const [customer, setCustomer] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    image: "",
    initials: "",
    status: "Active",
    notes: "",
    serviceFrequency: "",
    preferredDay: "",
    serviceType: "",
    servicePackage: "",
  })

  // Fetch customer data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundCustomer = mockCustomers.find((c) => c.id === id)
      if (foundCustomer) {
        setCustomer(foundCustomer)
      } else {
        // Handle customer not found
        router.push("/customers")
      }
      setIsLoading(false)
    }, 500)
  }, [id, router])

  const handleChange = (field, value) => {
    setCustomer((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleServiceSelection = (type: "service" | "package", id: string) => {
    if (type === "service") {
      setCustomer((prev) => ({
        ...prev,
        serviceType: id,
        servicePackage: "",
      }))
    } else {
      setCustomer((prev) => ({
        ...prev,
        serviceType: "",
        servicePackage: id,
      }))
    }
  }

  const handleSave = () => {
    // Validate form
    if (!customer.name || !customer.email || !customer.phone) {
      alert("Please fill in all required fields")
      return
    }

    // Simulate saving to API
    console.log("Saving customer:", customer)

    // Show success message
    alert("Customer updated successfully!")

    // Navigate back to customer list
    router.push("/customers")
  }

  const handleDelete = () => {
    // Simulate deleting from API
    console.log("Deleting customer:", id)

    // Navigate back to customer list
    router.push("/customers")
  }

  if (isLoading) {
    return (
      <main className="flex flex-col pb-16">
        <div className="bg-primary text-primary-foreground p-4 flex items-center">
          <Button variant="ghost" size="icon" className="mr-2 text-primary-foreground" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Edit Customer</h1>
        </div>
        <div className="p-4 flex justify-center items-center h-64">
          <p>Loading customer data...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex flex-col pb-16">
      <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2 text-primary-foreground" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Edit Customer</h1>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-primary-foreground">
              <Trash2 className="h-5 w-5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete {customer.name}'s customer record and all associated data. This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="p-4 space-y-4">
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={customer.image || "/placeholder.svg"} alt={customer.name} />
                <AvatarFallback>{customer.initials}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">{customer.name}</h2>
                <p className="text-sm text-muted-foreground">Customer ID: {customer.id}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Label htmlFor="status">Status</Label>
              <Select value={customer.status} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger id="status" className="w-32">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-4">
            <h2 className="font-semibold">Contact Information</h2>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" value={customer.name} onChange={(e) => handleChange("name", e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={customer.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={customer.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-4">
            <h2 className="font-semibold">Service Address</h2>

            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Input id="address" value={customer.address} onChange={(e) => handleChange("address", e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" value={customer.city} onChange={(e) => handleChange("city", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" value={customer.state} onChange={(e) => handleChange("state", e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input id="zipCode" value={customer.zipCode} onChange={(e) => handleChange("zipCode", e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-4">
            <h2 className="font-semibold">Service Plan</h2>
            <p className="text-sm text-muted-foreground">
              Choose either an individual service or a service package for this customer.
            </p>

            <ServiceSelection
              selectedServiceType={customer.serviceType}
              selectedPackage={customer.servicePackage}
              onSelectionChange={handleServiceSelection}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-4">
            <h2 className="font-semibold">Service Schedule</h2>

            <div className="space-y-2">
              <Label htmlFor="serviceFrequency">Service Frequency</Label>
              <Select
                value={customer.serviceFrequency}
                onValueChange={(value) => handleChange("serviceFrequency", value)}
              >
                <SelectTrigger id="serviceFrequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="One-time">One-time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredDay">Preferred Day</Label>
              <Select value={customer.preferredDay} onValueChange={(value) => handleChange("preferredDay", value)}>
                <SelectTrigger id="preferredDay">
                  <SelectValue placeholder="Select preferred day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monday">Monday</SelectItem>
                  <SelectItem value="Tuesday">Tuesday</SelectItem>
                  <SelectItem value="Wednesday">Wednesday</SelectItem>
                  <SelectItem value="Thursday">Thursday</SelectItem>
                  <SelectItem value="Friday">Friday</SelectItem>
                  <SelectItem value="Saturday">Saturday</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator className="my-2" />

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={customer.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Add any special instructions or notes about this customer..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Button className="w-full" onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </main>
  )
}
