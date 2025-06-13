import type { WeatherForecast, DailyForecast } from "@/utils/weather-service"
import { isWeatherSuitableForLawnCare, getWeatherForecast } from "@/utils/weather-service"

// Types for appointments and rescheduling
export interface Appointment {
  id: string
  customerId: string
  customerName: string
  date: string // YYYY-MM-DD
  time: string // HH:MM AM/PM
  duration: number // in minutes
  service: string
  status: "scheduled" | "completed" | "cancelled" | "in-progress"
  address: string
  notes?: string
}

export interface RescheduleOption {
  date: string
  time: string
  weatherSuitability: number // 0-100 score
  reason: string
  conflictCount: number // number of other appointments on this day
}

export interface RescheduleRecommendation {
  appointmentId: string
  originalDate: string
  originalTime: string
  customerName: string
  service: string
  weatherIssue: string
  options: RescheduleOption[]
}

// Mock appointments data
const mockAppointments: Appointment[] = [
  {
    id: "apt-001",
    customerId: "1",
    customerName: "John Smith",
    date: "2025-06-14", // Tomorrow
    time: "9:00 AM",
    duration: 60,
    service: "Lawn Mowing",
    status: "scheduled",
    address: "123 Oak Street, Anytown, ST 12345",
  },
  {
    id: "apt-002",
    customerId: "2",
    customerName: "Sarah Johnson",
    date: "2025-06-14", // Tomorrow
    time: "11:30 AM",
    duration: 90,
    service: "Lawn Mowing + Edging",
    status: "scheduled",
    address: "456 Maple Avenue, Anytown, ST 12345",
  },
  {
    id: "apt-003",
    customerId: "3",
    customerName: "Michael Brown",
    date: "2025-06-15", // Sunday
    time: "10:00 AM",
    duration: 120,
    service: "Full Service",
    status: "scheduled",
    address: "789 Pine Road, Anytown, ST 12345",
  },
  {
    id: "apt-004",
    customerId: "4",
    customerName: "Emily Davis",
    date: "2025-06-15", // Sunday
    time: "1:00 PM",
    duration: 60,
    service: "Lawn Mowing",
    status: "scheduled",
    address: "321 Cedar Lane, Anytown, ST 12345",
  },
  {
    id: "apt-005",
    customerId: "5",
    customerName: "David Wilson",
    date: "2025-06-16", // Monday
    time: "9:00 AM",
    duration: 90,
    service: "Lawn Mowing + Hedge Trimming",
    status: "scheduled",
    address: "654 Birch Boulevard, Anytown, ST 12345",
  },
  {
    id: "apt-006",
    customerId: "1",
    customerName: "John Smith",
    date: "2025-06-28", // Later
    time: "9:00 AM",
    duration: 60,
    service: "Lawn Mowing",
    status: "scheduled",
    address: "123 Oak Street, Anytown, ST 12345",
  },
  {
    id: "apt-007",
    customerId: "2",
    customerName: "Sarah Johnson",
    date: "2025-06-28", // Later
    time: "11:30 AM",
    duration: 90,
    service: "Lawn Mowing + Edging",
    status: "scheduled",
    address: "456 Maple Avenue, Anytown, ST 12345",
  },
]

// Get all appointments
export function getAllAppointments(): Appointment[] {
  return mockAppointments
}

// Get appointments for a specific date
export function getAppointmentsForDate(date: string): Appointment[] {
  return mockAppointments.filter((apt) => apt.date === date)
}

// Get appointments for a specific customer
export function getAppointmentsForCustomer(customerId: string): Appointment[] {
  return mockAppointments.filter((apt) => apt.customerId === customerId)
}

// Check if an appointment is affected by weather
export function isAppointmentWeatherAffected(
  appointment: Appointment,
  forecast: WeatherForecast,
): {
  affected: boolean
  reason?: string
  severity: "high" | "medium" | "low"
} {
  // Find the forecast for the appointment date
  const dayForecast = forecast.daily.find((day) => day.date === appointment.date)

  if (!dayForecast) {
    return { affected: false, severity: "low" }
  }

  // Check if weather is suitable for lawn care
  const suitability = isWeatherSuitableForLawnCare(dayForecast.condition)

  if (!suitability.suitable) {
    return {
      affected: true,
      reason: suitability.reason,
      severity: suitability.reason === "Stormy conditions" || suitability.reason === "Heavy rain" ? "high" : "medium",
    }
  }

  // Check precipitation chance
  if (dayForecast.precipitationChance > 70) {
    return {
      affected: true,
      reason: "High chance of precipitation",
      severity: dayForecast.precipitationChance > 90 ? "high" : "medium",
    }
  }

  // Check wind speed
  if (dayForecast.condition.windSpeed > 15) {
    return {
      affected: true,
      reason: "High winds",
      severity: dayForecast.condition.windSpeed > 20 ? "high" : "medium",
    }
  }

  return { affected: false, severity: "low" }
}

