import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

interface DetectionRule {
  id: string
  name: string
  event_type: string[]
  severity_threshold: string
  conditions: any
  action: "alert" | "block" | "log"
  enabled: boolean
}

interface AnalysisResult {
  riskScore: number
  threats: string[]
  recommendations: string[]
  shouldAlert: boolean
  alertPriority?: string
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    // Check authentication and analyst/admin role
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (!profile || !["analyst", "admin"].includes(profile.role)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const { event_data, device_context } = body
    if (!event_data) {
      return NextResponse.json({ error: "Missing event data" }, { status: 400 })
    }

    // Run detection analysis
    const analysis = await runDetectionEngine(event_data, device_context)

    // If analysis indicates high risk, create alert
    if (analysis.shouldAlert) {
      await createAutomaticAlert(supabase, event_data, analysis)
    }

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error("Detection engine error:", error)
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 })
  }
}

async function runDetectionEngine(eventData: any, deviceContext?: any): Promise<AnalysisResult> {
  const analysis: AnalysisResult = {
    riskScore: 0,
    threats: [],
    recommendations: [],
    shouldAlert: false,
  }

  // Analyze event severity
  const severityScores = { low: 1, medium: 3, high: 7, critical: 10 }
  analysis.riskScore += severityScores[eventData.severity as keyof typeof severityScores] || 0

  // Analyze event type patterns
  const highRiskEvents = [
    "malware_detected",
    "network_intrusion",
    "data_breach",
    "privilege_escalation",
    "suspicious_file_access",
  ]

  if (highRiskEvents.includes(eventData.event_type)) {
    analysis.riskScore += 5
    analysis.threats.push(`High-risk event type: ${eventData.event_type}`)
  }

  // Analyze source IP patterns
  if (eventData.source_ip) {
    const suspiciousPatterns = await analyzeSuspiciousIP(eventData.source_ip)
    if (suspiciousPatterns.length > 0) {
      analysis.riskScore += 3
      analysis.threats.push(...suspiciousPatterns)
    }
  }

  // Analyze failed login attempts
  if (eventData.event_type === "failed_login") {
    const failedAttempts = await countRecentFailedLogins(eventData.source_ip)
    if (failedAttempts > 5) {
      analysis.riskScore += 4
      analysis.threats.push(`Multiple failed login attempts: ${failedAttempts}`)
      analysis.recommendations.push("Consider implementing IP blocking or rate limiting")
    }
  }

  // Analyze device context
  if (deviceContext) {
    if (deviceContext.status === "compromised") {
      analysis.riskScore += 8
      analysis.threats.push("Event from compromised device")
    }

    if (deviceContext.device_type === "server" && eventData.severity !== "low") {
      analysis.riskScore += 2
      analysis.threats.push("Critical infrastructure affected")
    }
  }

  // Determine if alert should be created
  analysis.shouldAlert = analysis.riskScore >= 7

  if (analysis.shouldAlert) {
    if (analysis.riskScore >= 15) {
      analysis.alertPriority = "urgent"
    } else if (analysis.riskScore >= 10) {
      analysis.alertPriority = "high"
    } else {
      analysis.alertPriority = "medium"
    }
  }

  // Generate recommendations
  if (analysis.riskScore >= 5) {
    analysis.recommendations.push("Investigate event details and affected systems")
  }
  if (analysis.threats.length > 2) {
    analysis.recommendations.push("Consider isolating affected device")
  }
  if (eventData.event_type === "malware_detected") {
    analysis.recommendations.push("Run full system scan and update antivirus definitions")
  }

  return analysis
}

async function analyzeSuspiciousIP(sourceIP: string): Promise<string[]> {
  const threats: string[] = []

  // Check for private IP ranges (simplified)
  const privateRanges = ["10.", "192.168.", "172.16.", "172.17.", "172.18.", "172.19."]
  const isPrivate = privateRanges.some((range) => sourceIP.startsWith(range))

  if (!isPrivate) {
    threats.push("External IP address detected")
  }

  // Check for known malicious patterns (simplified)
  const suspiciousPatterns = ["0.0.0.0", "127.0.0.1", "255.255.255.255"]
  if (suspiciousPatterns.includes(sourceIP)) {
    threats.push("Suspicious IP pattern detected")
  }

  return threats
}

async function countRecentFailedLogins(sourceIP?: string): Promise<number> {
  if (!sourceIP) return 0

  try {
    const supabase = createClient()
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()

    const { count } = await supabase
      .from("security_events")
      .select("*", { count: "exact", head: true })
      .eq("event_type", "failed_login")
      .eq("source_ip", sourceIP)
      .gte("created_at", oneHourAgo)

    return count || 0
  } catch (error) {
    console.error("Error counting failed logins:", error)
    return 0
  }
}

async function createAutomaticAlert(supabase: any, eventData: any, analysis: AnalysisResult) {
  try {
    // First create the security event if it doesn't exist
    let eventId = eventData.id

    if (!eventId) {
      const { data: newEvent } = await supabase.from("security_events").insert([eventData]).select().single()

      eventId = newEvent?.id
    }

    if (eventId) {
      await supabase.from("alerts").insert([
        {
          event_id: eventId,
          priority: analysis.alertPriority || "medium",
          status: "new",
          notes: `Automatic alert created by detection engine. Risk score: ${analysis.riskScore}. Threats: ${analysis.threats.join(", ")}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
    }
  } catch (error) {
    console.error("Error creating automatic alert:", error)
  }
}
