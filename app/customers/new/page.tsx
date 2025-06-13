"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ServiceSelection } from "@/components/service-selection"

export default function NewCustomerPage() {
  const router = useRouter()
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    status: "Active",
    notes: "",
    serviceFrequency: "",
    preferredDay: "",
    serviceType: "",
    servicePackage: "",
  })

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
    console.log("Creating new customer:", customer)

    // Show success message
    alert("Customer created successfully!")

    // Navigate back to customer list
    router.push("/customers")
  }

  return (
    <main className="flex flex-col pb-16">
      <div className="bg-primary text-primary-foreground p-4 flex items-center">
        <Button variant="ghost" size="icon" className="mr-2 text-primary-foreground" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Add New Customer</h1>
      </div>

      <div className="p-4 space-y-4">
        <Card>
          <CardContent className="p-4 space-y-4">
            <h2 className="font-semibold">Contact Information</h2>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={customer.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter customer's full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={customer.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="customer@example.com"
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
                placeholder="(555) 123-4567"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={customer.status} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger id="status">
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
            <h2 className="font-semibold">Service Address</h2>

            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                value={customer.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="123 Main St"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={customer.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  placeholder="Anytown"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={customer.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                  placeholder="ST"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                value={customer.zipCode}
                onChange={(e) => handleChange("zipCode", e.target.value)}
                placeholder="12345"
              />
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
          Create Customer
        </Button>
      </div>
    </main>
  )
}
