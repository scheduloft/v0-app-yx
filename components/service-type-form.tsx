"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Clock, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

export interface ServiceType {
  id: string
  name: string
  description: string
  estimatedTime: number // in minutes
  price: number
}

interface ServiceTypeFormProps {
  serviceType?: ServiceType
  isEditing?: boolean
}

export function ServiceTypeForm({ serviceType, isEditing = false }: ServiceTypeFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<Omit<ServiceType, "id">>({
    name: serviceType?.name || "",
    description: serviceType?.description || "",
    estimatedTime: serviceType?.estimatedTime || 60,
    price: serviceType?.price || 0,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "estimatedTime" || name === "price" ? Number.parseFloat(value) : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.name) {
      toast({
        title: "Error",
        description: "Service name is required",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would save to a database
    // For now, we'll just simulate success and navigate back
    toast({
      title: isEditing ? "Service Updated" : "Service Created",
      description: `${formData.name} has been ${isEditing ? "updated" : "added"} successfully.`,
    })

    router.push("/settings/services")
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Service Type" : "Add New Service Type"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Service Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Lawn Mowing"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Includes cutting grass, edging, and cleanup"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimatedTime">Estimated Time (minutes)</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="estimatedTime"
                  name="estimatedTime"
                  type="number"
                  min="1"
                  step="1"
                  value={formData.estimatedTime}
                  onChange={handleChange}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.push("/settings/services")}>
            Cancel
          </Button>
          <Button type="submit">{isEditing ? "Update Service" : "Create Service"}</Button>
        </CardFooter>
      </Card>
    </form>
  )
}
