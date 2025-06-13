"use client"

import type React from "react"

import { useState } from "react"
import {
  Cloud,
  CloudDrizzle,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Sun,
  Wind,
  Droplets,
  Thermometer,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { WeatherCondition, WeatherAlert } from "@/utils/weather-service"
import { getWeatherIcon } from "@/utils/weather-service"
import Link from "next/link"

interface WeatherWidgetProps {
  weather: WeatherCondition
  alerts?: WeatherAlert[]
  showDetails?: boolean
  className?: string
}

export default function WeatherWidget({ weather, alerts = [], showDetails = false, className }: WeatherWidgetProps) {
  const [expanded, setExpanded] = useState(showDetails)

  // Map weather condition to icon
  const WeatherIcon = () => {
    const iconName = getWeatherIcon(weather.code)
    const iconMap: Record<string, React.ReactNode> = {
      sun: <Sun className="h-6 w-6" />,
      "cloud-sun": <Cloud className="h-6 w-6" />,
      cloud: <Cloud className="h-6 w-6" />,
      "cloud-rain": <CloudRain className="h-6 w-6" />,
      "cloud-drizzle": <CloudDrizzle className="h-6 w-6" />,
      "cloud-lightning": <CloudLightning className="h-6 w-6" />,
      "cloud-snow": <CloudSnow className="h-6 w-6" />,
      wind: <Wind className="h-6 w-6" />,
    }

    return iconMap[iconName] || <Sun className="h-6 w-6" />
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div
              className={cn(
                "p-2 rounded-full mr-3",
                weather.isRainy
                  ? "bg-blue-100 text-blue-600"
                  : weather.isStormy
                    ? "bg-purple-100 text-purple-600"
                    : weather.isWindy
                      ? "bg-gray-100 text-gray-600"
                      : "bg-yellow-100 text-yellow-600",
              )}
            >
              <WeatherIcon />
            </div>
            <div>
              <div className="flex items-center">
                <h3 className="font-medium">{weather.description}</h3>
                {alerts.length > 0 && (
                  <Badge
                    variant={alerts[0].severity === "warning" ? "destructive" : "default"}
                    className="ml-2 text-xs"
                  >
                    {alerts[0].severity === "warning" ? "Alert" : "Advisory"}
                  </Badge>
                )}
              </div>
              <p className="text-2xl font-semibold">{weather.temperature}°F</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-muted-foreground">Feels like {weather.feelsLike}°F</p>
            <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => setExpanded(!expanded)}>
              {expanded ? "Less" : "More"} info
            </Button>
          </div>
        </div>

        {expanded && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center">
                <Droplets className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>Humidity: {weather.humidity}%</span>
              </div>
              <div className="flex items-center">
                <Wind className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>
                  Wind: {weather.windSpeed} mph {weather.windDirection}
                </span>
              </div>
              {weather.precipitation > 0 && (
                <div className="flex items-center">
                  <CloudRain className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>Precip: {weather.precipitation}" </span>
                </div>
              )}
              <div className="flex items-center">
                <Thermometer className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>UV Index: {weather.uvIndex}</span>
              </div>
            </div>

            {alerts.length > 0 && (
              <div
                className={cn(
                  "mt-3 p-2 rounded-md text-sm",
                  alerts[0].severity === "warning"
                    ? "bg-destructive/10 text-destructive"
                    : "bg-amber-100 text-amber-800",
                )}
              >
                <p className="font-medium">{alerts[0].title}</p>
                <p className="text-xs mt-1">{alerts[0].description}</p>
              </div>
            )}

            <div className="mt-3 flex justify-end">
              <Link href="/weather">
                <Button variant="outline" size="sm">
                  Full Forecast
                </Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
