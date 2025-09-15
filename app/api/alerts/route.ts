import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)

    // Get query parameters
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")
    const priority = searchParams.get("priority")
    const status = searchParams.get("status")
    const assignedTo = searchParams.get("assigned_to")

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
      .from("alerts")
      .select(`
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
          id,
          full_name,
          email
        )
      `)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (priority) {
      query = query.eq("priority", priority)
    }
    if (status) {
      query = query.eq("status", status)
    }
    if (assignedTo) {
      query = query.eq("assigned_to", assignedTo)
    }

    const { data, error } = await query

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 })
    }

    return NextResponse.json({ alerts: data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    // Check authentication and role
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user profile to check role
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (!profile || !["analyst", "admin"].includes(profile.role)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Validate required fields
    const { event_id, priority, notes } = body
    if (!event_id || !priority) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create alert
    const { data, error } = await supabase
      .from("alerts")
      .insert([
        {
          event_id,
          priority,
          status: "new",
          notes: notes || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to create alert" }, { status: 500 })
    }

    return NextResponse.json({ alert: data }, { status: 201 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
