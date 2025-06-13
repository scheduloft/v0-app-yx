"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Calendar,
  Clock,
  CloudRain,
  Droplets,
  Sunrise,
  Sunset,
  Thermometer,
  Umbrella,
  Wind,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import WeatherWidget from "@/components/weather-widget"
import WeatherAlerts from "@/components/weather-alerts"
import WeatherRecommendations from "@/components/weather-recommendations"
import {
  getWeatherForecast,
  getWeatherRecommendations,
  getWeatherIcon,
  isWeatherSuitableForLawnCare,
} from "@/utils/weather-service"

export default function WeatherPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("forecast")
  const [showStormyWeather, setShowStormyWeather] = useState(false)
  const [dismissedAlerts, setDismissedAlerts] = useState<number[]>([])

  // Get weather data
  const weatherData = getWeatherForecast(showStormyWeather)
  const recommendations = getWeatherRecommendations(weatherData)

  // Filter alerts that haven't been dismissed
  const activeAlerts = weatherData.alerts.filter((_, index) => !dismissedAlerts.includes(index))

  const handleDismissAlert = (index: number) => {
    setDismissedAlerts([...dismissedAlerts, index])
  }

  // Toggle between normal and stormy weather (for demo purposes)
  const toggleWeatherScenario = () => {
    setShowStormyWeather(!showStormyWeather)
    setDismissedAlerts([])
  }

  return (
    <main className="flex flex-col pb-16">
      <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2 text-primary-foreground" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Weather</h1>
        </div>
        <div className="text-sm">
          {weatherData.location.city}, {weatherData.location.state}
        </div>
      </div>

      <div className="p-4 space-y-4">
        <WeatherWidget weather={weatherData.current} alerts={activeAlerts} showDetails={true} />

        {activeAlerts.length > 0 && <WeatherAlerts alerts={activeAlerts} onDismiss={handleDismissAlert} />}

        <WeatherRecommendations recommendations={recommendations} />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="forecast">7-Day Forecast</TabsTrigger>
            <TabsTrigger value="hourly">Hourly</TabsTrigger>
          </TabsList>

          <TabsContent value="forecast" className="mt-4 space-y-3">
            {weatherData.daily.map((day) => {
              const suitability = isWeatherSuitableForLawnCare(day.condition)
              return (
                <Card key={day.date}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div
                          className={`
                          p-2 rounded-full mr-3
                          ${
                            day.condition.isRainy
                              ? "bg-blue-100 text-blue-600"
                              : day.condition.isStormy
                                ? "bg-purple-100 text-purple-600"
                                : day.condition.isWindy
                                  ? "bg-gray-100 text-gray-600"
                                  : "bg-yellow-100 text-yellow-600"
                          }
                        `}
                        >
                          {(() => {
                            const iconName = getWeatherIcon(day.condition.code)
                            switch (iconName) {
                              case "sun":
                                return <Thermometer className="h-5 w-5" />
                              case "cloud-rain":
                                return <CloudRain className="h-5 w-5" />
                              default:
                                return <Thermometer className="h-5 w-5" />
                            }
                          })()}
                        </div>
                        <div>
                          <h3 className="font-medium">{day.day}</h3>
                          <p className="text-sm text-muted-foreground">{day.condition.description}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center justify-end">
                          <span className="font-medium">{day.high}°</span>
                          <span className="mx-1 text-muted-foreground">/</span>
                          <span className="text-muted-foreground">{day.low}°</span>
                        </div>
                        <Badge variant={suitability.suitable ? "outline" : "secondary"} className="mt-1">
                          {suitability.suitable ? "Suitable" : suitability.reason}
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-4 gap-2 text-xs text-muted-foreground">
                      <div className="flex flex-col items-center">
                        <Umbrella className="h-3 w-3 mb-1" />
                        <span>{day.precipitationChance}%</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Wind className="h-3 w-3 mb-1" />
                        <span>{day.condition.windSpeed} mph</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Sunrise className="h-3 w-3 mb-1" />
                        <span>{day.sunrise}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Sunset className="h-3 w-3 mb-1" />
                        <span>{day.sunset}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </TabsContent>

          <TabsContent value="hourly" className="mt-4 space-y-3">
            <Card>
              <CardContent className="p-3">
                <h3 className="font-medium mb-3">Today's Hourly Forecast</h3>
                <div className="flex overflow-x-auto pb-2 -mx-2 px-2">
                  {weatherData.hourly.map((hour, index) => (
                    <div key={index} className="flex flex-col items-center mr-4 min-w-[60px]">
                      <span className="text-sm font-medium">{hour.time}</span>
                      <div
                        className={`
                        p-2 my-1 rounded-full
                        ${
                          hour.condition.isRainy
                            ? "bg-blue-100 text-blue-600"
                            : hour.condition.isStormy
                              ? "bg-purple-100 text-purple-600"
                              : hour.condition.isWindy
                                ? "bg-gray-100 text-gray-600"
                                : "bg-yellow-100 text-yellow-600"
                        }
                      `}
                      >
                        {(() => {
                          const iconName = getWeatherIcon(hour.condition.code)
                          switch (iconName) {
                            case "sun":
                              return <Thermometer className="h-4 w-4" />
                            case "cloud-rain":
                              return <CloudRain className="h-4 w-4" />
                            default:
                              return <Thermometer className="h-4 w-4" />
                          }
                        })()}
                      </div>
                      <span className="text-sm font-medium">{hour.condition.temperature}°</span>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Droplets className="h-3 w-3 mr-1" />
                        <span>{hour.condition.humidity}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Weather Impact on Schedule</h3>
                  <Button variant="outline" size="sm" asChild>
                    <Calendar className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Today</span>
                    </div>
                    <Badge variant="outline">No Impact</Badge>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Tomorrow</span>
                    </div>
                    <Badge variant="secondary">Moderate Impact</Badge>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Sunday</span>
                    </div>
                    <Badge variant="destructive">High Impact</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* For demo purposes only - toggle between weather scenarios */}
        <div className="mt-8 text-center">
          <Button variant="outline" onClick={toggleWeatherScenario}>
            Toggle Weather Scenario ({showStormyWeather ? "Normal" : "Stormy"})
          </Button>
          <p className="text-xs text-muted-foreground mt-1">(Demo feature to show different weather conditions)</p>
        </div>
      </div>
    </main>
  )
}
