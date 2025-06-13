"use client"

import { useState } from "react"
import { Check, DollarSign, Clock, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { isPackageInSeason } from "@/utils/season-utils"

// Mock service types data
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

// Mock packages data
const servicePackages = [
  {
    id: "1",
    name: "Spring Cleanup Special",
    description: "Complete spring cleanup package including lawn mowing, leaf removal, and fertilization.",
    services: ["1", "3", "4"],
    discountType: "percentage" as const,
    discountValue: 15,
    totalPrice: 127.5,
    savings: 22.5,
    isSeasonalOnly: true,
    availableSeasons: ["spring" as const],
    startDate: null,
    endDate: null,
  },
  {
    id: "2",
    name: "Lawn Maintenance Bundle",
    description: "Regular lawn maintenance including mowing and weed control.",
    services: ["1", "5"],
    discountType: "fixed" as const,
    discountValue: 10,
    totalPrice: 85,
    savings: 10,
    isSeasonalOnly: false,
    availableSeasons: [],
    startDate: null,
    endDate: null,
  },
  {
    id: "3",
    name: "Complete Garden Care",
    description: "Comprehensive garden care including hedge trimming, weed control, and fertilization.",
    services: ["2", "4", "5"],
    discountType: "percentage" as const,
    discountValue: 20,
    totalPrice: 100,
    savings: 25,
    isSeasonalOnly: false,
    availableSeasons: [],
    startDate: null,
    endDate: null,
  },
]

interface ServiceSelectionProps {
  selectedServiceType?: string
  selectedPackage?: string
  onServiceTypeChange?: (serviceTypeId: string) => void
  onPackageChange?: (packageId: string) => void
  onSelectionChange?: (type: "service" | "package", id: string) => void
}

export function ServiceSelection({
  selectedServiceType,
  selectedPackage,
  onServiceTypeChange,
  onPackageChange,
  onSelectionChange,
}: ServiceSelectionProps) {
  const [selectionType, setSelectionType] = useState<"service" | "package">(selectedPackage ? "package" : "service")
  const [selectedService, setSelectedService] = useState(selectedServiceType || "")
  const [selectedPkg, setSelectedPkg] = useState(selectedPackage || "")

  const handleSelectionTypeChange = (type: "service" | "package") => {
    setSelectionType(type)
    if (type === "service") {
      setSelectedPkg("")
      if (onPackageChange) onPackageChange("")
    } else {
      setSelectedService("")
      if (onServiceTypeChange) onServiceTypeChange("")
    }
  }

  const handleServiceChange = (serviceId: string) => {
    setSelectedService(serviceId)
    if (onServiceTypeChange) onServiceTypeChange(serviceId)
    if (onSelectionChange) onSelectionChange("service", serviceId)
  }

  const handlePackageChange = (packageId: string) => {
    setSelectedPkg(packageId)
    if (onPackageChange) onPackageChange(packageId)
    if (onSelectionChange) onSelectionChange("package", packageId)
  }

  const getServiceNames = (serviceIds: string[]) => {
    return serviceIds.map((id) => {
      const service = serviceTypes.find((s) => s.id === id)
      return service ? service.name : "Unknown Service"
    })
  }

  return (
    <div className="space-y-4">
      <Tabs value={selectionType} onValueChange={(value) => handleSelectionTypeChange(value as "service" | "package")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="service">Individual Services</TabsTrigger>
          <TabsTrigger value="package">Service Packages</TabsTrigger>
        </TabsList>

        <TabsContent value="service" className="space-y-3">
          <RadioGroup value={selectedService} onValueChange={handleServiceChange}>
            {serviceTypes.map((service) => (
              <div key={service.id} className="flex items-center space-x-2">
                <RadioGroupItem value={service.id} id={`service-${service.id}`} />
                <Label htmlFor={`service-${service.id}`} className="flex-1 cursor-pointer">
                  <Card className={`transition-colors ${selectedService === service.id ? "ring-2 ring-primary" : ""}`}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium">{service.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-4 w-4 mr-1" />
                              {service.estimatedTime} min
                            </div>
                            <div className="flex items-center font-medium">
                              <DollarSign className="h-4 w-4" />
                              {service.price.toFixed(2)}
                            </div>
                          </div>
                        </div>
                        {selectedService === service.id && (
                          <Check className="h-5 w-5 text-primary flex-shrink-0 ml-2" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </TabsContent>

        <TabsContent value="package" className="space-y-3">
          <RadioGroup value={selectedPkg} onValueChange={handlePackageChange}>
            {servicePackages.map((pkg) => (
              <div key={pkg.id} className="flex items-center space-x-2">
                <RadioGroupItem value={pkg.id} id={`package-${pkg.id}`} />
                <Label htmlFor={`package-${pkg.id}`} className="flex-1 cursor-pointer">
                  <Card className={`transition-colors ${selectedPkg === pkg.id ? "ring-2 ring-primary" : ""}`}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{pkg.name}</h3>
                            {pkg.isSeasonalOnly && (
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                <Badge variant="outline" className="text-xs">
                                  {pkg.availableSeasons.length > 0 ? pkg.availableSeasons.join(", ") : "Limited Time"}
                                </Badge>
                              </div>
                            )}
                            {pkg.isSeasonalOnly && !isPackageInSeason(pkg) && (
                              <Badge variant="secondary" className="text-xs">
                                Not Available
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{pkg.description}</p>

                          <div className="flex flex-wrap gap-1 mb-2">
                            {getServiceNames(pkg.services).map((name, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {name}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="text-sm text-muted-foreground line-through">
                                ${(pkg.totalPrice + pkg.savings).toFixed(2)}
                              </div>
                              <div className="text-sm text-green-600 font-medium">Save ${pkg.savings.toFixed(2)}</div>
                            </div>
                            <div className="flex items-center font-bold">
                              <DollarSign className="h-4 w-4" />
                              {pkg.totalPrice.toFixed(2)}
                            </div>
                          </div>
                        </div>
                        {selectedPkg === pkg.id && <Check className="h-5 w-5 text-primary flex-shrink-0 ml-2" />}
                      </div>
                    </CardContent>
                  </Card>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </TabsContent>
      </Tabs>
    </div>
  )
}
