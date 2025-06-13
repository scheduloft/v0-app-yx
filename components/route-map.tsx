"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import type { OptimizedRoute } from "@/utils/route-optimizer"

interface RouteMapProps {
  route: OptimizedRoute
  height?: string
  interactive?: boolean
}

export default function RouteMap({ route, height = "200px", interactive = false }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    // In a real implementation, this would initialize a map library like Google Maps or Mapbox
    // For this demo, we'll just simulate a map with a placeholder
    if (mapRef.current) {
      const loadMap = setTimeout(() => {
        setMapLoaded(true)
      }, 500)

      return () => clearTimeout(loadMap)
    }
  }, [])

  // Draw route points on the map
  const renderRoutePoints = () => {
    return route.points.map((point, index) => {
      const isStart = index === 0
      const isEnd = index === route.points.length - 1
      const isAppointment = !isStart && !isEnd

      // Position dots in a way that simulates a route
      const left = 10 + index * (80 / (route.points.length - 1)) + "%"
      const top = 20 + Math.sin(index * 0.8) * 40 + "%"

      return (
        <div
          key={point.location.id}
          className={`absolute w-4 h-4 rounded-full flex items-center justify-center text-xs text-white
            ${isStart ? "bg-blue-500" : isEnd ? "bg-green-500" : "bg-primary"}`}
          style={{
            left,
            top,
            transform: "translate(-50%, -50%)",
            zIndex: 10,
          }}
          title={point.location.name}
        >
          {isAppointment && index}
        </div>
      )
    })
  }

  // Draw route lines connecting the points
  const renderRouteLines = () => {
    return route.points.map((point, index) => {
      if (index === 0) return null

      // Previous point position
      const prevLeft = 10 + (index - 1) * (80 / (route.points.length - 1)) + "%"
      const prevTop = 20 + Math.sin((index - 1) * 0.8) * 40 + "%"

      // Current point position
      const currLeft = 10 + index * (80 / (route.points.length - 1)) + "%"
      const currTop = 20 + Math.sin(index * 0.8) * 40 + "%"

      return (
        <svg key={`line-${index}`} className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 5 }}>
          <line
            x1={prevLeft}
            y1={prevTop}
            x2={currLeft}
            y2={currTop}
            stroke="#6366f1"
            strokeWidth="2"
            strokeDasharray={point.location.id === "home" ? "5,5" : "none"}
          />
        </svg>
      )
    })
  }

  return (
    <Card className={`relative overflow-hidden`} style={{ height }}>
      <div ref={mapRef} className="w-full h-full bg-muted/30 flex items-center justify-center relative">
        {!mapLoaded ? (
          <p className="text-muted-foreground">Loading map...</p>
        ) : (
          <>
            <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=600')] opacity-20"></div>
            {renderRouteLines()}
            {renderRoutePoints()}
            {!interactive && (
              <div className="absolute bottom-2 right-2 bg-background/80 text-xs p-1 rounded shadow">
                {route.totalDistance.toFixed(1)} miles • {Math.round(route.totalTime)} min
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  )
}
