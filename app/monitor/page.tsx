import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { LiveMonitor } from "@/components/monitor/live-monitor"

export default function MonitorPage() {
  return (
    <DashboardLayout title="Live Security Monitor" requiredRole="analyst">
      <LiveMonitor />
    </DashboardLayout>
  )
}
