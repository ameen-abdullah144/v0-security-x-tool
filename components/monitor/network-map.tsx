"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Network, Server, Monitor, Smartphone, Wifi } from "lucide-react"

const networkNodes = [
  { id: "gateway", name: "Network Gateway", type: "network", status: "active", connections: 5, threats: 0 },
  { id: "server1", name: "Web Server 01", type: "server", status: "active", connections: 12, threats: 2 },
  { id: "server2", name: "Database Server", type: "server", status: "warning", connections: 8, threats: 1 },
  {
    id: "workstation1",
    name: "Admin Workstation",
    type: "workstation",
    status: "critical",
    connections: 3,
    threats: 3,
  },
  { id: "mobile1", name: "Mobile Device", type: "mobile", status: "inactive", connections: 0, threats: 0 },
  { id: "iot1", name: "Security Camera", type: "iot", status: "active", connections: 1, threats: 0 },
]

const nodeIcons = {
  network: Wifi,
  server: Server,
  workstation: Monitor,
  mobile: Smartphone,
  iot: Network,
}

const statusColors = {
  active: "bg-green-500/10 text-green-500 border-green-500/20",
  warning: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  critical: "bg-destructive/10 text-destructive border-destructive/20",
  inactive: "bg-gray-500/10 text-gray-500 border-gray-500/20",
}

export function NetworkMap() {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5" />
          Network Topology
        </CardTitle>
        <CardDescription>Real-time network device status and threat indicators</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {networkNodes.map((node) => {
            const IconComponent = nodeIcons[node.type as keyof typeof nodeIcons]
            return (
              <div
                key={node.id}
                className="relative p-4 rounded-lg border border-border bg-card/50 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{node.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{node.type}</p>
                  </div>
                  <Badge className={statusColors[node.status as keyof typeof statusColors]} variant="outline">
                    {node.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Connections</p>
                    <p className="font-medium">{node.connections}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Threats</p>
                    <p className={`font-medium ${node.threats > 0 ? "text-destructive" : "text-green-500"}`}>
                      {node.threats}
                    </p>
                  </div>
                </div>

                {node.threats > 0 && (
                  <div className="absolute -top-1 -right-1">
                    <div className="h-3 w-3 bg-destructive rounded-full animate-pulse" />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">Network Health</p>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-muted-foreground">Monitoring Active</span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 text-xs">
            <div>
              <p className="text-muted-foreground">Total Devices</p>
              <p className="font-medium">{networkNodes.length}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Active</p>
              <p className="font-medium text-green-500">{networkNodes.filter((n) => n.status === "active").length}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Warnings</p>
              <p className="font-medium text-yellow-500">{networkNodes.filter((n) => n.status === "warning").length}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Critical</p>
              <p className="font-medium text-destructive">
                {networkNodes.filter((n) => n.status === "critical").length}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
