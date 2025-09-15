"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, User, MessageSquare, ExternalLink } from "lucide-react"

interface Alert {
  id: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "new" | "acknowledged" | "in_progress" | "resolved" | "dismissed"
  notes: string | null
  created_at: string
  security_events: {
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

interface AlertCardProps {
  alert: Alert
  onClick: () => void
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

export function AlertCard({ alert, onClick }: AlertCardProps) {
  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const alertTime = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - alertTime.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <Card className="border-border hover:bg-muted/50 transition-colors cursor-pointer" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex items-center gap-2">
            <AlertTriangle
              className={`h-5 w-5 ${alert.priority === "urgent" ? "text-destructive" : alert.priority === "high" ? "text-orange-500" : "text-muted-foreground"}`}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={priorityColors[alert.priority]} variant="outline">
                {alert.priority}
              </Badge>
              <Badge className={statusColors[alert.status]} variant="outline">
                {alert.status.replace("_", " ")}
              </Badge>
              <span className="text-xs text-muted-foreground">{formatTimeAgo(alert.created_at)}</span>
            </div>

            <h3 className="font-medium text-sm mb-1 truncate">{alert.security_events?.title}</h3>
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{alert.security_events?.description}</p>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {alert.security_events?.devices?.name && <span>Device: {alert.security_events.devices.name}</span>}
              {alert.security_events?.source_ip && <span>Source: {alert.security_events.source_ip}</span>}
              <span>Type: {alert.security_events?.event_type.replace("_", " ")}</span>
            </div>

            {alert.assigned_to && (
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                <span>Assigned to {alert.assigned_to.full_name || alert.assigned_to.email}</span>
              </div>
            )}

            {alert.notes && (
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <MessageSquare className="h-3 w-3" />
                <span className="truncate">{alert.notes}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
