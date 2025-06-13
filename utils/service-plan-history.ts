export interface ServicePlanHistoryEntry {
  id: string
  customerId: string
  customerName: string
  changeDate: string
  changeType: "initial" | "upgrade" | "downgrade" | "change" | "cancellation"
  previousServiceType?: string
  previousServiceTypeName?: string
  previousPackage?: string
  previousPackageName?: string
  newServiceType?: string
  newServiceTypeName?: string
  newPackage?: string
  newPackageName?: string
  previousPrice?: number
  newPrice?: number
  reason?: string
  changedBy: string
  notes?: string
}

// Mock service types for reference
const serviceTypes = [
  { id: "1", name: "Lawn Mowing", price: 45.0 },
  { id: "2", name: "Hedge Trimming", price: 35.0 },
  { id: "3", name: "Leaf Removal", price: 65.0 },
  { id: "4", name: "Fertilization", price: 40.0 },
  { id: "5", name: "Weed Control", price: 50.0 },
]

// Mock packages for reference
const servicePackages = [
  { id: "1", name: "Spring Cleanup Special", totalPrice: 127.5 },
  { id: "2", name: "Lawn Maintenance Bundle", totalPrice: 85.0 },
  { id: "3", name: "Complete Garden Care", totalPrice: 100.0 },
]

// Mock service plan history data
let servicePlanHistory: ServicePlanHistoryEntry[] = [
  {
    id: "hist-001",
    customerId: "1",
    customerName: "John Smith",
    changeDate: "2025-01-15T10:30:00",
    changeType: "initial",
    newServiceType: "1",
    newServiceTypeName: "Lawn Mowing",
    newPrice: 45.0,
    reason: "Initial service setup",
    changedBy: "System",
    notes: "Customer signed up for basic lawn mowing service",
  },
  {
    id: "hist-002",
    customerId: "2",
    customerName: "Sarah Johnson",
    changeDate: "2025-02-01T14:15:00",
    changeType: "initial",
    newPackage: "3",
    newPackageName: "Complete Garden Care",
    newPrice: 100.0,
    reason: "Initial service setup",
    changedBy: "Admin",
    notes: "Customer chose comprehensive package for large property",
  },
  {
    id: "hist-003",
    customerId: "1",
    customerName: "John Smith",
    changeDate: "2025-03-10T09:45:00",
    changeType: "upgrade",
    previousServiceType: "1",
    previousServiceTypeName: "Lawn Mowing",
    previousPrice: 45.0,
    newPackage: "2",
    newPackageName: "Lawn Maintenance Bundle",
    newPrice: 85.0,
    reason: "Customer requested weed control addition",
    changedBy: "Admin",
    notes: "Upgraded to package for better value with weed control",
  },
]

// Get service plan history for a specific customer
export function getCustomerServicePlanHistory(customerId: string): ServicePlanHistoryEntry[] {
  return servicePlanHistory
    .filter((entry) => entry.customerId === customerId)
    .sort((a, b) => new Date(b.changeDate).getTime() - new Date(a.changeDate).getTime())
}

// Get all service plan history
export function getAllServicePlanHistory(): ServicePlanHistoryEntry[] {
  return servicePlanHistory.sort((a, b) => new Date(b.changeDate).getTime() - new Date(a.changeDate).getTime())
}

// Add a new service plan history entry
export function addServicePlanHistoryEntry(entry: Omit<ServicePlanHistoryEntry, "id">): ServicePlanHistoryEntry {
  const newEntry: ServicePlanHistoryEntry = {
    ...entry,
    id: `hist-${Date.now().toString().slice(-6)}`,
  }

  servicePlanHistory = [newEntry, ...servicePlanHistory]
  return newEntry
}

// Track service plan change
export function trackServicePlanChange(
  customerId: string,
  customerName: string,
  previousServiceType: string | undefined,
  previousPackage: string | undefined,
  newServiceType: string | undefined,
  newPackage: string | undefined,
  reason?: string,
  changedBy = "Admin",
  notes?: string,
): ServicePlanHistoryEntry {
  // Get service/package names and prices
  const previousServiceTypeName = previousServiceType
    ? serviceTypes.find((s) => s.id === previousServiceType)?.name
    : undefined
  const previousPackageName = previousPackage ? servicePackages.find((p) => p.id === previousPackage)?.name : undefined
  const newServiceTypeName = newServiceType ? serviceTypes.find((s) => s.id === newServiceType)?.name : undefined
  const newPackageName = newPackage ? servicePackages.find((p) => p.id === newPackage)?.name : undefined

  const previousPrice = previousServiceType
    ? serviceTypes.find((s) => s.id === previousServiceType)?.price
    : previousPackage
      ? servicePackages.find((p) => p.id === previousPackage)?.totalPrice
      : undefined

  const newPrice = newServiceType
    ? serviceTypes.find((s) => s.id === newServiceType)?.price
    : newPackage
      ? servicePackages.find((p) => p.id === newPackage)?.totalPrice
      : undefined

  // Determine change type
  let changeType: ServicePlanHistoryEntry["changeType"] = "change"

  if (!previousServiceType && !previousPackage) {
    changeType = "initial"
  } else if (!newServiceType && !newPackage) {
    changeType = "cancellation"
  } else if (previousPrice && newPrice) {
    if (newPrice > previousPrice) {
      changeType = "upgrade"
    } else if (newPrice < previousPrice) {
      changeType = "downgrade"
    }
  }

  const entry = addServicePlanHistoryEntry({
    customerId,
    customerName,
    changeDate: new Date().toISOString(),
    changeType,
    previousServiceType,
    previousServiceTypeName,
    previousPackage,
    previousPackageName,
    newServiceType,
    newServiceTypeName,
    newPackage,
    newPackageName,
    previousPrice,
    newPrice,
    reason,
    changedBy,
    notes,
  })

  return entry
}

// Format change type for display
export function formatChangeType(changeType: ServicePlanHistoryEntry["changeType"]): string {
  const typeMap = {
    initial: "Initial Setup",
    upgrade: "Upgrade",
    downgrade: "Downgrade",
    change: "Plan Change",
    cancellation: "Cancellation",
  }
  return typeMap[changeType] || changeType
}

// Get change type color
export function getChangeTypeColor(changeType: ServicePlanHistoryEntry["changeType"]): string {
  const colorMap = {
    initial: "bg-blue-100 text-blue-800",
    upgrade: "bg-green-100 text-green-800",
    downgrade: "bg-orange-100 text-orange-800",
    change: "bg-purple-100 text-purple-800",
    cancellation: "bg-red-100 text-red-800",
  }
  return colorMap[changeType] || "bg-gray-100 text-gray-800"
}
