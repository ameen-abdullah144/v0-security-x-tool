import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)

    // Get query parameters
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")
    const severity = searchParams.get("severity")
    const eventType = searchParams.get("event_type")
    const deviceId = searchParams.get("device_id")
    const startDate = searchParams.get("start_date")
    const endDate = searchParams.get("end_date")

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Build query
    let query = supabase
      .from("security_events")
      .select(`
        *,
        devices (
          id,
          name,
          device_type,
          ip_address
        )
      `)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (severity) {
      query = query.eq("severity", severity)
    }
    if (eventType) {
      query = query.eq("event_type", eventType)
    }
    if (deviceId) {
      query = query.eq("device_id", deviceId)
    }
    if (startDate) {
      query = query.gte("created_at", startDate)
    }
    if (endDate) {
      query = query.lte("created_at", endDate)
    }

    const { data, error } = await query

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
    }

    return NextResponse.json({ events: data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Validate required fields
    const { title, event_type, severity, description, device_id, source_ip } = body
    if (!title || !event_type || !severity || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create security event
    const { data, error } = await supabase
      .from("security_events")
      .insert([
        {
          title,
          event_type,
          severity,
          description,
          device_id: device_id || null,
          source_ip: source_ip || null,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
    }

    // Trigger detection engine
    await triggerDetectionEngine(data)

    return NextResponse.json({ event: data }, { status: 201 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function triggerDetectionEngine(event: any) {
  // This would trigger the detection engine to analyze the event
  // For now, we'll simulate basic detection logic
  try {
    const supabase = createClient()

    // Check if this event should trigger an alert
    const shouldCreateAlert = await evaluateEventForAlert(event)

    if (shouldCreateAlert) {
      const priority = determinePriority(event)

      await supabase.from("alerts").insert([
        {
          event_id: event.id,
          priority,
          status: "new",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
    }
  } catch (error) {
    console.error("Detection engine error:", error)
  }
}

async function evaluateEventForAlert(event: any): Promise<boolean> {
  // Basic rules for alert creation
  if (event.severity === "critical") return true
  if (event.severity === "high" && ["malware_detected", "network_intrusion", "data_breach"].includes(event.event_type))
    return true
  if (event.event_type === "failed_login" && event.description.includes("multiple")) return true

  return false
}

function determinePriority(event: any): string {
  if (event.severity === "critical") return "urgent"
  if (event.severity === "high") return "high"
  if (event.severity === "medium") return "medium"
  return "low"
}
