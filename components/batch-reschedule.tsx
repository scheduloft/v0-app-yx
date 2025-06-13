"use client"

import { useState } from "react"
import { Calendar, CloudRain, AlertTriangle, Bell } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { Appointment } from "@/utils/rescheduling-service"

interface BatchRescheduleProps {
  affectedAppointments: {
    appointment: Appointment
    weatherCheck: { affected: boolean; reason?: string; severity: "high" | "medium" | "low" }
  }[]
  onBatchReschedule?: (appointmentIds: string[], sendNotifications: boolean) => void
}

export default function BatchReschedule({ affectedAppointments, onBatchReschedule }: BatchRescheduleProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedAppointments, setSelectedAppointments] = useState<Record<string, boolean>>({})
  const [sendNotifications, setSendNotifications] = useState(true)

  const handleOpenDialog = () => {
    // Initialize all appointments as selected
    const initialSelection: Record<string, boolean> = {}
    affectedAppointments.forEach((item) => {
      initialSelection[item.appointment.id] = true
    })
    setSelectedAppointments(initialSelection)
    setSendNotifications(true)
    setIsDialogOpen(true)
  }

  const handleToggleAppointment = (id: string) => {
    setSelectedAppointments((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleSelectAll = () => {
    const allSelected = affectedAppointments.every((item) => selectedAppointments[item.appointment.id])

    if (allSelected) {
      // Deselect all
      const newSelection: Record<string, boolean> = {}
      affectedAppointments.forEach((item) => {
        newSelection[item.appointment.id] = false
      })
      setSelectedAppointments(newSelection)
    } else {
      // Select all
      const newSelection: Record<string, boolean> = {}
      affectedAppointments.forEach((item) => {
        newSelection[item.appointment.id] = true
      })
      setSelectedAppointments(newSelection)
    }
  }

  const handleConfirmBatchReschedule = () => {
    const selectedIds = Object.entries(selectedAppointments)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => id)

    if (selectedIds.length > 0 && onBatchReschedule) {
      onBatchReschedule(selectedIds, sendNotifications)
      setIsDialogOpen(false)
    }
  }

  const selectedCount = Object.values(selectedAppointments).filter(Boolean).length

  if (affectedAppointments.length === 0) {
    return null
  }

  // Group appointments by date
  const appointmentsByDate: Record<string, typeof affectedAppointments> = {}
  affectedAppointments.forEach((item) => {
    if (!appointmentsByDate[item.appointment.date]) {
      appointmentsByDate[item.appointment.date] = []
    }
    appointmentsByDate[item.appointment.date].push(item)
  })

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
              Weather-Affected Appointments
            </CardTitle>
            <Button size="sm" variant="outline" onClick={handleOpenDialog}>
              Batch Reschedule
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {Object.entries(appointmentsByDate).map(([date, appointments]) => (
              <div key={date} className="border-b border-border pb-3 last:border-0 last:pb-0">
                <h4 className="font-medium mb-2">
                  {new Date(date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </h4>

                <div className="space-y-2">
                  {appointments.map((item) => (
                    <div key={item.appointment.id} className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center">
                          <Badge
                            variant={
                              item.weatherCheck.severity === "high"
                                ? "destructive"
                                : item.weatherCheck.severity === "medium"
                                  ? "default"
                                  : "outline"
                            }
                            className="mr-2"
                          >
                            {item.appointment.time}
                          </Badge>
                          <span className="font-medium">{item.appointment.customerName}</span>
                        </div>
                        <div className="flex items-center mt-1 text-xs text-muted-foreground">
                          <CloudRain className="h-3 w-3 mr-1" />
                          <span>{item.weatherCheck.reason}</span>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Batch Reschedule Appointments</DialogTitle>
            <DialogDescription>Select appointments to reschedule due to weather conditions.</DialogDescription>
          </DialogHeader>

          <div className="py-2">
            <div className="flex items-center justify-between mb-2">
              <Button variant="ghost" size="sm" onClick={handleSelectAll} className="h-8">
                {affectedAppointments.every((item) => selectedAppointments[item.appointment.id])
                  ? "Deselect All"
                  : "Select All"}
              </Button>
              <Badge variant="outline">
                {selectedCount} of {affectedAppointments.length} selected
              </Badge>
            </div>

            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-2">
                {Object.entries(appointmentsByDate).map(([date, appointments]) => (
                  <div key={date} className="mb-3">
                    <h4 className="font-medium text-sm mb-2">
                      {new Date(date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </h4>

                    <div className="space-y-2">
                      {appointments.map((item) => (
                        <div
                          key={item.appointment.id}
                          className={cn(
                            "flex items-center space-x-2 border rounded-md p-2",
                            selectedAppointments[item.appointment.id] ? "border-primary bg-primary/5" : "",
                            item.weatherCheck.severity === "high" ? "border-red-200" : "",
                          )}
                          onClick={() => handleToggleAppointment(item.appointment.id)}
                        >
                          <Checkbox
                            checked={selectedAppointments[item.appointment.id] || false}
                            onCheckedChange={() => handleToggleAppointment(item.appointment.id)}
                            id={`appointment-${item.appointment.id}`}
                          />
                          <div className="flex-1 cursor-pointer">
                            <div className="flex items-center">
                              <Badge
                                variant={
                                  item.weatherCheck.severity === "high"
                                    ? "destructive"
                                    : item.weatherCheck.severity === "medium"
                                      ? "default"
                                      : "outline"
                                }
                                className="mr-2"
                              >
                                {item.appointment.time}
                              </Badge>
                              <span className="font-medium">{item.appointment.customerName}</span>
                            </div>
                            <div className="flex items-center mt-1 text-xs text-muted-foreground">
                              <AlertTriangle
                                className={cn(
                                  "h-3 w-3 mr-1",
                                  item.weatherCheck.severity === "high"
                                    ? "text-red-500"
                                    : item.weatherCheck.severity === "medium"
                                      ? "text-amber-500"
                                      : "text-yellow-500",
                                )}
                              />
                              <span>{item.weatherCheck.reason}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="flex items-center space-x-2 mt-4">
              <Switch id="send-notifications" checked={sendNotifications} onCheckedChange={setSendNotifications} />
              <div>
                <Label htmlFor="send-notifications" className="flex items-center">
                  <Bell className="h-4 w-4 mr-1" />
                  Notify customers about rescheduling
                </Label>
                <p className="text-xs text-muted-foreground">Send email and SMS notifications to affected customers</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmBatchReschedule} disabled={selectedCount === 0}>
              Reschedule {selectedCount} Appointment{selectedCount !== 1 ? "s" : ""}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
