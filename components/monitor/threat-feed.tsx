"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, Globe, Shield, Zap } from "lucide-react"

interface ThreatIntel {
  id: string
  timestamp: string
  source: string
  threatType: string
  severity: "low" | "medium" | "high" | "critical"
  description: string
  location: string
  blocked: boolean
}

const threatTypes = {
  malware: { icon: AlertTriangle, color: "text-destructive" },
  phishing: { icon: Shield, color: "text-orange-500" },
  ddos: { icon: Zap, color: "text-yellow-500" },
  intrusion: { icon: Globe, color: "text-blue-500" },
}

const severityColors = {
  low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  critical: "bg-destructive/10 text-destructive border-destructive/20",
}

interface ThreatFeedProps {
  isActive: boolean
}

export function ThreatFeed({ isActive }: ThreatFeedProps) {
  const [threats, setThreats] = useState<ThreatIntel[]>([])

  useEffect(() => {
    // Generate initial threat data
    const generateThreat = (): ThreatIntel => {
      const types = Object.keys(threatTypes)
      const severities: ThreatIntel["severity"][] = ["low", "medium", "high", "critical"]
      const locations = ["US", "CN", "RU", "DE", "BR", "IN", "UK", "FR"]
      const sources = ["192.168.1.", "203.0.113.", "198.51.100.", "10.0.0."]

      const type = types[Math.floor(Math.random() * types.length)]
      const severity = severities[Math.floor(Math.random() * severities.length)]

      return {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        source: sources[Math.floor(Math.random() * sources.length)] + Math.floor(Math.random() * 255),
        threatType: type,
        severity,
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} attempt detected from external source`,
        location: locations[Math.floor(Math.random() * locations.length)],
        blocked: Math.random() > 0.3,
      }
    }

    // Initialize with some threats
    const initialThreats = Array.from({ length: 20 }, generateThreat)
    setThreats(initialThreats)

    if (isActive) {
      // Add new threats periodically
      const interval = setInterval(() => {
        const newThreat = generateThreat()
        setThreats((prev) => [newThreat, ...prev.slice(0, 49)])
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [isActive])

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Global Threat Intelligence
        </CardTitle>
        <CardDescription>Real-time threat detection and blocking</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          {threats.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Globe className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No threats detected</p>
            </div>
          ) : (
            <div className="space-y-2">
              {threats.map((threat) => {
                const threatConfig = threatTypes[threat.threatType as keyof typeof threatTypes]
                const IconComponent = threatConfig?.icon || AlertTriangle
                return (
                  <div
                    key={threat.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <IconComponent className={`h-4 w-4 ${threatConfig?.color || "text-muted-foreground"}`} />
                      <span className="text-xs text-muted-foreground font-mono">
                        {formatTimestamp(threat.timestamp)}
                      </span>
                    </div>
                    <Badge className={severityColors[threat.severity]} variant="outline">
                      {threat.severity}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{threat.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {threat.source} • {threat.location} • {threat.threatType}
                      </p>
                    </div>
                    <Badge variant={threat.blocked ? "default" : "destructive"} className="text-xs">
                      {threat.blocked ? "Blocked" : "Active"}
                    </Badge>
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
