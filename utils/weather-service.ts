// Types for weather data
export interface WeatherCondition {
  code: string
  description: string
  icon: string
  temperature: number
  feelsLike: number
  humidity: number
  windSpeed: number
  windDirection: string
  precipitation: number
  uvIndex: number
  isRainy: boolean
  isSnowy: boolean
  isStormy: boolean
  isSunny: boolean
  isWindy: boolean
}

export interface DailyForecast {
  date: string
  day: string
  condition: WeatherCondition
  high: number
  low: number
  sunrise: string
  sunset: string
  precipitationChance: number
  precipitationAmount: number
}

export interface HourlyForecast {
  time: string
  condition: WeatherCondition
}

export interface WeatherForecast {
  current: WeatherCondition
  hourly: HourlyForecast[]
  daily: DailyForecast[]
  alerts: WeatherAlert[]
  location: {
    city: string
    state: string
    country: string
    latitude: number
    longitude: number
  }
}

export interface WeatherAlert {
  type: string
  severity: "advisory" | "watch" | "warning"
  title: string
  description: string
  startTime: string
  endTime: string
}

// Mock weather data
const mockWeatherData: WeatherForecast = {
  current: {
    code: "partly-cloudy",
    description: "Partly Cloudy",
    icon: "partly-cloudy-day",
    temperature: 72,
    feelsLike: 74,
    humidity: 65,
    windSpeed: 8,
    windDirection: "NE",
    precipitation: 0,
    uvIndex: 6,
    isRainy: false,
    isSnowy: false,
    isStormy: false,
    isSunny: true,
    isWindy: false,
  },
  hourly: [
    {
      time: "11:00 AM",
      condition: {
        code: "partly-cloudy",
        description: "Partly Cloudy",
        icon: "partly-cloudy-day",
        temperature: 72,
        feelsLike: 74,
        humidity: 65,
        windSpeed: 8,
        windDirection: "NE",
        precipitation: 0,
        uvIndex: 6,
        isRainy: false,
        isSnowy: false,
        isStormy: false,
        isSunny: true,
        isWindy: false,
      },
    },
    {
      time: "12:00 PM",
      condition: {
        code: "partly-cloudy",
        description: "Partly Cloudy",
        icon: "partly-cloudy-day",
        temperature: 75,
        feelsLike: 77,
        humidity: 63,
        windSpeed: 9,
        windDirection: "NE",
        precipitation: 0,
        uvIndex: 7,
        isRainy: false,
        isSnowy: false,
        isStormy: false,
        isSunny: true,
        isWindy: false,
      },
    },
    {
      time: "1:00 PM",
      condition: {
        code: "partly-cloudy",
        description: "Partly Cloudy",
        icon: "partly-cloudy-day",
        temperature: 77,
        feelsLike: 79,
        humidity: 60,
        windSpeed: 10,
        windDirection: "NE",
        precipitation: 0,
        uvIndex: 8,
        isRainy: false,
        isSnowy: false,
        isStormy: false,
        isSunny: true,
        isWindy: false,
      },
    },
    {
      time: "2:00 PM",
      condition: {
        code: "partly-cloudy",
        description: "Partly Cloudy",
        icon: "partly-cloudy-day",
        temperature: 78,
        feelsLike: 80,
        humidity: 58,
        windSpeed: 10,
        windDirection: "NE",
        precipitation: 0,
        uvIndex: 8,
        isRainy: false,
        isSnowy: false,
        isStormy: false,
        isSunny: true,
        isWindy: false,
      },
    },
    {
      time: "3:00 PM",
      condition: {
        code: "partly-cloudy",
        description: "Partly Cloudy",
        icon: "partly-cloudy-day",
        temperature: 79,
        feelsLike: 81,
        humidity: 57,
        windSpeed: 11,
        windDirection: "NE",
        precipitation: 0,
        uvIndex: 7,
        isRainy: false,
        isSnowy: false,
        isStormy: false,
        isSunny: true,
        isWindy: false,
      },
    },
    {
      time: "4:00 PM",
      condition: {
        code: "partly-cloudy",
        description: "Partly Cloudy",
        icon: "partly-cloudy-day",
        temperature: 78,
        feelsLike: 80,
        humidity: 59,
        windSpeed: 10,
        windDirection: "NE",
        precipitation: 0,
        uvIndex: 6,
        isRainy: false,
        isSnowy: false,
        isStormy: false,
        isSunny: true,
        isWindy: false,
      },
    },
    {
      time: "5:00 PM",
      condition: {
        code: "partly-cloudy",
        description: "Partly Cloudy",
        icon: "partly-cloudy-day",
        temperature: 76,
        feelsLike: 78,
        humidity: 62,
        windSpeed: 9,
        windDirection: "NE",
        precipitation: 0,
        uvIndex: 5,
        isRainy: false,
        isSnowy: false,
        isStormy: false,
        isSunny: true,
        isWindy: false,
      },
    },
    {
      time: "6:00 PM",
      condition: {
        code: "partly-cloudy",
        description: "Partly Cloudy",
        icon: "partly-cloudy-day",
        temperature: 74,
        feelsLike: 76,
        humidity: 65,
        windSpeed: 8,
        windDirection: "NE",
        precipitation: 0,
        uvIndex: 3,
        isRainy: false,
        isSnowy: false,
        isStormy: false,
        isSunny: true,
        isWindy: false,
      },
    },
  ],
  daily: [
    {
      date: "2025-06-13",
      day: "Today",
      condition: {
        code: "partly-cloudy",
        description: "Partly Cloudy",
        icon: "partly-cloudy-day",
        temperature: 78,
        feelsLike: 80,
        humidity: 60,
        windSpeed: 10,
        windDirection: "NE",
        precipitation: 0,
        uvIndex: 7,
        isRainy: false,
        isSnowy: false,
        isStormy: false,
        isSunny: true,
        isWindy: false,
      },
      high: 79,
      low: 65,
      sunrise: "5:42 AM",
      sunset: "8:21 PM",
      precipitationChance: 10,
      precipitationAmount: 0,
    },
    {
      date: "2025-06-14",
      day: "Tomorrow",
      condition: {
        code: "rain",
        description: "Light Rain",
        icon: "rain",
        temperature: 72,
        feelsLike: 74,
        humidity: 75,
        windSpeed: 12,
        windDirection: "E",
        precipitation: 0.25,
        uvIndex: 4,
        isRainy: true,
        isSnowy: false,
        isStormy: false,
        isSunny: false,
        isWindy: true,
      },
      high: 74,
      low: 63,
      sunrise: "5:42 AM",
      sunset: "8:22 PM",
      precipitationChance: 70,
      precipitationAmount: 0.25,
    },
    {
      date: "2025-06-15",
      day: "Sunday",
      condition: {
        code: "rain",
        description: "Rain",
        icon: "rain",
        temperature: 68,
        feelsLike: 70,
        humidity: 85,
        windSpeed: 15,
        windDirection: "E",
        precipitation: 0.5,
        uvIndex: 3,
        isRainy: true,
        isSnowy: false,
        isStormy: true,
        isSunny: false,
        isWindy: true,
      },
      high: 70,
      low: 62,
      sunrise: "5:42 AM",
      sunset: "8:22 PM",
      precipitationChance: 90,
      precipitationAmount: 0.75,
    },
    {
      date: "2025-06-16",
      day: "Monday",
      condition: {
        code: "partly-cloudy",
        description: "Partly Cloudy",
        icon: "partly-cloudy-day",
        temperature: 72,
        feelsLike: 74,
        humidity: 70,
        windSpeed: 8,
        windDirection: "NW",
        precipitation: 0,
        uvIndex: 6,
        isRainy: false,
        isSnowy: false,
        isStormy: false,
        isSunny: true,
        isWindy: false,
      },
      high: 75,
      low: 60,
      sunrise: "5:43 AM",
      sunset: "8:22 PM",
      precipitationChance: 20,
      precipitationAmount: 0,
    },
    {
      date: "2025-06-17",
      day: "Tuesday",
      condition: {
        code: "clear",
        description: "Clear",
        icon: "clear-day",
        temperature: 76,
        feelsLike: 78,
        humidity: 55,
        windSpeed: 5,
        windDirection: "W",
        precipitation: 0,
        uvIndex: 8,
        isRainy: false,
        isSnowy: false,
        isStormy: false,
        isSunny: true,
        isWindy: false,
      },
      high: 78,
      low: 62,
      sunrise: "5:43 AM",
      sunset: "8:23 PM",
      precipitationChance: 0,
      precipitationAmount: 0,
    },
    {
      date: "2025-06-18",
      day: "Wednesday",
      condition: {
        code: "clear",
        description: "Clear",
        icon: "clear-day",
        temperature: 80,
        feelsLike: 82,
        humidity: 50,
        windSpeed: 6,
        windDirection: "W",
        precipitation: 0,
        uvIndex: 9,
        isRainy: false,
        isSnowy: false,
        isStormy: false,
        isSunny: true,
        isWindy: false,
      },
      high: 82,
      low: 65,
      sunrise: "5:43 AM",
      sunset: "8:23 PM",
      precipitationChance: 0,
      precipitationAmount: 0,
    },
    {
      date: "2025-06-19",
      day: "Thursday",
      condition: {
        code: "partly-cloudy",
        description: "Partly Cloudy",
        icon: "partly-cloudy-day",
        temperature: 81,
        feelsLike: 83,
        humidity: 55,
        windSpeed: 7,
        windDirection: "SW",
        precipitation: 0,
        uvIndex: 8,
        isRainy: false,
        isSnowy: false,
        isStormy: false,
        isSunny: true,
        isWindy: false,
      },
      high: 83,
      low: 67,
      sunrise: "5:44 AM",
      sunset: "8:23 PM",
      precipitationChance: 10,
      precipitationAmount: 0,
    },
  ],
  alerts: [
    {
      type: "rain",
      severity: "advisory",
      title: "Rain Advisory",
      description: "Heavy rain expected on Sunday. Consider rescheduling outdoor services.",
      startTime: "2025-06-15T08:00:00",
      endTime: "2025-06-15T20:00:00",
    },
  ],
  location: {
    city: "Anytown",
    state: "ST",
    country: "USA",
    latitude: 37.7749,
    longitude: -122.4194,
  },
}

