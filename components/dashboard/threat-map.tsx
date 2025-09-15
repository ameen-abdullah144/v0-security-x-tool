"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, MapPin } from "lucide-react"

const threatLocations = [
  { country: "United States", city: "New York", threats: 23, severity: "high" },
  { country: "China", city: "Beijing", threats: 18, severity: "critical" },
  { country: "Russia", city: "Moscow", threats: 15, severity: "medium" },
  { country: "Germany", city: "Berlin", threats: 12, severity: "high" },
  { country: "Brazil", city: "São Paulo", threats: 9, severity: "medium" },
  { country: "India", city: "Mumbai", threats: 7, severity: "low" },
]

const severityColors = {
  low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  critical: "bg-destructive/10 text-destructive border-destructive/20",
}

export function ThreatMap() {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Global Threat Intelligence
        </CardTitle>
        <CardDescription>Real-time threat activity from around the world</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {threatLocations.map((location, index) => (
            <div key={index} className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card/50">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium text-sm">{location.city}</p>
                <p className="text-xs text-muted-foreground">{location.country}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">{location.threats}</p>
                <Badge className={severityColors[location.severity as keyof typeof severityColors]} variant="outline">
                  {location.severity}
                </Badge>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <p className="text-sm font-medium">Live Threat Feed</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Monitoring global threat intelligence from 150+ countries. Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
