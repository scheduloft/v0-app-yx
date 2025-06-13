"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Navigation, MapPin, Clock, RouteIcon, Settings, RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import RouteMap from "@/components/route-map"
import { getMockOptimizedRoute } from "@/utils/route-optimizer"

export default function RoutePage() {
  const router = useRouter()
  const [includeReturn, setIncludeReturn] = useState(true)
  const [avoidHighways, setAvoidHighways] = useState(false)
  const [optimizeFor, setOptimizeFor] = useState<"time" | "distance">("time")

  // Get optimized route
  const optimizedRoute = getMockOptimizedRoute(includeReturn)

  // Filter out the start point (office) to get just the appointments and end
  const routePoints = optimizedRoute.points.map((point, index) => ({
    ...point,
    isStart: index === 0,
    isEnd: index === optimizedRoute.points.length - 1,
  }))

  const handleReoptimize = () => {
    // In a real app, this would recalculate the route with new parameters
    alert("Route re-optimized with new settings!")
  }

  return (
    <main className="flex flex-col pb-16">
      <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2 text-primary-foreground" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Route Details</h1>
        </div>
        <Button variant="secondary" size="sm" onClick={() => window.open("https://maps.google.com", "_blank")}>
          <Navigation className="h-4 w-4 mr-1" />
          Open in Maps
        </Button>
      </div>

      <Tabs defaultValue="map">
        <div className="p-4 pb-0">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="directions">Directions</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="map" className="mt-0">
          <div className="p-4">
            <RouteMap route={optimizedRoute} height="300px" interactive={true} />

            <Card className="mt-4">
              <CardContent className="p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Route Summary</h3>
                    <p className="text-sm text-muted-foreground">
                      {routePoints.length - 2} stops • {optimizedRoute.totalDistance.toFixed(1)} miles
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {Math.floor(optimizedRoute.totalTime / 60)}h {optimizedRoute.totalTime % 60}m
                    </p>
                    <p className="text-xs text-muted-foreground">Total travel time</p>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>Departure: 8:00 AM</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>Return: {routePoints[routePoints.length - 1].arrivalTime}</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center text-sm text-green-600">
                    <RotateCw className="h-4 w-4 mr-1" />
                    <span>Optimized to save {optimizedRoute.timeSaved} minutes</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => router.push("/route/settings")}>
                    <Settings className="h-3 w-3 mr-1" />
                    Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="directions" className="mt-0 p-4">
          <div className="space-y-4">
            {routePoints.map((point, index) => (
              <div key={point.location.id}>
                {index > 0 && (
                  <div className="flex items-center my-2 pl-6 text-sm text-muted-foreground">
                    <RouteIcon className="h-4 w-4 mr-2" />
                    <span>
                      {point.distanceFromPrevious.toFixed(1)} miles • {point.timeFromPrevious} min
                    </span>
                  </div>
                )}

                <Card>
                  <CardContent className="p-3 flex items-center">
                    <div
                      className={`
                      w-8 h-8 rounded-full flex items-center justify-center mr-3 text-white
                      ${point.isStart ? "bg-blue-500" : point.isEnd ? "bg-green-500" : "bg-primary"}
                    `}
                    >
                      {point.isStart ? (
                        <MapPin className="h-4 w-4" />
                      ) : point.isEnd ? (
                        <MapPin className="h-4 w-4" />
                      ) : (
                        index
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{point.location.name}</h3>
                        <Badge variant="outline">{point.arrivalTime}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{point.location.address}</p>

                      {!point.isStart && !point.isEnd && point.location.status && (
                        <Badge
                          variant={
                            point.location.status === "Completed"
                              ? "secondary"
                              : point.location.status === "In Progress"
                                ? "default"
                                : "outline"
                          }
                          className="mt-1"
                        >
                          {point.location.status}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="p-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">Route Options</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="include-return" className="flex-1">
                  Include return to office
                </Label>
                <Switch id="include-return" checked={includeReturn} onCheckedChange={setIncludeReturn} />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="avoid-highways" className="flex-1">
                  Avoid highways
                </Label>
                <Switch id="avoid-highways" checked={avoidHighways} onCheckedChange={setAvoidHighways} />
              </div>

              <Separator />

              <div>
                <Label className="mb-2 block">Optimize for:</Label>
                <div className="flex gap-2">
                  <Button
                    variant={optimizeFor === "time" ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                    onClick={() => setOptimizeFor("time")}
                  >
                    <Clock className="h-4 w-4 mr-1" />
                    Time
                  </Button>
                  <Button
                    variant={optimizeFor === "distance" ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                    onClick={() => setOptimizeFor("distance")}
                  >
                    <RouteIcon className="h-4 w-4 mr-1" />
                    Distance
                  </Button>
                </div>
              </div>

              <Button className="w-full" onClick={handleReoptimize}>
                <RotateCw className="h-4 w-4 mr-1" />
                Re-optimize Route
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