// Alternative weather scenario with a severe weather alert
const stormyWeatherData: WeatherForecast = {
  ...mockWeatherData,
  current: {
    ...mockWeatherData.current,
    code: "thunderstorm",
    description: "Thunderstorm",
    icon: "thunderstorm",
    temperature: 68,
    feelsLike: 70,
    humidity: 85,
    windSpeed: 18,
    precipitation: 0.5,
    isRainy: true,
    isStormy: true,
    isSunny: false,
    isWindy: true,
  },
  alerts: [
    {
      type: "thunderstorm",
      severity: "warning",
      title: "Severe Thunderstorm Warning",
      description:
        "Severe thunderstorms expected with potential for lightning, heavy rain, and strong winds. Avoid outdoor activities.",
      startTime: "2025-06-13T10:00:00",
      endTime: "2025-06-13T18:00:00",
    },
  ],
}

// Get weather icon based on condition code
export function getWeatherIcon(code: string): string {
  const iconMap: Record<string, string> = {
    clear: "sun",
    "partly-cloudy": "cloud-sun",
    cloudy: "cloud",
    rain: "cloud-rain",
    "light-rain": "cloud-drizzle",
    thunderstorm: "cloud-lightning",
    snow: "cloud-snow",
    fog: "cloud-fog",
    wind: "wind",
  }

  return iconMap[code] || "sun"
}

