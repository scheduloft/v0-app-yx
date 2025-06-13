"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import NotificationPreferences from "@/components/notification-preferences"
import NotificationHistoryComponent from "@/components/notification-history"
import NotificationDetail from "@/components/notification-detail"
import {
  getCustomerNotificationPreferences,
  getCustomerNotificationHistory,
  sendNotification,
} from "@/utils/notification-service"
import type { NotificationHistory, NotificationPreference } from "@/utils/notification-service"

// Mock customer data - in a real app, you would fetch this from your API
const mockCustomers = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael.b@example.com",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.d@example.com",
  },
  {
    id: "5",
    name: "David Wilson",
    email: "david.w@example.com",
  },
]

export default function CustomerNotificationsPage({ params }) {
  const router = useRouter()
  const { id } = params
  const [isLoading, setIsLoading] = useState(true)
  const [customer, setCustomer] = useState<{ id: string; name: string; email: string } | null>(null)
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreference | null>(null)
  const [notificationHistory, setNotificationHistory] = useState<NotificationHistory[]>([])
  const [selectedNotification, setSelectedNotification] = useState<NotificationHistory | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("preferences")

  // Fetch customer data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundCustomer = mockCustomers.find((c) => c.id === id)
      if (foundCustomer) {
        setCustomer(foundCustomer)

        // Get notification preferences
        const preferences = getCustomerNotificationPreferences(id)
        setNotificationPreferences(preferences)

        // Get notification history
        const history = getCustomerNotificationHistory(id)
        setNotificationHistory(history)
      } else {
        // Handle customer not found
        router.push("/customers")
      }
      setIsLoading(false)
    }, 500)
  }, [id, router])

  const handleUpdatePreferences = (updatedPreferences: NotificationPreference) => {
    setNotificationPreferences(updatedPreferences)
    toast({
      title: "Preferences Updated",
      description: "Notification preferences have been saved successfully.",
    })
  }

  const handleViewNotificationDetails = (notification: NotificationHistory) => {
    setSelectedNotification(notification)
    setIsDetailOpen(true)
  }

  const handleResendNotification = async (notification: NotificationHistory) => {
    try {
      // In a real app, you would extract variables from the notification body
      // For this demo, we'll just resend with the same content
      await sendNotification(notification.customerId, notification.customerName, notification.templateId, {})

      toast({
        title: "Notification Resent",
        description: "The notification has been resent successfully.",
      })

      // Refresh notification history
      const history = getCustomerNotificationHistory(id)
      setNotificationHistory(history)

      setIsDetailOpen(false)
    } catch (error) {
      console.error("Failed to resend notification:", error)
      toast({
        title: "Resend Failed",
        description: "There was a problem resending the notification.",
        variant: "destructive",
      })
    }
  }

  if (isLoading || !customer || !notificationPreferences) {
    return (
      <main className="flex flex-col pb-16">
        <div className="bg-primary text-primary-foreground p-4 flex items-center">
          <Button variant="ghost" size="icon" className="mr-2 text-primary-foreground" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Notification Preferences</h1>
        </div>
        <div className="p-4 flex justify-center items-center h-64">
          <p>Loading customer data...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex flex-col pb-16">
      <div className="bg-primary text-primary-foreground p-4 flex items-center">
        <Button variant="ghost" size="icon" className="mr-2 text-primary-foreground" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Notification Preferences</h1>
      </div>

      <div className="p-4">
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-primary/10 mr-3">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-medium">{customer.name}</h2>
                <p className="text-sm text-muted-foreground">{customer.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="history">Notification History</TabsTrigger>
          </TabsList>

          <TabsContent value="preferences">
            <NotificationPreferences
              customerId={customer.id}
              preferences={notificationPreferences}
              onUpdate={handleUpdatePreferences}
            />
          </TabsContent>

          <TabsContent value="history">
            {notificationHistory.length > 0 ? (
              <NotificationHistoryComponent
                notifications={notificationHistory}
                onViewDetails={handleViewNotificationDetails}
              />
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No notification history available</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <NotificationDetail
        notification={selectedNotification}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onResend={handleResendNotification}
      />

      <Toaster />
    </main>
  )
}
