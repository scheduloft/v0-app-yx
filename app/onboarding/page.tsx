"use client"

import { OnboardingProvider } from "@/contexts/onboarding-context"
import { OnboardingWizard } from "@/components/onboarding-wizard"

export default function OnboardingPage() {
  return (
    <OnboardingProvider>
      <div className="min-h-screen bg-gray-50">
        <OnboardingWizard />
      </div>
    </OnboardingProvider>
  )
}
