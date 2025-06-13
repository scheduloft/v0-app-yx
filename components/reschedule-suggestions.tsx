"use client"

import { useState } from "react"
import { Calendar, Clock, CloudRain, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import type { RescheduleRecommendation, RescheduleOption } from "@/utils/rescheduling-service"
import { sendWeatherRescheduleNotification, formatDateForNotification } from "@/utils/notification-service"

interface RescheduleSuggestionsProps {
  recommendations: RescheduleRecommendation[]
  onReschedule?: (appointmentId: string, newDate: string, newTime: string, sendNotification: boolean) => void
}

export default function RescheduleSuggestions({ recommendations, onReschedule }: RescheduleSuggestionsProps) {
  const [selectedRecommendation, setSelectedRecommendation] = useState<RescheduleRecommendation | null>(null)
  const [selectedOption, setSelectedOption] = useState<RescheduleOption | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [sendNotification, setSendNotification] = useState(true)
  const [isSending, setIsSending] = useState(false)

  const handleRescheduleClick = (recommendation: RescheduleRecommendation) => {
    setSelectedRecommendation(recommendation)
    setSelectedOption(recommendation.options[0])
    setSendNotification(true)
    setIsDialogOpen(true)
  }

  const handleConfirmReschedule = async () => {
    if (selectedRecommendation && selectedOption && onReschedule) {
      setIsSending(true)

      try {
        // If notification is enabled, send it before rescheduling
        if (sendNotification) {
          // Format reschedule options for the notification
          const rescheduleOptions = selectedRecommendation.options
            .map((option) => {
              const date = new Date(option.date)
              const formattedDate = date.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })
              return `- ${formattedDate} at ${option.time}`
            })
            .join("\n")

          // Send notification
          await sendWeatherRescheduleNotification(
            selectedRecommendation.appointmentId,
            selectedRecommendation.customerName,
            formatDateForNotification(selectedRecommendation.originalDate),
            selectedRecommendation.originalTime,
            selectedRecommendation.service,
            selectedRecommendation.weatherIssue,
            rescheduleOptions,
          )
        }

        // Complete the rescheduling
        onReschedule(selectedRecommendation.appointmentId, selectedOption.date, selectedOption.time, sendNotification)

        setIsDialogOpen(false)
      } catch (error) {
        console.error("Error during rescheduling:", error)
      } finally {
        setIsSending(false)
      }
    }
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            <CloudRain className="h-4 w-4 mr-2 text-blue-500" />
            Weather-Affected Appointments
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {recommendations.map((recommendation) => (
              <div key={recommendation.appointmentId} className="border-b border-border pb-3 last:border-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{recommendation.customerName}</h4>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      <span>
                        {new Date(recommendation.originalDate).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        at {recommendation.originalTime}
                      </span>
                    </div>
                    <div className="flex items-center mt-1">
                      <AlertTriangle className="h-3.5 w-3.5 mr-1 text-amber-500" />
                      <span className="text-sm text-amber-600">{recommendation.weatherIssue}</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleRescheduleClick(recommendation)}>
                    Reschedule
                  </Button>
                </div>

                <div className="mt-2 flex flex-wrap gap-2">
                  {recommendation.options.slice(0, 2).map((option, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className={cn(
                        "flex items-center",
                        option.weatherSuitability > 80 ? "border-green-300 bg-green-50" : "",
                      )}
                    >
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(option.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
          </DialogHeader>

          {selectedRecommendation && (
            <div className="space-y-4 py-2">
              <div>
                <h4 className="font-medium">{selectedRecommendation.customerName}</h4>
                <p className="text-sm text-muted-foreground">{selectedRecommendation.service}</p>
                <div className="flex items-center mt-1 text-sm">
                  <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  <span>
                    Currently scheduled for{" "}
                    {new Date(selectedRecommendation.originalDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    at {selectedRecommendation.originalTime}
                  </span>
                </div>
                <div className="flex items-center mt-1 text-sm">
                  <AlertTriangle className="h-3.5 w-3.5 mr-1 text-amber-500" />
                  <span className="text-amber-600">Weather issue: {selectedRecommendation.weatherIssue}</span>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Select a new date and time:</h4>
                <RadioGroup
                  value={selectedOption ? `${selectedOption.date}-${selectedOption.time}` : undefined}
                  onValueChange={(value) => {
                    const [date, time] = value.split("-")
                    const option = selectedRecommendation.options.find((o) => o.date === date && o.time === time)
                    if (option) {
                      setSelectedOption(option)
                    }
                  }}
                >
                  {selectedRecommendation.options.map((option, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex items-center space-x-2 border rounded-md p-3 mb-2",
                        option.weatherSuitability > 80 ? "border-green-300 bg-green-50" : "",
                        selectedOption === option ? "border-primary" : "",
                      )}
                    >
                      <RadioGroupItem value={`${option.date}-${option.time}`} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">
                              {new Date(option.date).toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                              })}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              <span>{option.time}</span>
                            </div>
                          </div>
                          <Badge
                            variant={option.weatherSuitability > 80 ? "success" : "outline"}
                            className="ml-2 whitespace-nowrap"
                          >
                            {option.weatherSuitability}% suitable
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{option.reason}</p>
                        {option.conflictCount > 0 && (
                          <p className="text-xs text-amber-600 mt-1">
                            Note: {option.conflictCount} other appointment{option.conflictCount > 1 ? "s" : ""} on this
                            day
                          </p>
                        )}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="flex items-center space-x-2 mt-4">
                <Switch id="send-notification" checked={sendNotification} onCheckedChange={setSendNotification} />
                <Label htmlFor="send-notification">Notify customer about rescheduling</Label>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSending}>
              Cancel
            </Button>
            <Button onClick={handleConfirmReschedule} disabled={isSending}>
              {isSending ? "Processing..." : "Confirm Reschedule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
