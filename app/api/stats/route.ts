import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get("range") || "24h"

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Calculate time range
    const now = new Date()
    let startTime: Date

    switch (timeRange) {
      case "1h":
        startTime = new Date(now.getTime() - 60 * 60 * 1000)
        break
      case "24h":
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case "7d":
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "30d":
        startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      default:
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    }

    // Fetch device stats
    const { data: devices } = await supabase.from("devices").select("status")
    const deviceStats = {
      total: devices?.length || 0,
      active: devices?.filter((d) => d.status === "active").length || 0,
      inactive: devices?.filter((d) => d.status === "inactive").length || 0,
      compromised: devices?.filter((d) => d.status === "compromised").length || 0,
    }

    // Fetch event stats
    const { data: events } = await supabase
      .from("security_events")
      .select("severity, event_type, created_at")
      .gte("created_at", startTime.toISOString())

    const eventStats = {
      total: events?.length || 0,
      critical: events?.filter((e) => e.severity === "critical").length || 0,
      high: events?.filter((e) => e.severity === "high").length || 0,
      medium: events?.filter((e) => e.severity === "medium").length || 0,
      low: events?.filter((e) => e.severity === "low").length || 0,
      byType:
        events?.reduce((acc: any, event) => {
          acc[event.event_type] = (acc[event.event_type] || 0) + 1
          return acc
        }, {}) || {},
    }

    // Fetch alert stats
    const { data: alerts } = await supabase
      .from("alerts")
      .select("priority, status, created_at")
      .gte("created_at", startTime.toISOString())

    const alertStats = {
      total: alerts?.length || 0,
      new: alerts?.filter((a) => a.status === "new").length || 0,
      acknowledged: alerts?.filter((a) => a.status === "acknowledged").length || 0,
      in_progress: alerts?.filter((a) => a.status === "in_progress").length || 0,
      resolved: alerts?.filter((a) => a.status === "resolved").length || 0,
      urgent: alerts?.filter((a) => a.priority === "urgent").length || 0,
      high: alerts?.filter((a) => a.priority === "high").length || 0,
      medium: alerts?.filter((a) => a.priority === "medium").length || 0,
      low: alerts?.filter((a) => a.priority === "low").length || 0,
    }

    // Generate timeline data
    const timelineData = generateTimelineData(events || [], startTime, timeRange)

    const stats = {
      devices: deviceStats,
      events: eventStats,
      alerts: alertStats,
      timeline: timelineData,
      timeRange,
      generatedAt: new Date().toISOString(),
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function generateTimelineData(events: any[], startTime: Date, timeRange: string) {
  const timeline = []
  const now = new Date()

  // Determine interval based on time range
  let intervalMs: number
  let intervals: number

  switch (timeRange) {
    case "1h":
      intervalMs = 5 * 60 * 1000 // 5 minutes
      intervals = 12
      break
    case "24h":
      intervalMs = 60 * 60 * 1000 // 1 hour
      intervals = 24
      break
    case "7d":
      intervalMs = 24 * 60 * 60 * 1000 // 1 day
      intervals = 7
      break
    case "30d":
      intervalMs = 24 * 60 * 60 * 1000 // 1 day
      intervals = 30
      break
    default:
      intervalMs = 60 * 60 * 1000 // 1 hour
      intervals = 24
  }

  // Generate timeline buckets
  for (let i = 0; i < intervals; i++) {
    const bucketStart = new Date(startTime.getTime() + i * intervalMs)
    const bucketEnd = new Date(bucketStart.getTime() + intervalMs)

    const bucketEvents = events.filter((event) => {
      const eventTime = new Date(event.created_at)
      return eventTime >= bucketStart && eventTime < bucketEnd
    })

    timeline.push({
      timestamp: bucketStart.toISOString(),
      events: bucketEvents.length,
      critical: bucketEvents.filter((e) => e.severity === "critical").length,
      high: bucketEvents.filter((e) => e.severity === "high").length,
      medium: bucketEvents.filter((e) => e.severity === "medium").length,
      low: bucketEvents.filter((e) => e.severity === "low").length,
    })
  }

  return timeline
}
