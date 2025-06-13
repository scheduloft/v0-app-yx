"use client"

import { useState } from "react"
import { Mail, MessageSquare, Bell, Save } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import type { NotificationPreference } from "@/utils/notification-service"
import { updateCustomerNotificationPreferences } from "@/utils/notification-service"

interface NotificationPreferencesProps {
  customerId: string
  preferences: NotificationPreference
  onUpdate?: (updatedPreferences: NotificationPreference) => void
}

export default function NotificationPreferences({ customerId, preferences, onUpdate }: NotificationPreferencesProps) {
  const [currentPreferences, setCurrentPreferences] = useState<NotificationPreference>({ ...preferences })
  const [isSaving, setIsSaving] = useState(false)

  const handleToggle = (field: keyof NotificationPreference, value: boolean) => {
    setCurrentPreferences((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // In a real app, this would call an API to update the preferences
      const updatedPreferences = updateCustomerNotificationPreferences(customerId, currentPreferences)

      if (onUpdate) {
        onUpdate(updatedPreferences)
      }

      toast({
        title: "Preferences Updated",
        description: "Notification preferences have been saved successfully.",
      })
    } catch (error) {
      console.error("Failed to update notification preferences:", error)
      toast({
        title: "Update Failed",
        description: "There was a problem updating notification preferences.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <Bell className="h-5 w-5 mr-2" />
          Notification Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                <Mail className="h-4 w-4" />
              </div>
              <div>
                <Label htmlFor="email-toggle" className="font-medium">
                  Email Notifications
                </Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
            </div>
            <Switch
              id="email-toggle"
              checked={currentPreferences.email}
              onCheckedChange={(checked) => handleToggle("email", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3">
                <MessageSquare className="h-4 w-4" />
              </div>
              <div>
                <Label htmlFor="sms-toggle" className="font-medium">
                  SMS Notifications
                </Label>
                <p className="text-sm text-muted-foreground">Receive notifications via text message</p>
              </div>
            </div>
            <Switch
              id="sms-toggle"
              checked={currentPreferences.sms}
              onCheckedChange={(checked) => handleToggle("sms", checked)}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <h3 className="font-medium">Notification Types</h3>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="weather-alerts-toggle" className="font-medium">
                Weather Alerts
              </Label>
              <p className="text-sm text-muted-foreground">Notifications about weather affecting appointments</p>
            </div>
            <Switch
              id="weather-alerts-toggle"
              checked={currentPreferences.weatherAlerts}
              onCheckedChange={(checked) => handleToggle("weatherAlerts", checked)}
              disabled={!currentPreferences.email && !currentPreferences.sms}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="appointment-reminders-toggle" className="font-medium">
                Appointment Reminders
              </Label>
              <p className="text-sm text-muted-foreground">Reminders about upcoming appointments</p>
            </div>
            <Switch
              id="appointment-reminders-toggle"
              checked={currentPreferences.appointmentReminders}
              onCheckedChange={(checked) => handleToggle("appointmentReminders", checked)}
              disabled={!currentPreferences.email && !currentPreferences.sms}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="reschedule-notifications-toggle" className="font-medium">
                Reschedule Notifications
              </Label>
              <p className="text-sm text-muted-foreground">Notifications about rescheduled appointments</p>
            </div>
            <Switch
              id="reschedule-notifications-toggle"
              checked={currentPreferences.rescheduleNotifications}
              onCheckedChange={(checked) => handleToggle("rescheduleNotifications", checked)}
              disabled={!currentPreferences.email && !currentPreferences.sms}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="marketing-messages-toggle" className="font-medium">
                Marketing Messages
              </Label>
              <p className="text-sm text-muted-foreground">Promotional offers and updates</p>
            </div>
            <Switch
              id="marketing-messages-toggle"
              checked={currentPreferences.marketingMessages}
              onCheckedChange={(checked) => handleToggle("marketingMessages", checked)}
              disabled={!currentPreferences.email && !currentPreferences.sms}
            />
          </div>
        </div>

        <div className="pt-2">
          <Button onClick={handleSave} disabled={isSaving} className="w-full">
            {isSaving ? (
              "Saving..."
            ) : (
              <>
                <Save className="h-4 w-4 mr-1" />
                Save Preferences
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
