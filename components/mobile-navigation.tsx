"use client"

import { Calendar, FileText, Home, Settings, Users, CloudRain, Bell, Map } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { getWeatherAffectedAppointmentCount } from "@/utils/rescheduling-service"

export default function MobileNavigation() {
  const pathname = usePathname()

  // Get weather-affected appointment count
  const affectedAppointmentCount = getWeatherAffectedAppointmentCount()

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
    },
    {
      name: "Schedule",
      href: "/schedule",
      icon: Calendar,
    },
    {
      name: "Route",
      href: "/route",
      icon: Map,
    },
    {
      name: "Customers",
      href: "/customers",
      icon: Users,
    },
    {
      name: "Invoices",
      href: "/invoices",
      icon: FileText,
    },
    {
      name: "Weather",
      href: "/weather",
      icon: CloudRain,
      badge: affectedAppointmentCount > 0 ? affectedAppointmentCount : undefined,
    },
    {
      name: "Notifications",
      href: "/notifications",
      icon: Bell,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden">
      <div className="max-w-7xl mx-auto w-full">
        <nav className="flex justify-around overflow-x-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center py-3 px-2 text-xs relative flex-1 text-center",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                <item.icon className={cn("h-5 w-5 mb-1", isActive ? "text-primary" : "text-muted-foreground")} />
                <span className="text-[10px]">{item.name}</span>
                {item.badge && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-4 min-w-4 p-0 flex items-center justify-center text-[10px]"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
