"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check, DollarSign, Percent, Plus, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { DatePicker } from "@/components/ui/date-picker"
import type { ServiceType } from "./service-type-form"

// Mock data for service types
const serviceTypes = [
  {
    id: "1",
    name: "Lawn Mowing",
    description: "Standard lawn mowing service including edging and cleanup.",
    estimatedTime: 60,
    price: 45.0,
  },
  {
    id: "2",
    name: "Hedge Trimming",
    description: "Trimming and shaping of hedges and small bushes.",
    estimatedTime: 45,
    price: 35.0,
  },
  {
    id: "3",
    name: "Leaf Removal",
    description: "Complete removal of leaves from lawn, garden beds, and gutters.",
    estimatedTime: 90,
    price: 65.0,
  },
  {
    id: "4",
    name: "Fertilization",
    description: "Application of seasonal fertilizer to promote healthy lawn growth.",
    estimatedTime: 30,
    price: 40.0,
  },
  {
    id: "5",
    name: "Weed Control",
    description: "Application of weed control products to eliminate unwanted plants.",
    estimatedTime: 45,
    price: 50.0,
  },
]

export type Season = "spring" | "summer" | "fall" | "winter"

export interface ServicePackage {
  id: string
  name: string
  description: string
  services: string[] // Array of service IDs
  discountType: "percentage" | "fixed"
  discountValue: number
  totalPrice?: number // Calculated field
  savings?: number // Calculated field
  isSeasonalOnly: boolean
  availableSeasons: Season[]
  startDate?: Date | null
  endDate?: Date | null
}

interface PackageFormProps {
  servicePackage?: ServicePackage
  isEditing?: boolean
}

const SEASONS: { value: Season; label: string }[] = [
  { value: "spring", label: "Spring" },
  { value: "summer", label: "Summer" },
  { value: "fall", label: "Fall" },
  { value: "winter", label: "Winter" },
]

