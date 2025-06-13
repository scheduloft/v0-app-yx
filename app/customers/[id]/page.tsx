"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Edit, Calendar, FileText, MapPin, Phone, Mail, Clock, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import NotificationHistoryComponent from "@/components/notification-history"
import NotificationDetail from "@/components/notification-detail"
import { getCustomerNotificationPreferences, getCustomerNotificationHistory } from "@/utils/notification-service"
import type { NotificationHistory } from "@/utils/notification-service"

// Mock customer data - in a real app, you would fetch this from your API
const mockCustomers = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    address: "123 Oak Street",
    city: "Anytown",
    state: "ST",
    zipCode: "12345",
    image: "/placeholder.svg?height=40&width=40",
    initials: "JS",
    status: "Active",
    lastService: "June 6, 2025",
    nextService: "June 20, 2025",
    notes: "Front gate code: 1234. Dog is friendly.",
    serviceFrequency: "Bi-weekly",
    preferredDay: "Friday",
    serviceType: "Standard",
    serviceHistory: [
      { date: "June 6, 2025", service: "Lawn Mowing", notes: "Completed on time" },
      {
        date: "May 23, 2025",
        service: "Lawn Mowing + Edging",
        notes: "Customer requested extra attention to front yard",
      },
      { date: "May 9, 2025", service: "Lawn Mowing", notes: "Completed on time" },
    ],
    upcomingServices: [
      { date: "June 20, 2025", service: "Lawn Mowing", status: "Scheduled" },
      { date: "July 4, 2025", service: "Lawn Mowing + Fertilization", status: "Scheduled" },
    ],
    invoices: [
      { id: "INV-001", date: "June 6, 2025", amount: 85.0, status: "Paid" },
      { id: "INV-002", date: "May 23, 2025", amount: 120.0, status: "Paid" },
      { id: "INV-003", date: "May 9, 2025", amount: 85.0, status: "Paid" },
    ],
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "(555) 234-5678",
    address: "456 Maple Avenue",
    city: "Anytown",
    state: "ST",
    zipCode: "12345",
    image: "/placeholder.svg?height=40&width=40",
    initials: "SJ",
    status: "Active",
    lastService: "June 10, 2025",
    nextService: "June 24, 2025",
    notes: "Please text before arrival.",
    serviceFrequency: "Weekly",
    preferredDay: "Monday",
    serviceType: "Premium",
    serviceHistory: [
      { date: "June 10, 2025", service: "Full Service", notes: "Completed on time" },
      { date: "June 3, 2025", service: "Full Service", notes: "Completed on time" },
      { date: "May 27, 2025", service: "Full Service", notes: "Completed on time" },
    ],
    upcomingServices: [
      { date: "June 17, 2025", service: "Full Service", status: "Scheduled" },
      { date: "June 24, 2025", service: "Full Service", status: "Scheduled" },
    ],
    invoices: [
      { id: "INV-004", date: "June 10, 2025", amount: 150.0, status: "Paid" },
      { id: "INV-005", date: "June 3, 2025", amount: 150.0, status: "Paid" },
      { id: "INV-006", date: "May 27, 2025", amount: 150.0, status: "Paid" },
    ],
  },
]

