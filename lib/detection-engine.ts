interface DetectionRule {
  id: string
  name: string
  eventTypes: string[]
  severityThreshold: string
  conditions: any
  action: "alert" | "block" | "log"
  priority: string
  enabled: boolean
}

interface SecurityEvent {
  id?: string
  title: string
  event_type: string
  severity: "low" | "medium" | "high" | "critical"
  description: string
  source_ip?: string
  device_id?: string
  created_at?: string
}

interface DetectionResult {
  shouldAlert: boolean
  priority?: string
  riskScore: number
  matchedRules: string[]
  threats: string[]
  recommendations: string[]
}

export class DetectionEngine {
  private rules: DetectionRule[] = []

  constructor() {
    this.loadDefaultRules()
  }

  private loadDefaultRules() {
    this.rules = [
      {
        id: "critical-events",
        name: "Critical Event Detection",
        eventTypes: ["*"],
        severityThreshold: "critical",
        conditions: { severity: "critical" },
        action: "alert",
        priority: "urgent",
        enabled: true,
      },
      {
        id: "malware-detection",
        name: "Malware Detection",
        eventTypes: ["malware_detected", "suspicious_file_access"],
        severityThreshold: "medium",
        conditions: { event_type: ["malware_detected", "suspicious_file_access"] },
        action: "alert",
        priority: "high",
        enabled: true,
      },
      {
        id: "network-intrusion",
        name: "Network Intrusion Detection",
        eventTypes: ["network_intrusion", "port_scan", "ddos_attack"],
        severityThreshold: "high",
        conditions: { event_type: ["network_intrusion", "port_scan", "ddos_attack"] },
        action: "alert",
        priority: "urgent",
        enabled: true,
      },
      {
        id: "failed-logins",
        name: "Multiple Failed Logins",
        eventTypes: ["failed_login"],
        severityThreshold: "low",
        conditions: { event_type: "failed_login", threshold: 5 },
        action: "alert",
        priority: "medium",
        enabled: true,
      },
    ]
  }

  async analyzeEvent(event: SecurityEvent, context?: any): Promise<DetectionResult> {
    const result: DetectionResult = {
      shouldAlert: false,
      riskScore: 0,
      matchedRules: [],
      threats: [],
      recommendations: [],
    }

    // Calculate base risk score from severity
    const severityScores = { low: 1, medium: 3, high: 7, critical: 10 }
    result.riskScore = severityScores[event.severity] || 0

    // Check against detection rules
    for (const rule of this.rules) {
      if (!rule.enabled) continue

      if (this.eventMatchesRule(event, rule)) {
        result.matchedRules.push(rule.name)
        result.riskScore += this.getRuleScore(rule)

        if (rule.action === "alert") {
          result.shouldAlert = true
          result.priority = this.getHighestPriority(result.priority, rule.priority)
        }
      }
    }

    // Additional threat analysis
    await this.performThreatAnalysis(event, result, context)

    // Generate recommendations
    this.generateRecommendations(event, result)

    return result
  }

  private eventMatchesRule(event: SecurityEvent, rule: DetectionRule): boolean {
    // Check event type match
    if (!rule.eventTypes.includes("*") && !rule.eventTypes.includes(event.event_type)) {
      return false
    }

    // Check severity threshold
    const severityLevels = { low: 1, medium: 2, high: 3, critical: 4 }
    const eventLevel = severityLevels[event.severity] || 0
    const thresholdLevel = severityLevels[rule.severityThreshold as keyof typeof severityLevels] || 0

    if (eventLevel < thresholdLevel) {
      return false
    }

    // Check additional conditions
    if (rule.conditions.severity && rule.conditions.severity !== event.severity) {
      return false
    }

    if (rule.conditions.event_type) {
      const allowedTypes = Array.isArray(rule.conditions.event_type)
        ? rule.conditions.event_type
        : [rule.conditions.event_type]

      if (!allowedTypes.includes(event.event_type)) {
        return false
      }
    }

    return true
  }