// Get weather recommendations based on conditions
export function getWeatherRecommendations(forecast: WeatherForecast): string[] {
  const recommendations: string[] = []
  const current = forecast.current
  const today = forecast.daily[0]
  const tomorrow = forecast.daily[1]

  // Check current conditions
  if (current.isRainy) {
    recommendations.push("Current rain may affect today's lawn services.")
  }

  if (current.isStormy) {
    recommendations.push("Stormy conditions present safety risks. Consider rescheduling outdoor work.")
  }

  if (current.isWindy && current.windSpeed > 15) {
    recommendations.push("High winds may affect spraying services.")
  }

  if (current.uvIndex > 7) {
    recommendations.push("High UV index. Ensure crew has sun protection.")
  }

  // Check upcoming conditions
  if (tomorrow.precipitationChance > 60) {
    recommendations.push(`High chance of rain tomorrow (${tomorrow.precipitationChance}%). Plan accordingly.`)
  }

  // Lawn care specific recommendations
  if (current.temperature > 85) {
    recommendations.push("Hot temperatures. Recommend watering lawns in early morning or evening.")
  }

  if (today.high - today.low > 20) {
    recommendations.push("Large temperature swing today. Monitor lawn stress.")
  }

  // If no specific recommendations, provide a general one
  if (recommendations.length === 0) {
    if (current.isSunny && !current.isWindy) {
      recommendations.push("Ideal conditions for all lawn care services.")
    } else {
      recommendations.push("Weather conditions acceptable for standard lawn care services.")
    }
  }

  return recommendations
}

// Check if weather conditions are suitable for lawn care
export function isWeatherSuitableForLawnCare(condition: WeatherCondition): {
  suitable: boolean
  reason?: string
} {
  if (condition.isStormy) {
    return { suitable: false, reason: "Stormy conditions" }
  }

  if (condition.isRainy && condition.precipitation > 0.25) {
    return { suitable: false, reason: "Heavy rain" }
  }

  if (condition.isWindy && condition.windSpeed > 15) {
    return { suitable: false, reason: "High winds" }
  }

  if (condition.temperature < 40) {
    return { suitable: false, reason: "Too cold" }
  }

  if (condition.temperature > 95) {
    return { suitable: false, reason: "Too hot" }
  }

  return { suitable: true }
}

// Get weather forecast
export function getWeatherForecast(useStormy = false): WeatherForecast {
  // In a real app, this would call a weather API
  return useStormy ? stormyWeatherData : mockWeatherData
}

// Get current weather
export function getCurrentWeather(useStormy = false): WeatherCondition {
  return getWeatherForecast(useStormy).current
}

// Get weather alerts
export function getWeatherAlerts(useStormy = false): WeatherAlert[] {
  return getWeatherForecast(useStormy).alerts
}
