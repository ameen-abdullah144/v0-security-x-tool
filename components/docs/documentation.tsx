"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Shield, AlertTriangle, Monitor, Settings, BookOpen, Download, ExternalLink, Play, Code } from "lucide-react"

const quickStartSteps = [
  {
    title: "Initial Setup",
    description: "Configure your Security X environment and connect your first devices",
    icon: Settings,
    time: "5 minutes",
  },
  {
    title: "Device Registration",
    description: "Add and configure devices for monitoring",
    icon: Monitor,
    time: "10 minutes",
  },
  {
    title: "Alert Configuration",
    description: "Set up alert rules and notification preferences",
    icon: AlertTriangle,
    time: "15 minutes",
  },
  {
    title: "Dashboard Overview",
    description: "Learn to navigate and customize your security dashboard",
    icon: Shield,
    time: "10 minutes",
  },
]

const apiEndpoints = [
  {
    method: "GET",
    endpoint: "/api/devices",
    description: "Retrieve all monitored devices",
    auth: "Required",
  },
  {
    method: "POST",
    endpoint: "/api/devices",
    description: "Register a new device",
    auth: "Admin",
  },
  {
    method: "GET",
    endpoint: "/api/events",
    description: "Fetch security events",
    auth: "Required",
  },
  {
    method: "POST",
    endpoint: "/api/alerts",
    description: "Create a new alert",
    auth: "Analyst",
  },
  {
    method: "PUT",
    endpoint: "/api/alerts/:id",
    description: "Update alert status",
    auth: "Analyst",
  },
]

const troubleshootingGuides = [
  {
    title: "Device Connection Issues",
    description: "Resolve common device connectivity problems",
    category: "Network",
    difficulty: "Beginner",
  },
  {
    title: "False Positive Alerts",
    description: "Configure detection rules to reduce false positives",
    category: "Detection",
    difficulty: "Intermediate",
  },
  {
    title: "Performance Optimization",
    description: "Optimize Security X for large-scale deployments",
    category: "Performance",
    difficulty: "Advanced",
  },
  {
    title: "Integration Setup",
    description: "Integrate with SIEM and other security tools",
    category: "Integration",
    difficulty: "Advanced",
  },
]

export function Documentation() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-2xl font-bold">Documentation</h2>
          <p className="text-muted-foreground">Comprehensive guides and API documentation</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline" className="bg-transparent">
            <ExternalLink className="h-4 w-4 mr-2" />
            API Reference
          </Button>
        </div>
      </div>

      <Tabs defaultValue="getting-started" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
          <TabsTrigger value="user-guide">User Guide</TabsTrigger>
          <TabsTrigger value="api">API Reference</TabsTrigger>
          <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
        </TabsList>

        <TabsContent value="getting-started" className="space-y-6">
          {/* Quick Start */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Quick Start Guide
              </CardTitle>
              <CardDescription>Get up and running with Security X in under 30 minutes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {quickStartSteps.map((step, index) => {
                  const IconComponent = step.icon
                  return (
                    <div key={index} className="flex items-start gap-3 p-4 rounded-lg border border-border">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{step.title}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {step.time}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Installation */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Installation & Setup</CardTitle>
              <CardDescription>System requirements and installation instructions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">System Requirements</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Minimum 4GB RAM, 8GB recommended</li>
                  <li>• 50GB available disk space</li>
                  <li>• Network connectivity to monitored devices</li>
                  <li>• Modern web browser (Chrome, Firefox, Safari, Edge)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Quick Installation</h4>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                  <div className="text-green-400"># Download and install Security X</div>
                  <div>curl -sSL https://install.securityx.com | bash</div>
                  <div className="mt-2 text-green-400"># Start the service</div>
                  <div>sudo systemctl start securityx</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user-guide" className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                User Guide
              </CardTitle>
              <CardDescription>Comprehensive guide to using Security X features</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Dashboard Overview</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      The Security X dashboard provides a real-time overview of your security posture. Key components
                      include:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• Summary cards showing device status and alert counts</li>
                      <li>• Real-time activity charts and threat intelligence</li>
                      <li>• Recent security events and alert notifications</li>
                      <li>• Global threat map with geographic threat distribution</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Device Management</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Manage all monitored devices from a centralized interface:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• Add new devices manually or through auto-discovery</li>
                      <li>• Monitor device health and connectivity status</li>
                      <li>• Configure device-specific monitoring rules</li>
                      <li>• View device history and security events</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Alert Management</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Efficiently manage security alerts and incidents:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• Prioritize alerts by severity and impact</li>
                      <li>• Assign alerts to team members for investigation</li>
                      <li>• Track alert resolution and add investigation notes</li>
                      <li>• Configure alert rules and notification preferences</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Live Monitoring</h3>
                    <p className="text-sm text-muted-foreground mb-3">Monitor security events in real-time:</p>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• View live event stream with filtering capabilities</li>
                      <li>• Interactive network topology visualization</li>
                      <li>• Global threat intelligence feed</li>
                      <li>• Real-time statistics and performance metrics</li>
                    </ul>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                API Reference
              </CardTitle>
              <CardDescription>RESTful API endpoints for Security X integration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Authentication</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    All API requests require authentication using Bearer tokens:
                  </p>
                  <div className="bg-muted p-3 rounded-lg font-mono text-sm">
                    <div className="text-green-400"># Include in request headers</div>
                    <div>Authorization: Bearer YOUR_API_TOKEN</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Endpoints</h4>
                  <div className="space-y-3">
                    {apiEndpoints.map((endpoint, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 rounded-lg border border-border">
                        <Badge
                          variant={endpoint.method === "GET" ? "secondary" : "default"}
                          className="font-mono text-xs"
                        >
                          {endpoint.method}
                        </Badge>
                        <code className="flex-1 text-sm">{endpoint.endpoint}</code>
                        <span className="text-sm text-muted-foreground">{endpoint.description}</span>
                        <Badge variant="outline" className="text-xs">
                          {endpoint.auth}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Example Request</h4>
                  <div className="bg-muted p-3 rounded-lg font-mono text-sm">
                    <div className="text-green-400"># Fetch all devices</div>
                    <div>curl -H "Authorization: Bearer YOUR_TOKEN" \</div>
                    <div className="ml-4">https://api.securityx.com/v1/devices</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="troubleshooting" className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Troubleshooting Guides</CardTitle>
              <CardDescription>Common issues and their solutions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {troubleshootingGuides.map((guide, index) => (
                  <div key={index} className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">{guide.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {guide.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{guide.description}</p>
                    <Badge variant="secondary" className="text-xs">
                      {guide.category}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Common Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Q: Devices not appearing in dashboard</h4>
                  <p className="text-sm text-muted-foreground">
                    Ensure devices are properly configured and network connectivity is established. Check firewall
                    settings and verify the Security X agent is running on target devices.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Q: High number of false positive alerts</h4>
                  <p className="text-sm text-muted-foreground">
                    Adjust detection sensitivity in the alert configuration. Consider creating custom rules for your
                    environment and whitelist known-good activities.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Q: Performance issues with large deployments</h4>
                  <p className="text-sm text-muted-foreground">
                    Enable database indexing, configure log rotation, and consider implementing distributed monitoring
                    for environments with 1000+ devices.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
