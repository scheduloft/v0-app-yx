"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, DollarSign, Edit, Filter, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageContainer } from "@/components/page-container"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCurrentSeason, isPackageInSeason, getSeasonalBadgeColor, formatDateRange } from "@/utils/season-utils"
import type { Season, ServicePackage } from "@/components/package-form"

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

// Mock data for packages with seasonal information
const packages: ServicePackage[] = [
  {
    id: "1",
    name: "Spring Cleanup Special",
    description: "Complete spring cleanup package including lawn mowing, leaf removal, and fertilization.",
    services: ["1", "3", "4"],
    discountType: "percentage",
    discountValue: 15,
    totalPrice: 127.5, // Calculated: (45 + 65 + 40) * 0.85
    savings: 22.5,
    isSeasonalOnly: true,
    availableSeasons: ["spring"],
    startDate: null,
    endDate: null,
  },
  {
    id: "2",
    name: "Lawn Maintenance Bundle",
    description: "Regular lawn maintenance including mowing and weed control.",
    services: ["1", "5"],
    discountType: "fixed",
    discountValue: 10,
    totalPrice: 85, // Calculated: (45 + 50) - 10
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
    discountType: "percentage",
    discountValue: 20,
    totalPrice: 100, // Calculated: (35 + 40 + 50) * 0.8
    savings: 25,
    isSeasonalOnly: false,
    availableSeasons: [],
    startDate: null,
    endDate: null,
  },
  {
    id: "4",
    name: "Summer Lawn Revival",
    description: "Revive your lawn during hot summer months with this special care package.",
    services: ["1", "4", "5"],
    discountType: "percentage",
    discountValue: 15,
    totalPrice: 114.75, // Calculated: (45 + 40 + 50) * 0.85
    savings: 20.25,
    isSeasonalOnly: true,
    availableSeasons: ["summer"],
    startDate: null,
    endDate: null,
  },
  {
    id: "5",
    name: "Fall Cleanup Bundle",
    description: "Prepare your lawn and garden for winter with our comprehensive fall cleanup.",
    services: ["1", "3", "2"],
    discountType: "fixed",
    discountValue: 20,
    totalPrice: 125, // Calculated: (45 + 65 + 35) - 20
    savings: 20,
    isSeasonalOnly: true,
    availableSeasons: ["fall"],
    startDate: null,
    endDate: null,
  },
  {
    id: "6",
    name: "Holiday Special",
    description: "Get your yard looking perfect for the holidays with this limited-time package.",
    services: ["1", "2"],
    discountType: "percentage",
    discountValue: 25,
    totalPrice: 60, // Calculated: (45 + 35) * 0.75
    savings: 20,
    isSeasonalOnly: true,
    availableSeasons: [],
    startDate: new Date(new Date().getFullYear(), 11, 1), // December 1st
    endDate: new Date(new Date().getFullYear(), 11, 31), // December 31st
  },
]

export default function PackagesPage() {
  const [filter, setFilter] = useState<"all" | "current" | "year-round" | Season>("all")
  const currentSeason = getCurrentSeason()

  // Helper function to get service names from IDs
  const getServiceNames = (serviceIds: string[]) => {
    return serviceIds.map((id) => {
      const service = serviceTypes.find((s) => s.id === id)
      return service ? service.name : "Unknown Service"
    })
  }

  // Filter packages based on selected filter
  const filteredPackages = packages.filter((pkg) => {
    if (filter === "all") return true
    if (filter === "current") return isPackageInSeason(pkg)
    if (filter === "year-round") return !pkg.isSeasonalOnly
    return pkg.availableSeasons.includes(filter as Season)
  })

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Service Packages</h1>
          <p className="text-muted-foreground">Create discounted bundles of services</p>
        </div>
        <Button asChild>
          <Link href="/settings/packages/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Package
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="all" className="mb-6" onValueChange={(value) => setFilter(value as any)}>
        <div className="flex items-center mb-2">
          <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter:</span>
        </div>
        <TabsList>
          <TabsTrigger value="all">All Packages</TabsTrigger>
          <TabsTrigger value="current">Current Season</TabsTrigger>
          <TabsTrigger value="year-round">Year-Round</TabsTrigger>
          <TabsTrigger value="spring">Spring</TabsTrigger>
          <TabsTrigger value="summer">Summer</TabsTrigger>
          <TabsTrigger value="fall">Fall</TabsTrigger>
          <TabsTrigger value="winter">Winter</TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredPackages.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/30">
          <h3 className="text-lg font-medium">No packages found</h3>
          <p className="text-muted-foreground mt-1">
            No packages match your current filter. Try changing the filter or create a new package.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPackages.map((pkg) => (
            <Card key={pkg.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle>{pkg.name}</CardTitle>
                  {pkg.isSeasonalOnly && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                      {pkg.startDate && pkg.endDate ? (
                        <Badge variant="outline">{formatDateRange(pkg.startDate, pkg.endDate)}</Badge>
                      ) : (
                        pkg.availableSeasons.map((season) => (
                          <Badge key={season} variant="outline" className={getSeasonalBadgeColor(season)}>
                            {season.charAt(0).toUpperCase() + season.slice(1)}
                          </Badge>
                        ))
                      )}
                    </div>
                  )}
                </div>
                <CardDescription className="line-clamp-2">{pkg.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Includes:</h4>
                  <div className="flex flex-wrap gap-2">
                    {getServiceNames(pkg.services).map((name, index) => (
                      <Badge key={index} variant="outline">
                        {name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Regular price:</span>
                    <span className="line-through">${(pkg.totalPrice! + pkg.savings!).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-green-600">
                    <span>Savings:</span>
                    <span>
                      ${pkg.savings!.toFixed(2)} (
                      {pkg.discountType === "percentage" ? `${pkg.discountValue}%` : `$${pkg.discountValue}`})
                    </span>
                  </div>
                  <div className="flex justify-between items-center font-bold mt-1">
                    <span>Package price:</span>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4" />
                      <span>{pkg.totalPrice!.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <div className="bg-muted p-3 flex justify-between items-center">
                {pkg.isSeasonalOnly && isPackageInSeason(pkg) && (
                  <Badge variant="default" className="bg-green-600">
                    Currently Available
                  </Badge>
                )}
                {pkg.isSeasonalOnly && !isPackageInSeason(pkg) && (
                  <Badge variant="outline" className="text-muted-foreground">
                    Not In Season
                  </Badge>
                )}
                {!pkg.isSeasonalOnly && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                    Year-Round
                  </Badge>
                )}
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/settings/packages/${pkg.id}`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  )
}
