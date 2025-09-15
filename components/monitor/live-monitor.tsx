"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Activity, Zap, Pause, Play, Filter } from "lucide-react"
import { EventStream } from "@/components/monitor/event-stream"
import { NetworkMap } from "@/components/monitor/network-map"
import { ThreatFeed } from "@/components/monitor/threat-feed"

interface MonitorStats {
  eventsPerSecond: number
  activeThreats: number
  blockedAttacks: number
  systemStatus: "operational" | "warning" | "critical"
}

export function LiveMonitor() {
  const [stats, setStats] = useState<MonitorStats>({
    eventsPerSecond: 0,
    activeThreats: 0,
    blockedAttacks: 0,
    systemStatus: "operational",
  })
  const [isMonitoring, setIsMonitoring] = useState(true)

  useEffect(() => {
    // Simulate real-time monitoring stats
    const updateStats = () => {
      setStats({
        eventsPerSecond: Math.floor(Math.random() * 50) + 10,
        activeThreats: Math.floor(Math.random() * 15) + 2,
        blockedAttacks: Math.floor(Math.random() * 100) + 50,
        systemStatus: Math.random() > 0.8 ? "warning" : "operational",
      })
    }

    updateStats()
    const interval = setInterval(updateStats, 2000)

    return () => clearInterval(interval)
  }, [])

  const statusColors = {
    operational: "bg-green-500/10 text-green-500 border-green-500/20",
    warning: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    critical: "bg-destructive/10 text-destructive border-destructive/20",
  }

  return (
    <div className="space-y-6">
      {/* Monitor Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${isMonitoring ? "bg-green-500 animate-pulse" : "bg-gray-500"}`} />
            <span className="text-sm font-medium">{isMonitoring ? "Live Monitoring" : "Monitoring Paused"}</span>
          </div>
          <Badge className={statusColors[stats.systemStatus]} variant="outline">
            {stats.systemStatus.toUpperCase()}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="bg-transparent">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button
            variant={isMonitoring ? "destructive" : "default"}
            size="sm"
            onClick={() => setIsMonitoring(!isMonitoring)}
          >
            {isMonitoring ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Resume
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events/Second</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.eventsPerSecond}</div>
            <div className="text-xs text-muted-foreground">Real-time processing</div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Threats</CardTitle>
            <Zap className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.activeThreats}</div>
            <div className="text-xs text-muted-foreground">Requires attention</div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked Attacks</CardTitle>
            <Eye className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.blockedAttacks}</div>
            <div className="text-xs text-muted-foreground">Last 24 hours</div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <div
              className={`h-3 w-3 rounded-full ${stats.systemStatus === "operational" ? "bg-green-500" : stats.systemStatus === "warning" ? "bg-yellow-500" : "bg-red-500"}`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{stats.systemStatus}</div>
            <div className="text-xs text-muted-foreground">All systems</div>
          </CardContent>
        </Card>
      </div>

      {/* Monitor Tabs */}
      <Tabs defaultValue="events" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="events">Event Stream</TabsTrigger>
          <TabsTrigger value="network">Network Map</TabsTrigger>
          <TabsTrigger value="threats">Threat Feed</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <EventStream isActive={isMonitoring} />
        </TabsContent>

        <TabsContent value="network" className="space-y-4">
          <NetworkMap />
        </TabsContent>

        <TabsContent value="threats" className="space-y-4">
          <ThreatFeed isActive={isMonitoring} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
