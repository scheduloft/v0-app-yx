"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Mail, MessageSquare, Bell } from "lucide-react"
import Link from "next/link"
import NotificationHistory from "@/components/notification-history"
import NotificationTemplateEditor from "@/components/notification-template-editor"
import { getAllNotificationHistory, getNotificationTemplates } from "@/utils/notification-service"
import type { NotificationTemplate } from "@/utils/notification-types"

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("history")
  const [notificationHistory, setNotificationHistory] = useState([])
  const [templates, setTemplates] = useState<NotificationTemplate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load notification history and templates
    const loadData = () => {
      try {
        const history = getAllNotificationHistory()
        const allTemplates = getNotificationTemplates()
        setNotificationHistory(history)
        setTemplates(allTemplates)
      } catch (error) {
        console.error("Failed to load notification data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-lg">Loading notifications...</div>
        </div>
      </div>
    )
  }

  return (
    <main className="flex flex-col pb-16">
      <div className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Notifications</h1>
        <Button size="sm" variant="secondary" asChild>
          <Link href="/notifications/providers">
            <Settings className="h-4 w-4 mr-1" />
            Providers
          </Link>
        </Button>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notificationHistory.length}</div>
              <p className="text-xs text-muted-foreground">All notifications sent to customers</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Email Notifications</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notificationHistory.filter((n) => n.type === "email").length}</div>
              <p className="text-xs text-muted-foreground">Email notifications sent to customers</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">SMS Notifications</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notificationHistory.filter((n) => n.type === "sms").length}</div>
              <p className="text-xs text-muted-foreground">SMS notifications sent to customers</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="history">Notification History</TabsTrigger>
            <TabsTrigger value="templates">Notification Templates</TabsTrigger>
          </TabsList>
          <TabsContent value="history">
            <NotificationHistory notifications={notificationHistory} showCustomerInfo={true} showFilters={true} />
          </TabsContent>
          <TabsContent value="templates">
            <NotificationTemplateEditor templates={templates} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
