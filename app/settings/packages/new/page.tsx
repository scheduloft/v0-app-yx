import { PageContainer } from "@/components/page-container"
import { PackageForm } from "@/components/package-form"

export default function NewPackagePage() {
  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create New Package</h1>
        <p className="text-muted-foreground">Bundle services together with a discount</p>
      </div>

      <PackageForm />
    </PageContainer>
  )
}
