import type { Season, ServicePackage } from "@/components/package-form"

export function getCurrentSeason(): Season {
  const now = new Date()
  const month = now.getMonth() + 1 // getMonth() returns 0-11, we want 1-12

  if (month >= 3 && month <= 5) return "spring"
  if (month >= 6 && month <= 8) return "summer"
  if (month >= 9 && month <= 11) return "fall"
  return "winter"
}

export function isPackageInSeason(pkg: ServicePackage): boolean {
  if (!pkg.isSeasonalOnly) return true

  const now = new Date()

  // Check custom date range first
  if (pkg.startDate && pkg.endDate) {
    return now >= pkg.startDate && now <= pkg.endDate
  }

  // Check seasonal availability
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
      return ""
  }
}

export function formatDateRange(startDate: Date, endDate: Date): string {
  const start = startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  const end = endDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  return `${start} - ${end}`
}
