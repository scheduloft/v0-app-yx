"use client"

import { useOnboarding } from "@/contexts/onboarding-context"
import { ProgressSteps } from "@/components/progress-steps"
import { AccountStep } from "@/components/onboarding/account-step"
import { BusinessStep } from "@/components/onboarding/business-step"
import { ServicesStep } from "@/components/onboarding/services-step"
import { CustomersStep } from "@/components/onboarding/customers-step"
import { JobStep } from "@/components/onboarding/job-step"
import { CompleteStep } from "@/components/onboarding/complete-step"

const steps = [
  { id: 1, title: "Account", description: "Create your account" },
  { id: 2, title: "Business", description: "Business information" },
  { id: 3, title: "Services", description: "Setup your services" },
  { id: 4, title: "Customers", description: "Add customers" },
  { id: 5, title: "First Job", description: "Schedule first job" },
  { id: 6, title: "Complete", description: "All done!" },
]

export function OnboardingWizard() {
  const { currentStep } = useOnboarding()

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <AccountStep />
      case 2:
        return <BusinessStep />
      case 3:
        return <ServicesStep />
      case 4:
        return <CustomersStep />
      case 5:
        return <JobStep />
      case 6:
        return <CompleteStep />
      default:
        return <AccountStep />
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">Welcome to LawnCare Pro</h1>
        <p className="text-gray-600 text-center">Let's get your business set up in just a few steps</p>
      </div>

      <ProgressSteps steps={steps} currentStep={currentStep} />

      <div className="mt-8">{renderStep()}</div>
    </div>
  )
}
