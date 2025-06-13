"use client"

import { useState } from "react"
import { useOnboarding } from "@/contexts/onboarding-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"

export function ServicesStep() {
  const { data, updateData, setCurrentStep } = useOnboarding()
  const [services, setServices] = useState(
    data.services.length > 0 ? data.services : [{ id: "1", name: "", description: "", price: 0, estimatedTime: 0 }],
  )

  const addService = () => {
    const newService = {
      id: Date.now().toString(),
      name: "",
      description: "",
      price: 0,
      estimatedTime: 0,
    }
    setServices([...services, newService])
  }

  const removeService = (id: string) => {
    setServices(services.filter((service) => service.id !== id))
  }

  const updateService = (id: string, field: string, value: string | number) => {
    setServices(services.map((service) => (service.id === id ? { ...service, [field]: value } : service)))
  }

  const handleNext = () => {
    const validServices = services.filter((service) => service.name && service.description && service.price > 0)
    updateData({ services: validServices })
    setCurrentStep(4)
  }

  const handleBack = () => {
    setCurrentStep(2)
  }

  const hasValidServices = services.some((service) => service.name && service.description && service.price > 0)

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Setup Your Services</CardTitle>
        <p className="text-gray-600">Add the lawn care services you offer</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {services.map((service, index) => (
          <Card key={service.id} className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Service {index + 1}</h3>
              {services.length > 1 && (
                <Button variant="outline" size="sm" onClick={() => removeService(service.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Service Name</Label>
                <Input
                  value={service.name}
                  onChange={(e) => updateService(service.id, "name", e.target.value)}
                  placeholder="e.g., Basic Lawn Mowing"
                />
              </div>
              <div>
                <Label>Price ($)</Label>
                <Input
                  type="number"
                  value={service.price || ""}
                  onChange={(e) => updateService(service.id, "price", Number.parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="mt-4">
              <Label>Description</Label>
              <Textarea
                value={service.description}
                onChange={(e) => updateService(service.id, "description", e.target.value)}
                placeholder="Describe what this service includes..."
                rows={2}
              />
            </div>

            <div className="mt-4">
              <Label>Estimated Time (minutes)</Label>
              <Input
                type="number"
                value={service.estimatedTime || ""}
                onChange={(e) => updateService(service.id, "estimatedTime", Number.parseInt(e.target.value) || 0)}
                placeholder="60"
              />
            </div>
          </Card>
        ))}

        <Button variant="outline" onClick={addService} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Another Service
        </Button>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>
          <Button onClick={handleNext} disabled={!hasValidServices}>
            Next: Add Customers
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