// Calculate weather suitability score (0-100)
function calculateWeatherSuitabilityScore(forecast: DailyForecast): number {
  let score = 100

  // Check basic suitability
  const suitability = isWeatherSuitableForLawnCare(forecast.condition)
  if (!suitability.suitable) {
    if (suitability.reason === "Stormy conditions") return 0
    if (suitability.reason === "Heavy rain") return 10
    if (suitability.reason === "High winds") return 20
    if (suitability.reason === "Too cold" || suitability.reason === "Too hot") return 30
    return 40
  }

  // Adjust for precipitation chance
  if (forecast.precipitationChance > 0) {
    score -= forecast.precipitationChance * 0.7 // Reduce score proportionally to precipitation chance
  }

  // Adjust for wind
  if (forecast.condition.windSpeed > 10) {
    score -= (forecast.condition.windSpeed - 10) * 3 // Reduce score for wind speed over 10 mph
  }

  // Adjust for temperature extremes
  const idealTemp = 75
  const tempDiff = Math.abs(forecast.condition.temperature - idealTemp)
  if (tempDiff > 10) {
    score -= (tempDiff - 10) * 1.5 // Reduce score for temperatures far from ideal
  }

  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, Math.round(score)))
}

// Find the best days to reschedule
function findBestRescheduleDays(
  appointment: Appointment,
  forecast: WeatherForecast,
  existingAppointments: Appointment[],
): RescheduleOption[] {
  const options: RescheduleOption[] = []
  const today = new Date()
  const nextTwoWeeks = new Date(today)
  nextTwoWeeks.setDate(today.getDate() + 14)

  // Check each day in the forecast
  for (const day of forecast.daily) {
    // Skip the original appointment date
    if (day.date === appointment.appointment.date) continue

    // Skip dates in the past
    const dayDate = new Date(day.date)
    if (dayDate < today) continue

    // Skip dates more than two weeks in the future
    if (dayDate > nextTwoWeeks) continue

    // Calculate weather suitability score
    const suitabilityScore = calculateWeatherSuitabilityScore(day)

    // Skip days with very poor weather
    if (suitabilityScore < 40) continue

    // Count conflicts (other appointments on the same day)
    const conflictCount = existingAppointments.filter((apt) => apt.date === day.date).length

    // Add as an option
    options.push({
      date: day.date,
      time: appointment.time, // Suggest the same time by default
      weatherSuitability: suitabilityScore,
      reason: suitabilityScore > 80 ? "Good weather conditions" : "Acceptable weather conditions",
      conflictCount,
    })
  }

  // Sort options by suitability (highest first) and then by conflict count (lowest first)
  return options.sort((a, b) => {
    if (b.weatherSuitability !== a.weatherSuitability) {
      return b.weatherSuitability - a.weatherSuitability
    }
    return a.conflictCount - b.conflictCount
  })
}

// Get rescheduling recommendations for weather-affected appointments
export function getRescheduleRecommendations(useStormy = false): RescheduleRecommendation[] {
  const forecast = getWeatherForecast(useStormy)
  const appointments = getAllAppointments()
  const recommendations: RescheduleRecommendation[] = []

  // Check each appointment for weather issues
  for (const appointment of appointments) {
    // Only check future appointments that are still scheduled
    const appointmentDate = new Date(appointment.date)
    const today = new Date()
    if (appointmentDate < today || appointment.status !== "scheduled") {
      continue
    }

    // Check if appointment is affected by weather
    const weatherCheck = isAppointmentWeatherAffected(appointment, forecast)
    if (weatherCheck.affected) {
      // Find best reschedule options
      const options = findBestRescheduleDays(
        { appointment, weatherCheck },
        forecast,
        appointments.filter((apt) => apt.id !== appointment.id),
      )

      // Only add recommendation if we have options
      if (options.length > 0) {
        recommendations.push({
          appointmentId: appointment.id,
          originalDate: appointment.date,
          originalTime: appointment.time,
          customerName: appointment.customerName,
          service: appointment.service,
          weatherIssue: weatherCheck.reason || "Weather conditions",
          options: options.slice(0, 3), // Limit to top 3 options
        })
      }
    }
  }

  return recommendations
}

// Get count of weather-affected appointments
export function getWeatherAffectedAppointmentCount(useStormy = false): number {
  const forecast = getWeatherForecast(useStormy)
  const appointments = getAllAppointments()
  let count = 0

  for (const appointment of appointments) {
    // Only check future appointments that are still scheduled
    const appointmentDate = new Date(appointment.date)
    const today = new Date()
    if (appointmentDate < today || appointment.status !== "scheduled") {
      continue
    }

    // Check if appointment is affected by weather
    const weatherCheck = isAppointmentWeatherAffected(appointment, forecast)
    if (weatherCheck.affected) {
      count++
    }
  }

  return count
}

// Get weather-affected appointments
export function getWeatherAffectedAppointments(useStormy = false): {
  appointment: Appointment
  weatherCheck: { affected: boolean; reason?: string; severity: "high" | "medium" | "low" }
}[] {
  const forecast = getWeatherForecast(useStormy)
  const appointments = getAllAppointments()
  const affected: {
    appointment: Appointment
    weatherCheck: { affected: boolean; reason?: string; severity: "high" | "medium" | "low" }
  }[] = []

  for (const appointment of appointments) {
    // Only check future appointments that are still scheduled
    const appointmentDate = new Date(appointment.date)
    const today = new Date()
    if (appointmentDate < today || appointment.status !== "scheduled") {
      continue
    }

    // Check if appointment is affected by weather
    const weatherCheck = isAppointmentWeatherAffected(appointment, forecast)
    if (weatherCheck.affected) {
      affected.push({ appointment, weatherCheck })
    }
  }

  // Sort by date and then by severity
  return affected.sort((a, b) => {
    if (a.appointment.date !== b.appointment.date) {
      return a.appointment.date.localeCompare(b.appointment.date)
    }
    const severityOrder = { high: 0, medium: 1, low: 2 }
    return severityOrder[a.weatherCheck.severity] - severityOrder[b.weatherCheck.severity]
  })
}
