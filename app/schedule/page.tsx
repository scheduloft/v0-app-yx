"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus, CloudRain, Sun, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import WeatherWidget from "@/components/weather-widget"
import WeatherRecommendations from "@/components/weather-recommendations"
import { getWeatherForecast, getWeatherRecommendations, isWeatherSuitableForLawnCare } from "@/utils/weather-service"
import { getWeatherAffectedAppointmentCount } from "@/utils/rescheduling-service"
import Link from "next/link"

export default function SchedulePage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Get weather data
  const weatherData = getWeatherForecast()
  const recommendations = getWeatherRecommendations(weatherData)

  // Get weather-affected appointment count
  const affectedAppointmentCount = getWeatherAffectedAppointmentCount()

  // Mock data for appointments
  const appointments = [
    { date: "2025-06-13", count: 4 },
    { date: "2025-06-14", count: 2 },
    { date: "2025-06-17", count: 3 },
    { date: "2025-06-20", count: 1 },
    { date: "2025-06-24", count: 5 },
    { date: "2025-06-27", count: 2 },
  ]

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const formatDateString = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  const getAppointmentsForDate = (dateString: string) => {
    return appointments.find((a) => a.date === dateString)?.count || 0
  }

  const getWeatherForDate = (dateString: string) => {
    return weatherData.daily.find((d) => d.date === dateString)?.condition
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const renderCalendar = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)

    const days = []
    const today = new Date()
    const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year
    const currentDate = isCurrentMonth ? today.getDate() : -1

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-16"></div>)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = formatDateString(year, month, day)
      const appointmentCount = getAppointmentsForDate(dateString)
      const weatherCondition = getWeatherForDate(dateString)
      const isToday = day === currentDate
      const suitability = weatherCondition ? isWeatherSuitableForLawnCare(weatherCondition) : { suitable: true }

      days.push(
        <div
          key={day}
          className={cn(
            "h-16 border border-border rounded-md flex flex-col items-center justify-start relative p-1",
            isToday ? "bg-primary/10 border-primary" : "hover:bg-muted/50",
            !suitability.suitable ? "border-amber-300" : "",
          )}
        >
          <span className={cn("text-sm", isToday ? "font-bold text-primary" : "")}>{day}</span>

          {weatherCondition && (
            <div
              className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center mt-1",
                weatherCondition.isRainy
                  ? "bg-blue-100 text-blue-600"
                  : weatherCondition.isStormy
                    ? "bg-purple-100 text-purple-600"
                    : "bg-yellow-100 text-yellow-600",
                !suitability.suitable ? "border border-red-300" : "",
              )}
            >
              {weatherCondition.isRainy ? <CloudRain className="h-3 w-3" /> : <Sun className="h-3 w-3" />}
            </div>
          )}

          {appointmentCount > 0 && (
            <Badge variant="secondary" className="absolute bottom-0 text-xs transform translate-y-1/2">
              {appointmentCount}
            </Badge>
          )}
        </div>,
      )
    }

    return days
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  return (
    <main className="flex flex-col pb-16">
      <div className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Schedule</h1>
        <Button size="sm" variant="secondary">
          <Plus className="h-4 w-4 mr-1" />
          New Appointment
        </Button>
      </div>

      <div className="p-4">
        <WeatherWidget weather={weatherData.current} className="mb-4" />

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
                      <h3 className="font-medium">Weather Impact</h3>
                      <p className="text-sm text-muted-foreground">
                        {affectedAppointmentCount} appointment{affectedAppointmentCount !== 1 ? "s" : ""} need
                        {affectedAppointmentCount === 1 ? "s" : ""} rescheduling
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="border-amber-300">
                    Reschedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        )}

        <WeatherRecommendations recommendations={recommendations} />
      </div>

      <Card className="m-4 border-none shadow-none">
        <CardContent className="p-0">
          <div className="flex justify-between items-center p-4">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-medium">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h2>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-1 p-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-xs text-muted-foreground font-medium py-1">
                {day}
              </div>
            ))}
            {renderCalendar()}
          </div>
        </CardContent>
      </Card>

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-3">Upcoming Appointments</h3>
        <div className="space-y-3">
          {appointments.slice(0, 3).map((appointment, index) => {
            const dateObj = new Date(appointment.date)
            const weatherCondition = getWeatherForDate(appointment.date)
            const suitability = weatherCondition ? isWeatherSuitableForLawnCare(weatherCondition) : { suitable: true }

            return (
              <Card key={index} className={cn("p-3", !suitability.suitable ? "border-amber-200 bg-amber-50" : "")}>
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">
                      {dateObj.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">{appointment.count} appointments</p>

                    {!suitability.suitable && (
                      <div className="flex items-center mt-1">
                        <AlertTriangle className="h-3.5 w-3.5 mr-1 text-amber-500" />
                        <span className="text-xs text-amber-600">{suitability.reason}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center">
                    {weatherCondition && (
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center mr-2",
                          weatherCondition.isRainy
                            ? "bg-blue-100 text-blue-600"
                            : weatherCondition.isStormy
                              ? "bg-purple-100 text-purple-600"
                              : "bg-yellow-100 text-yellow-600",
                          !suitability.suitable ? "border-2 border-amber-300" : "",
                        )}
                      >
                        {weatherCondition.isRainy ? <CloudRain className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                      </div>
                    )}
                    {!suitability.suitable ? (
                      <Link href="/reschedule">
                        <Button variant="outline" size="sm" className="border-amber-300">
                          Reschedule
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </main>
  )
}
