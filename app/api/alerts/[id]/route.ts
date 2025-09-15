import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const body = await request.json()
    const alertId = params.id

    // Check authentication
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

    // Prepare update data
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (body.status) updateData.status = body.status
    if (body.priority) updateData.priority = body.priority
    if (body.notes !== undefined) updateData.notes = body.notes
    if (body.assigned_to !== undefined) updateData.assigned_to = body.assigned_to
    if (body.resolution_notes) updateData.resolution_notes = body.resolution_notes

    // If resolving, set resolved timestamp
    if (body.status === "resolved") {
      updateData.resolved_at = new Date().toISOString()
    }

    // Update alert
    const { data, error } = await supabase.from("alerts").update(updateData).eq("id", alertId).select().single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to update alert" }, { status: 500 })
    }

    return NextResponse.json({ alert: data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const alertId = params.id

    // Check authentication and admin role
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user profile to check role
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    // Delete alert
    const { error } = await supabase.from("alerts").delete().eq("id", alertId)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to delete alert" }, { status: 500 })
    }

    return NextResponse.json({ message: "Alert deleted successfully" })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
