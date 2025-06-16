import { MapPin, Clock, Zap, Fuel } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import WeatherWidget from "@/components/weather-widget"
import { getWeatherForecast } from "@/utils/weather-service"
import { getAppointmentsForDate } from "@/utils/rescheduling-service"

export default function TodayPage() {
  // Get weather data
  const weatherData = getWeatherForecast()

  // Get today's appointments (using June 14 since that's where we have scheduled appointments)
  const todayDate = "2025-06-14"
  const todaysAppointments = getAppointmentsForDate(todayDate)

  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  // Function to format time to 12-hour format
  const formatTime = (time: string) => {
    return time // Already in correct format from mock data
  }

  return (
    <main className="flex flex-col pb-16">
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Today's Route</h1>
            <p className="text-sm opacity-90">Saturday, June 14, 2025</p>
          </div>
          <Link href="/onboarding">
            <Button size="sm" variant="secondary">
              Setup Guide
            </Button>
          </Link>
        </div>
      </div>

      <div className="p-4">
        {/* Weather Widget */}
        <WeatherWidget weather={weatherData.current} className="mb-4" />

        <Card className="mb-4">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Smart Routing</h3>
                  <p className="text-xs text-muted-foreground">Optimized for efficiency</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="mb-1">
                  12.5 miles
                </Badge>
                <div className="flex text-xs text-muted-foreground">
                  <div className="flex items-center mr-2">
                    <Fuel className="h-3 w-3 mr-1" />
                    2.3 gal saved
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    45 min saved
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{todaysAppointments.length} Appointments Today</h2>
          <Badge variant="outline" className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            On Schedule
          </Badge>
        </div>

        <div className="space-y-3">
          {todaysAppointments.map((appointment) => (
            <Card key={appointment.id} className="overflow-hidden">
              <CardHeader className="p-3 pb-0">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2">
                      {formatTime(appointment.time)}
                    </Badge>
                    <CardTitle className="text-base">{appointment.customerName}</CardTitle>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {appointment.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-3">
                <div className="flex items-start">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarFallback>{getInitials(appointment.customerName)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-start text-sm">
                      <MapPin className="h-4 w-4 mr-1 text-muted-foreground shrink-0 mt-0.5" />
                      <span>{appointment.address}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{appointment.service}</p>
                    {appointment.notes && (
                      <p className="text-xs text-muted-foreground mt-1 italic">{appointment.notes}</p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <Button size="sm" variant="outline">
                    Reschedule
                  </Button>
                  <Button size="sm">Start Job</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
