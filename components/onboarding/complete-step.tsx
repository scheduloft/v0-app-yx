"use client"

import { useRouter } from "next/navigation"
import { useOnboarding } from "@/contexts/onboarding-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Calendar, Users, Wrench } from "lucide-react"

export function CompleteStep() {
  const { data } = useOnboarding()
  const router = useRouter()

  const handleGoToDashboard = () => {
    router.push("/")
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <CardTitle className="text-2xl">Welcome to LawnCare Pro!</CardTitle>
        <p className="text-gray-600">Your account has been successfully set up</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium mb-3">Setup Summary:</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <span>Business: {data.businessName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-green-500" />
              <span>Services: {data.services.length} configured</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-500" />
              <span>Customers: {data.customers.length} added</span>
            </div>
            {data.firstJob && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-500" />
                <span>First job scheduled</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-medium">Next Steps:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Explore your dashboard to manage jobs and customers</li>
            <li>• Set up your route optimization preferences</li>
            <li>• Configure notification settings</li>
            <li>• Add more customers and services as needed</li>
          </ul>
        </div>

        <div className="pt-4">
          <Button onClick={handleGoToDashboard} className="w-full" size="lg">
            Go to Dashboard
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
