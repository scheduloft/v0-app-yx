"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Clock, Fuel, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { getHomeLocation } from "@/utils/route-optimizer"

export default function RouteSettingsPage() {
  const router = useRouter()
  const homeLocation = getHomeLocation()

  // Route optimization settings
  const [defaultStartLocation, setDefaultStartLocation] = useState("office")
  const [defaultEndLocation, setDefaultEndLocation] = useState("office")
  const [optimizeFor, setOptimizeFor] = useState("time")
  const [avoidHighways, setAvoidHighways] = useState(false)
  const [avoidTolls, setAvoidTolls] = useState(true)
  const [includeTraffic, setIncludeTraffic] = useState(true)

  // Vehicle settings
  const [vehicleType, setVehicleType] = useState("truck")
  const [fuelEfficiency, setFuelEfficiency] = useState(18)
  const [fuelType, setFuelType] = useState("gasoline")

  // Office location
  const [officeAddress, setOfficeAddress] = useState(homeLocation.address)

  const handleSave = () => {
    // In a real app, this would save the settings to a database or local storage
    alert("Route settings saved!")
    router.back()
  }

  return (
    <main className="flex flex-col pb-16">
      <div className="bg-primary text-primary-foreground p-4 flex items-center">
        <Button variant="ghost" size="icon" className="mr-2 text-primary-foreground" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Route Settings</h1>
      </div>

      <div className="p-4 space-y-4">
        <Card>
          <CardContent className="p-4 space-y-4">
            <h2 className="font-semibold">Route Optimization</h2>

            <div className="space-y-2">
              <Label htmlFor="optimize-for">Optimize Routes For</Label>
              <RadioGroup id="optimize-for" value={optimizeFor} onValueChange={setOptimizeFor} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="time" id="time" />
                  <Label htmlFor="time" className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Time
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="distance" id="distance" />
                  <Label htmlFor="distance" className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    Distance
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fuel" id="fuel" />
                  <Label htmlFor="fuel" className="flex items-center">
                    <Fuel className="h-4 w-4 mr-1" />
                    Fuel
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="default-start">Default Start Location</Label>
              <Select value={defaultStartLocation} onValueChange={setDefaultStartLocation}>
                <SelectTrigger id="default-start">
                  <SelectValue placeholder="Select start location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="office">Office</SelectItem>
                  <SelectItem value="home">Home</SelectItem>
                  <SelectItem value="current">Current Location</SelectItem>
                  <SelectItem value="custom">Custom Location</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="default-end">Default End Location</Label>
              <Select value={defaultEndLocation} onValueChange={setDefaultEndLocation}>
                <SelectTrigger id="default-end">
                  <SelectValue placeholder="Select end location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="office">Office</SelectItem>
                  <SelectItem value="home">Home</SelectItem>
                  <SelectItem value="current">Current Location</SelectItem>
                  <SelectItem value="custom">Custom Location</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="include-traffic" className="flex-1">
                Include traffic conditions
              </Label>
              <Switch id="include-traffic" checked={includeTraffic} onCheckedChange={setIncludeTraffic} />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="avoid-highways" className="flex-1">
                Avoid highways
              </Label>
              <Switch id="avoid-highways" checked={avoidHighways} onCheckedChange={setAvoidHighways} />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="avoid-tolls" className="flex-1">
                Avoid toll roads
              </Label>
              <Switch id="avoid-tolls" checked={avoidTolls} onCheckedChange={setAvoidTolls} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-4">
            <h2 className="font-semibold">Vehicle Information</h2>

            <div className="space-y-2">
              <Label htmlFor="vehicle-type">Vehicle Type</Label>
              <Select value={vehicleType} onValueChange={setVehicleType}>
                <SelectTrigger id="vehicle-type">
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="car">Car</SelectItem>
                  <SelectItem value="truck">Truck</SelectItem>
                  <SelectItem value="van">Van</SelectItem>
                  <SelectItem value="suv">SUV</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="fuel-efficiency">Fuel Efficiency (MPG)</Label>
                <span className="text-sm">{fuelEfficiency} MPG</span>
              </div>
              <Slider
                id="fuel-efficiency"
                min={10}
                max={50}
                step={1}
                value={[fuelEfficiency]}
                onValueChange={(value) => setFuelEfficiency(value[0])}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fuel-type">Fuel Type</Label>
              <Select value={fuelType} onValueChange={setFuelType}>
                <SelectTrigger id="fuel-type">
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gasoline">Gasoline</SelectItem>
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="electric">Electric</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-4">
            <h2 className="font-semibold">Office Location</h2>

            <div className="space-y-2">
              <Label htmlFor="office-address">Office Address</Label>
              <div className="flex gap-2">
                <Input
                  id="office-address"
                  value={officeAddress}
                  onChange={(e) => setOfficeAddress(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" size="icon">
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="h-32 bg-muted rounded-md flex items-center justify-center">
              <p className="text-muted-foreground">Map preview</p>
            </div>
          </CardContent>
        </Card>

        <Button className="w-full" onClick={handleSave}>
          <Save className="h-4 w-4 mr-1" />
          Save Settings
        </Button>
      </div>
    </main>
  )
}
