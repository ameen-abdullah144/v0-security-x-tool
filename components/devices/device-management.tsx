"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Monitor, Server, Smartphone, Wifi, Network, Search, Plus, MoreHorizontal } from "lucide-react"
import { DeviceDialog } from "@/components/devices/device-dialog"

interface Device {
  id: string
  name: string
  device_type: "server" | "workstation" | "mobile" | "iot" | "network"
  ip_address: string
  mac_address: string
  operating_system: string
  status: "active" | "inactive" | "maintenance" | "compromised"
  last_seen: string
  location: string
}

const deviceIcons = {
  server: Server,
  workstation: Monitor,
  mobile: Smartphone,
  iot: Network,
  network: Wifi,
}

const statusColors = {
  active: "bg-green-500/10 text-green-500 border-green-500/20",
  inactive: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  maintenance: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  compromised: "bg-destructive/10 text-destructive border-destructive/20",
}

export function DeviceManagement() {
  const [devices, setDevices] = useState<Device[]>([])
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const fetchDevices = async () => {
      const supabase = createClient()

      try {
        const { data, error } = await supabase.from("devices").select("*").order("name")

        if (error) throw error

        setDevices(data || [])
        setFilteredDevices(data || [])
      } catch (error) {
        console.error("Error fetching devices:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDevices()

    // Set up real-time subscription
    const supabase = createClient()
    const channel = supabase
      .channel("devices")
      .on("postgres_changes", { event: "*", schema: "public", table: "devices" }, () => {
        fetchDevices()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    let filtered = devices

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (device) =>
          device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          device.ip_address.includes(searchTerm) ||
          device.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((device) => device.status === statusFilter)
    }

    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((device) => device.device_type === typeFilter)
    }

    setFilteredDevices(filtered)
  }, [devices, searchTerm, statusFilter, typeFilter])

  const formatLastSeen = (dateString: string) => {
    const now = new Date()
    const lastSeen = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - lastSeen.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-2xl font-bold">Device Management</h2>
          <p className="text-muted-foreground">Monitor and manage all network devices</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Device
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search devices..."
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
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="compromised">Compromised</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-40 bg-input border-border">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="server">Server</SelectItem>
                <SelectItem value="workstation">Workstation</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
                <SelectItem value="iot">IoT</SelectItem>
                <SelectItem value="network">Network</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Device Table */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Devices ({filteredDevices.length})</CardTitle>
          <CardDescription>All registered network devices and their current status</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                  <div className="h-10 w-10 bg-muted animate-pulse rounded" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/4 bg-muted animate-pulse rounded" />
                    <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
                  </div>
                  <div className="h-6 w-16 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Seen</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDevices.map((device) => {
                  const IconComponent = deviceIcons[device.device_type]
                  return (
                    <TableRow key={device.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <IconComponent className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{device.name}</p>
                            <p className="text-sm text-muted-foreground">{device.operating_system}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="capitalize">{device.device_type}</span>
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-muted px-2 py-1 rounded">{device.ip_address}</code>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[device.status]} variant="outline">
                          {device.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatLastSeen(device.last_seen)}</TableCell>
                      <TableCell>{device.location}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <DeviceDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  )
}
