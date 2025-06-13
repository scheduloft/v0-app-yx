import Link from "next/link"
import { Clock, DollarSign, Edit, Package, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageContainer } from "@/components/page-container"

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

export default function ServicesPage() {
  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Service Types</h1>
          <p className="text-muted-foreground">Manage your lawn care service offerings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/settings/packages">
              <Package className="mr-2 h-4 w-4" />
              View Packages
            </Link>
          </Button>
          <Button asChild>
            <Link href="/settings/services/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Service
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {serviceTypes.map((service) => (
          <Card key={service.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle>{service.name}</CardTitle>
              <CardDescription className="line-clamp-2">{service.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>{service.estimatedTime} min</span>
                </div>
                <div className="flex items-center font-medium">
                  <DollarSign className="h-4 w-4" />
                  <span>{service.price.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <div className="bg-muted p-3 flex justify-end">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/settings/services/${service.id}`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  )
}