export function PackageForm({ servicePackage, isEditing = false }: PackageFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<Omit<ServicePackage, "id" | "totalPrice" | "savings">>({
    name: servicePackage?.name || "",
    description: servicePackage?.description || "",
    services: servicePackage?.services || [],
    discountType: servicePackage?.discountType || "percentage",
    discountValue: servicePackage?.discountValue || 10,
    isSeasonalOnly: servicePackage?.isSeasonalOnly || false,
    availableSeasons: servicePackage?.availableSeasons || [],
    startDate: servicePackage?.startDate || null,
    endDate: servicePackage?.endDate || null,
  })

  const [selectedServices, setSelectedServices] = useState<ServiceType[]>([])
  const [regularTotal, setRegularTotal] = useState(0)
  const [discountedTotal, setDiscountedTotal] = useState(0)
  const [savings, setSavings] = useState(0)
  const [useCustomDates, setUseCustomDates] = useState(!!(servicePackage?.startDate || servicePackage?.endDate))

  // Calculate totals when services or discount changes
  useEffect(() => {
    // Find the selected service objects
    const servicesInPackage = serviceTypes.filter((service) => formData.services.includes(service.id))
    setSelectedServices(servicesInPackage)

    // Calculate regular total
    const total = servicesInPackage.reduce((sum, service) => sum + service.price, 0)
    setRegularTotal(total)

    // Calculate discounted total
    let discounted = total
    if (formData.discountType === "percentage") {
      discounted = total * (1 - formData.discountValue / 100)
    } else {
      discounted = Math.max(0, total - formData.discountValue)
    }
    setDiscountedTotal(discounted)

    // Calculate savings
    setSavings(total - discounted)
  }, [formData.services, formData.discountType, formData.discountValue])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "discountValue" ? Number.parseFloat(value) : value,
    }))
  }

  const handleDiscountTypeChange = (value: "percentage" | "fixed") => {
    setFormData((prev) => ({
      ...prev,
      discountType: value,
      // Reset discount value to sensible defaults when switching types
      discountValue: value === "percentage" ? 10 : 20,
    }))
  }

  const handleServiceToggle = (serviceId: string) => {
    setFormData((prev) => {
      if (prev.services.includes(serviceId)) {
        return {
          ...prev,
          services: prev.services.filter((id) => id !== serviceId),
        }
      } else {
        return {
          ...prev,
          services: [...prev.services, serviceId],
        }
      }
    })
  }

  const handleRemoveService = (serviceId: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((id) => id !== serviceId),
    }))
  }

  const handleSeasonalToggle = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isSeasonalOnly: checked,
      // Reset seasons if turning off seasonal
      availableSeasons: checked ? prev.availableSeasons : [],
    }))
  }

  const handleSeasonToggle = (season: Season) => {
    setFormData((prev) => {
      if (prev.availableSeasons.includes(season)) {
        return {
          ...prev,
          availableSeasons: prev.availableSeasons.filter((s) => s !== season),
        }
      } else {
        return {
          ...prev,
          availableSeasons: [...prev.availableSeasons, season],
        }
      }
    })
  }

  const handleCustomDatesToggle = (checked: boolean) => {
    setUseCustomDates(checked)
    if (!checked) {
      setFormData((prev) => ({
        ...prev,
        startDate: null,
        endDate: null,
      }))
    }
  }

  const handleDateChange = (field: "startDate" | "endDate", date: Date | null) => {
    setFormData((prev) => ({
      ...prev,
      [field]: date,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.name) {
      toast({
        title: "Error",
        description: "Package name is required",
        variant: "destructive",
      })
      return
    }

    if (formData.services.length < 2) {
      toast({
        title: "Error",
        description: "Package must include at least 2 services",
        variant: "destructive",
      })
      return
    }

    if (formData.isSeasonalOnly && formData.availableSeasons.length === 0 && !useCustomDates) {
      toast({
        title: "Error",
        description: "Please select at least one season or use custom dates",
        variant: "destructive",
      })
      return
    }

    if (useCustomDates && (!formData.startDate || !formData.endDate)) {
      toast({
        title: "Error",
        description: "Please provide both start and end dates",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would save to a database
    toast({
      title: isEditing ? "Package Updated" : "Package Created",
      description: `${formData.name} has been ${isEditing ? "updated" : "added"} successfully.`,
    })

    router.push("/settings/packages")
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Package" : "Create New Package"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Package Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Spring Cleanup Special"
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
              placeholder="Complete spring cleanup package including lawn mowing, leaf removal, and fertilization"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Services Included</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedServices.map((service) => (
                <Badge key={service.id} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                  {service.name}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 rounded-full hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => handleRemoveService(service.id)}
                  >
                    <Trash className="h-3 w-3" />
                    <span className="sr-only">Remove {service.name}</span>
                  </Button>
                </Badge>
              ))}
              {selectedServices.length === 0 && (
                <div className="text-sm text-muted-foreground">No services selected</div>
              )}
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 border-dashed">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Service
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search services..." />
                  <CommandList>
                    <CommandEmpty>No services found.</CommandEmpty>
                    <CommandGroup>
                      {serviceTypes.map((service) => (
                        <CommandItem
                          key={service.id}
                          onSelect={() => handleServiceToggle(service.id)}
                          className="flex items-center justify-between"
                        >
                          <div>
                            <span>{service.name}</span>
                            <span className="ml-2 text-sm text-muted-foreground">${service.price.toFixed(2)}</span>
                          </div>
                          {formData.services.includes(service.id) && <Check className="h-4 w-4" />}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discountType">Discount Type</Label>
              <Select
                value={formData.discountType}
                onValueChange={(value) => handleDiscountTypeChange(value as "percentage" | "fixed")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select discount type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountValue">
                {formData.discountType === "percentage" ? "Discount Percentage" : "Discount Amount"}
              </Label>
              <div className="relative">
                {formData.discountType === "percentage" ? (
                  <Percent className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                ) : (
                  <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                )}
                <Input
                  id="discountValue"
                  name="discountValue"
                  type="number"
                  min={formData.discountType === "percentage" ? "0" : "0"}
                  max={formData.discountType === "percentage" ? "100" : undefined}
                  step={formData.discountType === "percentage" ? "1" : "0.01"}
                  value={formData.discountValue}
                  onChange={handleChange}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="seasonal">Seasonal Availability</Label>
                <p className="text-sm text-muted-foreground">Limit this package to specific seasons</p>
              </div>
              <Switch id="seasonal" checked={formData.isSeasonalOnly} onCheckedChange={handleSeasonalToggle} />
            </div>

            {formData.isSeasonalOnly && (
              <div className="space-y-4 pl-4 border-l-2 border-muted">
                <div className="space-y-2">
                  <Label>Available Seasons</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {SEASONS.map((season) => (
                      <div key={season.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`season-${season.value}`}
                          checked={formData.availableSeasons.includes(season.value)}
                          onCheckedChange={() => handleSeasonToggle(season.value)}
                          disabled={useCustomDates}
                        />
                        <Label
                          htmlFor={`season-${season.value}`}
                          className={useCustomDates ? "text-muted-foreground" : ""}
                        >
                          {season.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="custom-dates" checked={useCustomDates} onCheckedChange={handleCustomDatesToggle} />
                    <Label htmlFor="custom-dates">Use custom date range instead</Label>
                  </div>

                  {useCustomDates && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <DatePicker
                          date={formData.startDate}
                          setDate={(date) => handleDateChange("startDate", date)}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date</Label>
                        <DatePicker
                          date={formData.endDate}
                          setDate={(date) => handleDateChange("endDate", date)}
                          className="w-full"
                          fromDate={formData.startDate || undefined}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {selectedServices.length >= 2 && (
            <Card className="bg-muted">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Regular Price:</span>
                    <span>${regularTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600 font-medium">
                    <span>Savings:</span>
                    <span>-${savings.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Package Price:</span>
                    <span>${discountedTotal.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.push("/settings/packages")}>
            Cancel
          </Button>
          <Button type="submit">{isEditing ? "Update Package" : "Create Package"}</Button>
        </CardFooter>
      </Card>
    </form>
  )
}
