import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { AlertsManagement } from "@/components/alerts/alerts-management"

export default function AlertsPage() {
  return (
    <DashboardLayout title="Security Alerts">
      <AlertsManagement />
    </DashboardLayout>
  )
}
