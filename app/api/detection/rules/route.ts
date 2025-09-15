import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()

    // Check authentication and admin role
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    // Return default detection rules (in a real system, these would be stored in database)
    const defaultRules = [
      {
        id: "rule-001",
        name: "Critical Event Alert",
        description: "Create urgent alerts for all critical severity events",
        event_types: ["*"],
        severity_threshold: "critical",
        conditions: {
          severity: "critical",
        },
        action: "alert",
        priority: "urgent",
        enabled: true,
      },
      {
        id: "rule-002",
        name: "Malware Detection",
        description: "High priority alerts for malware detection events",
        event_types: ["malware_detected", "suspicious_file_access"],
        severity_threshold: "medium",
        conditions: {
          event_type: ["malware_detected", "suspicious_file_access"],
        },
        action: "alert",
        priority: "high",
        enabled: true,
      },
      {
        id: "rule-003",
        name: "Failed Login Attempts",
        description: "Alert on multiple failed login attempts from same IP",
        event_types: ["failed_login"],
        severity_threshold: "low",
        conditions: {
          event_type: "failed_login",
          count_threshold: 5,
          time_window: "1h",
        },
        action: "alert",
        priority: "medium",
        enabled: true,
      },
      {
        id: "rule-004",
        name: "Network Intrusion",
        description: "Immediate alerts for network intrusion attempts",
        event_types: ["network_intrusion", "port_scan", "ddos_attack"],
        severity_threshold: "high",
        conditions: {
          event_type: ["network_intrusion", "port_scan", "ddos_attack"],
        },
        action: "alert",
        priority: "urgent",
        enabled: true,
      },
      {
        id: "rule-005",
        name: "Privilege Escalation",
        description: "Alert on privilege escalation attempts",
        event_types: ["privilege_escalation", "unauthorized_access"],
        severity_threshold: "medium",
        conditions: {
          event_type: ["privilege_escalation", "unauthorized_access"],
        },
        action: "alert",
        priority: "high",
        enabled: true,
      },
    ]

    return NextResponse.json({ rules: defaultRules })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    // Check authentication and admin role
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    // Validate rule data
    const { name, description, event_types, severity_threshold, conditions, action, priority } = body
    if (!name || !event_types || !severity_threshold || !conditions || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // In a real system, this would save to database
    const newRule = {
      id: `rule-${Date.now()}`,
      name,
      description: description || "",
      event_types,
      severity_threshold,
      conditions,
      action,
      priority: priority || "medium",
      enabled: true,
      created_at: new Date().toISOString(),
    }

    return NextResponse.json({ rule: newRule }, { status: 201 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
