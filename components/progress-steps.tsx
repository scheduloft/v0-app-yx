"use client"

import { Check } from "lucide-react"

interface Step {
  id: number
  title: string
  description: string
}

interface ProgressStepsProps {
  steps: Step[]
  currentStep: number
}

export function ProgressSteps({ steps, currentStep }: ProgressStepsProps) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`
              w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
              ${
                currentStep > step.id
                  ? "bg-green-500 text-white"
                  : currentStep === step.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-600"
              }
            `}
            >
              {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
            </div>
            <div className="mt-2 text-center">
              <div className="text-sm font-medium">{step.title}</div>
              <div className="text-xs text-gray-500">{step.description}</div>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`
              w-16 h-0.5 mx-4 mt-[-20px]
              ${currentStep > step.id ? "bg-green-500" : "bg-gray-200"}
            `}
            />
          )}
        </div>
      ))}
    </div>
  )
}
