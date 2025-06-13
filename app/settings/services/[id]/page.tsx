import { PageContainer } from "@/components/page-container"
import { ServiceTypeForm } from "@/components/service-type-form"

// Mock data for service types - in a real app, this would come from a database
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

export default function EditServicePage({ params }: { params: { id: string } }) {
  // In a real app, this would fetch from a database
  const serviceType = serviceTypes.find((service) => service.id === params.id)

  if (!serviceType) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Service Not Found</h2>
            <p className="text-muted-foreground">The service you're looking for doesn't exist.</p>
          </div>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Service Type</h1>
        <p className="text-muted-foreground">Update details for {serviceType.name}</p>
      </div>

      <ServiceTypeForm serviceType={serviceType} isEditing />
    </PageContainer>
  )
}
