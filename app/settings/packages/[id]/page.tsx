import { PageContainer } from "@/components/page-container"
import { PackageForm } from "@/components/package-form"

// Mock data for packages
const packages = [
  {
    id: "1",
    name: "Spring Cleanup Special",
    description: "Complete spring cleanup package including lawn mowing, leaf removal, and fertilization.",
    services: ["1", "3", "4"],
    discountType: "percentage" as const,
    discountValue: 15,
    totalPrice: 127.5,
    savings: 22.5,
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
  },
]

export default function EditPackagePage({ params }: { params: { id: string } }) {
  // In a real app, this would fetch from a database
  const servicePackage = packages.find((pkg) => pkg.id === params.id)

  if (!servicePackage) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Package Not Found</h2>
            <p className="text-muted-foreground">The package you're looking for doesn't exist.</p>
          </div>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Package</h1>
        <p className="text-muted-foreground">Update details for {servicePackage.name}</p>
      </div>

      <PackageForm servicePackage={servicePackage} isEditing />
    </PageContainer>
  )
}
