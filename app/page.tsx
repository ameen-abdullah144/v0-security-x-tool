import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Eye,
  AlertTriangle,
  Activity,
  Lock,
  Zap,
  Users,
  BarChart3,
  ArrowRight,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Security X</h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#solutions" className="text-muted-foreground hover:text-foreground transition-colors">
                Solutions
              </Link>
              <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Button variant="outline" asChild className="bg-transparent">
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">Get Started</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20">
            Advanced Threat Detection Platform
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Protect Your Digital Assets with <span className="text-primary">Real-Time Security Intelligence</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
            Security X provides comprehensive threat detection, real-time monitoring, and automated response
            capabilities to safeguard your organization against evolving cyber threats.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8">
              <Link href="/auth/register">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 bg-transparent">
              <Link href="#demo">Watch Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4 bg-card/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Comprehensive Security Solutions</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced features designed to detect, prevent, and respond to security threats in real-time.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <Eye className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-xl">Real-Time Monitoring</CardTitle>
                <CardDescription>
                  24/7 continuous monitoring of your network, devices, and applications with instant threat detection.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <AlertTriangle className="h-12 w-12 text-accent mb-4" />
                <CardTitle className="text-xl">Intelligent Alerts</CardTitle>
                <CardDescription>
                  Smart alerting system that prioritizes threats and reduces false positives with AI-powered analysis.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <Activity className="h-12 w-12 text-chart-1 mb-4" />
                <CardTitle className="text-xl">Threat Analytics</CardTitle>
                <CardDescription>
                  Advanced analytics and machine learning to identify patterns and predict potential security breaches.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <Lock className="h-12 w-12 text-chart-2 mb-4" />
                <CardTitle className="text-xl">Automated Response</CardTitle>
                <CardDescription>
                  Automated incident response workflows that contain threats and minimize damage automatically.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <Zap className="h-12 w-12 text-chart-3 mb-4" />
                <CardTitle className="text-xl">Rapid Deployment</CardTitle>
                <CardDescription>
                  Quick setup and integration with existing infrastructure. Get protected in minutes, not days.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-chart-4 mb-4" />
                <CardTitle className="text-xl">Compliance Reporting</CardTitle>
                <CardDescription>
                  Comprehensive reporting and audit trails to meet regulatory requirements and industry standards.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Built for Every Organization</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Scalable security solutions that grow with your business needs.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="border-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-4" />
                <CardTitle className="text-2xl">Small Business</CardTitle>
                <CardDescription className="text-base">
                  Essential security protection for growing businesses with limited IT resources.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Up to 50 devices</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Basic threat detection</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Email alerts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">24/7 monitoring</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/50 backdrop-blur-sm border-primary/50">
              <CardHeader>
                <Badge className="w-fit mb-2 bg-primary text-primary-foreground">Most Popular</Badge>
                <Shield className="h-8 w-8 text-primary mb-4" />
                <CardTitle className="text-2xl">Enterprise</CardTitle>
                <CardDescription className="text-base">
                  Advanced security suite for large organizations with complex infrastructure.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Unlimited devices</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">AI-powered threat detection</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Custom detection rules</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Automated response</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Dedicated support</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <Lock className="h-8 w-8 text-primary mb-4" />
                <CardTitle className="text-2xl">Government</CardTitle>
                <CardDescription className="text-base">
                  High-security solutions meeting government and defense requirements.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">FedRAMP compliance</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">On-premise deployment</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Advanced encryption</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Custom integrations</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Ready to Secure Your Organization?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of organizations that trust Security X to protect their digital assets.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8">
              <Link href="/auth/register">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 bg-transparent">
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-bold text-foreground">Security X</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Advanced threat detection and prevention platform protecting organizations worldwide.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#solutions" className="hover:text-foreground transition-colors">
                    Solutions
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-foreground transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/docs" className="hover:text-foreground transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="hover:text-foreground transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/status" className="hover:text-foreground transition-colors">
                    Status
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Security X. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
