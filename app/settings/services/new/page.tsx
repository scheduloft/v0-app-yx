import { PageContainer } from "@/components/page-container"
import { ServiceTypeForm } from "@/components/service-type-form"

export default function NewServicePage() {
  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add New Service Type</h1>
        <p className="text-muted-foreground">Create a new service offering for your customers</p>
      </div>

      <ServiceTypeForm />
    </PageContainer>
  )
}