  private getRuleScore(rule: DetectionRule): number {
    const priorityScores = { low: 1, medium: 2, high: 4, urgent: 6 }
    return priorityScores[rule.priority as keyof typeof priorityScores] || 1
  }

  private getHighestPriority(current?: string, newPriority?: string): string {
    const priorities = ["low", "medium", "high", "urgent"]
    const currentIndex = current ? priorities.indexOf(current) : -1
    const newIndex = newPriority ? priorities.indexOf(newPriority) : -1

    return newIndex > currentIndex ? newPriority! : current || "low"
  }

  private async performThreatAnalysis(event: SecurityEvent, result: DetectionResult, context?: any) {
    // Analyze source IP
    if (event.source_ip) {
      const ipThreats = this.analyzeSourceIP(event.source_ip)
      result.threats.push(...ipThreats)
      result.riskScore += ipThreats.length * 2
    }

    // Analyze event patterns
    if (event.event_type === "failed_login") {
      result.threats.push("Potential brute force attack")
      result.riskScore += 2
    }

    if (event.event_type === "malware_detected") {
      result.threats.push("Malware infection detected")
      result.riskScore += 5
    }

    // Analyze device context
    if (context?.device?.status === "compromised") {
      result.threats.push("Event from compromised device")
      result.riskScore += 8
    }

    if (context?.device?.device_type === "server" && event.severity !== "low") {
      result.threats.push("Critical infrastructure affected")
      result.riskScore += 3
    }

    // Update alert decision based on final risk score
    if (result.riskScore >= 10 && !result.shouldAlert) {
      result.shouldAlert = true
      result.priority = "high"
    }
  }

  private analyzeSourceIP(sourceIP: string): string[] {
    const threats: string[] = []

    // Check for external IPs
    const privateRanges = ["10.", "192.168.", "172.16.", "172.17.", "172.18.", "172.19."]
    const isPrivate = privateRanges.some((range) => sourceIP.startsWith(range))

    if (!isPrivate) {
      threats.push("External IP address")
    }

    // Check for suspicious patterns
    const suspiciousIPs = ["0.0.0.0", "127.0.0.1", "255.255.255.255"]
    if (suspiciousIPs.includes(sourceIP)) {
      threats.push("Suspicious IP pattern")
    }

    return threats
  }

  private generateRecommendations(event: SecurityEvent, result: DetectionResult) {
    if (result.riskScore >= 8) {
      result.recommendations.push("Immediate investigation required")
    }

    if (result.threats.some((t) => t.includes("compromised"))) {
      result.recommendations.push("Isolate affected device")
    }

    if (event.event_type === "malware_detected") {
      result.recommendations.push("Run full system scan")
      result.recommendations.push("Update antivirus definitions")
    }

    if (event.event_type === "failed_login" && result.threats.includes("Potential brute force attack")) {
      result.recommendations.push("Implement rate limiting")
      result.recommendations.push("Consider IP blocking")
    }

    if (result.threats.includes("External IP address")) {
      result.recommendations.push("Verify external access is authorized")
    }

    if (result.riskScore >= 5) {
      result.recommendations.push("Document incident details")
      result.recommendations.push("Monitor for related events")
    }
  }

  getRules(): DetectionRule[] {
    return this.rules
  }

  addRule(rule: DetectionRule): void {
    this.rules.push(rule)
  }

  updateRule(id: string, updates: Partial<DetectionRule>): boolean {
    const index = this.rules.findIndex((r) => r.id === id)
    if (index !== -1) {
      this.rules[index] = { ...this.rules[index], ...updates }
      return true
    }
    return false
  }

  removeRule(id: string): boolean {
    const index = this.rules.findIndex((r) => r.id === id)
    if (index !== -1) {
      this.rules.splice(index, 1)
      return true
    }
    return false
  }
}

// Export singleton instance
export const detectionEngine = new DetectionEngine()
