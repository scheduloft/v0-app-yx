"use client"

import { AlertTriangle, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import type { WeatherAlert } from "@/utils/weather-service"

interface WeatherAlertsProps {
  alerts: WeatherAlert[]
  onDismiss?: (alertIndex: number) => void
}

export default function WeatherAlerts({ alerts, onDismiss }: WeatherAlertsProps) {
  if (!alerts || alerts.length === 0) {
    return null
  }

  return (
    <div className="space-y-2">
      {alerts.map((alert, index) => (
        <Alert
          key={index}
          variant={alert.severity === "warning" ? "destructive" : alert.severity === "watch" ? "default" : "outline"}
        >
          <div className="flex items-start">
            <AlertTriangle className="h-4 w-4 mr-2 mt-0.5" />
            <div className="flex-1">
              <AlertTitle>{alert.title}</AlertTitle>
              <AlertDescription>{alert.description}</AlertDescription>
            </div>
            {onDismiss && (
              <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1 -mr-2" onClick={() => onDismiss(index)}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </Alert>
      ))}
    </div>
  )
}
