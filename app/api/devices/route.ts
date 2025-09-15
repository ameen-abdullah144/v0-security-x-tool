import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)

    // Get query parameters
    const limit = Number.parseInt(searchParams.get("limit") || "100")
    const offset = Number.parseInt(searchParams.get("offset") || "0")
    const status = searchParams.get("status")
    const deviceType = searchParams.get("device_type")

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
      .from("devices")
      .select("*")
      .order("name")
      .range(offset, offset + limit - 1)

    // Apply filters
    if (status) {
      query = query.eq("status", status)
    }
    if (deviceType) {
      query = query.eq("device_type", deviceType)
    }

    const { data, error } = await query

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch devices" }, { status: 500 })
    }

    return NextResponse.json({ devices: data })
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
    const { name, device_type, ip_address, mac_address, operating_system, location } = body
    if (!name || !device_type || !ip_address) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if IP address already exists
    const { data: existingDevice } = await supabase.from("devices").select("id").eq("ip_address", ip_address).single()

    if (existingDevice) {
      return NextResponse.json({ error: "Device with this IP address already exists" }, { status: 409 })
    }

    // Create device
    const { data, error } = await supabase
      .from("devices")
      .insert([
        {
          name,
          device_type,
          ip_address,
          mac_address: mac_address || null,
          operating_system: operating_system || null,
          location: location || null,
          status: "active",
          last_seen: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to create device" }, { status: 500 })
    }

    return NextResponse.json({ device: data }, { status: 201 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
