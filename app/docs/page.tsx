import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Documentation } from "@/components/docs/documentation"

export default function DocsPage() {
  return (
    <DashboardLayout title="Documentation">
      <Documentation />
    </DashboardLayout>
  )
}
