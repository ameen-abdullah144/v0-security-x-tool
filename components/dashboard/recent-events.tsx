"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, ExternalLink } from "lucide-react"
import Link from "next/link"

interface SecurityEvent {
  id: string
  title: string
  severity: "low" | "medium" | "high" | "critical"
  event_type: string
  created_at: string
  device_name?: string
}

const severityColors = {
  low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  critical: "bg-destructive/10 text-destructive border-destructive/20",
}

export function RecentEvents() {
  const [events, setEvents] = useState<SecurityEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
            severity,
            event_type,
            created_at,
            devices (name)
          `,
          )
          .order("created_at", { ascending: false })
          .limit(10)

        if (error) throw error

        const formattedEvents = data?.map((event) => ({
          ...event,
          device_name: event.devices?.name,
        })) as SecurityEvent[]

        setEvents(formattedEvents || [])
      } catch (error) {
        console.error("Error fetching recent events:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecentEvents()

    // Set up real-time subscription
    const supabase = createClient()
    const channel = supabase
      .channel("recent-events")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "security_events" }, () => {
        fetchRecentEvents()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const eventTime = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - eventTime.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Events
        </CardTitle>
        <CardDescription>Latest security events and incidents</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                  <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                  <div className="flex-1">
                    <div className="h-4 w-3/4 bg-muted animate-pulse rounded mb-2" />
                    <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
                  </div>
                  <div className="h-3 w-12 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No recent events</p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <Badge className={severityColors[event.severity]} variant="outline">
                    {event.severity}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {event.device_name && `${event.device_name} • `}
                      {event.event_type.replace("_", " ")}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatTimeAgo(event.created_at)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="flex gap-2 mt-4">
          <Button asChild size="sm">
            <Link href="/events">
              View All Events
              <ExternalLink className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
