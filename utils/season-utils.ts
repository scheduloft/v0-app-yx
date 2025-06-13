import type { Season, ServicePackage } from "@/components/package-form"

export function getCurrentSeason(): Season {
  const month = new Date().getMonth()

  // Northern hemisphere seasons
  if (month >= 2 && month <= 4) return "spring" // March to May
  if (month >= 5 && month <= 7) return "summer" // June to August
  if (month >= 8 && month <= 10) return "fall" // September to November
  return "winter" // December to February
}

export function isPackageInSeason(pkg: ServicePackage): boolean {
  // If not seasonal, it's always in season
  if (!pkg.isSeasonalOnly) return true

  // Check custom date range
  if (pkg.startDate && pkg.endDate) {
    const now = new Date()
    return now >= pkg.startDate && now <= pkg.endDate
  }

  // Check seasons
  const currentSeason = getCurrentSeason()
  return pkg.availableSeasons.includes(currentSeason)
}

export function getSeasonalBadgeColor(season: Season): string {
  switch (season) {
    case "spring":
      return "bg-green-100 text-green-800 hover:bg-green-200"
    case "summer":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
    case "fall":
      return "bg-orange-100 text-orange-800 hover:bg-orange-200"
    case "winter":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200"
  }
}

export function formatDateRange(startDate: Date | null, endDate: Date | null): string {
  if (!startDate || !endDate) return ""

  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }
  return `${startDate.toLocaleDateString(undefined, options)} - ${endDate.toLocaleDateString(undefined, options)}`
}
