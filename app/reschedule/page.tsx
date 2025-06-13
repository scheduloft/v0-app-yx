"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, CloudRain, Check, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import BatchReschedule from "@/components/batch-reschedule"
import RescheduleSuggestions from "@/components/reschedule-suggestions"
import {
  getRescheduleRecommendations,
  getWeatherAffectedAppointments,
  getWeatherAffectedAppointmentCount,
} from "@/utils/rescheduling-service"
import { sendRescheduleConfirmationNotification, formatDateForNotification } from "@/utils/notification-service"

export default function ReschedulePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("affected")
  const [showStormyWeather, setShowStormyWeather] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Get rescheduling data
  const recommendations = getRescheduleRecommendations(showStormyWeather)
  const affectedAppointments = getWeatherAffectedAppointments(showStormyWeather)
  const affectedCount = getWeatherAffectedAppointmentCount(showStormyWeather)

  const handleReschedule = async (
    appointmentId: string,
    newDate: string,
    newTime: string,
    sendNotification: boolean,
  ) => {
    setIsProcessing(true)

    try {
      // Find the appointment and customer details
      const appointmentInfo = affectedAppointments.find((item) => item.appointment.id === appointmentId)

      if (!appointmentInfo) {
        throw new Error("Appointment not found")
      }

      // In a real app, this would call an API to update the appointment
      console.log("Rescheduling appointment:", appointmentId, "to", newDate, "at", newTime)

      // Send confirmation notification if requested
      if (sendNotification) {
        const { appointment } = appointmentInfo

        await sendRescheduleConfirmationNotification(
          appointment.customerId,
          appointment.customerName,
          appointment.service,
          formatDateForNotification(appointment.date),
          appointment.time,
          formatDateForNotification(newDate),
          newTime,
        )
      }

      toast({
        title: "Appointment Rescheduled",
        description: `The appointment has been rescheduled to ${new Date(newDate).toLocaleDateString()} at ${newTime}.`,
        duration: 3000,
      })
    } catch (error) {
      console.error("Error during rescheduling:", error)
      toast({
        title: "Rescheduling Failed",
        description: "There was a problem rescheduling the appointment.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBatchReschedule = async (appointmentIds: string[], sendNotifications: boolean) => {
    setIsProcessing(true)

    try {
      // In a real app, this would open a dialog to select new dates for all appointments
      console.log("Batch rescheduling appointments:", appointmentIds)
      console.log("Send notifications:", sendNotifications)

      // If notifications are enabled, we would send them here
      if (sendNotifications) {
        // For demo purposes, we'll just log this
        console.log("Sending notifications to customers:", appointmentIds)
      }

      toast({
        title: "Batch Rescheduling Initiated",
        description: `${appointmentIds.length} appointments have been queued for rescheduling.`,
        duration: 3000,
      })

      // Navigate to a hypothetical batch rescheduling wizard
      // router.push("/reschedule/batch");
    } catch (error) {
      console.error("Error during batch rescheduling:", error)
      toast({
        title: "Batch Rescheduling Failed",
        description: "There was a problem with the batch rescheduling process.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Toggle between normal and stormy weather (for demo purposes)
  const toggleWeatherScenario = () => {
    setShowStormyWeather(!showStormyWeather)
  }

  return (
    <main className="flex flex-col pb-16">
      <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2 text-primary-foreground" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Weather Rescheduling</h1>
        </div>
        <Badge variant={affectedCount > 0 ? "destructive" : "outline"}>{affectedCount} Affected</Badge>
      </div>

      <div className="p-4 space-y-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="bg-amber-100 p-2 rounded-full mr-3">
                <CloudRain className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h2 className="font-medium">Weather Impact on Schedule</h2>
                <p className="text-sm text-muted-foreground">
                  {affectedCount > 0
                    ? `${affectedCount} appointment${affectedCount !== 1 ? "s" : ""} affected by weather conditions`
                    : "No appointments currently affected by weather"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="affected">Affected Appointments</TabsTrigger>
            <TabsTrigger value="suggestions">Reschedule Suggestions</TabsTrigger>
          </TabsList>

          <TabsContent value="affected" className="mt-4 space-y-4">
            {affectedAppointments.length > 0 ? (
              <BatchReschedule affectedAppointments={affectedAppointments} onBatchReschedule={handleBatchReschedule} />
            ) : (
              <Card>
                <CardContent className="p-4 flex items-center justify-center">
                  <div className="text-center py-6">
                    <Check className="h-12 w-12 text-green-500 mx-auto mb-2" />
                    <h3 className="font-medium text-lg">No Weather-Affected Appointments</h3>
                    <p className="text-muted-foreground">
                      All your scheduled appointments have favorable weather conditions.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="suggestions" className="mt-4 space-y-4">
            {recommendations.length > 0 ? (
              <RescheduleSuggestions recommendations={recommendations} onReschedule={handleReschedule} />
            ) : (
              <Card>
                <CardContent className="p-4 flex items-center justify-center">
                  <div className="text-center py-6">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <h3 className="font-medium text-lg">No Rescheduling Needed</h3>
                    <p className="text-muted-foreground">
                      There are no appointments that need rescheduling at this time.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <Bell className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="font-medium">Customer Notifications</h2>
                <p className="text-sm text-muted-foreground">
                  Customers will be notified about weather-related rescheduling via email and SMS based on their
                  preferences
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push("/notifications")}>
                Manage Templates
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* For demo purposes only - toggle between weather scenarios */}
        <div className="mt-8 text-center">
          <Button variant="outline" onClick={toggleWeatherScenario}>
            Toggle Weather Scenario ({showStormyWeather ? "Normal" : "Stormy"})
          </Button>
          <p className="text-xs text-muted-foreground mt-1">(Demo feature to show different weather impacts)</p>
        </div>
      </div>

      <Toaster />
    </main>
  )
}
