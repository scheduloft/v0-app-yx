"use client"

import { useState } from "react"
import { useOnboarding } from "@/contexts/onboarding-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

export function BusinessStep() {
  const { data, updateData, setCurrentStep } = useOnboarding()
  const [formData, setFormData] = useState({
    businessName: data.businessName,
    businessAddress: data.businessAddress,
    businessPhone: data.businessPhone,
    businessEmail: data.businessEmail,
  })

  const handleNext = () => {
    updateData(formData)
    setCurrentStep(3)
  }

  const handleBack = () => {
    setCurrentStep(1)
  }

  const isValid = formData.businessName && formData.businessAddress && formData.businessPhone

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Business Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="businessName">Business Name</Label>
          <Input
            id="businessName"
            value={formData.businessName}
            onChange={(e) => setFormData((prev) => ({ ...prev, businessName: e.target.value }))}
            placeholder="Enter your business name"
          />
        </div>

        <div>
          <Label htmlFor="businessAddress">Business Address</Label>
          <Textarea
            id="businessAddress"
            value={formData.businessAddress}
            onChange={(e) => setFormData((prev) => ({ ...prev, businessAddress: e.target.value }))}
            placeholder="Enter your business address"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="businessPhone">Business Phone</Label>
          <Input
            id="businessPhone"
            type="tel"
            value={formData.businessPhone}
            onChange={(e) => setFormData((prev) => ({ ...prev, businessPhone: e.target.value }))}
            placeholder="Enter your business phone number"
          />
        </div>

        <div>
          <Label htmlFor="businessEmail">Business Email (Optional)</Label>
          <Input
            id="businessEmail"
            type="email"
            value={formData.businessEmail}
            onChange={(e) => setFormData((prev) => ({ ...prev, businessEmail: e.target.value }))}
            placeholder="Enter your business email"
          />
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>
          <Button onClick={handleNext} disabled={!isValid}>
            Next: Setup Services
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
