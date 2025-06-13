// Types for locations and routes
export interface Location {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  appointmentTime?: string
  status?: string
}

export interface RoutePoint {
  location: Location
  distanceFromPrevious: number // in miles
  timeFromPrevious: number // in minutes
  arrivalTime: string
}

export interface OptimizedRoute {
  totalDistance: number // in miles
  totalTime: number // in minutes
  fuelSaved: number // in gallons
  timeSaved: number // in minutes
  points: RoutePoint[]
}

// Mock data for demonstration
const mockLocations: Location[] = [
  {
    id: "1",
    name: "John Smith",
    address: "123 Oak Street, Anytown, ST 12345",
    lat: 37.7749,
    lng: -122.4194,
    appointmentTime: "8:00 AM",
    status: "Completed",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    address: "456 Maple Avenue, Anytown, ST 12345",
    lat: 37.7833,
    lng: -122.4167,
    appointmentTime: "10:30 AM",
    status: "In Progress",
  },
  {
    id: "3",
    name: "Michael Brown",
    address: "789 Pine Road, Anytown, ST 12345",
    lat: 37.7694,
    lng: -122.4862,
    appointmentTime: "1:00 PM",
    status: "Scheduled",
  },
  {
    id: "4",
    name: "Emily Davis",
    address: "321 Cedar Lane, Anytown, ST 12345",
    lat: 37.7575,
    lng: -122.4376,
    appointmentTime: "3:30 PM",
    status: "Scheduled",
  },
]

// Home/office location
const homeLocation: Location = {
  id: "home",
  name: "Office",
  address: "1000 Main Street, Anytown, ST 12345",
  lat: 37.7739,
  lng: -122.4312,
}

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3958.8 // Earth's radius in miles
  const dLat = toRadians(lat2 - lat1)
  const dLng = toRadians(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c
  return Math.round(distance * 100) / 100 // Round to 2 decimal places
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

// Calculate time based on distance (assuming average speed of 30 mph)
function calculateTime(distance: number): number {
  return Math.round((distance / 30) * 60) // Convert to minutes and round
}

// Calculate arrival time based on previous arrival time and travel time
function calculateArrivalTime(previousTime: string, travelTimeMinutes: number): string {
  const [hours, minutesPart] = previousTime.split(":")
  let hour = Number.parseInt(hours)
  let minutes = Number.parseInt(minutesPart.split(" ")[0])
  const isPM = previousTime.includes("PM")

  minutes += travelTimeMinutes
  hour += Math.floor(minutes / 60)
  minutes = minutes % 60

  if (hour > 12) {
    hour = hour - 12
  }

  return `${hour}:${minutes.toString().padStart(2, "0")} ${isPM ? "PM" : "AM"}`
}

// Simple greedy algorithm for route optimization
// In a real app, you would use a more sophisticated algorithm or external API
export function optimizeRoute(
  startLocation: Location = homeLocation,
  appointments: Location[] = mockLocations,
  endLocation: Location = homeLocation,
  includeReturn = true,
): OptimizedRoute {
  // Sort appointments by time if they have appointment times
  const sortedAppointments = [...appointments].sort((a, b) => {
    if (!a.appointmentTime) return -1
    if (!b.appointmentTime) return 1
    return a.appointmentTime.localeCompare(b.appointmentTime)
  })

  // Calculate route
  const route: RoutePoint[] = []
  let currentLocation = startLocation
  let totalDistance = 0
  let totalTime = 0
  let currentTime = "8:00 AM" // Assuming start time

  // Add start location
  route.push({
    location: startLocation,
    distanceFromPrevious: 0,
    timeFromPrevious: 0,
    arrivalTime: currentTime,
  })

  // Add each appointment
  for (const appointment of sortedAppointments) {
    const distance = calculateDistance(currentLocation.lat, currentLocation.lng, appointment.lat, appointment.lng)
    const time = calculateTime(distance)
    totalDistance += distance
    totalTime += time
    currentTime = calculateArrivalTime(currentTime, time)

    route.push({
      location: appointment,
      distanceFromPrevious: distance,
      timeFromPrevious: time,
      arrivalTime: currentTime,
    })

    currentLocation = appointment
  }

  // Add return to end location if requested
  if (includeReturn) {
    const distance = calculateDistance(currentLocation.lat, currentLocation.lng, endLocation.lat, endLocation.lng)
    const time = calculateTime(distance)
    totalDistance += distance
    totalTime += time
    currentTime = calculateArrivalTime(currentTime, time)

    route.push({
      location: endLocation,
      distanceFromPrevious: distance,
      timeFromPrevious: time,
      arrivalTime: currentTime,
    })
  }

  // Calculate savings (compared to visiting in original order)
  const unoptimizedDistance = calculateUnoptimizedDistance(startLocation, appointments, endLocation, includeReturn)
  const distanceSaved = unoptimizedDistance - totalDistance
  const timeSaved = calculateTime(distanceSaved)
  const fuelSaved = distanceSaved / 25 // Assuming 25 mpg

  return {
    totalDistance,
    totalTime,
    fuelSaved,
    timeSaved,
    points: route,
  }
}

// Calculate distance for unoptimized route (for comparison)
function calculateUnoptimizedDistance(
  startLocation: Location,
  appointments: Location[],
  endLocation: Location,
  includeReturn: boolean,
): number {
  let totalDistance = 0
  let currentLocation = startLocation

  for (const appointment of appointments) {
    const distance = calculateDistance(currentLocation.lat, currentLocation.lng, appointment.lat, appointment.lng)
    totalDistance += distance
    currentLocation = appointment
  }

  if (includeReturn) {
    const distance = calculateDistance(currentLocation.lat, currentLocation.lng, endLocation.lat, endLocation.lng)
    totalDistance += distance
  }

  return totalDistance
}

// Get mock locations for testing
export function getMockLocations(): Location[] {
  return mockLocations
}

// Get home location
export function getHomeLocation(): Location {
  return homeLocation
}

// Get optimized route with mock data
export function getMockOptimizedRoute(includeReturn = true): OptimizedRoute {
  return optimizeRoute(homeLocation, mockLocations, homeLocation, includeReturn)
}
