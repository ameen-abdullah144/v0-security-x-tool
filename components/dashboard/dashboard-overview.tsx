"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Shield, AlertTriangle, Activity, Monitor, TrendingUp, TrendingDown, Eye, CheckCircle } from "lucide-react"
import { RealtimeChart } from "@/components/dashboard/realtime-chart"
import { RecentEvents } from "@/components/dashboard/recent-events"
import { ThreatMap } from "@/components/dashboard/threat-map"
import Link from "next/link"

interface DashboardStats {
  totalDevices: number
  activeDevices: number
  totalEvents: number
  criticalAlerts: number
  highAlerts: number
  mediumAlerts: number
  lowAlerts: number
  eventsToday: number
  eventsYesterday: number
}

export function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardStats = async () => {
      const supabase = createClient()

      try {
        // Fetch device stats
        const { data: devices } = await supabase.from("devices").select("status")
        const totalDevices = devices?.length || 0
        const activeDevices = devices?.filter((d) => d.status === "active").length || 0

        // Fetch event stats
        const { data: events } = await supabase.from("security_events").select("severity, created_at")
        const totalEvents = events?.length || 0

        // Fetch alert stats
        const { data: alerts } = await supabase
          .from("alerts")
          .select("priority")
          .eq("status", "new")
          .or("status.eq.acknowledged")

        const criticalAlerts = alerts?.filter((a) => a.priority === "urgent").length || 0
        const highAlerts = alerts?.filter((a) => a.priority === "high").length || 0
        const mediumAlerts = alerts?.filter((a) => a.priority === "medium").length || 0
        const lowAlerts = alerts?.filter((a) => a.priority === "low").length || 0

        // Calculate events today vs yesterday
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        const eventsToday =
          events?.filter((e) => new Date(e.created_at).toDateString() === today.toDateString()).length || 0
        const eventsYesterday =
          events?.filter((e) => new Date(e.created_at).toDateString() === yesterday.toDateString()).length || 0

        setStats({
          totalDevices,
          activeDevices,
          totalEvents,
          criticalAlerts,
          highAlerts,
          mediumAlerts,
          lowAlerts,
          eventsToday,
          eventsYesterday,
        })
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardStats()

    // Set up real-time subscription for updates
    const supabase = createClient()
    const channel = supabase
      .channel("dashboard-updates")
      .on("postgres_changes", { event: "*", schema: "public", table: "security_events" }, () => {
        fetchDashboardStats()
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "alerts" }, () => {
        fetchDashboardStats()
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "devices" }, () => {
        fetchDashboardStats()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                <div className="h-4 w-4 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
                <div className="h-3 w-24 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const deviceUptime = stats ? (stats.activeDevices / stats.totalDevices) * 100 : 0
  const eventTrend =
    stats && stats.eventsYesterday > 0 ? ((stats.eventsToday - stats.eventsYesterday) / stats.eventsYesterday) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalDevices || 0}</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle className="h-3 w-3 text-green-500" />
              {stats?.activeDevices || 0} active
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats?.criticalAlerts || 0}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Badge variant="destructive" className="text-xs px-1">
                Urgent
              </Badge>
              Requires immediate attention
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.eventsToday || 0}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {eventTrend > 0 ? (
                <TrendingUp className="h-3 w-3 text-destructive" />
              ) : (
                <TrendingDown className="h-3 w-3 text-green-500" />
              )}
              {Math.abs(eventTrend).toFixed(1)}% from yesterday
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{deviceUptime.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">Device uptime</div>
            <Progress value={deviceUptime} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Alert Summary */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Alert Summary
          </CardTitle>
          <CardDescription>Current security alerts by priority level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <div className="h-3 w-3 rounded-full bg-destructive" />
              <div>
                <p className="text-sm font-medium">Critical</p>
                <p className="text-2xl font-bold text-destructive">{stats?.criticalAlerts || 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <div className="h-3 w-3 rounded-full bg-orange-500" />
              <div>
                <p className="text-sm font-medium">High</p>
                <p className="text-2xl font-bold text-orange-500">{stats?.highAlerts || 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <div>
                <p className="text-sm font-medium">Medium</p>
                <p className="text-2xl font-bold text-yellow-500">{stats?.mediumAlerts || 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <div>
                <p className="text-sm font-medium">Low</p>
                <p className="text-2xl font-bold text-blue-500">{stats?.lowAlerts || 0}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button asChild size="sm">
              <Link href="/alerts">View All Alerts</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="bg-transparent">
              <Link href="/monitor">
                <Eye className="h-4 w-4 mr-2" />
                Live Monitor
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Charts and Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RealtimeChart />
        <RecentEvents />
      </div>

      {/* Threat Map */}
      <ThreatMap />
    </div>
  )
}
