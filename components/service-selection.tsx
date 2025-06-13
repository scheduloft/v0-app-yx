"use client"

import { useState } from "react"
import { Clock, DollarSign, Package, Scissors, Leaf } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

// Mock service types
const serviceTypes = [
  {
    id: "1",
    name: "Lawn Mowing",
    description: "Regular grass cutting and basic cleanup",
    estimatedTime: 45,
    price: 45.0,
    icon: Scissors,
  },
  {
    id: "2",
    name: "Hedge Trimming",
    description: "Professional hedge and shrub trimming",
    estimatedTime: 30,
    price: 35.0,
    icon: Scissors,
  },
  {
    id: "3",
    name: "Leaf Removal",
    description: "Complete leaf cleanup and disposal",
    estimatedTime: 90,
    price: 65.0,
    icon: Leaf,
  },
  {
    id: "4",
    name: "Fertilization",
    description: "Lawn fertilization and soil treatment",
    estimatedTime: 30,
    price: 40.0,
    icon: Package,
  },
  {
    id: "5",
    name: "Weed Control",
    description: "Weed removal and prevention treatment",
    estimatedTime: 45,
    price: 50.0,
    icon: Package,
  },
]

// Mock service packages
const servicePackages = [
  {
    id: "1",
    name: "Spring Cleanup Special",
    description: "Complete spring preparation package",
    services: ["1", "2", "3"],
    serviceNames: ["Lawn Mowing", "Hedge Trimming", "Leaf Removal"],
    regularPrice: 145.0,
    discountType: "percentage" as const,
    discountValue: 15,
    totalPrice: 127.5,
    estimatedTime: 165,
    isSeasonalOnly: true,
    availableSeasons: ["spring"],
    icon: Leaf,
  },
  {
    id: "2",
    name: "Lawn Maintenance Bundle",
    description: "Regular lawn care with weed control",
    services: ["1", "5"],
    serviceNames: ["Lawn Mowing", "Weed Control"],
    regularPrice: 95.0,
    discountType: "fixed" as const,
    discountValue: 10,
    totalPrice: 85.0,
    estimatedTime: 90,
    isSeasonalOnly: false,
    icon: Scissors,
  },
  {
    id: "3",
    name: "Complete Garden Care",
    description: "Full-service lawn and garden maintenance",
    services: ["1", "2", "4"],
    serviceNames: ["Lawn Mowing", "Hedge Trimming", "Fertilization"],
    regularPrice: 120.0,
    discountType: "percentage" as const,
    discountValue: 20,
    totalPrice: 100.0,
    estimatedTime: 105,
    isSeasonalOnly: false,
    icon: Package,
  },
]

interface ServiceSelectionProps {
  selectedServiceType?: string
  selectedPackage?: string
  onSelectionChange: (type: "service" | "package", id: string) => void
}

export function ServiceSelection({ selectedServiceType, selectedPackage, onSelectionChange }: ServiceSelectionProps) {
  const [activeTab, setActiveTab] = useState(selectedPackage ? "packages" : "services")

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const getCurrentSeason = () => {
    const month = new Date().getMonth()
    if (month >= 2 && month <= 4) return "spring"
    if (month >= 5 && month <= 7) return "summer"
    if (month >= 8 && month <= 10) return "fall"
    return "winter"
  }

  const isPackageInSeason = (pkg: (typeof servicePackages)[0]) => {
    if (!pkg.isSeasonalOnly) return true
    const currentSeason = getCurrentSeason()
    return pkg.availableSeasons.includes(currentSeason)
  }

  const getSeasonBadge = (pkg: (typeof servicePackages)[0]) => {
    if (!pkg.isSeasonalOnly) {
      return <Badge variant="outline">Year-Round</Badge>
    }

    const inSeason = isPackageInSeason(pkg)
    return <Badge variant={inSeason ? "default" : "secondary"}>{inSeason ? "In Season" : "Out of Season"}</Badge>
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="services">Individual Services</TabsTrigger>
        <TabsTrigger value="packages">Service Packages</TabsTrigger>
      </TabsList>

      <TabsContent value="services" className="mt-4">
        <RadioGroup
          value={selectedServiceType}
          onValueChange={(value) => onSelectionChange("service", value)}
          className="space-y-3"
        >
          {serviceTypes.map((service) => {
            const Icon = service.icon
            return (
              <div key={service.id} className="flex items-center space-x-2">
                <RadioGroupItem value={service.id} id={`service-${service.id}`} />
                <Label htmlFor={`service-${service.id}`} className="flex-1 cursor-pointer">
                  <Card className="hover:bg-muted/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <Icon className="h-5 w-5 text-primary mt-1" />
                          <div>
                            <h3 className="font-medium">{service.name}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  {formatTime(service.estimatedTime)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="font-bold text-lg">{service.price.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Label>
              </div>
            )
          })}
        </RadioGroup>
      </TabsContent>

      <TabsContent value="packages" className="mt-4">
        <RadioGroup
          value={selectedPackage}
          onValueChange={(value) => onSelectionChange("package", value)}
          className="space-y-3"
        >
          {servicePackages.map((pkg) => {
            const Icon = pkg.icon
            const savings = pkg.regularPrice - pkg.totalPrice
            const savingsPercentage = ((savings / pkg.regularPrice) * 100).toFixed(0)

            return (
              <div key={pkg.id} className="flex items-center space-x-2">
                <RadioGroupItem value={pkg.id} id={`package-${pkg.id}`} />
                <Label htmlFor={`package-${pkg.id}`} className="flex-1 cursor-pointer">
                  <Card className="hover:bg-muted/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <Icon className="h-5 w-5 text-primary mt-1" />
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-medium">{pkg.name}</h3>
                              {getSeasonBadge(pkg)}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{pkg.description}</p>
                            <div className="space-y-1">
                              <p className="text-xs font-medium">Includes:</p>
                              <div className="flex flex-wrap gap-1">
                                {pkg.serviceNames.map((serviceName, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {serviceName}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center space-x-4 mt-2">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{formatTime(pkg.estimatedTime)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="space-y-1">
                            <div className="text-sm text-muted-foreground line-through">
                              ${pkg.regularPrice.toFixed(2)}
                            </div>
                            <div className="flex items-center space-x-1">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span className="font-bold text-lg">{pkg.totalPrice.toFixed(2)}</span>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              Save {savingsPercentage}%
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Label>
              </div>
            )
          })}
        </RadioGroup>
      </TabsContent>
    </Tabs>
  )
}
