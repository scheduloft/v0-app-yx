import { MapPin, Navigation, Clock, CheckCircle, Zap, Fuel, Route, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import RouteMap from "@/components/route-map"
import WeatherWidget from "@/components/weather-widget"
import WeatherAlerts from "@/components/weather-alerts"
import { getMockOptimizedRoute } from "@/utils/route-optimizer"
import { getCurrentWeather, getWeatherAlerts } from "@/utils/weather-service"
import { getWeatherAffectedAppointmentCount } from "@/utils/rescheduling-service"
import Link from "next/link"

export default function TodayPage() {
  // Get optimized route
  const optimizedRoute = getMockOptimizedRoute()

  // Get weather data
  const currentWeather = getCurrentWeather()
  const weatherAlerts = getWeatherAlerts()

  // Get weather-affected appointment count
  const affectedAppointmentCount = getWeatherAffectedAppointmentCount()

  // Filter out the start and end points (office) to get just the appointments
  const appointments = optimizedRoute.points
    .filter((point) => point.location.id !== "home")
    .map((point) => ({
      id: point.location.id,
      time: point.location.appointmentTime || point.arrivalTime,
      customer: point.location.name,
      address: point.location.address,
      service:
        point.location.id === "1"
          ? "Lawn Mowing"
          : point.location.id === "2"
            ? "Lawn Mowing + Edging"
            : point.location.id === "3"
              ? "Full Service"
              : "Lawn Mowing",
      status: point.location.status || "Scheduled",
      image: "/placeholder.svg?height=40&width=40",
      initials: point.location.name
        .split(" ")
        .map((n) => n[0])
        .join(""),
      arrivalTime: point.arrivalTime,
      distanceFromPrevious: point.distanceFromPrevious,
      timeFromPrevious: point.timeFromPrevious,
    }))

  return (
    <main className="flex flex-col pb-16">
      <div className="bg-primary text-primary-foreground p-4">
        <h1 className="text-xl font-bold">Today's Route</h1>
        <p className="text-sm opacity-90">Wednesday, June 13, 2025</p>
      </div>

      <div className="p-4">
        <WeatherWidget weather={currentWeather} alerts={weatherAlerts} className="mb-4" />

        {weatherAlerts.length > 0 && <WeatherAlerts alerts={weatherAlerts} className="mb-4" />}

        {affectedAppointmentCount > 0 && (
          <Link href="/reschedule">
            <Card className="mb-4 bg-amber-50 border-amber-200">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-amber-100 p-2 rounded-full mr-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Weather Alert</h3>
                      <p className="text-sm text-muted-foreground">
                        {affectedAppointmentCount} upcoming appointment{affectedAppointmentCount !== 1 ? "s" : ""}{" "}
                        affected by weather
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="border-amber-300">
                    View & Reschedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        )}
      </div>

      <div className="relative">
        <RouteMap route={optimizedRoute} height="180px" />
        <Link href="/route">
          <Button size="sm" className="absolute bottom-2 right-2 bg-background text-foreground">
            <Navigation className="h-4 w-4 mr-1" />
            Navigate
          </Button>
        </Link>
      </div>

      <div className="p-4">
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
                  {optimizedRoute.totalDistance.toFixed(1)} miles
                </Badge>
                <div className="flex text-xs text-muted-foreground">
                  <div className="flex items-center mr-2">
                    <Fuel className="h-3 w-3 mr-1" />
                    {optimizedRoute.fuelSaved.toFixed(1)} gal saved
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {optimizedRoute.timeSaved} min saved
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{appointments.length} Appointments Today</h2>
          <Badge variant="outline" className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            On Schedule
          </Badge>
        </div>

        <div className="space-y-3">
          {appointments.map((appointment, index) => (
            <Card key={appointment.id} className="overflow-hidden">
              <CardHeader className="p-3 pb-0">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <Badge
                      variant={
                        appointment.status === "Completed"
                          ? "secondary"
                          : appointment.status === "In Progress"
                            ? "default"
                            : "outline"
                      }
                      className="mr-2"
                    >
                      {appointment.time}
                    </Badge>
                    <CardTitle className="text-base">{appointment.customer}</CardTitle>
                  </div>
                  <Badge
                    variant={
                      appointment.status === "Completed"
                        ? "secondary"
                        : appointment.status === "In Progress"
                          ? "default"
                          : "outline"
                    }
                  >
                    {appointment.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-3">
                <div className="flex items-start">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={appointment.image || "/placeholder.svg"} alt={appointment.customer} />
                    <AvatarFallback>{appointment.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-start text-sm">
                      <MapPin className="h-4 w-4 mr-1 text-muted-foreground shrink-0 mt-0.5" />
                      <span>{appointment.address}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{appointment.service}</p>

                    {index > 0 && (
                      <div className="flex items-center mt-2 text-xs text-muted-foreground">
                        <Route className="h-3 w-3 mr-1" />
                        <span>
                          {appointment.distanceFromPrevious.toFixed(1)} miles • {appointment.timeFromPrevious} min from
                          previous stop
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  {appointment.status === "Scheduled" && (
                    <>
                      <Button size="sm" variant="outline">
                        Reschedule
                      </Button>
                      <Button size="sm">Start Job</Button>
                    </>
                  )}
                  {appointment.status === "In Progress" && (
                    <Button size="sm">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Complete
                    </Button>
                  )}
                  {appointment.status === "Completed" && (
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
