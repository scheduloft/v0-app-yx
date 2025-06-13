"use client"

import { useState } from "react"
import { useOnboarding } from "@/contexts/onboarding-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Upload } from "lucide-react"

export function CustomersStep() {
  const { data, updateData, setCurrentStep } = useOnboarding()
  const [customers, setCustomers] = useState(
    data.customers.length > 0 ? data.customers : [{ id: "1", name: "", email: "", phone: "", address: "" }],
  )

  const addCustomer = () => {
    const newCustomer = {
      id: Date.now().toString(),
      name: "",
      email: "",
      phone: "",
      address: "",
    }
    setCustomers([...customers, newCustomer])
  }

  const removeCustomer = (id: string) => {
    setCustomers(customers.filter((customer) => customer.id !== id))
  }

  const updateCustomer = (id: string, field: string, value: string) => {
    setCustomers(customers.map((customer) => (customer.id === id ? { ...customer, [field]: value } : customer)))
  }

  const handleNext = () => {
    const validCustomers = customers.filter((customer) => customer.name && customer.phone && customer.address)
    updateData({ customers: validCustomers })
    setCurrentStep(5)
  }

  const handleBack = () => {
    setCurrentStep(3)
  }

  const handleSkip = () => {
    updateData({ customers: [] })
    setCurrentStep(5)
  }

  const hasValidCustomers = customers.some((customer) => customer.name && customer.phone && customer.address)

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Add Your Customers</CardTitle>
        <p className="text-gray-600">Add your existing customers or skip this step for now</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-4">
          <Button variant="outline" className="flex-1">
            <Upload className="w-4 h-4 mr-2" />
            Import from CSV
          </Button>
          <Button variant="outline" onClick={addCustomer} className="flex-1">
            <Plus className="w-4 h-4 mr-2" />
            Add Customer Manually
          </Button>
        </div>

        {customers.map((customer, index) => (
          <Card key={customer.id} className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Customer {index + 1}</h3>
              {customers.length > 1 && (
                <Button variant="outline" size="sm" onClick={() => removeCustomer(customer.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Customer Name</Label>
                <Input
                  value={customer.name}
                  onChange={(e) => updateCustomer(customer.id, "name", e.target.value)}
                  placeholder="John Smith"
                />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input
                  value={customer.phone}
                  onChange={(e) => updateCustomer(customer.id, "phone", e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <div className="mt-4">
              <Label>Email (Optional)</Label>
              <Input
                type="email"
                value={customer.email}
                onChange={(e) => updateCustomer(customer.id, "email", e.target.value)}
                placeholder="john@example.com"
              />
            </div>

            <div className="mt-4">
              <Label>Address</Label>
              <Textarea
                value={customer.address}
                onChange={(e) => updateCustomer(customer.id, "address", e.target.value)}
                placeholder="123 Main St, City, State 12345"
                rows={2}
              />
            </div>
          </Card>
        ))}

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSkip}>
              Skip for Now
            </Button>
            <Button onClick={handleNext} disabled={!hasValidCustomers}>
              Next: Create First Job
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
