"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface OnboardingData {
  // Account Info
  firstName: string
  lastName: string
  email: string
  phone: string

  // Business Info
  businessName: string
  businessAddress: string
  businessPhone: string
  businessEmail: string
  businessLogo?: string

  // Services
  services: Array<{
    id: string
    name: string
    description: string
    price: number
    estimatedTime: number
  }>

  // Customers
  customers: Array<{
    id: string
    name: string
    email: string
    phone: string
    address: string
  }>

  // First Job
  firstJob?: {
    customerId: string
    serviceId: string
    date: string
    time: string
    notes: string
  }
}

interface OnboardingContextType {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  currentStep: number
  setCurrentStep: (step: number) => void
  totalSteps: number
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 6

  const [data, setData] = useState<OnboardingData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    businessName: "",
    businessAddress: "",
    businessPhone: "",
    businessEmail: "",
    services: [],
    customers: [],
  })

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }))
  }

  return (
    <OnboardingContext.Provider
      value={{
        data,
        updateData,
        currentStep,
        setCurrentStep,
        totalSteps,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider")
  }
  return context
}
