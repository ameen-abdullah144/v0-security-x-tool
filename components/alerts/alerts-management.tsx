"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Search, Filter, CheckCircle, Clock } from "lucide-react"
import { AlertCard } from "@/components/alerts/alert-card"
import { AlertDialog } from "@/components/alerts/alert-dialog"

interface Alert {
  id: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "new" | "acknowledged" | "in_progress" | "resolved" | "dismissed"
  notes: string | null
  created_at: string
  updated_at: string
  resolved_at: string | null
  security_events: {
    id: string
    title: string
    severity: "low" | "medium" | "high" | "critical"
    event_type: string
    description: string
    source_ip: string | null
    devices: {
      name: string
    } | null
  }
  assigned_to: {
    full_name: string | null
    email: string
  } | null
}

const priorityColors = {
  low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  urgent: "bg-destructive/10 text-destructive border-destructive/20",
}

const statusColors = {
  new: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  acknowledged: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  in_progress: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  resolved: "bg-green-500/10 text-green-500 border-green-500/20",
  dismissed: "bg-gray-500/10 text-gray-500 border-gray-500/20",
}

export function AlertsManagement() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("active")
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const fetchAlerts = async () => {
      const supabase = createClient()

      try {
        const { data, error } = await supabase
          .from("alerts")
          .select(
            `
            *,
            security_events (
              id,
              title,
              severity,
              event_type,
              description,
              source_ip,
              devices (name)
            ),
            assigned_to:profiles!alerts_assigned_to_fkey (
              full_name,
              email
            )
          `,
          )
          .order("created_at", { ascending: false })

        if (error) throw error

        setAlerts(data || [])
      } catch (error) {
        console.error("Error fetching alerts:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAlerts()

    // Set up real-time subscription
    const supabase = createClient()
    const channel = supabase
      .channel("alerts")
      .on("postgres_changes", { event: "*", schema: "public", table: "alerts" }, () => {
        fetchAlerts()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    let filtered = alerts

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (alert) =>
          alert.security_events?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alert.security_events?.devices?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alert.security_events?.source_ip?.includes(searchTerm),
      )
    }

    // Apply priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter((alert) => alert.priority === priorityFilter)
    }

    // Apply status filter
    if (statusFilter === "active") {
      filtered = filtered.filter((alert) => !["resolved", "dismissed"].includes(alert.status))
    } else if (statusFilter !== "all") {
      filtered = filtered.filter((alert) => alert.status === statusFilter)
    }

    setFilteredAlerts(filtered)
  }, [alerts, searchTerm, priorityFilter, statusFilter])

  const handleAlertClick = (alert: Alert) => {
    setSelectedAlert(alert)
    setIsDialogOpen(true)
  }

  const getAlertStats = () => {
    const stats = {
      total: alerts.length,
      new: alerts.filter((a) => a.status === "new").length,
      inProgress: alerts.filter((a) => a.status === "in_progress").length,
      resolved: alerts.filter((a) => a.status === "resolved").length,
      urgent: alerts.filter((a) => a.priority === "urgent").length,
    }
    return stats
  }

  const stats = getAlertStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-2xl font-bold">Security Alerts</h2>
          <p className="text-muted-foreground">Monitor and manage security incidents</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New</CardTitle>
            <div className="h-3 w-3 rounded-full bg-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{stats.new}</div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{stats.inProgress}</div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.resolved}</div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.urgent}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-input border-border"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40 bg-input border-border">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="acknowledged">Acknowledged</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="dismissed">Dismissed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-40 bg-input border-border">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Alerts ({filteredAlerts.length})</CardTitle>
          <CardDescription>Security alerts requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="h-6 w-16 bg-muted animate-pulse rounded" />
                    <div className="flex-1">
                      <div className="h-4 w-3/4 bg-muted animate-pulse rounded mb-2" />
                      <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
                    </div>
                    <div className="h-6 w-20 bg-muted animate-pulse rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredAlerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No alerts found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAlerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} onClick={() => handleAlertClick(alert)} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        alert={selectedAlert}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onUpdate={() => {
          // Refresh alerts after update
          setIsDialogOpen(false)
        }}
      />
    </div>
  )
}
