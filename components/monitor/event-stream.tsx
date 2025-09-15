"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Activity, AlertTriangle, Shield, Zap } from "lucide-react"

interface StreamEvent {
  id: string
  timestamp: string
  type: string
  severity: "low" | "medium" | "high" | "critical"
  source: string
  message: string
  details?: string
}

const eventIcons = {
  login_attempt: Shield,
  malware_detected: AlertTriangle,
  network_intrusion: Zap,
  suspicious_activity: Activity,
  system_anomaly: Activity,
  data_breach: AlertTriangle,
}

const severityColors = {
  low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  critical: "bg-destructive/10 text-destructive border-destructive/20",
}

interface EventStreamProps {
  isActive: boolean
}

export function EventStream({ isActive }: EventStreamProps) {
  const [events, setEvents] = useState<StreamEvent[]>([])

  useEffect(() => {
    const fetchRecentEvents = async () => {
      const supabase = createClient()

      try {
        const { data, error } = await supabase
          .from("security_events")
          .select(
            `
            id,
            title,
            event_type,
            severity,
            created_at,
            source_ip,
            devices (name)
          `,
          )
          .order("created_at", { ascending: false })
          .limit(50)

        if (error) throw error

        const formattedEvents: StreamEvent[] =
          data?.map((event) => ({
            id: event.id,
            timestamp: event.created_at,
            type: event.event_type,
            severity: event.severity as StreamEvent["severity"],
            source: event.devices?.name || event.source_ip || "Unknown",
            message: event.title,
          })) || []

        setEvents(formattedEvents)
      } catch (error) {
        console.error("Error fetching events:", error)
      }
    }

    fetchRecentEvents()

    if (isActive) {
      // Set up real-time subscription
      const supabase = createClient()
      const channel = supabase
        .channel("event-stream")
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "security_events" }, (payload) => {
          const newEvent: StreamEvent = {
            id: payload.new.id,
            timestamp: payload.new.created_at,
            type: payload.new.event_type,
            severity: payload.new.severity,
            source: payload.new.source_ip || "Unknown",
            message: payload.new.title,
          }
          setEvents((prev) => [newEvent, ...prev.slice(0, 49)])
        })
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
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
          <Activity className="h-5 w-5" />
          Live Event Stream
        </CardTitle>
        <CardDescription>Real-time security events as they occur</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          {events.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No events to display</p>
            </div>
          ) : (
            <div className="space-y-2">
              {events.map((event) => {
                const IconComponent = eventIcons[event.type as keyof typeof eventIcons] || Activity
                return (
                  <div
                    key={event.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground font-mono">
                        {formatTimestamp(event.timestamp)}
                      </span>
                    </div>
                    <Badge className={severityColors[event.severity]} variant="outline">
                      {event.severity}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{event.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {event.source} • {event.type.replace("_", " ")}
                      </p>
                    </div>
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
