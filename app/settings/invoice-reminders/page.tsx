"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Mail, MessageSquare, DollarSign, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import {
  getInvoiceReminderSettings,
  updateInvoiceReminderSettings,
  getNotificationTemplates,
  type InvoiceReminderSettings,
} from "@/utils/notification-service"

export default function InvoiceRemindersPage() {
  const router = useRouter()
  const [settings, setSettings] = useState<InvoiceReminderSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("schedule")

  const templates = getNotificationTemplates()
  const emailTemplates = templates.filter((t) => t.type === "email")

  useEffect(() => {
    // Load current settings
    const currentSettings = getInvoiceReminderSettings()
    setSettings(currentSettings)
    setLoading(false)
  }, [])

  const handleSave = async () => {
    if (!settings) return

    setSaving(true)
    try {
      updateInvoiceReminderSettings(settings)
      toast({
        title: "Settings Saved",
        description: "Invoice reminder settings have been updated successfully.",
      })
    } catch (error) {
      console.error("Failed to save settings:", error)
      toast({
        title: "Save Failed",
        description: "There was a problem saving your settings.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const updateSettings = (updates: Partial<InvoiceReminderSettings>) => {
    if (!settings) return
    setSettings({ ...settings, ...updates })
  }

  const updateReminderSchedule = (type: "beforeDue" | "onDueDate" | "afterDue", updates: any) => {
    if (!settings) return
    setSettings({
      ...settings,
      reminderSchedule: {
        ...settings.reminderSchedule,
        [type]: { ...settings.reminderSchedule[type], ...updates },
      },
    })
  }

  const updateLateFees = (updates: Partial<InvoiceReminderSettings["lateFees"]>) => {
    if (!settings) return
    setSettings({
      ...settings,
      lateFees: { ...settings.lateFees, ...updates },
    })
  }

  const updateEscalation = (updates: Partial<InvoiceReminderSettings["escalation"]>) => {
    if (!settings) return
    setSettings({
      ...settings,
      escalation: { ...settings.escalation, ...updates },
    })
  }

  const addReminderDay = (type: "beforeDue" | "afterDue", day: number) => {
    if (!settings) return
    const currentDays = settings.reminderSchedule[type].days
    if (!currentDays.includes(day)) {
      updateReminderSchedule(type, {
        days: [...currentDays, day].sort((a, b) => a - b),
      })
    }
  }

  const removeReminderDay = (type: "beforeDue" | "afterDue", day: number) => {
    if (!settings) return
    const currentDays = settings.reminderSchedule[type].days
    updateReminderSchedule(type, {
      days: currentDays.filter((d) => d !== day),
    })
  }

  if (loading || !settings) {
    return (
      <main className="flex flex-col pb-16">
        <div className="bg-primary text-primary-foreground p-4 flex items-center">
          <Button variant="ghost" size="icon" className="mr-2 text-primary-foreground" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Invoice Reminders</h1>
        </div>
        <div className="p-4 flex justify-center items-center h-64">
          <p>Loading settings...</p>
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
          <h1 className="text-xl font-bold">Invoice Reminders</h1>
        </div>
        <Button variant="secondary" size="sm" onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-1" />
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>

      <div className="p-4">
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Enable Invoice Reminders</h3>
                <p className="text-sm text-muted-foreground">
                  Automatically send reminders to customers about unpaid invoices
                </p>
              </div>
              <Switch checked={settings.enabled} onCheckedChange={(checked) => updateSettings({ enabled: checked })} />
            </div>
          </CardContent>
        </Card>

        {settings.enabled && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="fees">Late Fees</TabsTrigger>
              <TabsTrigger value="escalation">Escalation</TabsTrigger>
            </TabsList>

            <TabsContent value="schedule" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    Before Due Date
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Send reminders before due date</Label>
                    <Switch
                      checked={settings.reminderSchedule.beforeDue.enabled}
                      onCheckedChange={(checked) => updateReminderSchedule("beforeDue", { enabled: checked })}
                    />
                  </div>
                  {settings.reminderSchedule.beforeDue.enabled && (
                    <div>
                      <Label className="text-sm">Reminder days (days before due date)</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {settings.reminderSchedule.beforeDue.days.map((day) => (
                          <Badge key={day} variant="secondary" className="cursor-pointer">
                            {day} day{day !== 1 ? "s" : ""}
                            <button
                              onClick={() => removeReminderDay("beforeDue", day)}
                              className="ml-1 text-xs hover:text-destructive"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                        <Select onValueChange={(value) => addReminderDay("beforeDue", Number.parseInt(value))}>
                          <SelectTrigger className="w-auto h-6 text-xs">
                            <SelectValue placeholder="+ Add" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 5, 7, 10, 14, 21, 30].map((day) => (
                              <SelectItem key={day} value={day.toString()}>
                                {day} day{day !== 1 ? "s" : ""}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    On Due Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Label>Send reminder on due date</Label>
                    <Switch
                      checked={settings.reminderSchedule.onDueDate.enabled}
                      onCheckedChange={(checked) => updateReminderSchedule("onDueDate", { enabled: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    After Due Date
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Send reminders after due date</Label>
                    <Switch
                      checked={settings.reminderSchedule.afterDue.enabled}
                      onCheckedChange={(checked) => updateReminderSchedule("afterDue", { enabled: checked })}
                    />
                  </div>
                  {settings.reminderSchedule.afterDue.enabled && (
                    <div>
                      <Label className="text-sm">Reminder days (days after due date)</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {settings.reminderSchedule.afterDue.days.map((day) => (
                          <Badge key={day} variant="destructive" className="cursor-pointer">
                            {day} day{day !== 1 ? "s" : ""}
                            <button
                              onClick={() => removeReminderDay("afterDue", day)}
                              className="ml-1 text-xs hover:text-white"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                        <Select onValueChange={(value) => addReminderDay("afterDue", Number.parseInt(value))}>
                          <SelectTrigger className="w-auto h-6 text-xs">
                            <SelectValue placeholder="+ Add" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 3, 5, 7, 10, 14, 21, 30, 45, 60].map((day) => (
                              <SelectItem key={day} value={day.toString()}>
                                {day} day{day !== 1 ? "s" : ""}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Email Templates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Before Due Date Template</Label>
                    <Select
                      value={settings.templates.beforeDue}
                      onValueChange={(value) =>
                        setSettings({ ...settings, templates: { ...settings.templates, beforeDue: value } })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {emailTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>On Due Date Template</Label>
                    <Select
                      value={settings.templates.onDueDate}
                      onValueChange={(value) =>
                        setSettings({ ...settings, templates: { ...settings.templates, onDueDate: value } })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {emailTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>After Due Date Template</Label>
                    <Select
                      value={settings.templates.afterDue}
                      onValueChange={(value) =>
                        setSettings({ ...settings, templates: { ...settings.templates, afterDue: value } })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {emailTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fees" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Late Fee Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Enable late fees</Label>
                    <Switch
                      checked={settings.lateFees.enabled}
                      onCheckedChange={(checked) => updateLateFees({ enabled: checked })}
                    />
                  </div>

                  {settings.lateFees.enabled && (
                    <>
                      <div className="space-y-2">
                        <Label>Grace period (days)</Label>
                        <Input
                          type="number"
                          min="0"
                          value={settings.lateFees.gracePeriod}
                          onChange={(e) => updateLateFees({ gracePeriod: Number.parseInt(e.target.value) || 0 })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Fee type</Label>
                        <Select
                          value={settings.lateFees.feeType}
                          onValueChange={(value: "percentage" | "fixed") => updateLateFees({ feeType: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percentage">Percentage</SelectItem>
                            <SelectItem value="fixed">Fixed Amount</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>
                          {settings.lateFees.feeType === "percentage" ? "Fee percentage (%)" : "Fee amount ($)"}
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          step={settings.lateFees.feeType === "percentage" ? "0.1" : "1"}
                          value={settings.lateFees.feeAmount}
                          onChange={(e) => updateLateFees({ feeAmount: Number.parseFloat(e.target.value) || 0 })}
                        />
                      </div>

                      {settings.lateFees.feeType === "percentage" && (
                        <div className="space-y-2">
                          <Label>Maximum fee amount ($)</Label>
                          <Input
                            type="number"
                            min="0"
                            value={settings.lateFees.maxFee || ""}
                            onChange={(e) => updateLateFees({ maxFee: Number.parseFloat(e.target.value) || undefined })}
                            placeholder="No maximum"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Compounding fees</Label>
                          <p className="text-sm text-muted-foreground">Apply late fees on top of previous late fees</p>
                        </div>
                        <Switch
                          checked={settings.lateFees.compounding}
                          onCheckedChange={(checked) => updateLateFees({ compounding: checked })}
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="escalation" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Escalation Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Enable escalation</Label>
                    <Switch
                      checked={settings.escalation.enabled}
                      onCheckedChange={(checked) => updateEscalation({ enabled: checked })}
                    />
                  </div>

                  {settings.escalation.enabled && (
                    <>
                      <div className="space-y-2">
                        <Label>Days overdue before escalation</Label>
                        <Input
                          type="number"
                          min="1"
                          value={settings.escalation.daysOverdue}
                          onChange={(e) => updateEscalation({ daysOverdue: Number.parseInt(e.target.value) || 1 })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Escalation type</Label>
                        <Select
                          value={settings.escalation.escalationType}
                          onValueChange={(value: "email" | "sms" | "call" | "mail") =>
                            updateEscalation({ escalationType: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="sms">SMS</SelectItem>
                            <SelectItem value="call">Phone Call</SelectItem>
                            <SelectItem value="mail">Physical Mail</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Escalation template</Label>
                        <Select
                          value={settings.escalation.templateId}
                          onValueChange={(value) => updateEscalation({ templateId: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {emailTemplates.map((template) => (
                              <SelectItem key={template.id} value={template.id}>
                                {template.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>

      <Toaster />
    </main>
  )
}