export default function CustomerDetailPage({ params }) {
  const router = useRouter()
  const { id } = params
  const [isLoading, setIsLoading] = useState(true)
  const [customer, setCustomer] = useState(null)
  const [notificationPreferences, setNotificationPreferences] = useState(null)
  const [notificationHistory, setNotificationHistory] = useState<NotificationHistory[]>([])
  const [selectedNotification, setSelectedNotification] = useState<NotificationHistory | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

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

  const handleViewNotificationDetails = (notification: NotificationHistory) => {
    setSelectedNotification(notification)
    setIsDetailOpen(true)
  }

  if (isLoading || !customer) {
    return (
      <main className="flex flex-col pb-16">
        <div className="bg-primary text-primary-foreground p-4 flex items-center">
          <Button variant="ghost" size="icon" className="mr-2 text-primary-foreground" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Customer Details</h1>
        </div>
        <div className="p-4 flex justify-center items-center h-64">
          <p>Loading customer data...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex flex-col pb-16">
      <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2 text-primary-foreground" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Customer Details</h1>
        </div>
        <Button variant="secondary" size="sm" onClick={() => router.push(`/customers/edit/${customer.id}`)}>
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
      </div>

      <div className="p-4 space-y-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={customer.image || "/placeholder.svg"} alt={customer.name} />
                <AvatarFallback>{customer.initials}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{customer.name}</h2>
                <div className="flex items-center mt-1">
                  <Badge variant={customer.status === "Active" ? "outline" : "secondary"}>{customer.status}</Badge>
                  <span className="text-sm text-muted-foreground ml-2">Customer since January 2025</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{customer.email}</span>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foregroun mt-0.5" />
                  <div>
                    <p>{customer.address}</p>
                    <p>
                      {customer.city}, {customer.state} {customer.zipCode}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>
                    Service: {customer.serviceFrequency} ({customer.preferredDay}s)
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Last service: {customer.lastService}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Next service: {customer.nextService}</span>
                </div>
              </div>
            </div>

            {customer.notes && (
              <div className="mt-4 p-3 bg-muted/50 rounded-md">
                <h3 className="font-semibold text-sm mb-1">Notes:</h3>
                <p className="text-sm">{customer.notes}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-2 mt-4">
              <Button size="sm" onClick={() => router.push("/schedule")}>
                <Calendar className="h-4 w-4 mr-1" />
                Schedule Service
              </Button>
              <Button size="sm" variant="outline" onClick={() => router.push("/invoices/new")}>
                <FileText className="h-4 w-4 mr-1" />
                Create Invoice
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="upcoming">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-4 space-y-3">
            {customer.upcomingServices.length > 0 ? (
              customer.upcomingServices.map((service, index) => (
                <Card key={index}>
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{service.date}</p>
                        <p className="text-sm text-muted-foreground">{service.service}</p>
                      </div>
                      <Badge variant="outline">{service.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">No upcoming services scheduled</p>
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-4 space-y-3">
            {customer.serviceHistory.length > 0 ? (
              customer.serviceHistory.map((service, index) => (
                <Card key={index}>
                  <CardContent className="p-3">
                    <div>
                      <div className="flex justify-between">
                        <p className="font-medium">{service.date}</p>
                        <Badge variant="secondary">Completed</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{service.service}</p>
                      {service.notes && <p className="text-xs text-muted-foreground mt-1">{service.notes}</p>}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">No service history available</p>
            )}
          </TabsContent>

          <TabsContent value="invoices" className="mt-4 space-y-3">
            {customer.invoices.length > 0 ? (
              customer.invoices.map((invoice, index) => (
                <Card
                  key={index}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => router.push(`/invoices/${invoice.id}`)}
                >
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{invoice.id}</p>
                        <p className="text-sm text-muted-foreground">{invoice.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${invoice.amount.toFixed(2)}</p>
                        <Badge variant={invoice.status === "Paid" ? "success" : "outline"} className="mt-1">
                          {invoice.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">No invoices available</p>
            )}
          </TabsContent>

          <TabsContent value="notifications" className="mt-4 space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium flex items-center mb-3">
                  <Bell className="h-4 w-4 mr-2" />
                  Notification Settings
                </h3>
                {notificationPreferences && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Email:</span>
                      <Badge variant={notificationPreferences.email ? "success" : "outline"}>
                        {notificationPreferences.email ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">SMS:</span>
                      <Badge variant={notificationPreferences.sms ? "success" : "outline"}>
                        {notificationPreferences.sms ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Weather Alerts:</span>
                      <Badge variant={notificationPreferences.weatherAlerts ? "success" : "outline"}>
                        {notificationPreferences.weatherAlerts ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Appointment Reminders:</span>
                      <Badge variant={notificationPreferences.appointmentReminders ? "success" : "outline"}>
                        {notificationPreferences.appointmentReminders ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full"
                  onClick={() => router.push(`/customers/notifications/${customer.id}`)}
                >
                  Edit Notification Preferences
                </Button>
              </CardContent>
            </Card>

            <h3 className="font-medium">Recent Notifications</h3>
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

      <NotificationDetail notification={selectedNotification} open={isDetailOpen} onOpenChange={setIsDetailOpen} />
    </main>
  )
}
