"use client"

import { useState } from "react"
import { useOnboarding } from "@/contexts/onboarding-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function JobStep() {
  const { data, updateData, setCurrentStep } = useOnboarding()
  const [jobData, setJobData] = useState({
    customerId: "",
    serviceId: "",
    date: "",
    time: "",
    notes: "",
  })

  const handleNext = () => {
    updateData({ firstJob: jobData })
    setCurrentStep(6)
  }

  const handleBack = () => {
    setCurrentStep(4)
  }

  const handleSkip = () => {
    setCurrentStep(6)
  }

  const canCreateJob = data.customers.length > 0 && data.services.length > 0
  const isValid = jobData.customerId && jobData.serviceId && jobData.date && jobData.time

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Schedule Your First Job</CardTitle>
        <p className="text-gray-600">Get started by scheduling your first lawn care job</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {!canCreateJob ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">You need at least one customer and one service to create a job.</p>
            <p className="text-sm text-gray-500">You can add these later from your dashboard.</p>
          </div>
        ) : (
          <>
            <div>
              <Label>Select Customer</Label>
              <Select
                value={jobData.customerId}
                onValueChange={(value) => setJobData((prev) => ({ ...prev, customerId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a customer" />
                </SelectTrigger>
                <SelectContent>
                  {data.customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Select Service</Label>
              <Select
                value={jobData.serviceId}
                onValueChange={(value) => setJobData((prev) => ({ ...prev, serviceId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a service" />
                </SelectTrigger>
                <SelectContent>
                  {data.services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} - ${service.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={jobData.date}
                  onChange={(e) => setJobData((prev) => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div>
                <Label>Time</Label>
                <Input
                  type="time"
                  value={jobData.time}
                  onChange={(e) => setJobData((prev) => ({ ...prev, time: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label>Notes (Optional)</Label>
              <Textarea
                value={jobData.notes}
                onChange={(e) => setJobData((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Any special instructions or notes..."
                rows={3}
              />
            </div>
          </>
        )}

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSkip}>
              Skip for Now
            </Button>
            <Button onClick={handleNext} disabled={canCreateJob && !isValid}>
              Complete Setup
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
